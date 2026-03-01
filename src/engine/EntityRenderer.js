// --- キャラクター描画ロジック (キモかわ徹底強化版) ---
export const drawEntityShape = (ctx, id, size, state, time, isPlayer, attackFreq = 1000) => {
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
    ctx.beginPath(); ctx.moveTo(-s2 * 0.6, yPos); ctx.lineTo(-s2 * 0.8, yPos - s2 * 0.7); ctx.lineTo(-s2 * 0.1, yPos - s2 * 0.2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.1, yPos - s2 * 0.2); ctx.lineTo(s2 * 0.8, yPos - s2 * 0.7); ctx.lineTo(s2 * 0.6, yPos); ctx.fill(); ctx.stroke();
  };

  const drawCatFace = (yPos) => {
    if (state === 'attack' && attackPhase > 0.7) {
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(-s2 * 0.3, yPos - s2 * 0.1, s2 * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(s2 * 0.3, yPos - s2 * 0.1, s2 * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.arc(-s2 * 0.3, yPos - s2 * 0.1, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(s2 * 0.3, yPos - s2 * 0.1, 2, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.ellipse(0, yPos + s2 * 0.2, s2 * 0.4, s2 * 0.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'white'; // 歯
      ctx.fillRect(-s2 * 0.2, yPos - s2 * 0.3, s2 * 0.4, s2 * 0.2);
      ctx.fillStyle = 'red';
      ctx.beginPath(); ctx.arc(0, yPos + s2 * 0.5, s2 * 0.2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = 'black';
      ctx.fillRect(-s2 * 0.3, yPos, s2 * 0.15, s2 * 0.15);
      ctx.fillRect(s2 * 0.15, yPos, s2 * 0.15, s2 * 0.15);
      ctx.beginPath(); ctx.arc(-s2 * 0.1, yPos + s2 * 0.25, s2 * 0.1, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(s2 * 0.1, yPos + s2 * 0.25, s2 * 0.1, 0, Math.PI); ctx.stroke();
    }
    ctx.fillStyle = 'white';
  };

  const drawLegs = (length = 10, count = 2) => {
    if (count === 2) {
      ctx.beginPath(); ctx.moveTo(-s2 * 0.4, -length); ctx.lineTo(-s2 * 0.4 + legMove, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s2 * 0.4, -length); ctx.lineTo(s2 * 0.4 - legMove, 0); ctx.stroke();
    } else if (count === 4) {
      ctx.beginPath(); ctx.moveTo(-s2 * 0.8, -length); ctx.lineTo(-s2 * 0.8 + legMove, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s2 * 0.3, -length); ctx.lineTo(-s2 * 0.3 - legMove, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s2 * 0.3, -length); ctx.lineTo(s2 * 0.3 + legMove, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s2 * 0.8, -length); ctx.lineTo(s2 * 0.8 - legMove, 0); ctx.stroke();
    }
  };

  // --- 味方 ---
  if (id === 'basic') {
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.3, s2, s2 * 0.9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.1); drawCatFace(-s2 * 1.4);
  }
  else if (id === 'tank') {
    legMove *= 0.5; drawLegs(s2 * 0.5);
    ctx.beginPath(); ctx.rect(-s2, -size * 1.5, size, size * 1.5 - s2 * 0.5); ctx.fill(); ctx.stroke();
    drawCatEars(-size * 1.5); drawCatFace(-size * 1.0);
  }
  else if (id === 'battle') {
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.3, s2, s2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.2); drawCatFace(-s2 * 1.4);
    ctx.beginPath(); ctx.moveTo(0, -s2 * 0.5); ctx.lineTo(size, -s2 * 1.5); ctx.lineWidth = 4; ctx.stroke(); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(size * 0.8, -s2 * 1.2); ctx.lineTo(size * 1.5, -s2 * 2); ctx.lineTo(size, -s2 * 2.5); ctx.fill(); ctx.stroke();
  }
  else if (id === 'ranged') {
    legMove = state === 'walk' ? Math.sin(time / 60) * (size * 0.5) : 0;
    ctx.beginPath(); ctx.moveTo(-s2 * 0.3, -size * 1.2); ctx.lineTo(-s2 * 0.3 + legMove * 0.5, -size * 0.6); ctx.lineTo(-s2 * 0.3 + legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.3, -size * 1.2); ctx.lineTo(s2 * 0.3 - legMove * 0.5, -size * 0.6); ctx.lineTo(s2 * 0.3 - legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(-s2 * 0.3 + legMove * 0.5, -size * 0.6, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.3 - legMove * 0.5, -size * 0.6, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -size * 1.2 - s2 * 0.6, s2 * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-size * 1.2 - s2 * 1.1); drawCatFace(-size * 1.2 - s2 * 0.7);
  }
  else if (id === 'cow') {
    legMove = state === 'walk' ? Math.sin(time / 30) * (size * 0.4) : 0;
    drawLegs(s2 * 0.6, 4);
    ctx.beginPath(); ctx.ellipse(0, -s2, size * 0.8, s2 * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(0, -s2, s2 * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(-s2 * 0.5, -s2 * 0.8, s2 * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.ellipse(size * 0.8, -s2 * 1.2, s2 * 0.6, s2 * 0.5, -Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.translate(size * 0.8, 0); drawCatEars(-s2 * 1.6); drawCatFace(-s2 * 1.3); ctx.restore();
  }
  else if (id === 'titan') {
    drawLegs(s2 * 0.5);
    ctx.beginPath(); ctx.arc(0, -size * 0.9, size * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size * 0.7, size * 0.4, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -size * 0.7); ctx.lineTo(0, -size * 0.4); ctx.stroke();
    drawCatEars(-size * 1.4); drawCatFace(-size * 1.2);
    let armY = (state === 'attack' && attackPhase > 0.5) ? -size * 1.2 : -size * 0.5;
    ctx.beginPath(); ctx.ellipse(size * 0.5, armY, s2 * 0.6, size * 0.5, Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  else if (id === 'ninja') {
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(0, -s2 * 1.5, s2 + 1, Math.PI, 0); ctx.fill();
    ctx.fillRect(-s2 - 1, -s2 * 1.5, size + 2, s2 * 0.8);
    ctx.fillStyle = '#ffe0bd'; ctx.fillRect(-s2 + 4, -s2 * 1.3, size - 8, s2 * 0.5);
    drawCatFace(-s2 * 1.4);
    ctx.beginPath(); ctx.moveTo(-s2, -s2 * 0.5); ctx.lineTo(-size, -size); ctx.lineWidth = 4; ctx.stroke(); ctx.lineWidth = 2;
  }
  else if (id === 'zombie') {
    ctx.fillStyle = '#a5d6a7';
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.2); drawCatFace(-s2 * 1.4);
    ctx.fillStyle = 'white'; ctx.fillRect(-s2 * 0.6, -s2 * 0.6, s2 * 1.2, s2 * 0.3); ctx.strokeRect(-s2 * 0.6, -s2 * 0.6, s2 * 1.2, s2 * 0.3);
  }
  else if (id === 'pirate') {
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(-size * 0.8, -s2 * 1.8); ctx.lineTo(size * 0.8, -s2 * 1.8); ctx.lineTo(0, -size * 1.3); ctx.fill(); ctx.stroke();
    ctx.fillRect(-s2 * 0.3, -s2 * 1.5, s2 * 0.3, s2 * 0.3);
    drawCatFace(-s2 * 1.4);
    ctx.beginPath(); ctx.moveTo(s2, -s2 * 0.5); ctx.lineTo(size, -s2 * 1.5); ctx.lineWidth = 4; ctx.stroke(); ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'thief') {
    legMove = state === 'walk' ? Math.sin(time / 40) * (size * 0.25) : 0;
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#4caf50'; ctx.beginPath(); ctx.arc(-s2 * 0.8, -s2 * 1.3, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(-s2 * 0.8, -s2 * 1.3, s2 * 0.3, 0, Math.PI); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = 'black'; ctx.fillStyle = 'white';
    drawCatFace(-s2 * 1.4);
  }
  else if (id === 'beauty') {
    legMove = state === 'walk' ? Math.sin(time / 60) * (size * 0.4) : 0;
    ctx.beginPath(); ctx.moveTo(-s2 * 0.3, -size * 1.2); ctx.lineTo(-s2 * 0.3 + legMove * 0.5, -size * 0.6); ctx.lineTo(-s2 * 0.3 + legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.3, -size * 1.2); ctx.lineTo(s2 * 0.3 - legMove * 0.5, -size * 0.6); ctx.lineTo(s2 * 0.3 - legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size * 1.5, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(0, -size * 1.5, s2 * 1.05, Math.PI, 0); ctx.fill();
    ctx.fillRect(-s2 * 1.05, -size * 1.5, size * 1.05, s2 * 0.5);
    ctx.fillStyle = '#ffe0bd'; ctx.fillRect(-s2 * 0.8, -size * 1.5, size * 0.8, s2 * 0.4);
    drawCatFace(-size * 1.5);
    let armRot = (state === 'attack') ? -Math.PI / 2 : 0;
    ctx.save(); ctx.translate(0, -size * 1.2); ctx.rotate(armRot); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, size * 0.8); ctx.stroke(); ctx.restore();
  }
  else if (id === 'jura') {
    drawLegs(s2 * 0.6);
    ctx.fillStyle = '#4caf50';
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.5, size * 0.8, size * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size * 0.5, -s2 * 1.5); ctx.lineTo(size * 1.2, -s2 * 1.5); ctx.lineTo(size * 0.5, -s2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(-s2 * 0.5, -size * 1.2, s2 * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 1.2);
    ctx.fillStyle = 'white';
    if (state === 'attack') {
      ctx.beginPath(); ctx.moveTo(-size * 0.8, -s2 * 1.5); ctx.lineTo(-size * 1.2, -size); ctx.lineTo(-size * 0.8, -s2); ctx.fill(); ctx.stroke();
    }
  }
  else if (id === 'hacker') {
    ctx.beginPath(); ctx.arc(0, -s2 * 0.5, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 1.4); drawCatFace(-s2 * 0.6);
    ctx.fillStyle = '#ccc'; ctx.beginPath(); ctx.rect(s2 * 0.5, -s2 * 1.5, size * 0.6, size * 0.6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#eee'; ctx.fillRect(s2 * 0.6, -s2 * 1.4, size * 0.4, size * 0.3); ctx.fillStyle = 'white';
  }
  else if (id === 'otaku') {
    drawLegs(s2 * 0.5);
    ctx.beginPath(); ctx.arc(0, -size * 0.8, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 0.9);
    ctx.fillStyle = 'blue'; ctx.fillRect(-s2, -size * 0.5, size, s2 * 0.5);
    ctx.fillStyle = '#ccc'; ctx.beginPath(); ctx.rect(-s2 * 0.5, -size * 0.4, size * 0.5, size * 0.4); ctx.fill(); ctx.stroke();
    let armRot = (state === 'attack') ? Math.sin(time / 20) * Math.PI / 2 : 0;
    ctx.save(); ctx.translate(0, -size * 0.6); ctx.rotate(armRot);
    ctx.strokeStyle = 'cyan'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-size * 0.8, -size * 0.8); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.restore();
  }
  else if (id === 'skate') {
    legMove = state === 'walk' ? Math.sin(time / 100) * (size * 0.5) : 0;
    ctx.beginPath(); ctx.moveTo(-s2 * 0.4, -s2); ctx.lineTo(-s2 * 0.4 + legMove, -5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.4, -s2); ctx.lineTo(s2 * 0.4 - legMove, -5); ctx.stroke();
    ctx.fillStyle = 'gray'; ctx.beginPath(); ctx.ellipse(-s2 * 0.4 + legMove, 0, 8, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(s2 * 0.4 - legMove, 0, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(0, -size, s2 * 1.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 1.1);
    ctx.fillStyle = '#e91e63'; ctx.beginPath(); ctx.arc(0, -size * 1.6, s2 * 0.8, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'white';
  }
  else if (id === 'apple') {
    drawLegs(s2 * 0.8);
    ctx.fillStyle = '#ef5350'; ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#66bb6a'; ctx.beginPath(); ctx.ellipse(0, -size * 1.2, s2 * 0.3, s2 * 0.6, Math.PI / 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-s2 * 1.4);
  }
  else if (id === 'swimmer') {
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#29b6f6'; ctx.beginPath(); ctx.ellipse(0, -s2 * 0.8, size * 0.8, s2 * 0.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(0, -s2 * 0.8, size * 0.5, s2 * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    drawCatFace(-s2 * 1.4);
    ctx.fillStyle = '#ffa726'; ctx.fillRect(-s2 * 0.4, -s2 * 1.6, s2 * 0.8, s2 * 0.3); ctx.fillStyle = '#e0f7fa'; ctx.fillRect(-s2 * 0.3, -s2 * 1.5, s2 * 0.2, s2 * 0.15); ctx.fillRect(s2 * 0.1, -s2 * 1.5, s2 * 0.2, s2 * 0.15); ctx.fillStyle = 'white';
  }
  else if (id === 'valkyrie') {
    drawLegs(size * 0.8);
    ctx.beginPath(); ctx.ellipse(0, -size * 1.2, s2 * 0.6, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size * 2.2, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 2.3); drawCatEars(-size * 2.6);
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(-s2, -size * 1.5, size * 0.8, s2 * 0.5, -Math.PI / 4 + attackPhase, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2, -size * 0.5); ctx.lineTo(size * 1.5, -size * 3); ctx.lineWidth = 5; ctx.stroke(); ctx.lineWidth = 2;
  }
  else if (id === 'bahamut') {
    ctx.fillStyle = '#222'; ctx.strokeStyle = '#555';
    drawLegs(size * 0.8);
    ctx.beginPath(); ctx.ellipse(0, -size * 1.2, size * 0.6, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(size * 0.5, -size * 2, size * 0.4, size * 0.3, Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff00ff'; ctx.beginPath(); ctx.arc(size * 0.6, -size * 2.1, s2 * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111'; let wingY = Math.sin(time / 150) * (size * 0.2);
    ctx.beginPath(); ctx.ellipse(-size * 0.5, -size * 1.5 + wingY, size * 0.8, size * 0.4, -Math.PI / 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.strokeStyle = 'black';
  }
  else if (id === 'zeus') {
    ctx.fillStyle = '#ddd'; ctx.strokeStyle = '#aaa';
    ctx.beginPath(); ctx.arc(0, -s2, size * 0.6, 0, Math.PI * 2); ctx.arc(-size * 0.5, -s2 * 0.5, size * 0.5, 0, Math.PI * 2); ctx.arc(size * 0.5, -s2 * 0.5, size * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.strokeStyle = 'black';
    ctx.beginPath(); ctx.ellipse(0, -size * 1.5, size * 0.5, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size * 2.5, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.arc(0, -size * 2.2, size * 0.5, 0, Math.PI); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 2.6);
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(size * 0.5, -size); ctx.lineTo(size * 0.8, -size * 1.5); ctx.lineTo(size * 0.5, -size * 1.8); ctx.lineTo(size, -size * 2.8); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
  }
  else if (id === 'machine') {
    ctx.fillStyle = '#999'; ctx.beginPath(); ctx.rect(-size * 0.4, -size * 1.2, size * 0.8, size); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#333'; ctx.fillRect(-size * 0.3, -size, size * 0.6, size * 0.3); ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(0, -size * 0.85, s2 * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#444'; ctx.beginPath(); ctx.ellipse(0, -s2 * 0.5, size * 0.6, s2 * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    let armRot = (state === 'attack') ? -Math.PI / 2 : 0;
    ctx.save(); ctx.translate(-size * 0.4, -size * 0.7); ctx.rotate(armRot);
    ctx.fillStyle = '#777'; ctx.beginPath(); ctx.rect(-s2 * 0.5, -s2 * 0.5, size, s2); ctx.fill(); ctx.stroke();
    ctx.restore(); ctx.fillStyle = 'white';
  }
  else if (id === 'megalo') {
    drawLegs(size * 0.8);
    ctx.beginPath(); ctx.ellipse(0, -size * 1.2, s2 * 0.4, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size * 2.2, s2 * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 2.3);
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(s2, -size * 1.2, size, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(s2, -size * 2.2); ctx.lineTo(s2, -size * 0.2); ctx.stroke();
    if (state === 'attack') { ctx.strokeStyle = 'cyan'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -size * 1.2); ctx.lineTo(size * 3, -size * 1.2); ctx.stroke(); }
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
  }
  else if (id === 'gaou') {
    drawLegs(s2, 4);
    ctx.beginPath(); ctx.ellipse(0, -size * 1.2, size, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffb74d';
    for (let i = 0; i < 8; i++) {
      let a = (i / 8) * Math.PI * 2 + time / 500;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * size * 0.8 - size * 0.5, Math.sin(a) * size * 0.8 - size * 1.5);
      ctx.lineTo(Math.cos(a + 0.2) * size * 1.2 - size * 0.5, Math.sin(a + 0.2) * size * 1.2 - size * 1.5);
      ctx.lineTo(Math.cos(a - 0.2) * size * 1.2 - size * 0.5, Math.sin(a - 0.2) * size * 1.2 - size * 1.5); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(-size * 0.5, -size * 1.5, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 1.6);
    if (state === 'attack') { ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(-size, -size * 1.5, size * 0.5, 0, Math.PI * 2); ctx.fill(); }
  }
  else if (id === 'amaterasu') {
    ctx.translate(0, -10 - Math.sin(time / 100) * 5);
    ctx.beginPath(); ctx.ellipse(0, -size * 1.2, s2, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size * 2.2, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 2.3);
    ctx.strokeStyle = 'gold'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(-size, -size * 1.5, size * 0.6, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,0,0.3)'; ctx.fill();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
    if (state === 'attack') { ctx.strokeStyle = 'orange'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-size, -size * 1.5); ctx.lineTo(-size * 3, -size * 1.5); ctx.stroke(); ctx.strokeStyle = 'black'; ctx.lineWidth = 2; }
  }
  else if (id === 'ushiwaka') {
    ctx.translate(0, -15 - Math.sin(time / 100) * 5);
    ctx.strokeStyle = '#ff99cc'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-size, -size); ctx.quadraticCurveTo(0, -size * 1.5, size, -size); ctx.stroke();
    ctx.lineWidth = 2; ctx.strokeStyle = 'black'; drawLegs(s2 * 0.4);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.moveTo(-s2 * 0.4, -s2 * 2.2); ctx.lineTo(-s2 * 0.2, -size * 1.5); ctx.lineTo(s2 * 0.2, -size * 1.5); ctx.lineTo(s2 * 0.4, -s2 * 2.2); ctx.fill();
    ctx.fillStyle = 'white'; drawCatFace(-s2 * 1.4);
    if (state === 'attack') { ctx.strokeStyle = 'yellow'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -s2 * 1.4); ctx.lineTo(-size * 3, -s2 * 1.4); ctx.stroke(); ctx.strokeStyle = 'black'; ctx.lineWidth = 2; }
  }
  else if (id === 'creator') {
    ctx.translate(0, -30 - Math.sin(time / 150) * 10);
    let pulse = Math.sin(time / 50) * 5;
    ctx.fillStyle = 'cyan'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, s2 + pulse, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1.0; ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.5, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-s2 * 1.6); drawCatEars(-s2 * 2.2);
    ctx.strokeStyle = 'gold'; ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      let angle = (i / 8) * Math.PI * 2 + time / 1000;
      ctx.beginPath(); ctx.moveTo(Math.cos(angle) * size * 0.6, -s2 * 1.5 + Math.sin(angle) * size * 0.6);
      ctx.lineTo(Math.cos(angle) * size * 1.2, -s2 * 1.5 + Math.sin(angle) * size * 1.2); ctx.stroke();
    }
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    if (state === 'attack') { ctx.fillStyle = 'magenta'; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.arc(-size * 1.5, 0, size * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1.0; ctx.fillStyle = 'white'; }
  }
  else if (id === 'momoko') {
    ctx.translate(0, -20 - Math.sin(time / 80) * 8);
    ctx.fillStyle = '#f8bbd0'; ctx.beginPath(); ctx.arc(0, -s2, size * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -size * 1.3); ctx.lineTo(0, -s2); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(0, -size * 1.6, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 1.7);
    let armRot = (state === 'attack') ? -Math.PI / 2 : Math.sin(time / 100) * 0.2;
    ctx.save(); ctx.translate(-s2, -size * 1.5); ctx.rotate(armRot);
    ctx.fillStyle = 'red'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, s2, Math.PI, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore(); ctx.fillStyle = 'white';
  }

  // === 進化形態 ===
  // -- basic 進化 --
  else if (id === 'basic_2') { // モヒカンネコ
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.3, s2, s2 * 0.9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.1); drawCatFace(-s2 * 1.4);
    // モヒカン
    ctx.fillStyle = '#e91e63';
    ctx.beginPath(); ctx.moveTo(-s2 * 0.3, -s2 * 2.1); ctx.lineTo(0, -s2 * 3); ctx.lineTo(s2 * 0.3, -s2 * 2.1); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
  }
  else if (id === 'basic_3') { // ネコキング
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.3, s2 * 1.1, s2 * 1.0, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.2); drawCatFace(-s2 * 1.4);
    // 王冠
    ctx.fillStyle = '#ffd700';
    ctx.beginPath(); ctx.moveTo(-s2 * 0.7, -s2 * 2.2); ctx.lineTo(-s2 * 0.8, -s2 * 2.8); ctx.lineTo(-s2 * 0.3, -s2 * 2.5);
    ctx.lineTo(0, -s2 * 3); ctx.lineTo(s2 * 0.3, -s2 * 2.5); ctx.lineTo(s2 * 0.8, -s2 * 2.8); ctx.lineTo(s2 * 0.7, -s2 * 2.2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(0, -s2 * 2.6, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    // マント
    ctx.fillStyle = '#b71c1c'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(-s2, -s2 * 1.8); ctx.quadraticCurveTo(-s2 * 1.5, -s2 * 0.5, -s2 * 0.5, 0);
    ctx.lineTo(s2 * 0.5, 0); ctx.quadraticCurveTo(s2 * 1.5, -s2 * 0.5, s2, -s2 * 1.8); ctx.fill();
    ctx.globalAlpha = 1.0; ctx.fillStyle = 'white';
  }

  // -- tank 進化 --
  else if (id === 'tank_2') { // ゴムネコ
    legMove *= 0.5; drawLegs(s2 * 0.5);
    ctx.fillStyle = '#90a4ae';
    ctx.beginPath(); ctx.rect(-s2, -size * 1.5, size, size * 1.5 - s2 * 0.5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; drawCatEars(-size * 1.5); drawCatFace(-size * 1.0);
    // ゴム模様
    ctx.strokeStyle = '#546e7a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-s2 * 0.5, -size * 1.2); ctx.lineTo(s2 * 0.5, -size * 0.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s2 * 0.5, -size * 0.8); ctx.lineTo(s2 * 0.5, -size * 0.4); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
  }
  else if (id === 'tank_3') { // ネコカベ
    legMove *= 0.5; drawLegs(s2 * 0.5);
    ctx.fillStyle = '#78909c';
    ctx.beginPath(); ctx.rect(-s2 * 1.1, -size * 1.6, size * 1.1, size * 1.6 - s2 * 0.5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; drawCatEars(-size * 1.6); drawCatFace(-size * 1.1);
    // レンガ模様
    ctx.strokeStyle = '#455a64'; ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-s2, -size * (0.4 + i * 0.35)); ctx.lineTo(s2, -size * (0.4 + i * 0.35)); ctx.stroke(); }
    ctx.strokeStyle = 'black';
  }

  // -- battle 進化 --
  else if (id === 'battle_2') { // アタッカーネコ
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.3, s2, s2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.2); drawCatFace(-s2 * 1.4);
    // 大剣
    ctx.strokeStyle = '#9e9e9e'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, -s2 * 0.5); ctx.lineTo(size * 1.2, -s2 * 2); ctx.stroke();
    ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(size * 1.2, -s2 * 2, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'battle_3') { // ドラゴンスレイヤー
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.3, s2 * 1.1, s2 * 1.1, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.3); drawCatFace(-s2 * 1.4);
    // 鎧
    ctx.fillStyle = '#b71c1c'; ctx.beginPath(); ctx.rect(-s2 * 0.8, -s2 * 1.8, s2 * 1.6, s2 * 0.6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
    // 巨大剣
    ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, -s2); ctx.lineTo(size * 1.5, -s2 * 2.5); ctx.stroke();
    ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.moveTo(size * 1.3, -s2 * 2.3); ctx.lineTo(size * 1.8, -s2 * 3); ctx.lineTo(size * 1.5, -s2 * 3.2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }

  // -- ranged 進化 --
  else if (id === 'ranged_2') { // ムキアシネコ
    legMove = state === 'walk' ? Math.sin(time / 60) * (size * 0.5) : 0;
    // 太い脚
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-s2 * 0.3, -size * 1.2); ctx.lineTo(-s2 * 0.3 + legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.3, -size * 1.2); ctx.lineTo(s2 * 0.3 - legMove, 0); ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -size * 1.2 - s2 * 0.6, s2 * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-size * 1.2 - s2 * 1.2); drawCatFace(-size * 1.2 - s2 * 0.7);
    // 筋肉マーク
    ctx.fillStyle = '#ffb74d'; ctx.beginPath(); ctx.arc(-s2 * 0.3 + legMove * 0.5, -size * 0.6, s2 * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
  }
  else if (id === 'ranged_3') { // ネコレッグ
    legMove = state === 'walk' ? Math.sin(time / 60) * (size * 0.5) : 0;
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#e65100';
    ctx.beginPath(); ctx.moveTo(-s2 * 0.4, -size * 1.2); ctx.lineTo(-s2 * 0.4 + legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.4, -size * 1.2); ctx.lineTo(s2 * 0.4 - legMove, 0); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -size * 1.2 - s2 * 0.6, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-size * 1.2 - s2 * 1.3); drawCatFace(-size * 1.2 - s2 * 0.7);
    // 炎エフェクト
    if (state === 'attack') {
      ctx.fillStyle = 'orange'; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.arc(-s2 * 0.4 + legMove, 5, s2 * 0.5, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1.0; ctx.fillStyle = 'white';
    }
  }

  // -- cow 進化 --
  else if (id === 'cow_2') { // 闘牛ネコ
    legMove = state === 'walk' ? Math.sin(time / 25) * (size * 0.45) : 0;
    drawLegs(s2 * 0.6, 4);
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath(); ctx.ellipse(0, -s2, size * 0.9, s2 * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.ellipse(size * 0.8, -s2 * 1.2, s2 * 0.6, s2 * 0.5, -Math.PI / 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.translate(size * 0.8, 0); drawCatEars(-s2 * 1.6); drawCatFace(-s2 * 1.3); ctx.restore();
    // 角
    ctx.strokeStyle = '#795548'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(size * 0.5, -s2 * 1.8); ctx.lineTo(size * 0.3, -s2 * 2.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size * 1.1, -s2 * 1.8); ctx.lineTo(size * 1.3, -s2 * 2.5); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
  }
  else if (id === 'cow_3') { // 暴走ネコ
    legMove = state === 'walk' ? Math.sin(time / 20) * (size * 0.5) : 0;
    drawLegs(s2 * 0.6, 4);
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath(); ctx.ellipse(0, -s2, size, s2 * 0.9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.ellipse(size * 0.9, -s2 * 1.2, s2 * 0.7, s2 * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.translate(size * 0.9, 0); drawCatEars(-s2 * 1.7); drawCatFace(-s2 * 1.3); ctx.restore();
    // 炎オーラ
    ctx.fillStyle = 'rgba(255,100,0,0.4)';
    for (let i = 0; i < 5; i++) {
      let fx = Math.sin(time / 80 + i) * size * 0.5;
      let fy = -s2 - Math.abs(Math.cos(time / 60 + i * 2)) * s2;
      ctx.beginPath(); ctx.arc(fx, fy, s2 * 0.3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'white';
  }

  // -- titan 進化 --
  else if (id === 'titan_2') { // 巨神ネコ改
    drawLegs(s2 * 0.5);
    ctx.fillStyle = '#607d8b';
    ctx.beginPath(); ctx.arc(0, -size * 0.9, size * 0.65, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
    drawCatEars(-size * 1.5); drawCatFace(-size * 1.2);
    // 鎧パーツ
    ctx.fillStyle = '#455a64'; ctx.beginPath(); ctx.rect(-s2 * 0.8, -size * 0.7, s2 * 1.6, s2 * 0.4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
    let armY = (state === 'attack' && attackPhase > 0.5) ? -size * 1.2 : -size * 0.5;
    ctx.beginPath(); ctx.ellipse(size * 0.5, armY, s2 * 0.7, size * 0.5, Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  else if (id === 'titan_3') { // 覚醒巨神ネコ
    drawLegs(s2 * 0.5);
    ctx.fillStyle = '#263238';
    ctx.beginPath(); ctx.arc(0, -size * 0.9, size * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; drawCatEars(-size * 1.5); drawCatFace(-size * 1.2);
    // 闘気オーラ
    ctx.strokeStyle = '#ff5722'; ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      let a = (i / 6) * Math.PI * 2 + time / 300;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * size * 0.6, -size * 0.9 + Math.sin(a) * size * 0.6);
      ctx.lineTo(Math.cos(a) * size * 1.0, -size * 0.9 + Math.sin(a) * size * 1.0); ctx.stroke();
    }
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    let armY = (state === 'attack' && attackPhase > 0.5) ? -size * 1.3 : -size * 0.5;
    ctx.beginPath(); ctx.ellipse(size * 0.6, armY, s2 * 0.8, size * 0.6, Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  // -- ninja 進化 --
  else if (id === 'ninja_2') { // 影忍者ネコ
    drawLegs(s2 * 0.8);
    ctx.fillStyle = '#212121';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff1744'; ctx.fillRect(-s2 + 4, -s2 * 1.3, size - 8, s2 * 0.5);
    drawCatFace(-s2 * 1.4);
    // 二刀流
    ctx.strokeStyle = '#9e9e9e'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-s2, -s2 * 0.5); ctx.lineTo(-size * 1.2, -size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2, -s2 * 0.5); ctx.lineTo(size * 1.2, -size); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'ninja_3') { // 暗殺者ネコ
    drawLegs(s2 * 0.8);
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d50000'; ctx.fillRect(-s2 + 4, -s2 * 1.3, size - 8, s2 * 0.5);
    drawCatFace(-s2 * 1.4);
    // 影分身エフェクト
    ctx.globalAlpha = 0.3; ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(-s2, -s2 * 1.3, s2 * 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2, -s2 * 1.3, s2 * 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1.0; ctx.fillStyle = 'white';
  }

  // -- zombie 進化 --
  else if (id === 'zombie_2') { // グールネコ
    ctx.fillStyle = '#66bb6a';
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.3); drawCatFace(-s2 * 1.4);
    // 包帯
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-s2, -s2 * 1.5); ctx.lineTo(s2, -s2 * 1.0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s2, -s2 * 0.8); ctx.lineTo(s2, -s2 * 0.3); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'zombie_3') { // リッチネコ
    ctx.fillStyle = '#1b5e20';
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.4); drawCatFace(-s2 * 1.4);
    // 死霊オーラ
    ctx.fillStyle = 'rgba(100,0,255,0.3)';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.8 + Math.sin(time / 100) * 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    // 杖
    ctx.strokeStyle = '#7b1fa2'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(s2, -s2 * 0.5); ctx.lineTo(size, -size * 1.5); ctx.stroke();
    ctx.fillStyle = '#e040fb'; ctx.beginPath(); ctx.arc(size, -size * 1.5, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }

  // -- pirate 進化 --
  else if (id === 'pirate_2') { // ネコ船長
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 船長帽
    ctx.fillStyle = '#1a237e';
    ctx.beginPath(); ctx.moveTo(-size, -s2 * 1.8); ctx.lineTo(size, -s2 * 1.8); ctx.lineTo(s2 * 0.3, -size * 1.5); ctx.lineTo(-s2 * 0.3, -size * 1.5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(0, -s2 * 1.8, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white'; drawCatFace(-s2 * 1.4);
    // 大砲
    ctx.fillStyle = '#424242'; ctx.beginPath(); ctx.rect(s2, -s2 * 1.0, size * 0.6, s2 * 0.4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
  }
  else if (id === 'pirate_3') { // 海賊王ネコ
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#0d47a1';
    ctx.beginPath(); ctx.moveTo(-size * 1.1, -s2 * 1.8); ctx.lineTo(size * 1.1, -s2 * 1.8); ctx.lineTo(s2 * 0.3, -size * 1.6); ctx.lineTo(-s2 * 0.3, -size * 1.6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(0, -s2 * 1.8, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white'; drawCatFace(-s2 * 1.4);
    // 宝箱
    ctx.fillStyle = '#f9a825'; ctx.beginPath(); ctx.rect(-size * 0.8, -s2 * 0.3, s2, s2 * 0.5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
  }

  // -- thief 進化 --
  else if (id === 'thief_2') { // ネコ怪盗
    legMove = state === 'walk' ? Math.sin(time / 35) * (size * 0.3) : 0;
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // シルクハット
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.rect(-s2 * 0.6, -s2 * 2.5, s2 * 1.2, s2 * 0.8); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.7, s2 * 0.9, s2 * 0.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; drawCatFace(-s2 * 1.4);
    // マスク
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(0, -s2 * 1.3, s2 * 0.6, s2 * 0.3, 0, Math.PI * 0.8, Math.PI * 2.2); ctx.fill();
    ctx.fillStyle = 'white';
  }
  else if (id === 'thief_3') { // ファントムネコ
    legMove = state === 'walk' ? Math.sin(time / 30) * (size * 0.35) : 0;
    drawLegs(s2 * 0.8);
    ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-s2 * 1.4);
    // ファントムマント
    ctx.fillStyle = '#311b92'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(-s2, -s2 * 1.8); ctx.quadraticCurveTo(-s2 * 2, 0, -s2 * 0.5, s2 * 0.5);
    ctx.lineTo(s2 * 0.5, s2 * 0.5); ctx.quadraticCurveTo(s2 * 2, 0, s2, -s2 * 1.8); ctx.fill();
    ctx.globalAlpha = 1.0; ctx.fillStyle = 'white';
  }

  // -- beauty 進化 --
  else if (id === 'beauty_2') { // ネコモデル
    legMove = state === 'walk' ? Math.sin(time / 60) * (size * 0.4) : 0;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-s2 * 0.3, -size * 1.2); ctx.lineTo(-s2 * 0.3 + legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.3, -size * 1.2); ctx.lineTo(s2 * 0.3 - legMove, 0); ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -size * 1.5, s2 * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e91e63'; ctx.beginPath(); ctx.arc(0, -size * 1.5, s2 * 1.15, Math.PI, 0); ctx.fill();
    ctx.fillStyle = 'white'; drawCatFace(-size * 1.5);
    // サングラス
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.rect(-s2 * 0.7, -size * 1.55, s2 * 0.5, s2 * 0.25); ctx.fill();
    ctx.beginPath(); ctx.rect(s2 * 0.2, -size * 1.55, s2 * 0.5, s2 * 0.25); ctx.fill();
    ctx.fillStyle = 'white';
  }
  else if (id === 'beauty_3') { // ネコクイーン
    legMove = state === 'walk' ? Math.sin(time / 60) * (size * 0.4) : 0;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-s2 * 0.3, -size * 1.2); ctx.lineTo(-s2 * 0.3 + legMove, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.3, -size * 1.2); ctx.lineTo(s2 * 0.3 - legMove, 0); ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -size * 1.5, s2 * 1.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#880e4f'; ctx.beginPath(); ctx.arc(0, -size * 1.5, s2 * 1.25, Math.PI, 0); ctx.fill();
    ctx.fillStyle = 'white'; drawCatFace(-size * 1.5);
    // 王冠
    ctx.fillStyle = '#ffd700';
    ctx.beginPath(); ctx.moveTo(-s2 * 0.5, -size * 2); ctx.lineTo(-s2 * 0.6, -size * 2.3); ctx.lineTo(0, -size * 2.1);
    ctx.lineTo(s2 * 0.6, -size * 2.3); ctx.lineTo(s2 * 0.5, -size * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
  }

  // -- jura 進化 --
  else if (id === 'jura_2') { // ネコティラノ
    drawLegs(s2 * 0.6);
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.5, size * 0.9, size * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size * 0.6, -s2 * 1.5); ctx.lineTo(size * 1.5, -s2 * 1.5); ctx.lineTo(size * 0.6, -s2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(-s2 * 0.5, -size * 1.2, s2 * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 1.2);
    // 歯の強調
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-size * 0.7 + i * s2 * 0.3, -s2 * 1.5); ctx.lineTo(-size * 0.6 + i * s2 * 0.3, -s2 * 1.1); ctx.lineTo(-size * 0.5 + i * s2 * 0.3, -s2 * 1.5); ctx.fill(); }
    ctx.fillStyle = 'white';
  }
  else if (id === 'jura_3') { // ネコレックス
    drawLegs(s2 * 0.6);
    ctx.fillStyle = '#1b5e20';
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.5, size, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size * 0.7, -s2 * 1.5); ctx.lineTo(size * 1.8, -s2 * 1.5); ctx.lineTo(size * 0.7, -s2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(-s2 * 0.5, -size * 1.3, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 1.3);
    // 背びれ
    ctx.fillStyle = '#ff6f00';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(-s2 * 0.3 + i * s2 * 0.4, -s2 * 2); ctx.lineTo(-s2 * 0.1 + i * s2 * 0.4, -s2 * 2.6); ctx.lineTo(s2 * 0.1 + i * s2 * 0.4, -s2 * 2); ctx.fill();
    }
    ctx.fillStyle = 'white';
  }

  // === 進化形態（超激レア・伝説レア）のフォールバック ===
  // 第2・第3形態で個別描画がないものはベースを色変えで描画
  else if (id.includes('_2') || id.includes('_3')) {
    const baseId = id.replace(/_[23]$/, '');
    const isForm3 = id.endsWith('_3');
    // ベースキャラの描画を呼びつつ、色を変える
    ctx.save();
    if (isForm3) {
      ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 15;
    } else {
      ctx.shadowColor = '#2196f3'; ctx.shadowBlur = 10;
    }
    // ベース描画を呼び出し
    drawEntityShape(ctx, baseId, size, state, time, isPlayer, attackFreq);
    ctx.restore();
    // 形態バッジ
    ctx.fillStyle = isForm3 ? '#ffd700' : '#2196f3';
    ctx.beginPath(); ctx.arc(-s2, -size * 1.8, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(isForm3 ? '3' : '2', -s2, -size * 1.8 + 3);
    ctx.fillStyle = 'white';
  }

  // === 新キャラ ===
  else if (id === 'witch') { // ネコ魔女
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 三角帽
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath(); ctx.moveTo(-s2, -s2 * 1.5); ctx.lineTo(0, -size * 2); ctx.lineTo(s2, -s2 * 1.5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffd54f'; ctx.beginPath(); ctx.arc(0, -s2 * 1.65, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white'; drawCatFace(-s2 * 1.4);
    // 杖
    ctx.strokeStyle = '#4a148c'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(s2, -s2 * 0.5); ctx.lineTo(size, -size * 1.2); ctx.stroke();
    ctx.fillStyle = '#ce93d8'; ctx.beginPath(); ctx.arc(size, -size * 1.2, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'archer') { // ネコ射手
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#388e3c';
    ctx.beginPath(); ctx.moveTo(-s2 * 0.5, -s2 * 2.2); ctx.lineTo(0, -s2 * 1.5); ctx.lineTo(s2 * 0.5, -s2 * 2.2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; drawCatFace(-s2 * 1.4);
    // 弓
    ctx.strokeStyle = '#795548'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(s2, -s2 * 1.0, s2 * 0.8, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.strokeStyle = '#bdbdbd'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(s2, -s2 * 1.8); ctx.lineTo(s2, -s2 * 0.2); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
  }
  else if (id === 'angel') { // ネコエンジェル
    ctx.translate(0, -10 - Math.sin(time / 120) * 5);
    drawLegs(s2 * 0.6);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.1); drawCatFace(-s2 * 1.4);
    // 天使の輪
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, -s2 * 2.5, s2 * 0.5, s2 * 0.15, 0, 0, Math.PI * 2); ctx.stroke();
    // 羽
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    let wingAngle = Math.sin(time / 150) * 0.3;
    ctx.save(); ctx.translate(-s2, -s2 * 1.5); ctx.rotate(-Math.PI / 4 + wingAngle);
    ctx.beginPath(); ctx.ellipse(0, 0, s2 * 0.8, s2 * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(s2, -s2 * 1.5); ctx.rotate(Math.PI / 4 - wingAngle);
    ctx.beginPath(); ctx.ellipse(0, 0, s2 * 0.8, s2 * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'samurai') { // ネコサムライ
    drawLegs(s2 * 0.8);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 兜
    ctx.fillStyle = '#37474f';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.5, s2 * 1.15, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.moveTo(-s2 * 0.2, -s2 * 2.5); ctx.lineTo(0, -s2 * 2); ctx.lineTo(s2 * 0.2, -s2 * 2.5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; drawCatFace(-s2 * 1.4);
    // 刀
    ctx.strokeStyle = '#bdbdbd'; ctx.lineWidth = 4;
    let swordRot = (state === 'attack') ? -Math.PI / 3 : 0;
    ctx.save(); ctx.translate(s2, -s2); ctx.rotate(swordRot);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size, -s2 * 0.5); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
  }
  else if (id === 'dragon') { // ネコドラゴン
    drawLegs(size * 0.7, 4);
    ctx.fillStyle = '#c62828';
    ctx.beginPath(); ctx.ellipse(0, -size * 1.2, size * 0.6, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 首と頭
    ctx.beginPath(); ctx.ellipse(size * 0.5, -size * 2, size * 0.35, size * 0.3, Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff6f00';
    ctx.beginPath(); ctx.arc(size * 0.7, -size * 2.1, s2 * 0.15, 0, Math.PI * 2); ctx.fill(); // 目
    ctx.fillStyle = 'white';
    // 翼
    ctx.fillStyle = '#e53935'; let wingY = Math.sin(time / 120) * size * 0.2;
    ctx.beginPath(); ctx.ellipse(-size * 0.4, -size * 1.5 + wingY, size * 0.6, size * 0.3, -Math.PI / 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 炎ブレス
    if (state === 'attack') {
      ctx.fillStyle = 'orange'; ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.moveTo(size * 0.8, -size * 2); ctx.lineTo(size * 2, -size * 1.8); ctx.lineTo(size * 2, -size * 2.2); ctx.fill();
      ctx.globalAlpha = 1.0;
    }
    ctx.fillStyle = 'white';
  }
  else if (id === 'ice') { // ネコ氷結
    drawLegs(s2 * 0.8);
    ctx.fillStyle = '#e3f2fd';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatEars(-s2 * 2.3); drawCatFace(-s2 * 1.4);
    // 氷結晶
    ctx.strokeStyle = '#29b6f6'; ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      let a = (i / 6) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(0, -s2 * 1.3); ctx.lineTo(Math.cos(a) * s2 * 1.5, -s2 * 1.3 + Math.sin(a) * s2 * 1.5); ctx.stroke();
    }
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    // 冷気オーラ
    ctx.fillStyle = 'rgba(100,200,255,0.2)';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 2 + Math.sin(time / 80) * 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
  }
  else if (id === 'chaos') { // 混沌の支配者
    ctx.translate(0, -30 - Math.sin(time / 100) * 10);
    // 混沌オーラ
    ctx.fillStyle = 'rgba(128,0,128,0.3)';
    let pulse = Math.sin(time / 60) * 10;
    ctx.beginPath(); ctx.arc(0, -s2, s2 * 1.5 + pulse, 0, Math.PI * 2); ctx.fill();
    // 体
    ctx.fillStyle = '#311b92';
    ctx.beginPath(); ctx.ellipse(0, -size * 1.2, s2, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(0, -size * 2.2, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 2.3);
    // 混沌の軌道
    ctx.strokeStyle = '#e040fb'; ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      let a = (i / 4) * Math.PI * 2 + time / 500;
      let r = size * 0.8;
      ctx.beginPath(); ctx.arc(Math.cos(a) * r, -size * 1.2 + Math.sin(a) * r, 5, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    if (state === 'attack') { ctx.fillStyle = 'rgba(128,0,128,0.5)'; ctx.beginPath(); ctx.arc(0, -size * 1.2, size * 2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white'; }
  }
  else if (id === 'phoenix') { // 不死鳥ネコ
    ctx.translate(0, -20 - Math.sin(time / 80) * 8);
    // 火の翼
    ctx.fillStyle = '#ff6f00'; let wingAmp = Math.sin(time / 100) * size * 0.3;
    ctx.beginPath(); ctx.ellipse(-size * 0.6, -size + wingAmp, size * 0.7, size * 0.3, -Math.PI / 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(size * 0.6, -size - wingAmp, size * 0.7, size * 0.3, Math.PI / 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 体
    ctx.fillStyle = '#e65100';
    ctx.beginPath(); ctx.ellipse(0, -size, s2 * 0.6, size * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 頭
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(0, -size * 1.8, s2 * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 1.9);
    // 尾
    ctx.fillStyle = '#ff3d00';
    ctx.beginPath(); ctx.moveTo(0, -size * 0.4); ctx.quadraticCurveTo(-s2, size * 0.5 + Math.sin(time / 50) * 10, -s2 * 0.5, size * 0.3); ctx.fill();
    ctx.fillStyle = 'white';
    if (state === 'attack') {
      ctx.fillStyle = 'rgba(255,100,0,0.6)'; ctx.beginPath(); ctx.arc(0, -size, size * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white';
    }
  }

  else if (id === 'dog') {
    drawLegs(s2, 4);
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.5, size * 0.7, s2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    let mouthOpen = state === 'attack' && attackPhase > 0.5 ? Math.PI / 4 : 0;
    ctx.beginPath(); ctx.arc(size * 0.5, -size * 0.9, s2 * 0.7, mouthOpen, Math.PI * 2 - mouthOpen); ctx.lineTo(size * 0.5, -size * 0.9); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(size * 0.3, -size * 1.1, s2 * 0.3, s2 * 0.5, -Math.PI / 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(size * 0.8, -size * 0.9, s2 * 0.15, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(size * 0.5, -size * 1.1, s2 * 0.15, s2 * 0.15); ctx.fillStyle = 'white';
  }
  else if (id === 'snake') {
    let wave = Math.sin(time / 100) * (size * 0.3);
    ctx.beginPath(); ctx.moveTo(-size * 0.6, -s2); ctx.quadraticCurveTo(-s2, -s2 + wave, 0, -s2 * 1.5); ctx.quadraticCurveTo(s2, -s2 - wave, size * 0.4, -size * 0.8); ctx.quadraticCurveTo(size * 0.6, -size * 1.2 + wave, size * 0.5, -size * 1.4);
    ctx.arc(size * 0.5, -size * 1.4, s2 * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(size * 0.6, -size * 1.5, s2 * 0.2, s2 * 0.2); ctx.fillStyle = 'white';
  }
  else if (id === 'croco') {
    drawLegs(s2, 4);
    ctx.fillStyle = '#4caf50'; ctx.beginPath(); ctx.ellipse(0, -s2 * 1.5, size, s2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    let mouthOpen = state === 'attack' ? s2 * 0.5 : 0;
    ctx.beginPath(); ctx.moveTo(s2, -s2 * 1.5 - mouthOpen); ctx.lineTo(size * 1.5, -s2 * 1.5 - mouthOpen); ctx.lineTo(size, -s2 * 1.5 + mouthOpen); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(size * 0.7 + i * s2 * 0.3, -s2 * 1.5 - mouthOpen); ctx.lineTo(size * 0.8 + i * s2 * 0.3, -s2 * 1.2 - mouthOpen); ctx.lineTo(size * 0.9 + i * s2 * 0.3, -s2 * 1.5 - mouthOpen); ctx.fill(); }
    ctx.fillStyle = 'black'; ctx.fillRect(s2, -size * 0.9, s2 * 0.2, s2 * 0.2); ctx.fillStyle = 'white';
  }
  else if (id === 'seal') {
    legMove = state === 'walk' ? Math.sin(time / 60) * 5 : 0;
    ctx.translate(legMove, 0);
    ctx.beginPath(); ctx.ellipse(0, -s2, size, s2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size, -s2); ctx.lineTo(size * 1.2, -s2 * 1.5); ctx.lineTo(size * 1.2, -s2 * 0.5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(-size * 0.6, -size * 0.7, 4, 4); ctx.beginPath(); ctx.arc(-size * 0.8, -s2, 3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white';
  }
  else if (id === 'kangaroo') {
    legMove = state === 'walk' ? Math.abs(Math.sin(time / 50)) * size * 0.5 : 0;
    ctx.translate(0, -legMove); drawLegs(s2 * 1.2);
    ctx.beginPath(); ctx.ellipse(0, -size, size * 0.5, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-s2 * 0.5, -size * 1.8, s2 * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-s2, -size * 2.2, 5, 15, -Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -size * 2.2, 5, 15, Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(-s2 * 0.8, -size * 1.9, 4, 4);
    ctx.fillStyle = 'red'; let punchX = (state === 'attack') ? -size * 0.8 : 0;
    ctx.beginPath(); ctx.arc(-s2 + punchX, -size * 1.2, s2 * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'white';
  }
  else if (id === 'alien') {
    drawLegs(s2 * 1.2); ctx.fillStyle = '#69f0ae';
    ctx.beginPath(); ctx.ellipse(0, -size, size * 0.4, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size * 1.8, size * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s2 * 0.5, -size * 2.3); ctx.lineTo(-size * 0.8, -size * 2.8); ctx.stroke(); ctx.beginPath(); ctx.arc(-size * 0.8, -size * 2.8, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s2 * 0.5, -size * 2.3); ctx.lineTo(size * 0.8, -size * 2.8); ctx.stroke(); ctx.beginPath(); ctx.arc(size * 0.8, -size * 2.8, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'black'; ctx.save(); ctx.translate(-s2 * 0.5, -size * 1.8); ctx.rotate(-Math.PI / 6); ctx.beginPath(); ctx.ellipse(0, 0, s2 * 0.4, s2 * 0.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(s2 * 0.5, -size * 1.8); ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.ellipse(0, 0, s2 * 0.4, s2 * 0.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); ctx.fillStyle = 'white';
    if (state === 'attack') { ctx.strokeStyle = '#00e676'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -size * 1.8); ctx.lineTo(-size * 3, -size * 1.8); ctx.stroke(); ctx.strokeStyle = 'black'; ctx.lineWidth = 2; }
  }
  else if (id === 'elephant') {
    drawLegs(size * 0.6, 4);
    ctx.fillStyle = '#9e9e9e'; ctx.beginPath(); ctx.ellipse(0, -size * 1.2, size * 0.8, size * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(size * 0.6, -size * 1.4, size * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    let trunkRot = (state === 'attack') ? -Math.PI / 4 : 0;
    ctx.save(); ctx.translate(size, -size * 1.4); ctx.rotate(trunkRot); ctx.beginPath(); ctx.ellipse(size * 0.3, s2 * 0.5, size * 0.5, s2 * 0.4, Math.PI / 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(s2 * 0.5, -size * 1.4, size * 0.4, size * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(size * 0.8, -size * 1.5, s2 * 0.2, s2 * 0.2); ctx.fillStyle = 'white';
  }
  else if (id === 'ostrich') {
    legMove = state === 'walk' ? Math.sin(time / 40) * (size * 0.4) : 0;
    drawLegs(size * 0.8);
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(0, -size, size * 0.6, size * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffcc80'; let neckX = (state === 'attack') ? size * 0.5 : 0;
    ctx.beginPath(); ctx.moveTo(s2, -size * 1.2); ctx.lineTo(size * 0.6 + neckX, -size * 2); ctx.lineTo(size * 0.8 + neckX, -size * 1.8); ctx.lineWidth = 6; ctx.stroke(); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(size * 0.7 + neckX, -size * 2, s2 * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(size * 0.75 + neckX, -size * 2.1, s2 * 0.2, s2 * 0.2);
    ctx.fillStyle = 'orange'; ctx.beginPath(); ctx.moveTo(size * 0.9 + neckX, -size * 2); ctx.lineTo(size * 1.2 + neckX, -size * 1.9); ctx.lineTo(size * 0.9 + neckX, -size * 1.8); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'white';
  }
  else if (id === 'hippo') {
    drawLegs(s2 * 0.8, 4);
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.5, size * 0.8, size * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    let mouthOpen = state === 'attack' ? s2 * 0.5 : 0;
    ctx.beginPath(); ctx.ellipse(size * 0.6, -s2 * 1.5 + mouthOpen, size * 0.4, size * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(size * 0.8, -s2 * 1.5, s2 * 0.2, s2 * 0.2); ctx.fillRect(size * 0.5, -size * 0.9, s2 * 0.2, s2 * 0.2); ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(s2 * 0.5, -size, s2 * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  else if (id === 'gorilla') {
    drawLegs(s2 * 1.2);
    ctx.beginPath(); ctx.ellipse(0, -size * 0.8, size * 0.5, size * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(s2 * 0.3, -size * 1.2, size * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(s2 * 0.4, -size * 1.3, s2 * 0.2, s2 * 0.2); ctx.fillStyle = 'white';
    let armY = (state === 'attack') ? Math.sin(time / 50) * (size * 0.3) : 0;
    ctx.beginPath(); ctx.ellipse(-s2 * 0.3, -s2 + armY, s2 * 0.4, size * 0.5, -Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(size * 0.4, -s2 - armY, s2 * 0.4, size * 0.5, Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  else if (id === 'bear') {
    drawLegs(s2 * 1.2);
    ctx.beginPath(); ctx.ellipse(0, -size, size * 0.8, size * 0.9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(size * 0.4, -size * 1.5, size * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(s2 * 0.3, -size * 1.8, s2 * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(size * 0.6, -size * 1.8, s2 * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(size * 0.5, -size * 1.6, s2 * 0.2, s2 * 0.2); ctx.fillRect(size * 0.7, -size * 1.5, s2 * 0.3, s2 * 0.3); ctx.fillStyle = 'white';
    let armRot = (state === 'attack') ? Math.PI / 2 : 0;
    ctx.save(); ctx.translate(size * 0.3, -size * 0.8); ctx.rotate(armRot); ctx.beginPath(); ctx.ellipse(size * 0.4, 0, size * 0.4, s2 * 0.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  else if (id === 'face') {
    ctx.beginPath(); ctx.arc(0, -size * 0.8, size * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.ellipse(-size * 0.3, -size, s2 * 0.4, s2 * 0.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(size * 0.3, -size, s2 * 0.4, s2 * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    const mouthOpen = (state === 'attack') ? size * 0.4 : s2 * 0.2;
    ctx.beginPath(); ctx.ellipse(0, -s2 * 0.5, size * 0.3, mouthOpen, 0, 0, Math.PI * 2); ctx.fill();
    if (state === 'attack') { ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(0, -s2 * 0.5, s2 * 0.4, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = 'white';
  }
  else if (id === 'moth') {
    ctx.beginPath(); ctx.ellipse(0, -size * 0.5, s2 * 0.5, size * 0.5, Math.PI / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#a5d6a7'; let wingY = Math.sin(time / 50) * (size * 0.4);
    ctx.beginPath(); ctx.ellipse(0, -size * 0.8, size * 0.8, size * 0.5 + wingY, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(s2 * 0.2, -size * 0.6, s2 * 0.2, s2 * 0.2); ctx.fillStyle = 'white';
  }
  else if (id === 'penguin') {
    drawLegs(s2 * 0.8);
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(0, -size * 0.8, size * 0.5, size * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(s2 * 0.2, -size * 0.7, size * 0.3, size * 0.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'orange'; ctx.beginPath(); ctx.moveTo(size * 0.4, -size * 1.1); ctx.lineTo(size * 0.8, -size * 0.9); ctx.lineTo(size * 0.4, -size * 0.8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(s2 * 0.4, -size * 1.1, s2 * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'black'; ctx.fillRect(s2 * 0.5, -size * 1.15, s2 * 0.15, s2 * 0.15); ctx.fillStyle = 'white';
  }
  else if (id === 'rhino') {
    drawLegs(s2 * 0.8, 4);
    ctx.beginPath(); ctx.ellipse(0, -size * 0.8, size * 0.8, size * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(size * 0.6, -size * 0.9, size * 0.4, size * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.moveTo(size * 0.8, -size * 0.9); ctx.lineTo(size * 1.2, -size * 1.4); ctx.lineTo(size * 0.6, -size * 1.1); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(size * 0.7, -size, s2 * 0.2, s2 * 0.2); ctx.fillStyle = 'white';
  }
  else if (id === 'bunbun') {
    ctx.beginPath(); ctx.arc(0, -size * 1.2, size * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.fillRect(-size * 0.3, -size * 1.5, size * 0.2, size * 0.2); ctx.fillRect(size * 0.3, -size * 1.5, size * 0.2, size * 0.2);
    ctx.fillStyle = '#555'; let wingY = Math.sin(time / 100) * (size * 0.2);
    ctx.beginPath(); ctx.ellipse(-size * 0.8, -size * 1.5 + wingY, size * 0.6, size * 0.3, -Math.PI / 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(size * 0.8, -size * 1.5 + wingY, size * 0.6, size * 0.3, Math.PI / 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; let punchX = (state === 'attack') ? size : 0;
    ctx.beginPath(); ctx.arc(size * 0.6 + punchX, -size * 0.5, size * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-size * 0.6, -size * 0.5, size * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  // ======== 追加味方キャラ描画 ========
  else if (id === 'eyeball') { // ネコ目玉
    drawLegs(s2 * 0.5);
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 巨大な目
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    let pupilX = Math.sin(time / 200) * s2 * 0.2;
    ctx.fillStyle = '#e91e63'; ctx.beginPath(); ctx.arc(pupilX, -s2 * 1.3, s2 * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(pupilX, -s2 * 1.3, s2 * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(pupilX - s2 * 0.1, -s2 * 1.5, s2 * 0.1, 0, Math.PI * 2); ctx.fill();
    // 小さい猫耳
    drawCatEars(-s2 * 2.3);
    // 血管
    ctx.strokeStyle = '#ef5350'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-s2 * 0.7, -s2 * 1.8); ctx.lineTo(-s2 * 0.4, -s2 * 1.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.8, -s2 * 1.0); ctx.lineTo(s2 * 0.5, -s2 * 1.2); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
    if (state === 'attack') { ctx.strokeStyle = '#e91e63'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -s2 * 1.3); ctx.lineTo(-size * 2, -s2 * 1.3); ctx.stroke(); ctx.strokeStyle = 'black'; ctx.lineWidth = 2; }
  }
  else if (id === 'mushroom') { // ネコキノコ
    drawLegs(s2 * 0.4);
    // 茎
    ctx.fillStyle = '#ffe0b2'; ctx.beginPath(); ctx.rect(-s2 * 0.3, -s2 * 1.5, s2 * 0.6, s2); ctx.fill(); ctx.stroke();
    // 傘
    ctx.fillStyle = '#e53935'; ctx.beginPath(); ctx.arc(0, -s2 * 1.5, s2, Math.PI, 0); ctx.fill(); ctx.stroke();
    // 水玉
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(-s2 * 0.4, -s2 * 1.9, s2 * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.3, -s2 * 1.7, s2 * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s2 * 2.0, s2 * 0.12, 0, Math.PI * 2); ctx.fill();
    // 顔
    drawCatFace(-s2 * 1.2);
    // 胞子（攻撃時）
    if (state === 'attack') {
      ctx.fillStyle = 'rgba(255,200,0,0.5)';
      for (let i = 0; i < 6; i++) { let a = (i / 6) * Math.PI * 2 + time / 300; ctx.beginPath(); ctx.arc(Math.cos(a) * s2 * 1.5, -s2 * 1.5 + Math.sin(a) * s2 * 1.5, 3, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.fillStyle = 'white';
  }
  else if (id === 'jellyfish') { // ネコクラゲ
    ctx.translate(0, -10 - Math.sin(time / 100) * 8);
    // 傘
    ctx.fillStyle = 'rgba(150,200,255,0.7)';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.5, s2, Math.PI, 0); ctx.fill(); ctx.stroke();
    drawCatFace(-s2 * 1.3);
    // 触手
    ctx.strokeStyle = 'rgba(100,150,255,0.6)'; ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      let xOff = -s2 * 0.8 + i * s2 * 0.4;
      let wave = Math.sin(time / 120 + i) * s2 * 0.3;
      ctx.beginPath(); ctx.moveTo(xOff, -s2 * 0.5); ctx.quadraticCurveTo(xOff + wave, s2 * 0.3, xOff - wave * 0.5, s2); ctx.stroke();
    }
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
    if (state === 'attack') { ctx.fillStyle = 'rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.arc(0, -s2, s2 * 2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white'; }
  }
  else if (id === 'caterpillar') { // ネコ芋虫
    // 体（連結した丸）
    ctx.fillStyle = '#8bc34a';
    for (let i = 0; i < 5; i++) {
      let segX = i * s2 * 0.5; let segY = -s2 * 0.6 + Math.sin(time / 100 + i * 0.8) * s2 * 0.2;
      ctx.beginPath(); ctx.arc(segX - s2, segY, s2 * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    // 頭
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(s2 * 0.5, -s2 * 0.6, s2 * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-s2 * 0.7);
    // 触角
    ctx.strokeStyle = '#4caf50'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(s2 * 0.3, -s2 * 1.0); ctx.lineTo(s2 * 0.1, -s2 * 1.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.7, -s2 * 1.0); ctx.lineTo(s2 * 0.9, -s2 * 1.5); ctx.stroke();
    ctx.fillStyle = '#ffeb3b'; ctx.beginPath(); ctx.arc(s2 * 0.1, -s2 * 1.5, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.9, -s2 * 1.5, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'demon') { // ネコデーモン
    drawLegs(s2 * 0.8);
    ctx.fillStyle = '#4a0072';
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.3, s2 * 1.1, s2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-s2 * 1.4);
    // 角
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath(); ctx.moveTo(-s2 * 0.5, -s2 * 2.1); ctx.lineTo(-s2 * 0.3, -s2 * 2.8); ctx.lineTo(-s2 * 0.1, -s2 * 2.1); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.1, -s2 * 2.1); ctx.lineTo(s2 * 0.3, -s2 * 2.8); ctx.lineTo(s2 * 0.5, -s2 * 2.1); ctx.fill(); ctx.stroke();
    // 翼
    ctx.fillStyle = '#311b92'; let dwing = Math.sin(time / 120) * 0.2;
    ctx.save(); ctx.translate(-s2, -s2 * 1.5); ctx.rotate(-Math.PI / 3 + dwing);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s2, -s2 * 0.8); ctx.lineTo(-s2 * 0.3, -s2 * 0.3); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(s2, -s2 * 1.5); ctx.rotate(Math.PI / 3 - dwing);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s2, -s2 * 0.8); ctx.lineTo(s2 * 0.3, -s2 * 0.3); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.fillStyle = 'white';
    if (state === 'attack') { ctx.fillStyle = 'rgba(128,0,128,0.5)'; ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white'; }
  }
  else if (id === 'darkknight') { // ネコ暗黒騎士
    drawLegs(s2 * 0.8);
    ctx.fillStyle = '#212121';
    ctx.beginPath(); ctx.rect(-s2 * 0.8, -size * 1.6, s2 * 1.6, size * 1.2); ctx.fill(); ctx.stroke();
    // ヘルメット
    ctx.beginPath(); ctx.arc(0, -size * 1.6, s2 * 0.7, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#f44336'; ctx.fillRect(-s2 * 0.3, -size * 1.5, s2 * 0.6, s2 * 0.15);
    ctx.fillStyle = 'white'; drawCatFace(-size * 1.3);
    // 盾と剣
    ctx.fillStyle = '#37474f'; ctx.beginPath(); ctx.rect(-s2 * 1.3, -size * 1.2, s2 * 0.5, s2 * 0.8); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#9e9e9e'; ctx.lineWidth = 4;
    let sRot = (state === 'attack') ? -Math.PI / 2 : -Math.PI / 6;
    ctx.save(); ctx.translate(s2 * 0.8, -size); ctx.rotate(sRot);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -size); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'thunder') { // ネコ雷帝
    ctx.translate(0, -15 - Math.sin(time / 80) * 5);
    drawLegs(s2 * 0.8);
    ctx.fillStyle = '#1a237e';
    ctx.beginPath(); ctx.ellipse(0, -size * 1.2, s2, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(0, -size * 2.2, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 2.3);
    // 雷冠
    ctx.strokeStyle = '#ffeb3b'; ctx.lineWidth = 4;
    for (let i = 0; i < 5; i++) { let a = (i / 5) * Math.PI - Math.PI / 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * s2 * 0.6, -size * 2.2 + Math.sin(a) * s2 * 0.6); ctx.lineTo(Math.cos(a) * s2 * 1.2, -size * 2.2 + Math.sin(a) * s2 * 1.2); ctx.stroke(); }
    // 雷撃
    if (state === 'attack') {
      ctx.strokeStyle = '#ffeb3b'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(0, -size * 2); ctx.lineTo(-s2, -size * 2.5); ctx.lineTo(s2 * 0.5, -size * 3); ctx.lineTo(-s2 * 0.3, -size * 3.5); ctx.stroke();
    }
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'spacePirate') { // ネコ宇宙海賊
    drawLegs(s2 * 0.8);
    ctx.fillStyle = '#263238';
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.3, s2 * 1.1, s2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // ヘルメット
    ctx.fillStyle = 'rgba(100,200,255,0.3)'; ctx.beginPath(); ctx.arc(0, -s2 * 1.5, s2 * 0.9, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'white'; drawCatFace(-s2 * 1.4);
    // ジェットパック
    ctx.fillStyle = '#ff6f00'; ctx.beginPath(); ctx.rect(-s2 * 1.2, -s2 * 1.0, s2 * 0.3, s2 * 0.8); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(s2 * 0.9, -s2 * 1.0, s2 * 0.3, s2 * 0.8); ctx.fill(); ctx.stroke();
    // 炎
    ctx.fillStyle = 'rgba(255,200,0,0.7)';
    let fH = Math.sin(time / 50) * s2 * 0.3 + s2 * 0.5;
    ctx.beginPath(); ctx.moveTo(-s2 * 1.2, -s2 * 0.2); ctx.lineTo(-s2 * 1.05, -s2 * 0.2 + fH); ctx.lineTo(-s2 * 0.9, -s2 * 0.2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s2 * 0.9, -s2 * 0.2); ctx.lineTo(s2 * 1.05, -s2 * 0.2 + fH); ctx.lineTo(s2 * 1.2, -s2 * 0.2); ctx.fill();
    // レーザーガン
    ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(s2, -s2 * 0.5); ctx.lineTo(size, -s2); ctx.stroke();
    if (state === 'attack') { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(size, -s2); ctx.lineTo(size * 3, -s2); ctx.stroke(); }
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'slime') { // ネコスライム
    // ぷるぷるアニメ
    let squish = Math.sin(time / 150) * s2 * 0.15;
    ctx.fillStyle = '#64b5f6';
    ctx.beginPath(); ctx.ellipse(0, -s2 * 0.8, s2 + squish, s2 * 0.8 - squish * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 透明感
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(-s2 * 0.3, -s2 * 1.1, s2 * 0.2, 0, Math.PI * 2); ctx.fill();
    // 猫顔
    drawCatFace(-s2 * 0.9);
    drawCatEars(-s2 * 1.5);
    ctx.fillStyle = 'white';
  }
  else if (id === 'skull') { // ネコドクロ
    drawLegs(s2 * 0.6);
    ctx.fillStyle = '#eeeeee';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 1.0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // ドクロ穴目
    ctx.fillStyle = 'black';
    ctx.beginPath(); ctx.arc(-s2 * 0.3, -s2 * 1.4, s2 * 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.3, -s2 * 1.4, s2 * 0.25, 0, Math.PI * 2); ctx.fill();
    // 鼻穴
    ctx.beginPath(); ctx.moveTo(-s2 * 0.1, -s2 * 1.0); ctx.lineTo(0, -s2 * 1.15); ctx.lineTo(s2 * 0.1, -s2 * 1.0); ctx.fill();
    // 歯
    ctx.fillStyle = 'white';
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.rect(-s2 * 0.4 + i * s2 * 0.22, -s2 * 0.85, s2 * 0.18, s2 * 0.2); ctx.fill(); ctx.stroke(); }
    drawCatEars(-s2 * 2.2);
    // 鎌
    ctx.strokeStyle = '#616161'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(s2, -s2 * 0.5); ctx.lineTo(size * 1.2, -size * 1.5); ctx.stroke();
    ctx.strokeStyle = '#bdbdbd'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(size * 1.2, -size * 1.5, s2 * 0.4, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'mecha') { // ネコメカ
    // 脚（メカ）
    ctx.fillStyle = '#616161';
    ctx.beginPath(); ctx.rect(-s2 * 0.7, -s2 * 0.3, s2 * 0.4, s2 * 0.5); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(s2 * 0.3, -s2 * 0.3, s2 * 0.4, s2 * 0.5); ctx.fill(); ctx.stroke();
    // 体
    ctx.fillStyle = '#37474f';
    ctx.beginPath(); ctx.rect(-s2 * 0.8, -size * 1.4, s2 * 1.6, size); ctx.fill(); ctx.stroke();
    // コックピット
    ctx.fillStyle = 'rgba(100,255,200,0.4)'; ctx.beginPath(); ctx.arc(0, -size, s2 * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 1.05);
    // 頭部
    ctx.fillStyle = '#455a64'; ctx.beginPath(); ctx.rect(-s2 * 0.5, -size * 1.7, s2, s2 * 0.4); ctx.fill(); ctx.stroke();
    // アンテナ
    ctx.strokeStyle = '#f44336'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -size * 1.7); ctx.lineTo(0, -size * 2); ctx.stroke();
    ctx.fillStyle = '#f44336'; ctx.beginPath(); ctx.arc(0, -size * 2, 3, 0, Math.PI * 2); ctx.fill();
    // 腕（砲）
    let armRot = (state === 'attack') ? -Math.PI / 4 : 0;
    ctx.save(); ctx.translate(s2 * 0.8, -size * 0.8); ctx.rotate(armRot);
    ctx.fillStyle = '#546e7a'; ctx.beginPath(); ctx.rect(0, -s2 * 0.2, size * 0.7, s2 * 0.4); ctx.fill(); ctx.stroke();
    ctx.restore();
    if (state === 'attack') { ctx.strokeStyle = '#ff5722'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(s2 * 0.8 + size * 0.5, -size * 0.8 - size * 0.4); ctx.lineTo(size * 3, -size * 0.8 - size * 0.4); ctx.stroke(); }
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
  }
  else if (id === 'odin') { // 神槍ネコオーディン
    ctx.translate(0, -15 - Math.sin(time / 120) * 6);
    drawLegs(size * 0.7);
    ctx.fillStyle = '#1a237e';
    ctx.beginPath(); ctx.ellipse(0, -size * 1.2, s2 * 0.6, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // マント
    ctx.fillStyle = 'rgba(26,35,126,0.5)';
    ctx.beginPath(); ctx.moveTo(-s2 * 0.6, -size * 1.5); ctx.quadraticCurveTo(-s2 * 1.5, -s2, -s2, s2 * 0.3);
    ctx.lineTo(s2, s2 * 0.3); ctx.quadraticCurveTo(s2 * 1.5, -s2, s2 * 0.6, -size * 1.5); ctx.fill();
    // 頭
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(0, -size * 2.2, s2 * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCatFace(-size * 2.3);
    // 兜（片目）
    ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(0, -size * 2.6, s2 * 0.5, Math.PI, 0); ctx.fill(); ctx.stroke();
    // 翼飾り
    ctx.beginPath(); ctx.moveTo(-s2 * 0.5, -size * 2.6); ctx.lineTo(-s2, -size * 3); ctx.lineTo(-s2 * 0.2, -size * 2.6); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s2 * 0.2, -size * 2.6); ctx.lineTo(s2, -size * 3); ctx.lineTo(s2 * 0.5, -size * 2.6); ctx.fill();
    // グングニル（槍）
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 4;
    let spearRot = (state === 'attack') ? -Math.PI / 3 : -Math.PI / 8;
    ctx.save(); ctx.translate(s2 * 0.5, -size * 1.5); ctx.rotate(spearRot);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -size * 1.5); ctx.stroke();
    ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.moveTo(-s2 * 0.15, -size * 1.5); ctx.lineTo(0, -size * 1.8); ctx.lineTo(s2 * 0.15, -size * 1.5); ctx.fill(); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
    if (state === 'attack') { ctx.fillStyle = 'rgba(255,215,0,0.3)'; ctx.beginPath(); ctx.arc(0, -size * 1.5, size * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white'; }
  }

  // ======== 追加敵キャラ描画 ========
  else if (id === 'octopus') { // タコ
    ctx.fillStyle = '#e91e63';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.2, s2 * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 触手
    for (let i = 0; i < 6; i++) {
      let tx = -s2 * 0.8 + i * s2 * 0.32; let wave = Math.sin(time / 100 + i * 1.2) * s2 * 0.3;
      ctx.beginPath(); ctx.moveTo(tx, -s2 * 0.5); ctx.quadraticCurveTo(tx + wave, s2 * 0.2, tx - wave * 0.5, s2 * 0.5); ctx.lineWidth = 3; ctx.stroke(); ctx.lineWidth = 2;
    }
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(-s2 * 0.2, -s2 * 1.4, s2 * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(s2 * 0.2, -s2 * 1.4, s2 * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(-s2 * 0.2, -s2 * 1.4, s2 * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.2, -s2 * 1.4, s2 * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
  }
  else if (id === 'snail') { // カタツムリ
    // 殻
    ctx.fillStyle = '#a1887f';
    ctx.beginPath(); ctx.arc(0, -s2 * 1.0, s2 * 0.9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 渦巻き
    ctx.strokeStyle = '#795548'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -s2 * 1.0, s2 * 0.4, 0, Math.PI * 3); ctx.stroke();
    ctx.strokeStyle = 'black';
    // 体
    ctx.fillStyle = '#ffcc80';
    ctx.beginPath(); ctx.ellipse(s2 * 0.5, -s2 * 0.3, s2 * 0.8, s2 * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 目
    ctx.strokeStyle = '#795548'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(s2 * 0.8, -s2 * 0.5); ctx.lineTo(s2 * 0.7, -s2 * 1.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 1.1, -s2 * 0.5); ctx.lineTo(s2 * 1.0, -s2 * 1.1); ctx.stroke();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(s2 * 0.7, -s2 * 1.2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 1.0, -s2 * 1.1, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'black'; ctx.fillStyle = 'white';
  }
  else if (id === 'bat') { // コウモリ
    ctx.translate(0, -15 - Math.sin(time / 60) * 8);
    ctx.fillStyle = '#424242';
    ctx.beginPath(); ctx.arc(0, -s2 * 0.8, s2 * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 耳
    ctx.beginPath(); ctx.moveTo(-s2 * 0.4, -s2 * 1.2); ctx.lineTo(-s2 * 0.6, -s2 * 1.8); ctx.lineTo(-s2 * 0.1, -s2 * 1.2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 * 0.1, -s2 * 1.2); ctx.lineTo(s2 * 0.6, -s2 * 1.8); ctx.lineTo(s2 * 0.4, -s2 * 1.2); ctx.fill(); ctx.stroke();
    // 目
    ctx.fillStyle = '#f44336'; ctx.beginPath(); ctx.arc(-s2 * 0.2, -s2 * 0.9, s2 * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.2, -s2 * 0.9, s2 * 0.1, 0, Math.PI * 2); ctx.fill();
    // 翼
    let bwing = Math.sin(time / 60) * 0.4;
    ctx.fillStyle = '#333';
    ctx.save(); ctx.translate(-s2 * 0.5, -s2 * 0.8); ctx.rotate(-Math.PI / 3 + bwing);
    ctx.beginPath(); ctx.ellipse(0, 0, s2, s2 * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(s2 * 0.5, -s2 * 0.8); ctx.rotate(Math.PI / 3 - bwing);
    ctx.beginPath(); ctx.ellipse(0, 0, s2, s2 * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.fillStyle = 'white';
  }
  else if (id === 'wolf') { // オオカミ
    legMove = state === 'walk' ? Math.sin(time / 40) * (size * 0.3) : 0;
    drawLegs(s2 * 0.8, 4);
    ctx.fillStyle = '#78909c';
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.2, size * 0.6, s2 * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 頭
    ctx.beginPath(); ctx.ellipse(size * 0.5, -s2 * 1.5, s2 * 0.5, s2 * 0.4, -Math.PI / 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 耳
    ctx.beginPath(); ctx.moveTo(size * 0.3, -s2 * 1.8); ctx.lineTo(size * 0.15, -s2 * 2.4); ctx.lineTo(size * 0.45, -s2 * 1.8); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size * 0.6, -s2 * 1.8); ctx.lineTo(size * 0.75, -s2 * 2.4); ctx.lineTo(size * 0.85, -s2 * 1.7); ctx.fill(); ctx.stroke();
    // 目
    ctx.fillStyle = '#ffeb3b'; ctx.beginPath(); ctx.arc(size * 0.6, -s2 * 1.6, s2 * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(size * 0.6, -s2 * 1.6, s2 * 0.06, 0, Math.PI * 2); ctx.fill();
    // 尻尾
    ctx.strokeStyle = '#78909c'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-size * 0.5, -s2 * 1.2); ctx.quadraticCurveTo(-size, -s2 * 2 + Math.sin(time / 100) * s2, -size * 0.8, -s2 * 1.8); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
    if (state === 'attack') { let mouthO = s2 * 0.3; ctx.fillStyle = 'black'; ctx.beginPath(); ctx.ellipse(size * 0.8, -s2 * 1.4, s2 * 0.2, mouthO, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white'; }
  }
  else if (id === 'dragonEnemy') { // 敵ドラゴン
    drawLegs(size * 0.7, 4);
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath(); ctx.ellipse(0, -size * 1.2, size * 0.7, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 首と頭
    ctx.beginPath(); ctx.ellipse(-size * 0.5, -size * 2, size * 0.4, size * 0.3, -Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 目
    ctx.fillStyle = '#ff6f00'; ctx.beginPath(); ctx.arc(-size * 0.7, -size * 2.1, s2 * 0.15, 0, Math.PI * 2); ctx.fill();
    // 翼
    ctx.fillStyle = '#388e3c'; let deWing = Math.sin(time / 120) * size * 0.2;
    ctx.beginPath(); ctx.ellipse(size * 0.4, -size * 1.5 + deWing, size * 0.7, size * 0.3, Math.PI / 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 背びれ
    ctx.fillStyle = '#1b5e20';
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-s2 * 0.3 + i * s2 * 0.35, -size * 1.8); ctx.lineTo(-s2 * 0.15 + i * s2 * 0.35, -size * 2.2); ctx.lineTo(i * s2 * 0.35, -size * 1.8); ctx.fill(); }
    ctx.fillStyle = 'white';
    if (state === 'attack') { ctx.fillStyle = 'orange'; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(-size * 0.8, -size * 2); ctx.lineTo(-size * 2.5, -size * 1.8); ctx.lineTo(-size * 2.5, -size * 2.2); ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = 'white'; }
  }
  else if (id === 'demonEnemy') { // 敵デーモン
    drawLegs(s2 * 0.8);
    ctx.fillStyle = '#880e4f';
    ctx.beginPath(); ctx.ellipse(0, -s2 * 1.3, s2 * 1.1, s2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 角
    ctx.fillStyle = '#f44336';
    ctx.beginPath(); ctx.moveTo(-s2 * 0.4, -s2 * 2.1); ctx.lineTo(-s2 * 0.2, -s2 * 2.7); ctx.lineTo(0, -s2 * 2.1); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s2 * 2.1); ctx.lineTo(s2 * 0.2, -s2 * 2.7); ctx.lineTo(s2 * 0.4, -s2 * 2.1); ctx.fill(); ctx.stroke();
    // 目
    ctx.fillStyle = '#ffeb3b'; ctx.beginPath(); ctx.arc(-s2 * 0.3, -s2 * 1.4, s2 * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.3, -s2 * 1.4, s2 * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(-s2 * 0.3, -s2 * 1.4, s2 * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.3, -s2 * 1.4, s2 * 0.06, 0, Math.PI * 2); ctx.fill();
    // 翼
    ctx.fillStyle = '#4a148c'; let demWing = Math.sin(time / 100) * 0.2;
    ctx.save(); ctx.translate(-s2, -s2 * 1.3); ctx.rotate(Math.PI / 3 - demWing);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s2, -s2 * 0.8); ctx.lineTo(s2 * 0.3, 0); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(s2, -s2 * 1.3); ctx.rotate(-Math.PI / 3 + demWing);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s2, -s2 * 0.8); ctx.lineTo(-s2 * 0.3, 0); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.fillStyle = 'white';
    if (state === 'attack') { ctx.fillStyle = 'rgba(128,0,0,0.4)'; ctx.beginPath(); ctx.arc(0, -s2 * 1.3, s2 * 2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white'; }
  }
  else if (id === 'golem') { // ゴーレム
    ctx.fillStyle = '#795548';
    // 脚
    ctx.beginPath(); ctx.rect(-s2 * 0.7, -s2 * 0.5, s2 * 0.5, s2 * 0.7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(s2 * 0.2, -s2 * 0.5, s2 * 0.5, s2 * 0.7); ctx.fill(); ctx.stroke();
    // 体
    ctx.beginPath(); ctx.rect(-s2 * 0.9, -size * 1.5, s2 * 1.8, size); ctx.fill(); ctx.stroke();
    // 苔模様
    ctx.fillStyle = '#4caf50';
    ctx.beginPath(); ctx.arc(-s2 * 0.4, -size * 1.0, s2 * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.3, -size * 0.7, s2 * 0.2, 0, Math.PI * 2); ctx.fill();
    // 頭
    ctx.fillStyle = '#8d6e63'; ctx.beginPath(); ctx.rect(-s2 * 0.6, -size * 1.8, s2 * 1.2, s2 * 0.5); ctx.fill(); ctx.stroke();
    // 目
    ctx.fillStyle = '#ff5722'; ctx.beginPath(); ctx.arc(-s2 * 0.2, -size * 1.65, s2 * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.2, -size * 1.65, s2 * 0.12, 0, Math.PI * 2); ctx.fill();
    // 腕
    let gArmRot = (state === 'attack') ? Math.PI / 3 : 0;
    ctx.fillStyle = '#795548';
    ctx.save(); ctx.translate(-s2 * 0.9, -size * 1.2); ctx.rotate(-gArmRot);
    ctx.beginPath(); ctx.rect(-s2 * 0.3, 0, s2 * 0.5, size * 0.7); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(s2 * 0.9, -size * 1.2); ctx.rotate(gArmRot);
    ctx.beginPath(); ctx.rect(-s2 * 0.2, 0, s2 * 0.5, size * 0.7); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.fillStyle = 'white';
  }
  else if (id === 'wyvern') { // ワイバーン
    ctx.translate(0, -20 - Math.sin(time / 80) * 10);
    ctx.fillStyle = '#5d4037';
    ctx.beginPath(); ctx.ellipse(0, -s2 * 0.8, s2 * 0.6, s2 * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 頭
    ctx.beginPath(); ctx.ellipse(-s2 * 0.5, -s2 * 1.3, s2 * 0.35, s2 * 0.25, -Math.PI / 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff5722'; ctx.beginPath(); ctx.arc(-s2 * 0.6, -s2 * 1.4, s2 * 0.08, 0, Math.PI * 2); ctx.fill();
    // 翼
    ctx.fillStyle = '#4e342e'; let wWing = Math.sin(time / 80) * 0.4;
    ctx.save(); ctx.translate(0, -s2 * 0.8); ctx.rotate(-Math.PI / 4 + wWing);
    ctx.beginPath(); ctx.ellipse(-s2 * 0.5, 0, s2 * 1.2, s2 * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(0, -s2 * 0.8); ctx.rotate(Math.PI / 4 - wWing);
    ctx.beginPath(); ctx.ellipse(s2 * 0.5, 0, s2 * 1.2, s2 * 0.3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    // 尻尾
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(s2 * 0.5, -s2 * 0.8); ctx.quadraticCurveTo(size, -s2 * 0.2 + Math.sin(time / 80) * s2 * 0.3, size * 0.8, s2 * 0.2); ctx.stroke();
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.fillStyle = 'white';
    if (state === 'attack') { ctx.fillStyle = 'orange'; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(-s2 * 0.7, -s2 * 1.2); ctx.lineTo(-size * 2, -s2 * 1.0); ctx.lineTo(-size * 2, -s2 * 1.4); ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = 'white'; }
  }
  else if (id === 'spider') { // 蜘蛛
    ctx.fillStyle = '#424242';
    ctx.beginPath(); ctx.ellipse(0, -s2 * 0.6, s2 * 0.5, s2 * 0.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(s2 * 0.4, -s2 * 0.9, s2 * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 脚（8本）
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      let ang = (i - 1.5) * 0.4; let legW = Math.sin(time / 80 + i) * s2 * 0.2;
      ctx.beginPath(); ctx.moveTo(-s2 * 0.3, -s2 * 0.5); ctx.lineTo(-s2 * 0.3 - Math.cos(ang) * s2 + legW, -s2 * 0.5 + Math.sin(ang) * s2 * 0.5); ctx.lineTo(-s2 * 0.3 - Math.cos(ang) * s2 * 1.3 + legW, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s2 * 0.3, -s2 * 0.5); ctx.lineTo(s2 * 0.3 + Math.cos(ang) * s2 - legW, -s2 * 0.5 + Math.sin(ang) * s2 * 0.5); ctx.lineTo(s2 * 0.3 + Math.cos(ang) * s2 * 1.3 - legW, 0); ctx.stroke();
    }
    // 目
    ctx.strokeStyle = 'black';
    ctx.fillStyle = '#f44336';
    ctx.beginPath(); ctx.arc(s2 * 0.3, -s2 * 1.0, s2 * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.5, -s2 * 1.0, s2 * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.3, -s2 * 0.85, s2 * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2 * 0.5, -s2 * 0.85, s2 * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
  }
  else if (id === 'cyclops') { // サイクロプス
    drawLegs(size * 0.6);
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath(); ctx.ellipse(0, -size * 1.0, size * 0.7, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size * 1.8, size * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 一つ目
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(0, -size * 1.8, size * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    let cpX = Math.sin(time / 200) * size * 0.1;
    ctx.fillStyle = '#f44336'; ctx.beginPath(); ctx.arc(cpX, -size * 1.8, size * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(cpX, -size * 1.8, size * 0.07, 0, Math.PI * 2); ctx.fill();
    // 棍棒
    ctx.fillStyle = '#5d4037';
    let clubRot = (state === 'attack') ? Math.PI / 3 : 0;
    ctx.save(); ctx.translate(size * 0.6, -size * 0.8); ctx.rotate(clubRot);
    ctx.beginPath(); ctx.rect(-s2 * 0.15, -size, s2 * 0.3, size * 1.2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size, s2 * 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = 'white';
  }
};
