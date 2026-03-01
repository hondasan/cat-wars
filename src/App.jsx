import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpCircle, Coins, Zap, Play, RotateCcw, ChevronLeft, ChevronRight, Sword, Gift, Lock, Shield, Users, Plus, X, GripVertical, Pause, FastForward } from 'lucide-react';
import { LOCAL_STORAGE_KEY, WALLET_LEVELS } from './data/walletLevels.js';
import { STAGES } from './data/stages.js';
import { PLAYER_UNITS, getUnitForm } from './data/playerUnits.js';
import { ENEMY_UNITS } from './data/enemyUnits.js';
import { TREASURES, drawTreasure, rollTreasureDrop } from './data/treasures.js';
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
      const baseUnit = PLAYER_UNITS[id] || ENEMY_UNITS[id];
      const baseSize = baseUnit ? baseUnit.size : 30;
      const drawId = (isPlayer && PLAYER_UNITS[id]) ? id : id;
      const scale = (size * 0.5) / baseSize;
      ctx.scale(scale, scale);
      drawEntityShape(ctx, drawId, baseSize, animate ? 'walk' : 'idle', time, isPlayer, 1000);
      ctx.restore();
      if (animate) animationId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationId);
  }, [id, size, animate]);

  return <canvas ref={canvasRef} width={size} height={size} className="pointer-events-none" />;
};

// --- お宝アイコンコンポーネント ---
const TreasureIcon = ({ treasure, size }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save(); ctx.translate(canvas.width / 2, canvas.height / 2);
    const scale = size / 60;
    ctx.scale(scale, scale);
    drawTreasure(ctx, treasure, 30);
    ctx.restore();
  }, [treasure, size]);
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
        levels: { ...defaultLevels, ...(parsed.levels || {}) },
        deck: parsed.deck || parsed.unlockedUnits || ['basic', 'tank', 'battle', 'ranged', 'cow', 'titan']
      };
    } catch (e) {
      console.error("Failed to parse save data", e);
    }
  }
  const defaultUnlocked = ['basic', 'tank', 'battle', 'ranged', 'cow', 'titan'];
  return {
    xp: 5000,
    catFood: 3000,
    unlockedUnits: defaultUnlocked,
    deck: [...defaultUnlocked],
    levels: Object.keys(PLAYER_UNITS).reduce((acc, key) => ({ ...acc, [key]: 1 }), {}),
    cannonLv: 1, baseHpLv: 1, maxStageCleared: 0,
    collectedTreasures: []
  };
};

