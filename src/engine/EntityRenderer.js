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

  // --- 敵 ---
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
};
