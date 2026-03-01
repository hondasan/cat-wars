import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpCircle, Coins, Zap, Play, RotateCcw, ChevronLeft, ChevronRight, Sword, Gift, Lock, Shield } from 'lucide-react';

// --- ゲームデータ定義 ---
const LOCAL_STORAGE_KEY = 'nyan_defense_save_data_v2';

const STAGES = [
  { id: 1, name: '第1章: 九州', enemyBaseHp: 3000, boss: 'hippo', bg: '#87CEEB', ground: '#8B4513', groundLight: '#654321' },
  { id: 2, name: '第1章: 四国', enemyBaseHp: 4500, boss: 'seal', bg: '#B0E0E6', ground: '#556B2F', groundLight: '#6B8E23' },
  { id: 3, name: '第1章: 中国', enemyBaseHp: 6000, boss: 'gorilla', bg: '#F5DEB3', ground: '#8B4513', groundLight: '#A0522D' },
  { id: 4, name: '第1章: 関西', enemyBaseHp: 8000, boss: 'kangaroo', bg: '#ffb6c1', ground: '#5c4033', groundLight: '#3b2f2f' },
  { id: 5, name: '第1章: 近畿', enemyBaseHp: 12000, boss: 'elephant', bg: '#DDA0DD', ground: '#2F4F4F', groundLight: '#40E0D0' },
  { id: 6, name: '第1章: 中部', enemyBaseHp: 15000, boss: 'moth', bg: '#FFDAB9', ground: '#D2691E', groundLight: '#CD853F' },
  { id: 7, name: '第1章: 関東', enemyBaseHp: 20000, boss: 'face', bg: '#483d8b', ground: '#2f4f4f', groundLight: '#1a1a1a' },
  { id: 8, name: '第1章: 東北', enemyBaseHp: 25000, boss: 'rhino', bg: '#e0f7fa', ground: '#006064', groundLight: '#00838f' },
  { id: 9, name: '第1章: 北海道', enemyBaseHp: 35000, boss: 'alien', bg: '#E6E6FA', ground: '#808080', groundLight: '#A9A9A9' },
  { id: 10, name: '第1章: 西表島', enemyBaseHp: 50000, boss: 'bunbun', bg: '#1a237e', ground: '#3e2723', groundLight: '#4e342e' }
];

const WALLET_LEVELS = [
  { level: 1, max: 500, rate: 1, cost: 100 }, { level: 2, max: 1000, rate: 1.5, cost: 300 },
  { level: 3, max: 2000, rate: 2.0, cost: 600 }, { level: 4, max: 4000, rate: 3.0, cost: 1000 },
  { level: 5, max: 8000, rate: 4.5, cost: 2000 }, { level: 6, max: 10000, rate: 6.0, cost: 5000 },
  { level: 7, max: 15000, rate: 8.0, cost: null }
];

// キャラクター大幅追加 (伝説レア含む全25種)
const PLAYER_UNITS = {
  // 基本
  basic:   { id: 'basic',   name: 'ネコ',       cost: 50,   hp: 100,  attack: 15,  range: 40,  speed: -1.5, cooldown: 2000,  size: 30, kb: 3, attackFreq: 1000, area: false, baseUpgradeCost: 100, rarity: 'basic', icon: 'ネコ' },
  tank:    { id: 'tank',    name: 'タンクネコ', cost: 150,  hp: 500,  attack: 10,  range: 40,  speed: -0.8, cooldown: 5000,  size: 45, kb: 1, attackFreq: 1500, area: false, baseUpgradeCost: 200, rarity: 'basic', icon: 'タンク' },
  battle:  { id: 'battle',  name: 'バトルネコ', cost: 200,  hp: 200,  attack: 30,  range: 45,  speed: -1.4, cooldown: 3500,  size: 35, kb: 3, attackFreq: 800,  area: false, baseUpgradeCost: 300, rarity: 'basic', icon: 'バトル' },
  ranged:  { id: 'ranged',  name: 'キモネコ',   cost: 300,  hp: 80,   attack: 40,  range: 200, speed: -1.2, cooldown: 6000,  size: 40, kb: 3, attackFreq: 2000, area: false, baseUpgradeCost: 500, rarity: 'basic', icon: 'キモ' },
  cow:     { id: 'cow',     name: 'ウシネコ',   cost: 400,  hp: 250,  attack: 15,  range: 40,  speed: -3.5, cooldown: 4000,  size: 45, kb: 5, attackFreq: 300,  area: false, baseUpgradeCost: 800, rarity: 'basic', icon: 'ウシ' },
  titan:   { id: 'titan',   name: '巨神ネコ',   cost: 1000, hp: 1500, attack: 120, range: 100, speed: -0.6, cooldown: 15000, size: 80, kb: 1, attackFreq: 2500, area: true,  baseUpgradeCost: 2000, rarity: 'basic', icon: '巨神' },
  // レア
  ninja:   { id: 'ninja',   name: '忍者ネコ',   cost: 300,  hp: 250,  attack: 60,  range: 40,  speed: -2.5, cooldown: 2500,  size: 30, kb: 3, attackFreq: 600,  area: false, baseUpgradeCost: 600, rarity: 'rare', icon: '忍者' },
  zombie:  { id: 'zombie',  name: 'ゾンビネコ', cost: 450,  hp: 800,  attack: 20,  range: 40,  speed: -0.5, cooldown: 4000,  size: 35, kb: 1, attackFreq: 2000, area: false, baseUpgradeCost: 700, rarity: 'rare', icon: 'ゾンビ' },
  pirate:  { id: 'pirate',  name: 'ネコ海賊',   cost: 500,  hp: 300,  attack: 40,  range: 120, speed: -1.0, cooldown: 5000,  size: 40, kb: 3, attackFreq: 1500, area: false, baseUpgradeCost: 800, rarity: 'rare', icon: '海賊' },
  thief:   { id: 'thief',   name: 'ネコ泥棒',   cost: 250,  hp: 150,  attack: 25,  range: 40,  speed: -3.0, cooldown: 2000,  size: 30, kb: 5, attackFreq: 800,  area: false, baseUpgradeCost: 500, rarity: 'rare', icon: '泥棒' },
  beauty:  { id: 'beauty',  name: 'ネコエステ', cost: 600,  hp: 400,  attack: 150, range: 250, speed: -1.2, cooldown: 5000,  size: 45, kb: 3, attackFreq: 2500, area: true,  baseUpgradeCost: 1000, rarity: 'rare', icon: '美脚' },
  jura:    { id: 'jura',    name: 'ネコジュラ', cost: 400,  hp: 500,  attack: 180, range: 50,  speed: -1.5, cooldown: 3000,  size: 35, kb: 3, attackFreq: 1200, area: false, baseUpgradeCost: 900,  rarity: 'rare', icon: '恐竜' },
  // 激レア
  hacker:  { id: 'hacker',  name: 'ネコハッカー',cost: 1500, hp: 200,  attack: 200, range: 400, speed: -0.4, cooldown: 20000, size: 50, kb: 1, attackFreq: 5000, area: true,  baseUpgradeCost: 2500, rarity: 'super', icon: 'ハッカ' },
  apple:   { id: 'apple',   name: 'ネコリンゴ', cost: 800,  hp: 600,  attack: 80,  range: 60,  speed: -1.2, cooldown: 8000,  size: 45, kb: 3, attackFreq: 1000, area: true,  baseUpgradeCost: 1500, rarity: 'super', icon: 'リンゴ' },
  swimmer: { id: 'swimmer', name: 'ネコスイマー',cost: 1200, hp: 400,  attack: 300, range: 50,  speed: -4.0, cooldown: 12000, size: 40, kb: 5, attackFreq: 2000, area: false, baseUpgradeCost: 2000, rarity: 'super', icon: 'スイマ' },
  otaku:   { id: 'otaku',   name: 'オタクネコ', cost: 1200, hp: 150,  attack: 100, range: 450, speed: -0.5, cooldown: 18000, size: 40, kb: 1, attackFreq: 4000, area: true,  baseUpgradeCost: 2000, rarity: 'super', icon: 'ヲタ' },
  skate:   { id: 'skate',   name: 'ネコスケーター',cost: 900,  hp: 700,  attack: 120, range: 150, speed: -3.0, cooldown: 6000,  size: 35, kb: 4, attackFreq: 1500, area: false, baseUpgradeCost: 1800, rarity: 'super', icon: '氷滑' },
  // 超激レア
  valkyrie:{ id: 'valkyrie',name: 'ヴァルキリー',cost: 3000, hp: 2500, attack: 400, range: 250, speed: -2.0, cooldown: 25000, size: 60, kb: 2, attackFreq: 2500, area: true,  baseUpgradeCost: 5000, rarity: 'uber', icon: '神槍' },
  bahamut: { id: 'bahamut', name: 'ネコムート', cost: 4500, hp: 5000, attack: 2000,range: 350, speed: -0.5, cooldown: 40000, size: 90, kb: 1, attackFreq: 8000, area: true,  baseUpgradeCost: 8000, rarity: 'uber', icon: '竜王' },
  zeus:    { id: 'zeus',    name: '神さま',     cost: 6000, hp: 8000, attack: 1500,range: 300, speed: -0.8, cooldown: 50000, size: 80, kb: 3, attackFreq: 5000, area: true,  baseUpgradeCost: 10000, rarity: 'uber', icon: '全能'},
  machine: { id: 'machine', name: 'ネコマシン', cost: 3600, hp: 12000,attack: 1000,range: 60,  speed: -0.6, cooldown: 30000, size: 85, kb: 1, attackFreq: 4000, area: true,  baseUpgradeCost: 6000, rarity: 'uber', icon: '鉄機' },
  megalo:  { id: 'megalo',  name: 'メガロ',     cost: 4200, hp: 3000, attack: 1800,range: 450, speed: -1.0, cooldown: 35000, size: 70, kb: 3, attackFreq: 6000, area: true,  baseUpgradeCost: 7000, rarity: 'uber', icon: '超弓' },
  gaou:    { id: 'gaou',    name: '皇獣ガオウ', cost: 4800, hp: 6000, attack: 2500,range: 380, speed: -0.8, cooldown: 45000, size: 85, kb: 3, attackFreq: 5000, area: true,  baseUpgradeCost: 9000, rarity: 'uber', icon: '皇獣' },
  amaterasu:{id: 'amaterasu',name:'アマテラス', cost: 4400, hp: 4500, attack: 1800,range: 400, speed: -1.2, cooldown: 40000, size: 75, kb: 4, attackFreq: 6000, area: true,  baseUpgradeCost: 8500, rarity: 'uber', icon: '天照' },
  // 伝説レア
  creator: { id: 'creator', name: '創造神ガイア',cost: 6500, hp: 15000,attack: 5000, range: 400, speed: -0.8, cooldown: 60000, size: 80, kb: 3, attackFreq: 6000, area: true,  baseUpgradeCost: 15000,rarity: 'legend', icon: '創造' },
  ushiwaka:{ id: 'ushiwaka',name: '牛若丸',     cost: 1500, hp: 3000, attack: 1500, range: 250, speed: -2.5, cooldown: 15000, size: 45, kb: 5, attackFreq: 1500, area: true,  baseUpgradeCost: 8000, rarity: 'legend', icon: '牛若' },
  momoko:  { id: 'momoko',  name: 'モモコ',     cost: 3800, hp: 4000, attack: 1200, range: 300, speed: -2.5, cooldown: 25000, size: 50, kb: 5, attackFreq: 3000, area: true,  baseUpgradeCost: 12000,rarity: 'legend', icon: '桃娘' }
};

