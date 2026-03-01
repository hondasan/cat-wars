// --- サウンドエンジン ---
export class SoundManager {
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
export const sfx = new SoundManager();
