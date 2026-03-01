import { PLAYER_UNITS } from '../data/playerUnits.js';
import { ENEMY_UNITS } from '../data/enemyUnits.js';
import { WALLET_LEVELS } from '../data/walletLevels.js';
import { drawEntityShape } from './EntityRenderer.js';
import { sfx } from './SoundManager.js';

// --- ゲームエンジン ---

export class GameEngine {
  constructor(canvas, updateUI, saveData, stageData) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.updateUI = updateUI; this.saveData = saveData; this.stage = stageData;
    this.isRunning = false; this.lastTime = 0;

    this.money = 0; this.sessionXp = 0; this.walletLevelIndex = 0;
    this.units = []; this.enemies = []; this.effects = []; this.particles = []; this.souls = [];
    
    this.screenShakeTime = 0; this.screenShakeIntensity = 0;
    this.cannonPower = 0; this.cannonMax = 15000; this.isFiringCannon = false; this.cannonTimer = 0;

    this.groundY = canvas.height - 40;
    this.playerBase = { x: canvas.width - 130, y: this.groundY - 120, width: 80, height: 120, hp: 1000 + (saveData.baseHpLv * 500), maxHp: 1000 + (saveData.baseHpLv * 500), isBase: true };
    this.enemyBase = { x: 50, y: this.groundY - 120, width: 80, height: 120, hp: stageData.enemyBaseHp, maxHp: stageData.enemyBaseHp, isBase: true };

    this.stageTime = 0; this.enemySpawnTimer = 0;
    this.cooldowns = Object.keys(PLAYER_UNITS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    this.status = 'playing';
    this.bossSpawned = false;
  }

  start() {
    sfx.init(); sfx.startBgm(false);
    this.isRunning = true; this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
    this.uiInterval = setInterval(() => this.syncUI(), 100);
  }

  stop() {
    this.isRunning = false; sfx.stopBgm(); clearInterval(this.uiInterval);
  }

  get currentWallet() { return WALLET_LEVELS[this.walletLevelIndex]; }

  syncUI() {
    if (!this.isRunning) return;
    this.updateUI({
      money: Math.floor(this.money), maxMoney: this.currentWallet.max,
      walletLevel: this.currentWallet.level, walletCost: this.currentWallet.cost,
      cooldowns: { ...this.cooldowns }, cannonPercent: Math.min(100, (this.cannonPower / this.cannonMax) * 100),
      canFireCannon: this.cannonPower >= this.cannonMax, status: this.status, sessionXp: this.sessionXp,
      bossSpawned: this.bossSpawned, stageName: this.stage.name,
      baseHpPercent: Math.max(0, (this.enemyBase.hp / this.enemyBase.maxHp) * 100)
    });
  }

  shakeScreen(time, intensity) { this.screenShakeTime = time; this.screenShakeIntensity = intensity; }

  addParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({ x: x, y: y, vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 1) * 15, life: 500 + Math.random() * 500, maxLife: 1000, color: color, size: Math.random() * 6 + 3 });
    }
  }

  addSoul(x, y) { this.souls.push({ x: x, y: y, vy: -1.5, life: 1000, maxLife: 1000 }); }

  upgradeWallet() {
    if (this.currentWallet.cost && this.money >= this.currentWallet.cost) {
      this.money -= this.currentWallet.cost; this.walletLevelIndex++; sfx.se('upgrade'); this.syncUI();
    } else { sfx.se('error'); }
  }

  fireCannon() {
    if (this.cannonPower >= this.cannonMax && this.status === 'playing') {
      this.cannonPower = 0; this.isFiringCannon = true; this.cannonTimer = 800;
      sfx.se('cannonFire'); this.shakeScreen(800, 15);
      const dmg = 300 + (this.saveData.cannonLv * 250);
      this.enemies.forEach(e => {
        this.applyDamage(e, dmg, false, true); this.addParticles(e.x + e.size/2, e.y + e.size/2, '#fbbf24', 15);
      });
      this.syncUI();
    } else { sfx.se('error'); }
  }

  spawnPlayer(typeId) {
    const data = PLAYER_UNITS[typeId];
    const currentCooldown = this.cooldowns[typeId] || 0;
    if (this.money >= data.cost && currentCooldown <= 0 && this.status === 'playing') {
      this.money -= data.cost; this.cooldowns[typeId] = data.cooldown;
      const lv = this.saveData.levels[typeId] || 1;
      const actualHp = data.hp * (1 + (lv - 1) * 0.2); 
      const actualAttack = data.attack * (1 + (lv - 1) * 0.2);

      this.units.push({
        ...data, hp: actualHp, maxHp: actualHp, attack: actualAttack, lastKbHp: actualHp,
        x: this.playerBase.x - data.size, y: this.groundY - data.size + (Math.random()*16 - 8),
        state: 'walk', attackTimer: 0, kbTimer: 0, isForceKb: false,
        instanceId: Math.random().toString(36).substr(2, 9)
      });
      sfx.se('spawn'); this.syncUI();
    } else { sfx.se('error'); }
  }

  spawnEnemy(typeId, isBoss = false) {
    const data = ENEMY_UNITS[typeId];
    const startX = isBoss ? this.enemyBase.x + this.enemyBase.width + 30 : this.enemyBase.x + this.enemyBase.width;
    const stageMultiplier = 1 + (this.stage.id - 1) * 0.6; 
    
    this.enemies.push({
      ...data, hp: data.hp * stageMultiplier, maxHp: data.hp * stageMultiplier, attack: data.attack * stageMultiplier,
      lastKbHp: data.hp * stageMultiplier, x: startX, y: this.groundY - data.size + (Math.random()*16 - 8),
      state: 'walk', attackTimer: 0, kbTimer: 0, isBoss: isBoss, isForceKb: false,
      instanceId: Math.random().toString(36).substr(2, 9)
    });
  }

  triggerBossShockwave() {
    this.bossSpawned = true;
    sfx.se('shockwave'); this.shakeScreen(2000, 40); 
    sfx.startBgm(true); 

    this.units.forEach(u => {
      this.applyDamage(u, 300, true, true);
      u.state = 'knockback'; u.kbTimer = 1000; u.isForceKb = true; u.x += 200; 
    });

    this.spawnEnemy(this.stage.boss, true);
    setTimeout(() => this.spawnEnemy('gorilla'), 500);
    setTimeout(() => this.spawnEnemy('snake'), 1000);
    setTimeout(() => this.spawnEnemy('penguin'), 1500);
  }

  applyDamage(target, amount, isPlayerTarget, forceKnockback = false) {
    target.hp -= amount;
    if (!target.isBase) {
      let color = isPlayerTarget ? '#ef4444' : '#3b82f6';
      const offsetX = (Math.random() - 0.5) * 20;
      this.effects.push({ x: target.x + target.size/2 + offsetX, y: target.y - 10, text: Math.floor(amount), life: 600, maxLife: 600, color });
      if(Math.random() > 0.5) this.addParticles(target.x + target.size/2, target.y + target.size/2, color, 4);
      sfx.se('hit');

      if (target.hp <= 0) {
        sfx.se('kill'); this.addParticles(target.x + target.size/2, target.y + target.size/2, 'white', 25);
        this.addSoul(target.x + target.size/2, target.y); 
        if (!isPlayerTarget) this.sessionXp += target.xp;
      } else {
        let kbThreshold = target.maxHp / target.kb;
        if (forceKnockback || (target.lastKbHp - target.hp >= kbThreshold)) {
          target.state = 'knockback'; target.kbTimer = forceKnockback ? 500 : 300;
          target.isForceKb = forceKnockback;
          target.lastKbHp = target.hp; target.attackTimer = 0;
        }
      }
    } else {
      this.effects.push({ x: target.x + target.width/2, y: target.y + target.height/2, text: Math.floor(amount), life: 800, maxLife: 800, color: '#ffaa00' });
      sfx.se('baseHit'); this.shakeScreen(300, 8);
      if (!isPlayerTarget && !this.bossSpawned && target.hp <= target.maxHp * 0.9) {
        this.triggerBossShockwave();
      }
    }
  }

  loop(currentTime) {
    if (!this.isRunning) return;
    const dt = currentTime - this.lastTime; this.lastTime = currentTime;
    if (this.status === 'playing') this.update(dt);
    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    this.stageTime += dt;
    this.money += (this.currentWallet.rate * 15 * dt) / 1000;
    if (this.money > this.currentWallet.max) this.money = this.currentWallet.max;

    if (this.cannonPower < this.cannonMax) {
      this.cannonPower += dt;
      if (this.cannonPower >= this.cannonMax && this.cannonPower - dt < this.cannonMax) sfx.se('cannonCharge');
    }

    if (this.isFiringCannon) {
      this.cannonTimer -= dt; if (this.cannonTimer <= 0) this.isFiringCannon = false;
    }

    Object.keys(this.cooldowns).forEach(key => {
      if (this.cooldowns[key] > 0) this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
    });

    this.enemySpawnTimer += dt;
    let spawnInterval = this.bossSpawned ? 2000 : Math.max(1000, 4000 - (this.stageTime / 20)); 
    if (this.enemySpawnTimer > spawnInterval) {
      this.enemySpawnTimer = 0; let r = Math.random();
      if (this.stage.id <= 2) {
        if (r < 0.1) this.spawnEnemy('hippo'); else if (r < 0.3) this.spawnEnemy('seal'); else if (r < 0.6) this.spawnEnemy('snake'); else this.spawnEnemy('dog');
      } else if (this.stage.id <= 4) {
        if (r < 0.1) this.spawnEnemy('kangaroo'); else if (r < 0.3) this.spawnEnemy('croco'); else if (r < 0.5) this.spawnEnemy('seal'); else if (r < 0.8) this.spawnEnemy('snake'); else this.spawnEnemy('dog');
      } else if (this.stage.id <= 6) {
        if (r < 0.1) this.spawnEnemy('bear'); else if (r < 0.3) this.spawnEnemy('elephant'); else if (r < 0.5) this.spawnEnemy('kangaroo'); else if (r < 0.7) this.spawnEnemy('moth'); else this.spawnEnemy('penguin');
      } else if (this.stage.id <= 8) {
        if (r < 0.1) this.spawnEnemy('ostrich'); else if (r < 0.3) this.spawnEnemy('rhino'); else if (r < 0.5) this.spawnEnemy('alien'); else this.spawnEnemy('bear');
      } else {
        if (r < 0.1) this.spawnEnemy('face'); else if (r < 0.3) this.spawnEnemy('ostrich'); else if (r < 0.5) this.spawnEnemy('alien'); else this.spawnEnemy('rhino');
      }
    }

    this.updateEntities(this.units, this.enemies, this.enemyBase, dt, true);
    this.updateEntities(this.enemies, this.units, this.playerBase, dt, false);

    this.units = this.units.filter(u => u.hp > 0);
    this.enemies = this.enemies.filter(e => {
      if (e.hp <= 0) { this.money = Math.min(this.currentWallet.max, this.money + e.reward); return false; }
      return true;
    });

    this.effects = this.effects.filter(eff => { eff.life -= dt; eff.y -= (20 * dt) / 1000; return eff.life > 0; });
    this.particles = this.particles.filter(p => { p.life -= dt; p.x += (p.vx * dt) / 50; p.y += (p.vy * dt) / 50; p.vy += 0.5; if(p.y > this.groundY) p.y = this.groundY; return p.life > 0; });
    this.souls = this.souls.filter(s => { s.life -= dt; s.y += (s.vy * dt) / 10; return s.life > 0; });

    if (this.screenShakeTime > 0) this.screenShakeTime -= dt;

    if (this.playerBase.hp <= 0 && this.status === 'playing') {
      this.status = 'defeat'; sfx.stopBgm(); sfx.se('lose'); this.syncUI();
    } else if (this.enemyBase.hp <= 0 && this.status === 'playing') {
      this.status = 'victory'; this.sessionXp += 8000 * this.stage.id; sfx.stopBgm(); sfx.se('win'); this.syncUI();
    }
  }

  updateEntities(entities, targets, targetBase, dt, isPlayer) {
    entities.forEach(char => {
      if (char.state === 'knockback') {
        char.kbTimer -= dt; 
        char.x += isPlayer ? 3 : -3; 
        if (char.kbTimer <= 0) char.state = 'walk';
        return;
      }
      let target = null; let minDistance = Infinity;
      targets.forEach(t => {
        let dist = isPlayer ? (char.x - (t.x + t.size)) : (t.x - (char.x + char.size));
        if (dist >= -20 && dist < minDistance) { minDistance = dist; target = t; }
      });
      if (!target) {
        let dist = isPlayer ? (char.x - (targetBase.x + targetBase.width)) : (targetBase.x - (char.x + char.size));
        if (dist >= -20) { minDistance = dist; target = targetBase; }
      }

      if (minDistance <= char.range) {
        char.state = 'attack'; char.attackTimer += dt;
        if (char.attackTimer >= char.attackFreq) {
          if (char.area) {
            targets.forEach(t => {
              let d = isPlayer ? (char.x - (t.x + t.size)) : (t.x - (char.x + char.size));
              if (d <= char.range && d >= -20) this.applyDamage(t, char.attack, !isPlayer);
            });
            let dBase = isPlayer ? (char.x - (targetBase.x + targetBase.width)) : (targetBase.x - (char.x + char.size));
            if (dBase <= char.range && dBase >= -20) this.applyDamage(targetBase, char.attack, !isPlayer);
          } else {
            this.applyDamage(target, char.attack, !isPlayer);
          }
          char.attackTimer = 0;
        }
      } else {
        char.state = 'walk'; char.x += char.speed; char.attackTimer = 0;
      }
    });
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.save();

    if (this.screenShakeTime > 0) {
      const dx = (Math.random() - 0.5) * this.screenShakeIntensity; const dy = (Math.random() - 0.5) * this.screenShakeIntensity;
      ctx.translate(dx, dy);
    }

    ctx.fillStyle = this.stage.bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(200, canvas.height, 150, 0, Math.PI, true); ctx.arc(600, canvas.height, 200, 0, Math.PI, true); ctx.fill();

    if (this.bossSpawned && this.screenShakeTime > 1000) {
       ctx.fillStyle = `rgba(255, 255, 255, ${(this.screenShakeTime-1000)/1000})`; ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    ctx.fillStyle = this.stage.ground; ctx.fillRect(0, this.groundY, canvas.width, canvas.height - this.groundY);
    ctx.fillStyle = this.stage.groundLight; ctx.fillRect(0, this.groundY + 15, canvas.width, canvas.height - this.groundY - 15);

    if (this.isFiringCannon) {
      const laserWidth = Math.random() * 30 + 50;
      ctx.fillStyle = 'rgba(255, 255, 150, 0.9)'; ctx.fillRect(this.enemyBase.x, this.groundY - 70 - laserWidth/2, this.playerBase.x - this.enemyBase.x, laserWidth);
      ctx.fillStyle = 'rgba(255, 255, 255, 1)'; ctx.fillRect(this.enemyBase.x, this.groundY - 70 - laserWidth/4, this.playerBase.x - this.enemyBase.x, laserWidth/2);
    }

    this.drawBase(this.enemyBase, false); this.drawBase(this.playerBase, true);

    if (this.status !== 'defeat') {
      ctx.fillStyle = '#222'; ctx.fillRect(this.playerBase.x - 40, this.groundY - 80, 50, 30); 
    }

    const allChars = [...this.units.map(u=>({char:u, isPlayer:true})), ...this.enemies.map(e=>({char:e, isPlayer:false}))];
    allChars.sort((a, b) => a.char.y - b.char.y);
    allChars.forEach(c => {
      ctx.save();
      const s = c.char.size;
      const kbRatio = c.char.state === 'knockback' ? (c.char.kbTimer / (c.char.isForceKb ? 500 : 300)) : 0;
      const attackRot = c.char.state === 'knockback' ? (c.isPlayer ? 0.5 : -0.5) * kbRatio : 0;
      const kbYOffset = c.char.state === 'knockback' ? -Math.sin(kbRatio * Math.PI) * 30 : 0; 
      
      ctx.translate(c.char.x + s/2, c.char.y + s/2 + kbYOffset);
      ctx.rotate(attackRot);
      if (c.isPlayer) ctx.scale(-1, 1);
      
      drawEntityShape(ctx, c.char.id, s, c.char.state, this.stageTime, c.isPlayer, c.char.attackFreq);
      ctx.restore();
      
      // HPバー
      ctx.save(); ctx.translate(c.char.x, c.char.y - 20);
      ctx.fillStyle = 'black'; ctx.fillRect(0, 0, s, 6);
      ctx.fillStyle = c.isPlayer ? '#60a5fa' : '#ef4444'; ctx.fillRect(1, 1, (s-2) * Math.max(0, c.char.hp / c.char.maxHp), 4);
      ctx.restore();
    });

    this.souls.forEach(s => {
      ctx.globalAlpha = s.life / s.maxLife; ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath(); ctx.arc(s.x, s.y, 8, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(s.x-8, s.y); ctx.lineTo(s.x, s.y-25); ctx.lineTo(s.x+8, s.y); ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    this.particles.forEach(p => {
      ctx.globalAlpha = p.life / p.maxLife; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    this.effects.forEach(eff => {
      ctx.globalAlpha = eff.life / eff.maxLife;
      ctx.fillStyle = eff.color; ctx.font = 'bold 26px "Impact", sans-serif';
      ctx.strokeStyle = 'black'; ctx.lineWidth = 5; 
      ctx.strokeText(eff.text, eff.x, eff.y); ctx.fillStyle = 'white'; ctx.fillText(eff.text, eff.x, eff.y);
    });
    ctx.globalAlpha = 1.0;

    if (this.bossSpawned && this.screenShakeTime > 500) {
      ctx.fillStyle = 'red'; ctx.font = 'black 100px sans-serif'; ctx.textAlign = 'center';
      ctx.strokeStyle = 'black'; ctx.lineWidth = 15;
      ctx.strokeText("BOSS 襲来!!", canvas.width/2, canvas.height/2); ctx.fillStyle = 'white'; ctx.fillText("BOSS 襲来!!", canvas.width/2, canvas.height/2);
      ctx.textAlign = 'left';
    }

    ctx.restore();
  }

  drawBase(base, isPlayer) {
    if(base.hp <= 0) return; 
    const { ctx } = this;
    ctx.fillStyle = 'white'; ctx.strokeStyle = 'black'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.rect(base.x, base.y + 40, base.width, base.height - 40); ctx.fill(); ctx.stroke();

    if (isPlayer) {
      ctx.beginPath(); ctx.arc(base.x + base.width/2, base.y + 30, 35, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(base.x + 10, base.y + 10); ctx.lineTo(base.x, base.y - 15); ctx.lineTo(base.x + 35, base.y + 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'black'; ctx.fillRect(base.x + 25, base.y + 25, 4, 4); ctx.fillRect(base.x + 50, base.y + 25, 4, 4);
    } else {
      ctx.beginPath(); ctx.arc(base.x + base.width/2, base.y + 30, 35, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(base.x + 10, base.y + 30, 8, 15, Math.PI/4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(base.x + 70, base.y + 30, 8, 15, -Math.PI/4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(base.x + 25, base.y + 25, 6, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(base.x + 55, base.y + 25, 6, 0, Math.PI*2); ctx.fill();
    }
  }
}