const ENEMY_UNITS = {
  dog:     { id: 'dog',     hp: 80,   attack: 10,  range: 40,  speed: 1.2, size: 30, kb: 3, attackFreq: 1000, area: false, reward: 25,  xp: 100 },
  snake:   { id: 'snake',   hp: 50,   attack: 20,  range: 40,  speed: 2.2, size: 25, kb: 2, attackFreq: 800,  area: false, reward: 40,  xp: 150 },
  seal:    { id: 'seal',    hp: 400,  attack: 30,  range: 40,  speed: 0.8, size: 40, kb: 2, attackFreq: 1200, area: false, reward: 70,  xp: 250 },
  croco:   { id: 'croco',   hp: 200,  attack: 40,  range: 40,  speed: 1.5, size: 40, kb: 3, attackFreq: 800,  area: false, reward: 80,  xp: 300 },
  hippo:   { id: 'hippo',   hp: 800,  attack: 30,  range: 50,  speed: 0.6, size: 50, kb: 1, attackFreq: 1500, area: true,  reward: 150, xp: 500 },
  kangaroo:{ id: 'kangaroo',hp: 900,  attack: 80,  range: 50,  speed: 2.0, size: 50, kb: 4, attackFreq: 800,  area: false, reward: 180, xp: 600 },
  gorilla: { id: 'gorilla', hp: 400,  attack: 25,  range: 45,  speed: 1.8, size: 55, kb: 3, attackFreq: 500,  area: false, reward: 200, xp: 800 },
  bear:    { id: 'bear',    hp: 2500, attack: 150, range: 120, speed: 0.8, size: 70, kb: 2, attackFreq: 2000, area: true,  reward: 400, xp: 2000 },
  elephant:{ id: 'elephant',hp: 5000, attack: 200, range: 180, speed: 0.5, size: 90, kb: 1, attackFreq: 3000, area: true,  reward: 800, xp: 3000 },
  face:    { id: 'face',    hp: 8000, attack: 300, range: 100, speed: 0.4, size: 90, kb: 1, attackFreq: 3000, area: true,  reward: 1000, xp: 5000 },
  penguin: { id: 'penguin', hp: 300,  attack: 40,  range: 40,  speed: 1.5, size: 35, kb: 3, attackFreq: 800,  area: false, reward: 50,  xp: 200 },
  moth:    { id: 'moth',    hp: 600,  attack: 60,  range: 60,  speed: 1.8, size: 40, kb: 5, attackFreq: 1200, area: true,  reward: 100, xp: 400 },
  rhino:   { id: 'rhino',   hp: 4000, attack: 100, range: 40,  speed: 0.8, size: 60, kb: 1, attackFreq: 1500, area: false, reward: 300, xp: 1500 },
  ostrich: { id: 'ostrich', hp: 8000, attack: 150, range: 50,  speed: 2.5, size: 70, kb: 5, attackFreq: 300,  area: true,  reward: 1200,xp: 4500 },
  alien:   { id: 'alien',   hp: 3000, attack: 150, range: 200, speed: 1.0, size: 45, kb: 3, attackFreq: 1500, area: true,  reward: 500, xp: 1800 },
  bunbun:  { id: 'bunbun',  hp: 30000, attack: 500, range: 60,  speed: 1.2, size: 110,kb: 2, attackFreq: 500,  area: true,  reward: 2000,xp: 10000 }
};