export default function NyanDefenseApp() {
  const [appState, setAppState] = useState('title');
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [saveData, setSaveData] = useState(getInitialSaveData);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
  }, [saveData]);

  const [finalResult, setFinalResult] = useState({ status: '', xpEarned: 0, catFoodEarned: 0, droppedTreasures: [] });
  const [gachaResult, setGachaResult] = useState([]);

  const canvasRef = useRef(null); const engineRef = useRef(null);

  const [gameState, setGameState] = useState({
    money: 0, maxMoney: 500, walletLevel: 1, walletCost: 100, cooldowns: {},
    cannonPercent: 0, canFireCannon: false, status: 'playing', sessionXp: 0, bossSpawned: false, stageName: '', baseHpPercent: 100,
    gameSpeed: 1, isPaused: false
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
              const droppedTreasures = state.status === 'victory' ? rollTreasureDrop(STAGES[stageIndex].id) : [];
              const newTreasureIds = droppedTreasures.map(t => t.id);
              setSaveData(prev => {
                const existingSet = new Set(prev.collectedTreasures || []);
                newTreasureIds.forEach(id => existingSet.add(id));
                return {
                  ...prev, xp: prev.xp + state.sessionXp, catFood: prev.catFood + catFoodBonus,
                  maxStageCleared: state.status === 'victory' ? Math.max(prev.maxStageCleared, stageIndex + 1) : prev.maxStageCleared,
                  collectedTreasures: [...existingSet]
                };
              });
              setFinalResult({ status: state.status, xpEarned: state.sessionXp, catFoodEarned: catFoodBonus, droppedTreasures });
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

        <h1 className="text-6xl md:text-7xl font-black mb-2 text-white drop-shadow-[0_8px_0_rgba(0,0,0,1)] tracking-widest text-center leading-tight z-10 border-black" style={{ WebkitTextStroke: '3px black' }}>
          にゃんこ<br />大防衛
        </h1>
        <p className="text-yellow-300 font-black text-xl md:text-2xl mb-10 drop-shadow-[0_4px_0_rgba(0,0,0,1)] z-10" style={{ WebkitTextStroke: '1px black' }}>〜 Webブラウザの侵略 〜</p>

        <div className="flex flex-col gap-4 w-64 md:w-72 z-10">
          <button onClick={() => setAppState('stageSelect')} className="py-4 bg-orange-500 hover:bg-orange-400 rounded-2xl text-xl md:text-2xl font-black shadow-[0_8px_0_#9a3412] active:translate-y-2 active:shadow-none transition-all border-4 border-black text-white">
            ゲームスタート
          </button>
          <button onClick={() => setAppState('deck')} className="py-4 bg-purple-500 hover:bg-purple-400 rounded-2xl text-xl md:text-2xl font-black shadow-[0_8px_0_#581c87] active:translate-y-2 active:shadow-none transition-all border-4 border-black flex justify-center items-center gap-2 text-white">
            編成 <Users size={24} strokeWidth={3} />
          </button>
          <button onClick={() => stopEngineAndGoTo('upgrade')} className="py-4 bg-blue-500 hover:bg-blue-400 rounded-2xl text-xl md:text-2xl font-black shadow-[0_8px_0_#1e3a8a] active:translate-y-2 active:shadow-none transition-all border-4 border-black flex justify-center items-center gap-2 text-white">
            パワーアップ <ArrowUpCircle size={24} strokeWidth={3} />
          </button>
          <button onClick={() => { setGachaResult([]); stopEngineAndGoTo('gacha'); }} className="py-4 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl text-xl md:text-2xl font-black shadow-[0_8px_0_#b45309] active:translate-y-2 active:shadow-none transition-all border-4 border-black flex justify-center items-center gap-2">
            レアガチャ <Gift size={24} strokeWidth={3} />
          </button>
          <button onClick={() => setAppState('encyclopedia')} className="py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl text-xl md:text-2xl font-black shadow-[0_8px_0_#065f46] active:translate-y-2 active:shadow-none transition-all border-4 border-black flex justify-center items-center gap-2">
            お宝図鑑 <Shield size={24} strokeWidth={3} />
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

  if (appState === 'deck') {
    const MAX_DECK = 10;
    const addToDeck = (unitId) => {
      if (saveData.deck.length >= MAX_DECK) { sfx.init(); sfx.se('error'); return; }
      if (saveData.deck.includes(unitId)) return;
      sfx.init(); sfx.se('spawn');
      setSaveData(prev => ({ ...prev, deck: [...prev.deck, unitId] }));
    };
    const removeFromDeck = (unitId) => {
      sfx.init(); sfx.se('hit');
      setSaveData(prev => ({ ...prev, deck: prev.deck.filter(id => id !== unitId) }));
    };
    const moveDeck = (idx, dir) => {
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= saveData.deck.length) return;
      sfx.init(); sfx.se('spawn');
      setSaveData(prev => {
        const newDeck = [...prev.deck];
        [newDeck[idx], newDeck[newIdx]] = [newDeck[newIdx], newDeck[idx]];
        return { ...prev, deck: newDeck };
      });
    };

    const rarityBorder = (rarity) => {
      if (rarity === 'super') return 'border-blue-500';
      if (rarity === 'uber') return 'border-red-500';
      if (rarity === 'legend') return 'border-purple-500';
      return 'border-black';
    };
    const rarityBg = (rarity) => {
      if (rarity === 'super') return 'bg-blue-50';
      if (rarity === 'uber') return 'bg-red-50';
      if (rarity === 'legend') return 'bg-purple-50';
      return 'bg-white';
    };

    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-purple-100 text-black font-sans select-none p-4 md:p-6">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white p-3 md:p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] sticky top-4 z-50">
          <button onClick={() => setAppState('title')} className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-xl font-black border-4 border-black shadow-[0_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex items-center gap-2">
            <ChevronLeft strokeWidth={3} /> もどる
          </button>
          <h2 className="text-2xl md:text-4xl font-black text-purple-600 drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]">編成</h2>
          <div className="bg-purple-50 px-3 py-1 rounded-xl border-2 border-black">
            <p className="text-xs font-black text-gray-500">デッキ</p>
            <p className="text-lg font-black text-purple-600">{saveData.deck.length}/{MAX_DECK}</p>
          </div>
        </div>

        {/* デッキスロット */}
        <div className="w-full max-w-4xl mb-6">
          <h3 className="text-lg font-black text-purple-700 mb-3 flex items-center gap-2">
            <Users size={20} strokeWidth={3} /> 出撃デッキ
          </h3>
          <div className="bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] p-3 md:p-4">
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {Array.from({ length: MAX_DECK }).map((_, idx) => {
                const unitId = saveData.deck[idx];
                if (unitId) {
                  const unit = PLAYER_UNITS[unitId];
                  return (
                    <div key={`slot-${idx}`} className={`relative flex flex-col items-center rounded-xl border-4 ${rarityBorder(unit.rarity)} ${rarityBg(unit.rarity)} p-1 shadow-md`}>
                      <UnitIcon id={unit.id} size={50} animate={false} />
                      <p className="text-[8px] md:text-[9px] font-black truncate w-full text-center mt-0.5">{unit.name}</p>
                      <div className="absolute -top-2 -left-2 bg-purple-500 text-white text-[8px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">{idx + 1}</div>
                      <button onClick={() => removeFromDeck(unitId)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
                        <X size={10} strokeWidth={4} />
                      </button>
                      <div className="flex gap-0.5 mt-0.5">
                        <button onClick={() => moveDeck(idx, -1)} disabled={idx === 0} className="text-[8px] bg-gray-200 hover:bg-gray-300 rounded px-1 disabled:opacity-30">◀</button>
                        <button onClick={() => moveDeck(idx, 1)} disabled={idx === saveData.deck.length - 1} className="text-[8px] bg-gray-200 hover:bg-gray-300 rounded px-1 disabled:opacity-30">▶</button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={`slot-${idx}`} className="flex flex-col items-center justify-center rounded-xl border-4 border-dashed border-gray-300 bg-gray-50 p-1 h-24 md:h-28">
                    <span className="text-gray-300 text-2xl">+</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 所持ユニット一覧 */}
        <div className="w-full max-w-4xl">
          <h3 className="text-lg font-black text-gray-600 mb-3">所持ユニット</h3>
          <div className="bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] p-3 md:p-4">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {saveData.unlockedUnits.map(unitId => {
                const unit = PLAYER_UNITS[unitId];
                const inDeck = saveData.deck.includes(unitId);
                return (
                  <button
                    key={unitId}
                    onClick={() => inDeck ? removeFromDeck(unitId) : addToDeck(unitId)}
                    className={`relative flex flex-col items-center rounded-xl border-4 p-1 transition-all
                      ${inDeck
                        ? `${rarityBorder(unit.rarity)} ${rarityBg(unit.rarity)} opacity-50 shadow-none`
                        : `${rarityBorder(unit.rarity)} ${rarityBg(unit.rarity)} hover:scale-105 shadow-[2px_3px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none`
                      }
                    `}
                  >
                    <UnitIcon id={unit.id} size={45} animate={false} />
                    <p className="text-[8px] md:text-[9px] font-black truncate w-full text-center">{unit.name}</p>
                    <p className="text-[7px] md:text-[8px] text-gray-500 font-bold">Lv.{saveData.levels[unitId]}</p>
                    {inDeck && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                        <span className="bg-purple-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full border-2 border-black">出撃中</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
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
            <ChevronLeft strokeWidth={3} /> もどる
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
                  {isUnlocked ? <Play size={32} className="text-orange-500" fill="currentColor" /> : <Lock size={28} />}
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
            <ChevronLeft strokeWidth={3} /> もどる
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
            const form = getUnitForm(unitId, lv);
            const nextEvo = unit.evolutions ? unit.evolutions.find(e => lv < e.levelReq) : null;
            return (
              <div key={unit.id} className="bg-white border-4 border-black rounded-2xl p-3 md:p-4 shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl border-2 border-gray-300 flex items-center justify-center">
                      <UnitIcon id={form.drawId} size={50} animate={false} />
                    </div>
                    <div>
                      <h3 className="font-black text-base md:text-lg">{form.formName}
                        {form.form > 1 && <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${form.form === 3 ? 'bg-yellow-400 text-yellow-900' : 'bg-blue-400 text-white'}`}>{form.form === 3 ? '第3形態' : '第2形態'}</span>}
                      </h3>
                      <p className="text-xs md:text-sm font-bold text-gray-500">Lv. {lv} → <span className="text-blue-500">{lv + 1}</span></p>
                      {nextEvo && <p className="text-[10px] font-bold text-purple-500">Lv.{nextEvo.levelReq}で「{nextEvo.name}」に進化</p>}
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
              </div>
            );
          })}

          <div className="bg-yellow-50 border-4 border-black rounded-2xl p-4 flex items-center justify-between shadow-[4px_4px_0_rgba(0,0,0,0.2)] md:col-span-2 mt-4 md:mt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl border-2 border-black flex items-center justify-center text-3xl"><Shield className="text-orange-500" size={36} /></div>
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
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl border-2 border-black flex items-center justify-center text-3xl"><Zap className="text-blue-500" size={36} /></div>
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
            <ChevronLeft strokeWidth={3} /> もどる
          </button>
          <h2 className="text-2xl md:text-4xl font-black text-red-600 drop-shadow-[0_2px_0_rgba(0,0,0,0.2)] flex items-center gap-2"><Gift /> レアガチャ</h2>
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
            <h3 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-[0_4px_0_rgba(0,0,0,1)] text-white text-center" style={{ WebkitTextStroke: '2px black' }}>
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

  if (appState === 'encyclopedia') {
    const collected = new Set(saveData.collectedTreasures || []);
    const totalCount = TREASURES.length;
    const collectedCount = [...collected].filter(id => TREASURES.find(t => t.id === id)).length;

    // ステージごとにグループ化
    const stageGroups = STAGES.map(stage => ({
      stage,
      treasures: TREASURES.filter(t => t.stageId === stage.id)
    }));

    return (
      <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-b from-emerald-800 to-emerald-950 text-white font-sans select-none p-4 overflow-y-auto">
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setAppState('title')} className="px-4 py-2 bg-white text-black rounded-xl border-4 border-black font-black shadow-[0_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1">
              <ChevronLeft strokeWidth={3} size={18} /> もどる
            </button>
            <h2 className="text-3xl md:text-4xl font-black drop-shadow-[0_4px_0_rgba(0,0,0,1)]" style={{ WebkitTextStroke: '2px black' }}>
              お宝図鑑
            </h2>
            <div className="bg-white text-black px-3 py-1 rounded-xl border-4 border-black font-black text-sm shadow-[0_4px_0_rgba(0,0,0,1)]">
              {collectedCount}/{totalCount}
            </div>
          </div>

          {stageGroups.map(({ stage, treasures: stageTreasures }) => (
            <div key={stage.id} className="mb-6">
              <h3 className="text-xl md:text-2xl font-black mb-3 text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
                {stage.name}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {stageTreasures.map(t => {
                  const isCollected = collected.has(t.id);
                  const rarityBorder = t.rarity === 'legendary' ? 'border-yellow-400' : t.rarity === 'rare' ? 'border-blue-400' : 'border-gray-400';
                  const rarityBg = t.rarity === 'legendary' ? 'bg-gradient-to-b from-yellow-50 to-yellow-100' : t.rarity === 'rare' ? 'bg-gradient-to-b from-blue-50 to-blue-100' : 'bg-white';
                  const rarityLabel = t.rarity === 'legendary' ? '伝説' : t.rarity === 'rare' ? 'レア' : 'ノーマル';
                  const labelColor = t.rarity === 'legendary' ? 'text-yellow-600' : t.rarity === 'rare' ? 'text-blue-600' : 'text-gray-500';

                  return (
                    <div key={t.id} className={`${rarityBg} border-4 ${rarityBorder} rounded-2xl p-3 flex flex-col items-center text-black relative ${t.rarity === 'legendary' && isCollected ? 'shadow-[0_0_20px_rgba(255,215,0,0.4)]' : 'shadow-[3px_3px_0_rgba(0,0,0,0.3)]'}`}>
                      {isCollected ? (
                        <>
                          <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-2">
                            <TreasureIcon treasure={t} size={55} />
                          </div>
                          <p className="font-black text-[11px] md:text-xs text-center leading-tight mb-1">{t.name}</p>
                          <span className={`text-[9px] font-bold ${labelColor}`}>{rarityLabel}</span>
                          <p className="text-[9px] text-gray-500 text-center mt-1 leading-tight">{t.desc}</p>
                          {t.effect && (
                            <div className="mt-1 flex flex-wrap justify-center gap-1">
                              {t.effect.hpMul && <span className="text-[8px] bg-green-100 text-green-700 px-1 rounded font-bold">HP+{Math.round((t.effect.hpMul - 1) * 100)}%</span>}
                              {t.effect.atkMul && <span className="text-[8px] bg-red-100 text-red-700 px-1 rounded font-bold">ATK+{Math.round((t.effect.atkMul - 1) * 100)}%</span>}
                              {t.effect.spdMul && <span className="text-[8px] bg-blue-100 text-blue-700 px-1 rounded font-bold">SPD+{Math.round((t.effect.spdMul - 1) * 100)}%</span>}
                              {t.effect.cdMul && <span className="text-[8px] bg-purple-100 text-purple-700 px-1 rounded font-bold">CD-{Math.round((1 - t.effect.cdMul) * 100)}%</span>}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-2 opacity-30">
                            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                              <span className="text-2xl font-black text-gray-600">?</span>
                            </div>
                          </div>
                          <p className="font-black text-[11px] md:text-xs text-gray-400 text-center leading-tight mb-1">？？？</p>
                          <span className={`text-[9px] font-bold ${labelColor}`}>{rarityLabel}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (appState === 'result') {
    const isWin = finalResult.status === 'victory';
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-900 text-white font-sans select-none relative z-50 p-4">
        <h2 className={`text-6xl md:text-8xl font-black mb-6 drop-shadow-[0_8px_0_rgba(0,0,0,1)] text-center ${isWin ? 'text-yellow-400' : 'text-blue-500'}`} style={{ WebkitTextStroke: '3px black' }}>
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

          {/* お宝ドロップ表示 */}
          {finalResult.droppedTreasures && finalResult.droppedTreasures.length > 0 && (
            <>
              <div className="w-full border-t-4 border-dashed border-gray-300 my-3 md:my-4"></div>
              <span className="text-gray-500 text-lg md:text-xl font-black mb-2">獲得お宝</span>
              <div className="flex flex-wrap justify-center gap-3">
                {finalResult.droppedTreasures.map(t => (
                  <div key={t.id} className={`flex flex-col items-center p-2 rounded-xl border-3 ${t.rarity === 'legendary' ? 'border-yellow-400 bg-yellow-50 shadow-[0_0_15px_rgba(255,215,0,0.5)]' :
                    t.rarity === 'rare' ? 'border-blue-400 bg-blue-50' :
                      'border-gray-300 bg-gray-50'
                    }`}>
                    <TreasureIcon treasure={t} size={45} />
                    <span className={`text-[10px] font-black mt-1 ${t.rarity === 'legendary' ? 'text-yellow-600' :
                      t.rarity === 'rare' ? 'text-blue-600' : 'text-gray-600'
                      }`}>{t.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="w-full border-t-4 border-dashed border-gray-300 my-4 md:my-6"></div>

          <div className="flex flex-col items-center gap-1 md:gap-2 font-black text-lg md:text-xl">
            <p className="text-gray-500">所持XP: <span className="text-orange-500 text-2xl md:text-3xl">{saveData.xp.toLocaleString()}</span></p>
            <p className="text-gray-500">ネコ缶: <span className="text-red-500 text-2xl md:text-3xl">{saveData.catFood.toLocaleString()}</span></p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-10 md:mt-16 z-50 pointer-events-auto">
          <button onClick={() => stopEngineAndGoTo('title')} className="px-6 md:px-8 py-4 md:py-5 bg-gray-300 text-black hover:bg-gray-200 rounded-2xl text-xl md:text-2xl font-black border-4 border-black shadow-[0_8px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2">
            <ChevronLeft strokeWidth={3} /> メニュー
          </button>
          {isWin && currentStageIdx < STAGES.length - 1 && (
            <button onClick={() => startGame(currentStageIdx + 1)} className="px-6 md:px-10 py-4 md:py-5 bg-orange-500 text-white hover:bg-orange-400 rounded-2xl text-xl md:text-2xl font-black border-4 border-black shadow-[0_8px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2">
              次へ進む <ChevronRight strokeWidth={3} />
            </button>
          )}
          {(!isWin || currentStageIdx === STAGES.length - 1) && (
            <button onClick={() => startGame(currentStageIdx)} className="px-6 md:px-10 py-4 md:py-5 bg-blue-500 text-white hover:bg-blue-400 rounded-2xl text-xl md:text-2xl font-black border-4 border-black shadow-[0_8px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2">
              <RotateCcw strokeWidth={3} /> もう一度
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- プレイ画面 ---
  const moneyPercent = Math.min(100, (gameState.money / gameState.maxMoney) * 100);

  return (
    <div className="flex flex-col w-full bg-gray-900 h-[100dvh] font-sans select-none relative overflow-hidden">
      {gameState.bossSpawned && <div className="absolute inset-0 border-[12px] md:border-[16px] border-red-600 pointer-events-none z-50 opacity-50 animate-pulse rounded-sm"></div>}

      {/* ===== ヘッダー ===== */}
      <div className="w-full bg-gradient-to-b from-gray-800 to-gray-900 text-white px-2 md:px-4 pt-1 pb-1.5 md:pt-2 md:pb-2 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-b-4 border-yellow-500 shrink-0">

        {/* 上段: ステージ名 & 倍速コントロール & XP */}
        <div className="flex items-center justify-between mb-1 md:mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] md:text-sm font-black bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 md:px-3 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,0.5)] whitespace-nowrap truncate">
              {gameState.stageName}
            </span>
            <span className="text-yellow-400 text-xs md:text-base font-black flex items-center gap-1 whitespace-nowrap">
              <Sword size={12} strokeWidth={3} className="shrink-0" /> {gameState.sessionXp.toLocaleString()} <span className="text-gray-500 text-[8px] md:text-[10px]">XP</span>
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
            <button
              onClick={() => { if (engineRef.current) engineRef.current.togglePause(); }}
              className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg border-2 transition-all
                ${gameState.isPaused
                  ? 'bg-yellow-400 border-yellow-600 shadow-[0_2px_0_rgba(0,0,0,0.5)]'
                  : 'bg-gray-700 border-gray-500 shadow-[0_2px_0_rgba(0,0,0,0.5)] hover:bg-gray-600'}
                active:translate-y-0.5 active:shadow-none`}
            >
              {gameState.isPaused ? <Play size={16} strokeWidth={3} fill="black" className="text-black" /> : <Pause size={16} strokeWidth={3} className="text-white" />}
            </button>
            {[1, 2, 3, 5].map(s => (
              <button
                key={s}
                onClick={() => { if (engineRef.current) engineRef.current.setSpeed(s); }}
                className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg border-2 text-[10px] md:text-xs font-black transition-all
                  ${gameState.gameSpeed === s
                    ? 'bg-orange-500 border-orange-700 text-white shadow-[0_2px_0_rgba(0,0,0,0.5)]'
                    : 'bg-gray-700 border-gray-500 text-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.5)] hover:bg-gray-600'}
                  active:translate-y-0.5 active:shadow-none`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* 下段: お金 + 敵城HP + にゃんこ砲 */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* お金 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-sm md:text-lg font-black text-yellow-400 flex items-center gap-1 truncate">
                <Coins size={14} strokeWidth={3} className="shrink-0" /> {gameState.money}
                <span className="text-gray-500 text-[8px] md:text-[10px]">/{gameState.maxMoney}</span>
              </span>
              <span className="text-[8px] md:text-[10px] font-black bg-yellow-500 text-black px-1.5 py-0.5 rounded-full border border-yellow-700 whitespace-nowrap">
                Lv.{gameState.walletLevel}
              </span>
            </div>
            <div className="w-full bg-gray-700 h-2.5 md:h-3 rounded-full border border-gray-600 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 transition-all duration-100 rounded-full" style={{ width: `${moneyPercent}%` }}></div>
            </div>
          </div>

          {/* 敵城HP */}
          <div className="w-20 md:w-28 shrink-0">
            <div className="text-[8px] md:text-[10px] font-black text-red-400 text-center mb-0.5 flex items-center justify-center gap-0.5">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> 敵城
            </div>
            <div className="w-full bg-gray-700 h-2.5 md:h-3 rounded-full border border-gray-600 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300 rounded-full" style={{ width: `${gameState.baseHpPercent}%` }}></div>
            </div>
          </div>

          {/* にゃんこ砲 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[8px] md:text-[10px] text-cyan-400 font-black flex items-center gap-0.5 truncate"><Zap size={12} strokeWidth={3} className="shrink-0" /> にゃんこ砲</span>
              <span className={`text-[8px] md:text-[10px] font-black ${gameState.canFireCannon ? 'text-cyan-300 animate-pulse' : 'text-gray-400'}`}>
                {gameState.canFireCannon ? '発射可能！' : `${Math.floor(gameState.cannonPercent)}%`}
              </span>
            </div>
            <div className="w-full bg-gray-700 h-2.5 md:h-3 rounded-full border border-gray-600 overflow-hidden">
              <div className={`h-full transition-all duration-100 rounded-full ${gameState.canFireCannon ? 'bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse' : 'bg-gradient-to-r from-blue-700 to-blue-500'}`} style={{ width: `${gameState.cannonPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ゲーム画面 (Canvas) ===== */}
      <div className="w-full flex-1 bg-black relative flex items-center justify-center min-h-0 overflow-hidden">
        <canvas ref={canvasRef} width={1000} height={450} className="w-full h-full block cursor-grab active:cursor-grabbing" style={{ touchAction: 'none', objectFit: 'contain' }} />
        {/* 一時停止オーバーレイ */}
        {gameState.isPaused && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30 cursor-pointer" onClick={() => { if (engineRef.current) engineRef.current.togglePause(); }}>
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              <Play size={50} className="text-white ml-2" fill="white" />
            </div>
            <span className="text-white text-2xl md:text-4xl font-black mt-6 drop-shadow-[0_4px_0_rgba(0,0,0,1)]" style={{ WebkitTextStroke: '2px black' }}>一時停止中</span>
            <span className="text-gray-300 text-xs md:text-sm mt-2 font-bold">タップで再開</span>
          </div>
        )}
        {/* 倍速インジケーター */}
        {gameState.gameSpeed > 1 && !gameState.isPaused && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs md:text-sm font-black px-2.5 py-1 rounded-lg border-2 border-orange-700 shadow-[2px_2px_0_rgba(0,0,0,0.5)] z-20 flex items-center gap-1">
            <FastForward size={14} strokeWidth={3} /> {gameState.gameSpeed}x
          </div>
        )}
      </div>

      {/* ===== コントロールパネル ===== */}
      <div className="w-full bg-gradient-to-t from-gray-800 to-gray-900 px-2 md:px-3 py-2 md:py-3 flex gap-2 md:gap-3 border-t-4 border-yellow-500 z-10 shrink-0" style={{ height: 'clamp(130px, 22vh, 200px)' }}>

        {/* 左側: 働きネコ & にゃんこ砲 */}
        <div className="flex flex-col gap-1.5 md:gap-2 shrink-0 w-20 md:w-24">
          <button
            onClick={() => { if (engineRef.current) engineRef.current.upgradeWallet(); }}
            disabled={gameState.status !== 'playing' || gameState.walletCost === null || gameState.money < gameState.walletCost}
            className="flex-1 flex flex-col items-center justify-center rounded-xl border-3 md:border-4 border-black transition-all p-1
              bg-gradient-to-b from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 shadow-[0_4px_0_#166534] active:translate-y-1 active:shadow-none disabled:from-gray-500 disabled:to-gray-600 disabled:shadow-none disabled:border-gray-600"
          >
            <span className="text-[9px] md:text-[11px] font-black text-black leading-none">働きネコ</span>
            <span className="text-[8px] md:text-[10px] font-black text-black leading-none">UP</span>
            {gameState.walletCost
              ? <span className="text-white text-[8px] md:text-[10px] font-black bg-black/70 px-1.5 rounded-full mt-0.5">{gameState.walletCost}円</span>
              : <span className="text-yellow-300 font-black text-[9px] md:text-[10px] mt-0.5">MAX</span>}
          </button>

          <button
            onClick={() => { if (engineRef.current) engineRef.current.fireCannon(); }}
            disabled={gameState.status !== 'playing' || !gameState.canFireCannon}
            className={`flex-1 flex flex-col items-center justify-center rounded-xl border-3 md:border-4 border-black transition-all p-1
              ${gameState.canFireCannon
                ? 'bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_4px_0_#1e3a5f] active:translate-y-1 active:shadow-none'
                : 'bg-gradient-to-b from-gray-500 to-gray-600 shadow-none border-gray-600'}
            `}
          >
            <Zap size={18} className={gameState.canFireCannon ? 'text-yellow-300 fill-current animate-bounce' : 'text-gray-400'} strokeWidth={3} />
            <span className={`text-[8px] md:text-[10px] font-black mt-0.5 leading-none ${gameState.canFireCannon ? 'text-white' : 'text-gray-400'}`}>にゃんこ砲</span>
          </button>
        </div>

        {/* 右側: 出撃パネル */}
        <div className="flex-grow overflow-x-auto custom-scrollbar bg-gray-800/50 rounded-xl border-2 md:border-3 border-gray-600 p-1 md:p-1.5 min-w-0">
          <div className="grid grid-rows-2 grid-flow-col gap-1 md:gap-1.5 h-full min-w-max">
            {saveData.deck.map(unitId => {
              const unit = PLAYER_UNITS[unitId];
              const lv = saveData.levels[unitId] || 1;
              const form = getUnitForm(unitId, lv);
              const currentCooldown = gameState.cooldowns[unit.id] || 0;
              const cooldownPercent = (currentCooldown / unit.cooldown) * 100;
              const isAffordable = gameState.money >= unit.cost;
              const isCoolingDown = currentCooldown > 0;
              const canSpawn = isAffordable && !isCoolingDown && gameState.status === 'playing';

              const rarityGlow = unit.rarity === 'legend' ? 'shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                : unit.rarity === 'uber' ? 'shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  : unit.rarity === 'super' ? 'shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                    : '';
              const rarityBorderActive = unit.rarity === 'legend' ? 'border-purple-400'
                : unit.rarity === 'uber' ? 'border-red-400'
                  : unit.rarity === 'super' ? 'border-blue-400'
                    : 'border-gray-400';

              return (
                <button
                  key={unit.id}
                  onClick={() => { if (engineRef.current) engineRef.current.spawnPlayer(unit.id); }}
                  disabled={!canSpawn}
                  className={`relative flex flex-col items-center justify-center rounded-lg border-2 md:border-3 w-16 md:w-20 h-full overflow-hidden transition-all
                    ${canSpawn
                      ? `bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 ${rarityBorderActive} ${rarityGlow} active:scale-95`
                      : 'bg-gray-700 border-gray-600 shadow-none'}
                  `}
                >
                  <div className={`flex justify-center items-center w-full flex-1 transition-transform ${canSpawn ? 'scale-100' : 'scale-75 opacity-40'}`}>
                    <UnitIcon id={form.drawId} size={42} animate={canSpawn} />
                  </div>

                  <div className={`w-full text-[8px] md:text-[9px] font-black text-center py-0.5 z-30 rounded-b-md
                    ${canSpawn
                      ? (!isAffordable ? 'bg-red-600 text-red-200' : 'bg-black/80 text-white')
                      : 'bg-black/60 text-gray-400'}`}>
                    {form.cost || unit.cost}円
                  </div>

                  <div className={`absolute top-0 right-0 text-[7px] md:text-[8px] font-black px-1 rounded-bl-md z-30 ${canSpawn ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-gray-400'}`}>
                    {lv}
                  </div>

                  {isCoolingDown && (
                    <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-end overflow-hidden rounded-lg">
                      <div className="w-full bg-yellow-400/30 transition-all" style={{ height: `${cooldownPercent}%` }}></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fBBF24; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #F59E0B; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #fBBF24 transparent; }
      `}
      </style>
    </div>
  );
}