import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpCircle, Coins, Zap, Play, RotateCcw, ChevronLeft, ChevronRight, Sword, Gift, Lock, Shield } from 'lucide-react';
import { LOCAL_STORAGE_KEY, WALLET_LEVELS } from './data/walletLevels.js';
import { STAGES } from './data/stages.js';
import { PLAYER_UNITS } from './data/playerUnits.js';
import { ENEMY_UNITS } from './data/enemyUnits.js';
import { drawEntityShape } from './engine/EntityRenderer.js';
import { sfx } from './engine/SoundManager.js';
import { GameEngine } from './engine/GameEngine.js';

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