// --- キャラクター描画ロジック (キモかわ徹底強化版) ---
const drawEntityShape = (ctx, id, size, state, time, isPlayer, attackFreq = 1000) => {
  const s2 = size / 2;
  
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath(); ctx.ellipse(0, 0, size * 0.4, size * 0.1, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = Math.max(2, size / 15);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  let legMove = state === 'walk' ? Math.sin(time / 80) * (size * 0.15) : 0;
  let attackPhase = state === 'attack' ? Math.min(1, (time % attackFreq) / attackFreq) : 0;

  let stretchX = 1; let stretchY = 1; let yOffset = 0;
  if (state === 'attack') {
    if (attackPhase > 0.8) { stretchX = 1.3; stretchY = 0.8; ctx.translate(10, 0); } 
    else if (attackPhase > 0.5) { stretchX = 0.8; stretchY = 1.2; ctx.translate(-5, -5); } 
  } else if (state === 'walk') {
    yOffset = -Math.abs(Math.sin(time / 80)) * 5; 
    ctx.translate(0, yOffset);
  } else {
    stretchY = 1 + Math.sin(time / 150) * 0.05; 
  }
  ctx.scale(stretchX, stretchY);

  const drawCatEars = (yPos) => {
    ctx.beginPath(); ctx.moveTo(-s2*0.6, yPos); ctx.lineTo(-s2*0.8, yPos - s2*0.7); ctx.lineTo(-s2*0.1, yPos - s2*0.2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2*0.1, yPos - s2*0.2); ctx.lineTo(s2*0.8, yPos - s2*0.7); ctx.lineTo(s2*0.6, yPos); ctx.fill(); ctx.stroke();
  };

  const drawCatFace = (yPos) => {
    if (state === 'attack' && attackPhase > 0.7) {
       ctx.fillStyle = 'white';
       ctx.beginPath(); ctx.arc(-s2*0.3, yPos-s2*0.1, s2*0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
       ctx.beginPath(); ctx.arc(s2*0.3, yPos-s2*0.1, s2*0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
       ctx.fillStyle = 'black';
       ctx.beginPath(); ctx.arc(-s2*0.3, yPos-s2*0.1, 2, 0, Math.PI*2); ctx.fill();
       ctx.beginPath(); ctx.arc(s2*0.3, yPos-s2*0.1, 2, 0, Math.PI*2); ctx.fill();
       
       ctx.fillStyle = 'black'; 
       ctx.beginPath(); ctx.ellipse(0, yPos+s2*0.2, s2*0.4, s2*0.6, 0, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = 'white'; // 歯
       ctx.fillRect(-s2*0.2, yPos-s2*0.3, s2*0.4, s2*0.2);
       ctx.fillStyle = 'red';
       ctx.beginPath(); ctx.arc(0, yPos+s2*0.5, s2*0.2, 0, Math.PI*2); ctx.fill(); 
    } else {
       ctx.fillStyle = 'black';
       ctx.fillRect(-s2*0.3, yPos, s2*0.15, s2*0.15); 
       ctx.fillRect(s2*0.15, yPos, s2*0.15, s2*0.15);
       ctx.beginPath(); ctx.arc(-s2*0.1, yPos+s2*0.25, s2*0.1, 0, Math.PI); ctx.stroke(); 
       ctx.beginPath(); ctx.arc(s2*0.1, yPos+s2*0.25, s2*0.1, 0, Math.PI); ctx.stroke(); 
    }
    ctx.fillStyle = 'white';
  };

  const drawLegs = (length = 10, count = 2) => {
     if (count === 2) {
       ctx.beginPath(); ctx.moveTo(-s2*0.4, -length); ctx.lineTo(-s2*0.4 + legMove, 0); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(s2*0.4, -length); ctx.lineTo(s2*0.4 - legMove, 0); ctx.stroke();
     } else if (count === 4) { 
       ctx.beginPath(); ctx.moveTo(-s2*0.8, -length); ctx.lineTo(-s2*0.8 + legMove, 0); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(-s2*0.3, -length); ctx.lineTo(-s2*0.3 - legMove, 0); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(s2*0.3, -length); ctx.lineTo(s2*0.3 + legMove, 0); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(s2*0.8, -length); ctx.lineTo(s2*0.8 - legMove, 0); ctx.stroke();
     }
  };

  // --- 味方 ---
  if (id === 'basic') {
    drawLegs(s2*0.8);
    ctx.beginPath(); ctx.ellipse(0, -s2*1.3, s2, s2*0.9, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    drawCatEars(-s2*2.1); drawCatFace(-s2*1.4);
  }
  else if (id === 'tank') {
    legMove *= 0.5; drawLegs(s2*0.5);
    ctx.beginPath(); ctx.rect(-s2, -size*1.5, size, size*1.5 - s2*0.5); ctx.fill(); ctx.stroke(); 
    drawCatEars(-size*1.5); drawCatFace(-size*1.0); 
  }
  else if (id === 'battle') {
    drawLegs(s2*0.8);
    ctx.beginPath(); ctx.ellipse(0, -s2*1.3, s2, s2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2*2.2); drawCatFace(-s2*1.4);
    ctx.beginPath(); ctx.moveTo(0, -s2*0.5); ctx.lineTo(size, -s2*1.5); ctx.lineWidth=4; ctx.stroke(); ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(size*0.8, -s2*1.2); ctx.lineTo(size*1.5, -s2*2); ctx.lineTo(size, -s2*2.5); ctx.fill(); ctx.stroke();
  }
  else if (id === 'ranged') {
    legMove = state === 'walk' ? Math.sin(time / 60) * (size * 0.5) : 0; 
    ctx.beginPath(); ctx.moveTo(-s2*0.3, -size*1.2); ctx.lineTo(-s2*0.3 + legMove*0.5, -size*0.6); ctx.lineTo(-s2*0.3 + legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2*0.3, -size*1.2); ctx.lineTo(s2*0.3 - legMove*0.5, -size*0.6); ctx.lineTo(s2*0.3 - legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(-s2*0.3 + legMove*0.5, -size*0.6, 2, 0, Math.PI*2); ctx.fill(); 
    ctx.beginPath(); ctx.arc(s2*0.3 - legMove*0.5, -size*0.6, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -size*1.2 - s2*0.6, s2*0.6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    drawCatEars(-size*1.2 - s2*1.1); drawCatFace(-size*1.2 - s2*0.7);
  }
  else if (id === 'cow') {
    legMove = state === 'walk' ? Math.sin(time / 30) * (size * 0.4) : 0; 
    drawLegs(s2*0.6, 4);
    ctx.beginPath(); ctx.ellipse(0, -s2, size*0.8, s2*0.7, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(0, -s2, s2*0.3, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(-s2*0.5, -s2*0.8, s2*0.2, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.ellipse(size*0.8, -s2*1.2, s2*0.6, s2*0.5, -Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.save(); ctx.translate(size*0.8, 0); drawCatEars(-s2*1.6); drawCatFace(-s2*1.3); ctx.restore();
  }
  else if (id === 'titan') {
    drawLegs(s2*0.5);
    ctx.beginPath(); ctx.arc(0, -size*0.9, size*0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(0, -size*0.7, size*0.4, Math.PI, 0); ctx.stroke(); 
    ctx.beginPath(); ctx.moveTo(0, -size*0.7); ctx.lineTo(0, -size*0.4); ctx.stroke(); 
    drawCatEars(-size*1.4); drawCatFace(-size*1.2);
    let armY = (state === 'attack' && attackPhase > 0.5) ? -size*1.2 : -size*0.5;
    ctx.beginPath(); ctx.ellipse(size*0.5, armY, s2*0.6, size*0.5, Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
  }
  else if (id === 'ninja') {
    drawLegs(s2*0.8);
    ctx.beginPath(); ctx.arc(0, -s2*1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(0, -s2*1.5, s2+1, Math.PI, 0); ctx.fill(); 
    ctx.fillRect(-s2-1, -s2*1.5, size+2, s2*0.8); 
    ctx.fillStyle = '#ffe0bd'; ctx.fillRect(-s2+4, -s2*1.3, size-8, s2*0.5); 
    drawCatFace(-s2*1.4);
    ctx.beginPath(); ctx.moveTo(-s2, -s2*0.5); ctx.lineTo(-size, -size); ctx.lineWidth=4; ctx.stroke(); ctx.lineWidth=2; 
  }
  else if (id === 'zombie') {
    ctx.fillStyle = '#a5d6a7';
    drawLegs(s2*0.8);
    ctx.beginPath(); ctx.arc(0, -s2*1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    drawCatEars(-s2*2.2); drawCatFace(-s2*1.4);
    ctx.fillStyle = 'white'; ctx.fillRect(-s2*0.6, -s2*0.6, s2*1.2, s2*0.3); ctx.strokeRect(-s2*0.6, -s2*0.6, s2*1.2, s2*0.3); 
  }
  else if (id === 'pirate') {
    drawLegs(s2*0.8);
    ctx.beginPath(); ctx.arc(0, -s2*1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(-size*0.8, -s2*1.8); ctx.lineTo(size*0.8, -s2*1.8); ctx.lineTo(0, -size*1.3); ctx.fill(); ctx.stroke(); 
    ctx.fillRect(-s2*0.3, -s2*1.5, s2*0.3, s2*0.3); 
    drawCatFace(-s2*1.4);
    ctx.beginPath(); ctx.moveTo(s2, -s2*0.5); ctx.lineTo(size, -s2*1.5); ctx.lineWidth=4; ctx.stroke(); ctx.lineWidth=2; ctx.fillStyle='white';
  }
  else if (id === 'thief') {
    legMove = state === 'walk' ? Math.sin(time / 40) * (size * 0.25) : 0; 
    drawLegs(s2*0.8);
    ctx.beginPath(); ctx.arc(0, -s2*1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#4caf50'; ctx.beginPath(); ctx.arc(-s2*0.8, -s2*1.3, s2*0.8, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(-s2*0.8, -s2*1.3, s2*0.3, 0, Math.PI); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = 'black'; ctx.fillStyle='white';
    drawCatFace(-s2*1.4);
  }
  else if (id === 'beauty') {
    legMove = state === 'walk' ? Math.sin(time / 60) * (size * 0.4) : 0; 
    ctx.beginPath(); ctx.moveTo(-s2*0.3, -size*1.2); ctx.lineTo(-s2*0.3 + legMove*0.5, -size*0.6); ctx.lineTo(-s2*0.3 + legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2*0.3, -size*1.2); ctx.lineTo(s2*0.3 - legMove*0.5, -size*0.6); ctx.lineTo(s2*0.3 - legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size*1.5, s2, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(0, -size*1.5, s2*1.05, Math.PI, 0); ctx.fill(); 
    ctx.fillRect(-s2*1.05, -size*1.5, size*1.05, s2*0.5); 
    ctx.fillStyle = '#ffe0bd'; ctx.fillRect(-s2*0.8, -size*1.5, size*0.8, s2*0.4); 
    drawCatFace(-size*1.5);
    let armRot = (state === 'attack') ? -Math.PI/2 : 0;
    ctx.save(); ctx.translate(0, -size*1.2); ctx.rotate(armRot); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, size*0.8); ctx.stroke(); ctx.restore();
  }
  else if (id === 'jura') {
    drawLegs(s2*0.6);
    ctx.fillStyle = '#4caf50'; 
    ctx.beginPath(); ctx.ellipse(0, -s2*1.5, size*0.8, size*0.6, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.moveTo(size*0.5, -s2*1.5); ctx.lineTo(size*1.2, -s2*1.5); ctx.lineTo(size*0.5, -s2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(-s2*0.5, -size*1.2, s2*0.6, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    drawCatFace(-size*1.2);
    ctx.fillStyle = 'white';
    if(state==='attack') {
       ctx.beginPath(); ctx.moveTo(-size*0.8, -s2*1.5); ctx.lineTo(-size*1.2, -size); ctx.lineTo(-size*0.8, -s2); ctx.fill(); ctx.stroke(); 
    }
  }
  else if (id === 'hacker') {
    ctx.beginPath(); ctx.arc(0, -s2*0.5, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    drawCatEars(-s2*1.4); drawCatFace(-s2*0.6);
    ctx.fillStyle = '#ccc'; ctx.beginPath(); ctx.rect(s2*0.5, -s2*1.5, size*0.6, size*0.6); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#eee'; ctx.fillRect(s2*0.6, -s2*1.4, size*0.4, size*0.3); ctx.fillStyle='white';
  }
  else if (id === 'otaku') {
    drawLegs(s2*0.5);
    ctx.beginPath(); ctx.arc(0, -size*0.8, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    drawCatFace(-size*0.9);
    ctx.fillStyle = 'blue'; ctx.fillRect(-s2, -size*0.5, size, s2*0.5); 
    ctx.fillStyle = '#ccc'; ctx.beginPath(); ctx.rect(-s2*0.5, -size*0.4, size*0.5, size*0.4); ctx.fill(); ctx.stroke(); 
    let armRot = (state === 'attack') ? Math.sin(time/20)*Math.PI/2 : 0;
    ctx.save(); ctx.translate(0, -size*0.6); ctx.rotate(armRot);
    ctx.strokeStyle = 'cyan'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-size*0.8, -size*0.8); ctx.stroke(); 
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.restore();
  }
  else if (id === 'skate') {
    legMove = state === 'walk' ? Math.sin(time / 100) * (size * 0.5) : 0; 
    ctx.beginPath(); ctx.moveTo(-s2*0.4, -s2); ctx.lineTo(-s2*0.4 + legMove, -5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2*0.4, -s2); ctx.lineTo(s2*0.4 - legMove, -5); ctx.stroke();
    ctx.fillStyle = 'gray'; ctx.beginPath(); ctx.ellipse(-s2*0.4 + legMove, 0, 8, 4, 0, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(s2*0.4 - legMove, 0, 8, 4, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(0, -size, s2*1.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    drawCatFace(-size*1.1);
    ctx.fillStyle = '#e91e63'; ctx.beginPath(); ctx.arc(0, -size*1.6, s2*0.8, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'white';
  }
  else if (id === 'apple') {
    drawLegs(s2*0.8);
    ctx.fillStyle = '#ef5350'; ctx.beginPath(); ctx.arc(0, -s2*1.3, s2*1.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#66bb6a'; ctx.beginPath(); ctx.ellipse(0, -size*1.2, s2*0.3, s2*0.6, Math.PI/4, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    drawCatFace(-s2*1.4);
  }
  else if (id === 'swimmer') {
    drawLegs(s2*0.8);
    ctx.beginPath(); ctx.arc(0, -s2*1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#29b6f6'; ctx.beginPath(); ctx.ellipse(0, -s2*0.8, size*0.8, s2*0.4, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(0, -s2*0.8, size*0.5, s2*0.2, 0, 0, Math.PI*2); ctx.fill(); 
    drawCatFace(-s2*1.4);
    ctx.fillStyle = '#ffa726'; ctx.fillRect(-s2*0.4, -s2*1.6, s2*0.8, s2*0.3); ctx.fillStyle = '#e0f7fa'; ctx.fillRect(-s2*0.3, -s2*1.5, s2*0.2, s2*0.15); ctx.fillRect(s2*0.1, -s2*1.5, s2*0.2, s2*0.15); ctx.fillStyle='white';
  }
  else if (id === 'valkyrie') {
    drawLegs(size*0.8);
    ctx.beginPath(); ctx.ellipse(0, -size*1.2, s2*0.6, size*0.8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(0, -size*2.2, s2*0.8, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    drawCatFace(-size*2.3); drawCatEars(-size*2.6);
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(-s2, -size*1.5, size*0.8, s2*0.5, -Math.PI/4 + attackPhase, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.moveTo(s2, -size*0.5); ctx.lineTo(size*1.5, -size*3); ctx.lineWidth=5; ctx.stroke(); ctx.lineWidth=2; 
  }
  else if (id === 'bahamut') {
    ctx.fillStyle = '#222'; ctx.strokeStyle = '#555';
    drawLegs(size*0.8);
    ctx.beginPath(); ctx.ellipse(0, -size*1.2, size*0.6, size*0.8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(size*0.5, -size*2, size*0.4, size*0.3, Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#ff00ff'; ctx.beginPath(); ctx.arc(size*0.6, -size*2.1, s2*0.2, 0, Math.PI*2); ctx.fill(); 
    ctx.fillStyle = '#111'; let wingY = Math.sin(time / 150) * (size*0.2);
    ctx.beginPath(); ctx.ellipse(-size*0.5, -size*1.5 + wingY, size*0.8, size*0.4, -Math.PI/3, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'white'; ctx.strokeStyle = 'black';
  }
  else if (id === 'zeus') {
    ctx.fillStyle = '#ddd'; ctx.strokeStyle = '#aaa';
    ctx.beginPath(); ctx.arc(0, -s2, size*0.6, 0, Math.PI*2); ctx.arc(-size*0.5, -s2*0.5, size*0.5, 0, Math.PI*2); ctx.arc(size*0.5, -s2*0.5, size*0.5, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'white'; ctx.strokeStyle = 'black';
    ctx.beginPath(); ctx.ellipse(0, -size*1.5, size*0.5, size*0.8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(0, -size*2.5, s2, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.arc(0, -size*2.2, size*0.5, 0, Math.PI); ctx.fill(); ctx.stroke(); 
    drawCatFace(-size*2.6);
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(size*0.5, -size); ctx.lineTo(size*0.8, -size*1.5); ctx.lineTo(size*0.5, -size*1.8); ctx.lineTo(size, -size*2.8); ctx.stroke(); 
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
  }
  else if (id === 'machine') {
    ctx.fillStyle = '#999'; ctx.beginPath(); ctx.rect(-size*0.4, -size*1.2, size*0.8, size); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#333'; ctx.fillRect(-size*0.3, -size, size*0.6, size*0.3); ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(0, -size*0.85, s2*0.2, 0, Math.PI*2); ctx.fill(); 
    ctx.fillStyle = '#444'; ctx.beginPath(); ctx.ellipse(0, -s2*0.5, size*0.6, s2*0.5, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    let armRot = (state === 'attack') ? -Math.PI/2 : 0;
    ctx.save(); ctx.translate(-size*0.4, -size*0.7); ctx.rotate(armRot);
    ctx.fillStyle = '#777'; ctx.beginPath(); ctx.rect(-s2*0.5, -s2*0.5, size, s2); ctx.fill(); ctx.stroke(); 
    ctx.restore(); ctx.fillStyle = 'white';
  }
  else if (id === 'megalo') {
    drawLegs(size*0.8);
    ctx.beginPath(); ctx.ellipse(0, -size*1.2, s2*0.4, size*0.8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(0, -size*2.2, s2*0.6, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    drawCatFace(-size*2.3);
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(s2, -size*1.2, size, -Math.PI/2, Math.PI/2); ctx.stroke(); 
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(s2, -size*2.2); ctx.lineTo(s2, -size*0.2); ctx.stroke(); 
    if (state === 'attack') { ctx.strokeStyle = 'cyan'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -size*1.2); ctx.lineTo(size*3, -size*1.2); ctx.stroke(); } 
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
  }
  else if (id === 'gaou') {
    drawLegs(s2, 4);
    ctx.beginPath(); ctx.ellipse(0, -size*1.2, size, size*0.8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#ffb74d'; 
    for(let i=0; i<8; i++) {
      let a = (i/8)*Math.PI*2 + time/500;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*size*0.8 - size*0.5, Math.sin(a)*size*0.8 - size*1.5);
      ctx.lineTo(Math.cos(a+0.2)*size*1.2 - size*0.5, Math.sin(a+0.2)*size*1.2 - size*1.5);
      ctx.lineTo(Math.cos(a-0.2)*size*1.2 - size*0.5, Math.sin(a-0.2)*size*1.2 - size*1.5); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(-size*0.5, -size*1.5, s2, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    drawCatFace(-size*1.6);
    if(state==='attack') { ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(-size, -size*1.5, size*0.5, 0, Math.PI*2); ctx.fill(); }
  }
  else if (id === 'amaterasu') {
    ctx.translate(0, -10 - Math.sin(time/100)*5); 
    ctx.beginPath(); ctx.ellipse(0, -size*1.2, s2, size*0.8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(0, -size*2.2, s2*0.8, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    drawCatFace(-size*2.3);
    ctx.strokeStyle = 'gold'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(-size, -size*1.5, size*0.6, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,0,0.3)'; ctx.fill();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
    if(state==='attack') { ctx.strokeStyle = 'orange'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-size, -size*1.5); ctx.lineTo(-size*3, -size*1.5); ctx.stroke(); ctx.strokeStyle = 'black'; ctx.lineWidth = 2;}
  }
  else if (id === 'ushiwaka') {
    ctx.translate(0, -15 - Math.sin(time/100)*5); 
    ctx.strokeStyle = '#ff99cc'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-size, -size); ctx.quadraticCurveTo(0, -size*1.5, size, -size); ctx.stroke(); 
    ctx.lineWidth = 2; ctx.strokeStyle = 'black'; drawLegs(s2*0.4);
    ctx.beginPath(); ctx.arc(0, -s2*1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.moveTo(-s2*0.4, -s2*2.2); ctx.lineTo(-s2*0.2, -size*1.5); ctx.lineTo(s2*0.2, -size*1.5); ctx.lineTo(s2*0.4, -s2*2.2); ctx.fill(); 
    ctx.fillStyle = 'white'; drawCatFace(-s2*1.4);
    if (state === 'attack') { ctx.strokeStyle = 'yellow'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -s2*1.4); ctx.lineTo(-size*3, -s2*1.4); ctx.stroke(); ctx.strokeStyle = 'black'; ctx.lineWidth = 2;}
  }
  else if (id === 'creator') {
    ctx.translate(0, -30 - Math.sin(time/150)*10); 
    let pulse = Math.sin(time/50) * 5;
    ctx.fillStyle = 'cyan'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, s2 + pulse, 0, Math.PI*2); ctx.fill(); 
    ctx.globalAlpha = 1.0; ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(0, -s2*1.5, s2*0.8, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    drawCatFace(-s2*1.6); drawCatEars(-s2*2.2);
    ctx.strokeStyle = 'gold'; ctx.lineWidth = 4;
    for(let i=0; i<8; i++) { 
       let angle = (i/8) * Math.PI*2 + time/1000;
       ctx.beginPath(); ctx.moveTo(Math.cos(angle)*size*0.6, -s2*1.5 + Math.sin(angle)*size*0.6); 
       ctx.lineTo(Math.cos(angle)*size*1.2, -s2*1.5 + Math.sin(angle)*size*1.2); ctx.stroke();
    }
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    if (state === 'attack') { ctx.fillStyle = 'magenta'; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.arc(-size*1.5, 0, size*1.5, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1.0; ctx.fillStyle = 'white';}
  }
  else if (id === 'momoko') {
    ctx.translate(0, -20 - Math.sin(time/80)*8);
    ctx.fillStyle = '#f8bbd0'; ctx.beginPath(); ctx.arc(0, -s2, size*0.8, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -size*1.3); ctx.lineTo(0, -s2); ctx.stroke(); 
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(0, -size*1.6, s2*0.8, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    drawCatFace(-size*1.7);
    let armRot = (state === 'attack') ? -Math.PI/2 : Math.sin(time/100)*0.2;
    ctx.save(); ctx.translate(-s2, -size*1.5); ctx.rotate(armRot);
    ctx.fillStyle = 'red'; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0, s2, Math.PI, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.restore(); ctx.fillStyle = 'white';
  }

  // --- 敵 ---
  else if (id === 'dog') {
    drawLegs(s2, 4);
    ctx.beginPath(); ctx.ellipse(0, -s2*1.5, size*0.7, s2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    let mouthOpen = state === 'attack' && attackPhase > 0.5 ? Math.PI/4 : 0;
    ctx.beginPath(); ctx.arc(size*0.5, -size*0.9, s2*0.7, mouthOpen, Math.PI*2 - mouthOpen); ctx.lineTo(size*0.5, -size*0.9); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.ellipse(size*0.3, -size*1.1, s2*0.3, s2*0.5, -Math.PI/4, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(size*0.8, -size*0.9, s2*0.15, 0, Math.PI*2); ctx.fill(); ctx.fillRect(size*0.5, -size*1.1, s2*0.15, s2*0.15); ctx.fillStyle='white';
  } 
  else if (id === 'snake') {
    let wave = Math.sin(time / 100) * (size*0.3);
    ctx.beginPath(); ctx.moveTo(-size*0.6, -s2); ctx.quadraticCurveTo(-s2, -s2 + wave, 0, -s2*1.5); ctx.quadraticCurveTo(s2, -s2 - wave, size*0.4, -size*0.8); ctx.quadraticCurveTo(size*0.6, -size*1.2 + wave, size*0.5, -size*1.4);
    ctx.arc(size*0.5, -size*1.4, s2*0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.fillRect(size*0.6, -size*1.5, s2*0.2, s2*0.2); ctx.fillStyle='white';
  } 
  else if (id === 'croco') {
    drawLegs(s2, 4);
    ctx.fillStyle = '#4caf50'; ctx.beginPath(); ctx.ellipse(0, -s2*1.5, size, s2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    let mouthOpen = state === 'attack' ? s2*0.5 : 0;
    ctx.beginPath(); ctx.moveTo(s2, -s2*1.5 - mouthOpen); ctx.lineTo(size*1.5, -s2*1.5 - mouthOpen); ctx.lineTo(size, -s2*1.5 + mouthOpen); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'white'; for(let i=0; i<3; i++) { ctx.beginPath(); ctx.moveTo(size*0.7+i*s2*0.3, -s2*1.5 - mouthOpen); ctx.lineTo(size*0.8+i*s2*0.3, -s2*1.2 - mouthOpen); ctx.lineTo(size*0.9+i*s2*0.3, -s2*1.5 - mouthOpen); ctx.fill(); } 
    ctx.fillStyle = 'black'; ctx.fillRect(s2, -size*0.9, s2*0.2, s2*0.2); ctx.fillStyle='white';
  }
  else if (id === 'seal') {
    legMove = state === 'walk' ? Math.sin(time / 60) * 5 : 0; 
    ctx.translate(legMove, 0);
    ctx.beginPath(); ctx.ellipse(0, -s2, size, s2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size, -s2); ctx.lineTo(size*1.2, -s2*1.5); ctx.lineTo(size*1.2, -s2*0.5); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.fillRect(-size*0.6, -size*0.7, 4, 4); ctx.beginPath(); ctx.arc(-size*0.8, -s2, 3, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = 'white';
  }
  else if (id === 'kangaroo') {
    legMove = state === 'walk' ? Math.abs(Math.sin(time / 50)) * size*0.5 : 0; 
    ctx.translate(0, -legMove); drawLegs(s2*1.2);
    ctx.beginPath(); ctx.ellipse(0, -size, size*0.5, size*0.8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(-s2*0.5, -size*1.8, s2*0.6, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.ellipse(-s2, -size*2.2, 5, 15, -Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -size*2.2, 5, 15, Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(-s2*0.8, -size*1.9, 4, 4);
    ctx.fillStyle = 'red'; let punchX = (state === 'attack') ? -size*0.8 : 0;
    ctx.beginPath(); ctx.arc(-s2 + punchX, -size*1.2, s2*0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'white';
  }
  else if (id === 'alien') {
    drawLegs(s2*1.2); ctx.fillStyle = '#69f0ae'; 
    ctx.beginPath(); ctx.ellipse(0, -size, size*0.4, size*0.8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(0, -size*1.8, size*0.6, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.moveTo(-s2*0.5, -size*2.3); ctx.lineTo(-size*0.8, -size*2.8); ctx.stroke(); ctx.beginPath(); ctx.arc(-size*0.8, -size*2.8, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s2*0.5, -size*2.3); ctx.lineTo(size*0.8, -size*2.8); ctx.stroke(); ctx.beginPath(); ctx.arc(size*0.8, -size*2.8, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'black'; ctx.save(); ctx.translate(-s2*0.5, -size*1.8); ctx.rotate(-Math.PI/6); ctx.beginPath(); ctx.ellipse(0, 0, s2*0.4, s2*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(s2*0.5, -size*1.8); ctx.rotate(Math.PI/6); ctx.beginPath(); ctx.ellipse(0, 0, s2*0.4, s2*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); ctx.fillStyle = 'white';
    if(state === 'attack') { ctx.strokeStyle = '#00e676'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -size*1.8); ctx.lineTo(-size*3, -size*1.8); ctx.stroke(); ctx.strokeStyle = 'black'; ctx.lineWidth = 2;}
  }
  else if (id === 'elephant') {
    drawLegs(size*0.6, 4);
    ctx.fillStyle = '#9e9e9e'; ctx.beginPath(); ctx.ellipse(0, -size*1.2, size*0.8, size*0.7, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(size*0.6, -size*1.4, size*0.5, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    let trunkRot = (state === 'attack') ? -Math.PI/4 : 0;
    ctx.save(); ctx.translate(size, -size*1.4); ctx.rotate(trunkRot); ctx.beginPath(); ctx.ellipse(size*0.3, s2*0.5, size*0.5, s2*0.4, Math.PI/4, 0, Math.PI*2); ctx.fill(); ctx.stroke(); ctx.restore(); 
    ctx.beginPath(); ctx.ellipse(s2*0.5, -size*1.4, size*0.4, size*0.6, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.fillRect(size*0.8, -size*1.5, s2*0.2, s2*0.2); ctx.fillStyle='white';
  }
  else if (id === 'ostrich') {
    legMove = state === 'walk' ? Math.sin(time / 40) * (size * 0.4) : 0; 
    drawLegs(size*0.8);
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(0, -size, size*0.6, size*0.5, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#ffcc80'; let neckX = (state === 'attack') ? size*0.5 : 0;
    ctx.beginPath(); ctx.moveTo(s2, -size*1.2); ctx.lineTo(size*0.6 + neckX, -size*2); ctx.lineTo(size*0.8 + neckX, -size*1.8); ctx.lineWidth=6; ctx.stroke(); ctx.lineWidth=2; 
    ctx.beginPath(); ctx.arc(size*0.7 + neckX, -size*2, s2*0.5, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.fillRect(size*0.75 + neckX, -size*2.1, s2*0.2, s2*0.2); 
    ctx.fillStyle = 'orange'; ctx.beginPath(); ctx.moveTo(size*0.9 + neckX, -size*2); ctx.lineTo(size*1.2 + neckX, -size*1.9); ctx.lineTo(size*0.9 + neckX, -size*1.8); ctx.fill(); ctx.stroke(); ctx.fillStyle='white';
  }
  else if (id === 'hippo') {
    drawLegs(s2*0.8, 4);
    ctx.beginPath(); ctx.ellipse(0, -s2*1.5, size*0.8, size*0.5, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    let mouthOpen = state === 'attack' ? s2*0.5 : 0;
    ctx.beginPath(); ctx.ellipse(size*0.6, -s2*1.5 + mouthOpen, size*0.4, size*0.3, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.fillRect(size*0.8, -s2*1.5, s2*0.2, s2*0.2); ctx.fillRect(size*0.5, -size*0.9, s2*0.2, s2*0.2); ctx.fillStyle='white';
    ctx.beginPath(); ctx.arc(s2*0.5, -size, s2*0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
  }
  else if (id === 'gorilla') {
    drawLegs(s2*1.2);
    ctx.beginPath(); ctx.ellipse(0, -size*0.8, size*0.5, size*0.6, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(s2*0.3, -size*1.2, size*0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.fillRect(s2*0.4, -size*1.3, s2*0.2, s2*0.2); ctx.fillStyle='white';
    let armY = (state === 'attack') ? Math.sin(time/50)* (size*0.3) : 0; 
    ctx.beginPath(); ctx.ellipse(-s2*0.3, -s2 + armY, s2*0.4, size*0.5, -Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(size*0.4, -s2 - armY, s2*0.4, size*0.5, Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  }
  else if (id === 'bear') {
    drawLegs(s2*1.2);
    ctx.beginPath(); ctx.ellipse(0, -size, size*0.8, size*0.9, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(size*0.4, -size*1.5, size*0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(s2*0.3, -size*1.8, s2*0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(size*0.6, -size*1.8, s2*0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.fillRect(size*0.5, -size*1.6, s2*0.2, s2*0.2); ctx.fillRect(size*0.7, -size*1.5, s2*0.3, s2*0.3); ctx.fillStyle='white';
    let armRot = (state === 'attack') ? Math.PI/2 : 0; 
    ctx.save(); ctx.translate(size*0.3, -size*0.8); ctx.rotate(armRot); ctx.beginPath(); ctx.ellipse(size*0.4, 0, size*0.4, s2*0.4, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  else if (id === 'face') {
    ctx.beginPath(); ctx.arc(0, -size*0.8, size*0.8, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.ellipse(-size*0.3, -size, s2*0.4, s2*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(size*0.3, -size, s2*0.4, s2*0.2, 0, 0, Math.PI*2); ctx.fill(); 
    const mouthOpen = (state === 'attack') ? size*0.4 : s2*0.2;
    ctx.beginPath(); ctx.ellipse(0, -s2*0.5, size*0.3, mouthOpen, 0, 0, Math.PI*2); ctx.fill(); 
    if(state === 'attack') { ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(0, -s2*0.5, s2*0.4, 0, Math.PI*2); ctx.fill(); } ctx.fillStyle='white';
  }
  else if (id === 'moth') {
    ctx.beginPath(); ctx.ellipse(0, -size*0.5, s2*0.5, size*0.5, Math.PI/2, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = '#a5d6a7'; let wingY = Math.sin(time / 50) * (size*0.4);
    ctx.beginPath(); ctx.ellipse(0, -size*0.8, size*0.8, size*0.5 + wingY, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(s2*0.2, -size*0.6, s2*0.2, s2*0.2); ctx.fillStyle='white';
  }
  else if (id === 'penguin') {
    drawLegs(s2*0.8);
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(0, -size*0.8, size*0.5, size*0.6, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(s2*0.2, -size*0.7, size*0.3, size*0.4, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'orange'; ctx.beginPath(); ctx.moveTo(size*0.4, -size*1.1); ctx.lineTo(size*0.8, -size*0.9); ctx.lineTo(size*0.4, -size*0.8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(s2*0.4, -size*1.1, s2*0.2, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = 'black'; ctx.fillRect(s2*0.5, -size*1.15, s2*0.15, s2*0.15); ctx.fillStyle='white';
  }
  else if (id === 'rhino') {
    drawLegs(s2*0.8, 4);
    ctx.beginPath(); ctx.ellipse(0, -size*0.8, size*0.8, size*0.5, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.ellipse(size*0.6, -size*0.9, size*0.4, size*0.3, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.moveTo(size*0.8, -size*0.9); ctx.lineTo(size*1.2, -size*1.4); ctx.lineTo(size*0.6, -size*1.1); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.fillRect(size*0.7, -size, s2*0.2, s2*0.2); ctx.fillStyle='white';
  }
  else if (id === 'bunbun') {
    ctx.beginPath(); ctx.arc(0, -size*1.2, size*0.8, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.fillStyle = 'black'; ctx.fillRect(-size*0.3, -size*1.5, size*0.2, size*0.2); ctx.fillRect(size*0.3, -size*1.5, size*0.2, size*0.2); 
    ctx.fillStyle = '#555'; let wingY = Math.sin(time / 100) * (size*0.2);
    ctx.beginPath(); ctx.ellipse(-size*0.8, -size*1.5 + wingY, size*0.6, size*0.3, -Math.PI/4, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.ellipse(size*0.8, -size*1.5 + wingY, size*0.6, size*0.3, Math.PI/4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; let punchX = (state === 'attack') ? size : 0;
    ctx.beginPath(); ctx.arc(size*0.6 + punchX, -size*0.5, size*0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke(); 
    ctx.beginPath(); ctx.arc(-size*0.6, -size*0.5, size*0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  }
};

// --- アイコン用 Canvas コンポーネント ---
const UnitIcon = ({ id, size, isPlayer = true, animate = false }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId; let startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = animate ? Date.now() - startTime : 0;
      ctx.save(); ctx.translate(canvas.width / 2, canvas.height - 10); 
      const baseSize = PLAYER_UNITS[id] ? PLAYER_UNITS[id].size : (ENEMY_UNITS[id] ? ENEMY_UNITS[id].size : 30);
      const scale = (size * 0.5) / baseSize; 
      ctx.scale(scale, scale);
      drawEntityShape(ctx, id, baseSize, animate ? 'walk' : 'idle', time, isPlayer, 1000);
      ctx.restore();
      if (animate) animationId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationId);
  }, [id, size, animate]);

  return <canvas ref={canvasRef} width={size} height={size} className="pointer-events-none" />;
};


// --- サウンドエンジン ---
class SoundManager {
  constructor() {
    this.ctx = null; this.masterGain = null;
    this.isPlayingBgm = false; this.bgmTimer = null; this.isBossBgm = false;
    this.tick = 0;
  }
  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.15;
    this.masterGain.connect(this.ctx.destination);
  }
  playTone(freq, type, duration, vol = 1) {
    if (!this.ctx || freq <= 0) return;
    const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain); gain.connect(this.masterGain); osc.start(); osc.stop(this.ctx.currentTime + duration);
  }
  playNoise(duration, vol = 1, type = 'lowpass', freq = 1000) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource(); noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter(); filter.type = type; filter.frequency.value = freq;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    noise.connect(filter); filter.connect(gain); gain.connect(this.masterGain); noise.start();
  }

  se(type) {
    if (!this.ctx) return;
    switch(type) {
      case 'spawn': this.playTone(600, 'square', 0.1, 0.4); setTimeout(() => this.playTone(800, 'square', 0.1, 0.4), 50); break;
      case 'hit': this.playNoise(0.1, 0.3, 'highpass', 800); break;
      case 'baseHit': this.playNoise(0.3, 0.8); this.playTone(100, 'sawtooth', 0.3, 0.8); break;
      case 'kill': this.playTone(1200, 'sine', 0.1, 0.3); this.playNoise(0.1, 0.3); break;
      case 'upgrade': this.playTone(400, 'sine', 0.1, 0.5); setTimeout(() => this.playTone(600, 'sine', 0.2, 0.5), 100); break;
      case 'gacha': [400, 500, 600, 800, 1200].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.1, 0.5), i * 100)); break;
      case 'cannonCharge': this.playTone(800, 'sine', 0.1, 0.2); break;
      case 'cannonFire': this.playNoise(1.0, 1.5); this.playTone(200, 'sawtooth', 1.0, 1.0); break;
      case 'shockwave': this.playNoise(1.5, 2.0, 'lowpass', 400); this.playTone(50, 'sawtooth', 1.5, 1.5); break;
      case 'win': [523, 659, 783, 1046].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.2, 0.8), i * 150)); break;
      case 'lose': [300, 280, 260, 200].forEach((f, i) => setTimeout(() => this.playTone(f, 'sawtooth', 0.4, 0.8), i * 300)); break;
      case 'error': this.playTone(200, 'sawtooth', 0.1, 0.5); break;
    }
  }

  startBgm(isBoss = false) {
    if (this.isPlayingBgm && this.isBossBgm === isBoss) return;
    this.stopBgm();
    this.isPlayingBgm = true;
    this.isBossBgm = isBoss;
    this.tick = 0;
    
    // 楽しげでリズミカルなマーチ
    const bNotes = isBoss ? [146, 0, 164, 0, 196, 0, 164, 0] : [130, 0, 164, 196, 130, 0, 196, 164];
    const mNotes = isBoss ? [293, 329, 392, 440, 493, 440, 392, 329] : [261, 329, 392, 440, 392, 329, 261, 0];
    const speed = isBoss ? 110 : 130;
    
    const loop = () => {
      if (!this.isPlayingBgm) return;
      const b = bNotes[this.tick % bNotes.length];
      const m = mNotes[this.tick % mNotes.length];
      
      if (b > 0) this.playTone(b, isBoss ? 'sawtooth' : 'triangle', 0.15, 0.4);
      if (m > 0) this.playTone(m, 'square', 0.1, 0.2);
      
      // パーカッション（裏打ち）
      if (this.tick % 2 !== 0) {
         this.playNoise(0.05, 0.1, 'highpass', 5000); // ハイハット
      } else {
         this.playNoise(0.05, 0.1, 'lowpass', 200); // キック
      }
      
      this.tick++;
      this.bgmTimer = setTimeout(loop, speed);
    };
    loop();
  }

  stopBgm() {
    this.isPlayingBgm = false;
    clearTimeout(this.bgmTimer);
  }
}
const sfx = new SoundManager();

// --- ゲームエンジン ---

class GameEngine {
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

// --- React アプリ ---

const getInitialSaveData = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const defaultLevels = Object.keys(PLAYER_UNITS).reduce((acc, key) => ({ ...acc, [key]: 1 }), {});
      return {
        ...parsed,
        levels: { ...defaultLevels, ...(parsed.levels || {}) } // 新キャラ追加時のフォールバック
      };
    } catch (e) {
      console.error("Failed to parse save data", e);
    }
  }
  return {
    xp: 5000, 
    catFood: 3000, 
    unlockedUnits: ['basic', 'tank', 'battle', 'ranged', 'cow', 'titan'],
    levels: Object.keys(PLAYER_UNITS).reduce((acc, key) => ({ ...acc, [key]: 1 }), {}),
    cannonLv: 1, baseHpLv: 1, maxStageCleared: 0
  };
};

export default function NyanDefenseApp() {
  const [appState, setAppState] = useState('title');
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [saveData, setSaveData] = useState(getInitialSaveData);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
  }, [saveData]);

  const [finalResult, setFinalResult] = useState({ status: '', xpEarned: 0, catFoodEarned: 0 });
  const [gachaResult, setGachaResult] = useState([]);
  
  const canvasRef = useRef(null); const engineRef = useRef(null);
  
  const [gameState, setGameState] = useState({
    money: 0, maxMoney: 500, walletLevel: 1, walletCost: 100, cooldowns: {},
    cannonPercent: 0, canFireCannon: false, status: 'playing', sessionXp: 0, bossSpawned: false, stageName: '', baseHpPercent: 100
  });

  const stopEngineAndGoTo = (state) => {
    if (engineRef.current) { engineRef.current.stop(); engineRef.current = null; }
    setAppState(state);
  };

  const startGame = (stageIndex) => {
    if (stageIndex > saveData.maxStageCleared) return; 
    setCurrentStageIdx(stageIndex); setAppState('playing');
    setGameState(prev => ({ ...prev, status: 'playing', sessionXp: 0, bossSpawned: false, cooldowns: {}, baseHpPercent: 100 }));
    
    const tryStartEngine = () => {
      if (canvasRef.current) {
        if (engineRef.current) engineRef.current.stop();
        engineRef.current = new GameEngine(canvasRef.current, (state) => {
          setGameState(state);
          if (state.status === 'victory' || state.status === 'defeat') {
            setTimeout(() => {
              const catFoodBonus = state.status === 'victory' ? 50 : 0;
              setSaveData(prev => ({ 
                ...prev, xp: prev.xp + state.sessionXp, catFood: prev.catFood + catFoodBonus,
                maxStageCleared: state.status === 'victory' ? Math.max(prev.maxStageCleared, stageIndex + 1) : prev.maxStageCleared
              }));
              setFinalResult({ status: state.status, xpEarned: state.sessionXp, catFoodEarned: catFoodBonus });
              stopEngineAndGoTo('result');
            }, 4000); 
          }
        }, saveData, STAGES[stageIndex]);
        engineRef.current.start();
      } else { requestAnimationFrame(tryStartEngine); }
    };
    requestAnimationFrame(tryStartEngine);
  };

  const handleUpgrade = (type, isUnit = true) => {
    const currentLv = isUnit ? saveData.levels[type] : saveData[type];
    const baseCost = isUnit ? PLAYER_UNITS[type].baseUpgradeCost : (type === 'cannonLv' ? 500 : 800);
    const cost = Math.floor(baseCost * Math.pow(1.5, currentLv - 1));

    if (saveData.xp >= cost) {
      sfx.init(); sfx.se('upgrade');
      setSaveData(prev => ({
        ...prev, xp: prev.xp - cost,
        levels: isUnit ? { ...prev.levels, [type]: prev.levels[type] + 1 } : prev.levels,
        [type]: !isUnit ? prev[type] + 1 : prev[type]
      }));
    } else { sfx.init(); sfx.se('error'); }
  };

  const pullGacha = (times) => {
    const cost = times === 11 ? 1500 : 150;
    if (saveData.catFood < cost) { sfx.init(); sfx.se('error'); return; }
    sfx.init(); sfx.se('gacha');

    let pulledUnits = [];
    let newUnlocked = [...saveData.unlockedUnits];
    let newLevels = { ...saveData.levels };

    for (let i = 0; i < times; i++) {
      const r = Math.random(); let targetRarity = 'rare';
      if (r < 0.003) targetRarity = 'legend'; 
      else if (r < 0.053) targetRarity = 'uber'; 
      else if (r < 0.303) targetRarity = 'super'; 
      
      const pool = Object.values(PLAYER_UNITS).filter(u => u.rarity === targetRarity);
      const pulled = pool[Math.floor(Math.random() * pool.length)];
      const isNew = !newUnlocked.includes(pulled.id);

      if (isNew) newUnlocked.push(pulled.id);
      else newLevels[pulled.id]++;
      
      pulledUnits.push({ unit: pulled, isNew });
    }

    setSaveData(prev => ({
      ...prev, catFood: prev.catFood - cost,
      unlockedUnits: newUnlocked,
      levels: newLevels
    }));
    setGachaResult(pulledUnits);
  };

  // --- UI レンダリング ---

  if (appState === 'title') {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-b from-blue-300 to-blue-500 text-white font-sans select-none relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <h1 className="text-6xl md:text-7xl font-black mb-2 text-white drop-shadow-[0_8px_0_rgba(0,0,0,1)] tracking-widest text-center leading-tight z-10 border-black" style={{WebkitTextStroke: '3px black'}}>
          にゃんこ<br/>大防衛
        </h1>
        <p className="text-yellow-300 font-black text-xl md:text-2xl mb-10 drop-shadow-[0_4px_0_rgba(0,0,0,1)] z-10" style={{WebkitTextStroke: '1px black'}}>〜 Webブラウザの侵略 〜</p>
        
        <div className="flex flex-col gap-4 w-64 md:w-72 z-10">
          <button onClick={() => setAppState('stageSelect')} className="py-4 bg-orange-500 hover:bg-orange-400 rounded-2xl text-xl md:text-2xl font-black shadow-[0_8px_0_#9a3412] active:translate-y-2 active:shadow-none transition-all border-4 border-black text-white">
            ゲームスタート
          </button>
          <button onClick={() => stopEngineAndGoTo('upgrade')} className="py-4 bg-blue-500 hover:bg-blue-400 rounded-2xl text-xl md:text-2xl font-black shadow-[0_8px_0_#1e3a8a] active:translate-y-2 active:shadow-none transition-all border-4 border-black flex justify-center items-center gap-2 text-white">
            パワーアップ <ArrowUpCircle size={24} strokeWidth={3}/>
          </button>
          <button onClick={() => { setGachaResult([]); stopEngineAndGoTo('gacha'); }} className="py-4 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl text-xl md:text-2xl font-black shadow-[0_8px_0_#b45309] active:translate-y-2 active:shadow-none transition-all border-4 border-black flex justify-center items-center gap-2">
            レアガチャ <Gift size={24} strokeWidth={3}/>
          </button>
        </div>
        
        <div className="mt-12 flex gap-4 md:gap-6 z-10">
          <div className="bg-white text-black p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] text-center w-36 md:w-44 font-black">
            <p className="text-gray-500 text-xs mb-1">所持XP</p>
            <p className="text-xl md:text-2xl text-orange-500">{saveData.xp.toLocaleString()}</p>
          </div>
          <div className="bg-white text-black p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] text-center w-36 md:w-44 font-black">
            <p className="text-gray-500 text-xs mb-1">ネコ缶</p>
            <p className="text-xl md:text-2xl text-red-500">{saveData.catFood.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'stageSelect') {
    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-orange-100 text-black font-sans select-none p-4 md:p-6">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white p-3 md:p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
          <button onClick={() => setAppState('title')} className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-xl font-black border-4 border-black shadow-[0_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex items-center gap-2">
            <ChevronLeft strokeWidth={3}/> もどる
          </button>
          <h2 className="text-2xl md:text-4xl font-black text-orange-600 drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]">ステージ選択</h2>
          <div className="w-16 md:w-24"></div>
        </div>
        
        <div className="w-full max-w-4xl flex flex-col gap-4 pb-10">
          {STAGES.map((stage, idx) => {
            const isUnlocked = idx <= saveData.maxStageCleared;
            return (
              <button 
                key={stage.id} 
                onClick={() => startGame(idx)}
                disabled={!isUnlocked}
                className={`relative p-4 md:p-6 rounded-2xl border-4 border-black flex justify-between items-center transition-all overflow-hidden
                  ${isUnlocked ? 'bg-white hover:bg-orange-50 shadow-[4px_6px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none cursor-pointer' : 'bg-gray-400 text-gray-600 shadow-none cursor-not-allowed'}
                `}
              >
                {!isUnlocked && <div className="absolute inset-0 bg-black opacity-10"></div>}
                <div className="flex items-center gap-3 z-10">
                  <span className={`text-xl md:text-2xl font-black ${isUnlocked ? 'text-orange-500' : 'text-gray-600'}`}>{idx + 1}.</span>
                  <span className="text-xl md:text-3xl font-black">{stage.name}</span>
                </div>
                <div className="z-10">
                  {isUnlocked ? <Play size={32} className="text-orange-500" fill="currentColor"/> : <Lock size={28} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (appState === 'upgrade') {
    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-blue-100 text-black font-sans select-none p-4 md:p-6 relative">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white p-3 md:p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] sticky top-4 z-50">
          <button onClick={() => stopEngineAndGoTo('title')} className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-xl font-black border-4 border-black shadow-[0_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex items-center gap-2">
            <ChevronLeft strokeWidth={3}/> もどる
          </button>
          <h2 className="text-2xl md:text-4xl font-black text-blue-600 drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]">パワーアップ</h2>
          <div className="text-right bg-blue-50 px-3 py-1 rounded-xl border-2 border-black">
            <p className="text-gray-500 text-[10px] md:text-xs font-black">所持XP</p>
            <p className="text-lg md:text-2xl font-black text-orange-500">{saveData.xp.toLocaleString()}</p>
          </div>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
          {saveData.unlockedUnits.map(unitId => {
            const unit = PLAYER_UNITS[unitId];
            const lv = saveData.levels[unitId];
            const cost = Math.floor(unit.baseUpgradeCost * Math.pow(1.5, lv - 1));
            const canAfford = saveData.xp >= cost;
            return (
              <div key={unit.id} className="bg-white border-4 border-black rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl border-2 border-gray-300 flex items-center justify-center">
                    <UnitIcon id={unit.id} size={50} animate={false} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg md:text-xl">{unit.name}</h3>
                    <p className="text-xs md:text-sm font-bold text-gray-500">Lv. {lv} → <span className="text-blue-500">{lv + 1}</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => handleUpgrade(unit.id, true)}
                  disabled={!canAfford}
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-xl border-4 font-black transition-all ${canAfford ? 'bg-yellow-400 border-black shadow-[0_6px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none hover:bg-yellow-300' : 'bg-gray-300 border-gray-400 text-gray-500'}`}
                >
                  <span className="block text-[9px] md:text-[10px] mb-1 leading-none">必要XP</span>
                  {cost.toLocaleString()}
                </button>
              </div>
            );
          })}
          
          <div className="bg-yellow-50 border-4 border-black rounded-2xl p-4 flex items-center justify-between shadow-[4px_4px_0_rgba(0,0,0,0.2)] md:col-span-2 mt-4 md:mt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl border-2 border-black flex items-center justify-center text-3xl"><Shield className="text-orange-500" size={36}/></div>
              <div>
                <h3 className="font-black text-xl md:text-2xl text-orange-600">お城体力アップ</h3>
                <p className="text-xs md:text-sm font-bold text-gray-500">Lv. {saveData.baseHpLv} → <span className="text-orange-500">{saveData.baseHpLv + 1}</span></p>
              </div>
            </div>
            <button onClick={() => handleUpgrade('baseHpLv', false)} disabled={saveData.xp < Math.floor(800 * Math.pow(1.5, saveData.baseHpLv - 1))} className={`px-4 md:px-8 py-3 md:py-4 rounded-xl border-4 font-black text-sm md:text-xl transition-all ${saveData.xp >= Math.floor(800 * Math.pow(1.5, saveData.baseHpLv - 1)) ? 'bg-orange-500 border-black text-white shadow-[0_6px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none hover:bg-orange-400' : 'bg-gray-300 border-gray-400 text-gray-500'}`}>
              {Math.floor(800 * Math.pow(1.5, saveData.baseHpLv - 1)).toLocaleString()} XP
            </button>
          </div>
          
          <div className="bg-yellow-50 border-4 border-black rounded-2xl p-4 flex items-center justify-between shadow-[4px_4px_0_rgba(0,0,0,0.2)] md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl border-2 border-black flex items-center justify-center text-3xl"><Zap className="text-blue-500" size={36}/></div>
              <div>
                <h3 className="font-black text-xl md:text-2xl text-blue-600">にゃんこ砲 攻撃力</h3>
                <p className="text-xs md:text-sm font-bold text-gray-500">Lv. {saveData.cannonLv} → <span className="text-blue-500">{saveData.cannonLv + 1}</span></p>
              </div>
            </div>
            <button onClick={() => handleUpgrade('cannonLv', false)} disabled={saveData.xp < Math.floor(500 * Math.pow(1.5, saveData.cannonLv - 1))} className={`px-4 md:px-8 py-3 md:py-4 rounded-xl border-4 font-black text-sm md:text-xl transition-all ${saveData.xp >= Math.floor(500 * Math.pow(1.5, saveData.cannonLv - 1)) ? 'bg-blue-500 border-black text-white shadow-[0_6px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none hover:bg-blue-400' : 'bg-gray-300 border-gray-400 text-gray-500'}`}>
              {Math.floor(500 * Math.pow(1.5, saveData.cannonLv - 1)).toLocaleString()} XP
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'gacha') {
    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-yellow-300 to-orange-400 text-black font-sans select-none p-4 md:p-6 relative overflow-x-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000 20px, #000 40px)' }}></div>

        <div className="w-full max-w-5xl flex justify-between items-center mb-8 bg-white p-3 md:p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] z-50 relative">
          <button onClick={() => { setGachaResult([]); stopEngineAndGoTo('title'); }} className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-xl font-black border-4 border-black shadow-[0_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex items-center gap-2">
            <ChevronLeft strokeWidth={3}/> もどる
          </button>
          <h2 className="text-2xl md:text-4xl font-black text-red-600 drop-shadow-[0_2px_0_rgba(0,0,0,0.2)] flex items-center gap-2"><Gift/> レアガチャ</h2>
          <div className="text-right bg-red-50 px-3 py-1 rounded-xl border-2 border-black">
            <p className="text-gray-500 text-[10px] md:text-xs font-black">ネコ缶</p>
            <p className="text-lg md:text-2xl font-black text-red-500">{saveData.catFood.toLocaleString()}</p>
          </div>
        </div>

        {gachaResult.length === 0 ? (
          <div className="flex flex-col items-center mt-6 md:mt-20 z-10 bg-white p-6 md:p-10 rounded-3xl border-8 border-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] max-w-lg w-full">
            <Gift size={100} className="mb-8 text-yellow-500 animate-bounce drop-shadow-xl" />
            <div className="flex flex-col gap-4 w-full">
              <button 
                onClick={() => pullGacha(1)}
                disabled={saveData.catFood < 150}
                className={`w-full py-4 rounded-2xl text-xl md:text-2xl font-black transition-all border-4 border-black
                  ${saveData.catFood >= 150 ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-[0_6px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none' : 'bg-gray-400 text-gray-600 shadow-none cursor-not-allowed'}`}
              >
                1回引く (150缶)
              </button>
              <button 
                onClick={() => pullGacha(11)}
                disabled={saveData.catFood < 1500}
                className={`w-full py-4 rounded-2xl text-xl md:text-2xl font-black transition-all border-4 border-black
                  ${saveData.catFood >= 1500 ? 'bg-red-500 hover:bg-red-400 text-white shadow-[0_6px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none' : 'bg-gray-400 text-gray-600 shadow-none cursor-not-allowed'}`}
              >
                11連ガチャ (1500缶)
              </button>
            </div>
            <p className="mt-6 text-gray-600 font-bold bg-gray-100 px-4 py-2 rounded-xl border-2 border-gray-300 text-sm md:text-base text-center">伝説レア(0.3%) 超激レア(5%) 激レア(25%) レア(69.7%)</p>
          </div>
        ) : (
          <div className="flex flex-col items-center z-10 animate-in fade-in duration-500 w-full max-w-6xl pb-20">
            <h3 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-[0_4px_0_rgba(0,0,0,1)] text-white text-center" style={{WebkitTextStroke: '2px black'}}>
              ガチャ結果
            </h3>
            
            <div className={`grid gap-3 md:gap-4 w-full px-2 justify-center
              ${gachaResult.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'}`}
            >
              {gachaResult.map((res, idx) => {
                let badgeClass = 'bg-blue-400 text-white';
                let badgeText = 'レア';
                if (res.unit.rarity === 'super') { badgeClass = 'bg-yellow-400 text-black'; badgeText = '激レア'; }
                if (res.unit.rarity === 'uber') { badgeClass = 'bg-red-500 text-white'; badgeText = '超激レア'; }
                if (res.unit.rarity === 'legend') { badgeClass = 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-white'; badgeText = '伝説レア!!'; }

                return (
                  <div key={idx} className={`bg-white p-2 md:p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex flex-col items-center relative animate-in zoom-in`} style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                    <div className={`absolute -top-3 px-2 py-0.5 border-2 border-black rounded-full font-black text-[10px] md:text-xs shadow-[2px_2px_0_rgba(0,0,0,1)] z-20 whitespace-nowrap ${badgeClass}`}>
                      {badgeText}
                    </div>
                    {res.isNew && <div className="absolute -top-3 -right-3 bg-red-500 text-white font-black text-[9px] md:text-xs px-2 py-0.5 border-2 border-black rounded-full rotate-12 shadow-[2px_2px_0_rgba(0,0,0,1)] z-20">NEW!</div>}
                    {!res.isNew && <div className="absolute -top-3 -right-3 bg-blue-500 text-white font-black text-[9px] md:text-xs px-2 py-0.5 border-2 border-black rounded-full shadow-[2px_2px_0_rgba(0,0,0,1)] z-20">+1Lv</div>}
                    
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl border-2 border-gray-300 flex items-center justify-center mb-2 mt-3 overflow-hidden">
                       <UnitIcon id={res.unit.id} size={50} animate={true} />
                    </div>
                    {/* 長い名前も収まるように調整 */}
                    <p className="text-[10px] md:text-xs font-black text-black text-center leading-tight w-full" style={{ wordBreak: 'keep-all' }}>{res.unit.name}</p>
                  </div>
                )
              })}
            </div>

            <button onClick={() => setGachaResult([])} className="mt-10 px-8 md:px-10 py-4 bg-blue-500 text-white hover:bg-blue-400 rounded-2xl text-xl md:text-2xl font-black border-4 border-black shadow-[0_8px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all">
              確認する
            </button>
          </div>
        )}
      </div>
    );
  }

  if (appState === 'result') {
    const isWin = finalResult.status === 'victory';
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-900 text-white font-sans select-none relative z-50 p-4">
        <h2 className={`text-6xl md:text-8xl font-black mb-6 drop-shadow-[0_8px_0_rgba(0,0,0,1)] text-center ${isWin ? 'text-yellow-400' : 'text-blue-500'}`} style={{WebkitTextStroke: '3px black'}}>
          {isWin ? '完全勝利！！' : '敗北...'}
        </h2>
        
        <div className="bg-white text-black border-8 border-black p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center w-full max-w-lg mt-4 shadow-[10px_10px_0_rgba(0,0,0,0.5)] relative overflow-hidden">
          <span className="text-gray-500 text-xl md:text-2xl font-black mb-4">獲得報酬</span>
          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-8 w-full">
            <div className="flex items-baseline justify-center">
              <span className="text-5xl md:text-7xl font-black text-orange-500">+{finalResult.xpEarned.toLocaleString()}</span>
              <span className="text-xl md:text-3xl text-orange-600 ml-2 font-black">XP</span>
            </div>
            {finalResult.catFoodEarned > 0 && (
               <div className="flex items-baseline justify-center">
                 <span className="text-4xl md:text-5xl font-black text-red-500">+{finalResult.catFoodEarned}</span>
                 <span className="text-lg md:text-2xl text-red-600 ml-2 font-black">ネコ缶</span>
               </div>
            )}
          </div>
          
          <div className="w-full border-t-4 border-dashed border-gray-300 my-4 md:my-6"></div>
          
          <div className="flex flex-col items-center gap-1 md:gap-2 font-black text-lg md:text-xl">
            <p className="text-gray-500">所持XP: <span className="text-orange-500 text-2xl md:text-3xl">{saveData.xp.toLocaleString()}</span></p>
            <p className="text-gray-500">ネコ缶: <span className="text-red-500 text-2xl md:text-3xl">{saveData.catFood.toLocaleString()}</span></p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-10 md:mt-16 z-50 pointer-events-auto">
          <button onClick={() => stopEngineAndGoTo('title')} className="px-6 md:px-8 py-4 md:py-5 bg-gray-300 text-black hover:bg-gray-200 rounded-2xl text-xl md:text-2xl font-black border-4 border-black shadow-[0_8px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2">
            <ChevronLeft strokeWidth={3}/> メニュー
          </button>
          {isWin && currentStageIdx < STAGES.length - 1 && (
            <button onClick={() => startGame(currentStageIdx + 1)} className="px-6 md:px-10 py-4 md:py-5 bg-orange-500 text-white hover:bg-orange-400 rounded-2xl text-xl md:text-2xl font-black border-4 border-black shadow-[0_8px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2">
              次へ進む <ChevronRight strokeWidth={3}/>
            </button>
          )}
          {(!isWin || currentStageIdx === STAGES.length - 1) && (
            <button onClick={() => startGame(currentStageIdx)} className="px-6 md:px-10 py-4 md:py-5 bg-blue-500 text-white hover:bg-blue-400 rounded-2xl text-xl md:text-2xl font-black border-4 border-black shadow-[0_8px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2">
              <RotateCcw strokeWidth={3}/> もう一度
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- プレイ画面 ---
  const moneyPercent = Math.min(100, (gameState.money / gameState.maxMoney) * 100);

  return (
    <div className="flex flex-col items-center w-full bg-gray-900 min-h-screen font-sans select-none relative overflow-hidden">
      {gameState.bossSpawned && <div className="absolute inset-0 border-[16px] border-red-600 pointer-events-none z-50 opacity-50 animate-pulse"></div>}

      {/* ヘッダー UI */}
      <div className="w-full max-w-5xl bg-white border-b-8 border-black text-black p-2 md:p-3 flex justify-between items-end z-10 shadow-lg">
        <div className="flex flex-col w-5/12">
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg md:text-xl font-black text-orange-500 flex items-center gap-1">
              <Coins size={20} strokeWidth={3}/> {gameState.money} <span className="text-gray-500 text-[10px] md:text-xs">/ {gameState.maxMoney}</span>
            </span>
            <span className="text-[10px] md:text-xs font-black bg-yellow-400 px-2 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)]">
              財布 Lv.{gameState.walletLevel}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-3 md:h-4 rounded-full border-2 border-black overflow-hidden relative">
            <div className="h-full bg-yellow-400 transition-all duration-100" style={{ width: `${moneyPercent}%` }}></div>
            <div className="absolute inset-0 flex justify-between px-1/4 opacity-30 pointer-events-none"><div className="w-px h-full bg-black"></div><div className="w-px h-full bg-black"></div><div className="w-px h-full bg-black"></div></div>
          </div>
        </div>

        <div className="flex flex-col items-center w-2/12 -translate-y-2">
           <span className="text-black font-black text-[10px] md:text-sm tracking-widest bg-white px-3 py-1 rounded-full border-4 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] -mt-6 z-20 absolute top-2 whitespace-nowrap">{gameState.stageName}</span>
           <span className="text-blue-600 text-sm md:text-lg font-black flex items-center gap-1 mt-4"><Sword size={14} strokeWidth={3}/> {gameState.sessionXp.toLocaleString()}</span>
        </div>

        <div className="w-4/12 flex flex-col items-end">
          <div className="flex justify-between items-center mb-1 w-full">
            <span className="text-[10px] md:text-xs text-blue-600 font-black flex items-center gap-1"><Zap size={14} strokeWidth={3}/> にゃんこ砲</span>
            <span className="text-[9px] md:text-xs text-red-500 font-black">{gameState.canFireCannon ? '発射可能！' : `${Math.floor(gameState.cannonPercent)}%`}</span>
          </div>
          <div className="w-full bg-gray-200 h-3 md:h-4 rounded-full border-2 border-black overflow-hidden">
            <div className={`h-full transition-all duration-100 ${gameState.canFireCannon ? 'bg-blue-400 animate-pulse' : 'bg-blue-600'}`} style={{ width: `${gameState.cannonPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* 敵城HPバー */}
      <div className="absolute top-16 md:top-20 z-10 w-48 md:w-64 text-center">
        <span className="bg-black text-white text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded-t-lg border-x-2 border-t-2 border-black">敵のお城</span>
        <div className="w-full bg-gray-800 h-2 md:h-3 rounded-b-lg rounded-tr-lg border-2 border-black overflow-hidden shadow-[2px_4px_0_rgba(0,0,0,0.5)]">
           <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${gameState.baseHpPercent}%` }}></div>
        </div>
      </div>

      {/* ゲーム画面 (Canvas) */}
      <div className="w-full max-w-5xl bg-black relative border-x-0 md:border-x-8 border-black flex-grow flex items-center">
        <canvas ref={canvasRef} width={1000} height={450} className="w-full h-auto block" />
      </div>

      {/* コントロールパネル */}
      <div className="w-full max-w-5xl bg-gray-200 p-2 md:p-3 flex gap-2 md:gap-3 border-t-8 border-black h-40 md:h-48 z-10 shadow-[inset_0_10px_10px_rgba(0,0,0,0.1)]">
        
        <div className="flex flex-col gap-2 md:gap-3 shrink-0 w-24 md:w-28">
          <button 
            onClick={() => { if (engineRef.current) engineRef.current.upgradeWallet(); }}
            disabled={gameState.status !== 'playing' || gameState.walletCost === null || gameState.money < gameState.walletCost}
            className="flex-1 flex flex-col items-center justify-center rounded-xl border-4 border-black transition-all p-1
              bg-green-400 hover:bg-green-300 shadow-[0_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none disabled:bg-gray-400 disabled:shadow-none"
          >
            <span className="text-[10px] md:text-[11px] font-black text-black">働きネコUP</span>
            {gameState.walletCost ? <span className="text-white text-[10px] md:text-xs font-black bg-black px-2 rounded-full mt-0.5 md:mt-1 border-2 border-green-800">{gameState.walletCost}円</span> : <span className="text-red-600 font-black text-[10px] md:text-xs mt-1">MAX</span>}
          </button>

          <button 
            onClick={() => { if (engineRef.current) engineRef.current.fireCannon(); }}
            disabled={gameState.status !== 'playing' || !gameState.canFireCannon}
            className={`flex-1 flex flex-col items-center justify-center rounded-xl border-4 border-black transition-all p-1
              ${gameState.canFireCannon ? 'bg-blue-400 text-white shadow-[0_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none animate-pulse' : 'bg-gray-400 text-gray-600 shadow-none'}
            `}
          >
            <Zap size={20} className={gameState.canFireCannon ? 'text-yellow-300 fill-current' : 'text-gray-500'} strokeWidth={3}/>
            <span className="text-[10px] md:text-[11px] font-black text-black mt-0.5 md:mt-1">にゃんこ砲</span>
          </button>
        </div>

        {/* 右側：出撃パネル */}
        <div className="flex-grow overflow-x-auto pb-1 md:pb-2 custom-scrollbar bg-white rounded-2xl border-4 border-black p-1 md:p-2 shadow-[inset_4px_4px_0_rgba(0,0,0,0.05)]">
          <div className="grid grid-rows-2 grid-flow-col gap-1.5 md:gap-2 h-full min-w-max">
            {saveData.unlockedUnits.map(unitId => {
              const unit = PLAYER_UNITS[unitId];
              const currentCooldown = gameState.cooldowns[unit.id] || 0;
              const cooldownPercent = (currentCooldown / unit.cooldown) * 100;
              const isAffordable = gameState.money >= unit.cost;
              const isCoolingDown = currentCooldown > 0;
              const canSpawn = isAffordable && !isCoolingDown && gameState.status === 'playing';

              let borderColor = 'border-black';
              if(unit.rarity === 'super') borderColor = 'border-blue-500';
              if(unit.rarity === 'uber') borderColor = 'border-red-500';
              if(unit.rarity === 'legend') borderColor = 'border-purple-500';

              return (
                <button
                  key={unit.id}
                  onClick={() => { if (engineRef.current) engineRef.current.spawnPlayer(unit.id); }}
                  disabled={!canSpawn}
                  className={`relative flex flex-col items-center justify-between rounded-xl border-4 w-16 md:w-20 h-full overflow-hidden transition-all bg-gray-100
                    ${canSpawn ? `hover:bg-white shadow-[2px_3px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${borderColor}` : `bg-gray-300 border-gray-400 shadow-none`}
                  `}
                >
                  <div className={`flex justify-center items-center w-full h-full pb-2 transition-transform ${canSpawn ? 'scale-100' : 'scale-90 opacity-50'}`}>
                    <UnitIcon id={unit.id} size={45} animate={canSpawn} />
                  </div>
                  
                  <div className={`absolute bottom-0 w-full bg-black bg-opacity-80 text-[9px] md:text-[10px] font-black text-center py-0.5 z-30 ${!isAffordable && !isCoolingDown ? 'text-red-400' : 'text-white'}`}>
                    {unit.cost}円
                  </div>
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[8px] md:text-[9px] font-black px-1 rounded-bl-lg border-b-2 border-l-2 border-black z-30">Lv.{saveData.levels[unit.id]}</div>

                  {isCoolingDown && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 z-20 flex items-start justify-center">
                       <div className="w-full bg-yellow-400 opacity-30" style={{ height: `${cooldownPercent}%` }}></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #e5e7eb; border-radius: 8px; border: 2px solid #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fBBF24; border-radius: 8px; border: 2px solid #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #F59E0B; }
      `}</style>
    </div>
  );
}