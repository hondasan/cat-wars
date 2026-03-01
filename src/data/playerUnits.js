// キャラクター大幅追加 (伝説レア含む全25種)
export const PLAYER_UNITS = {
    // 基本
    basic: { id: 'basic', name: 'ネコ', cost: 50, hp: 100, attack: 15, range: 40, speed: -1.5, cooldown: 2000, size: 30, kb: 3, attackFreq: 1000, area: false, baseUpgradeCost: 100, rarity: 'basic', icon: 'ネコ' },
    tank: { id: 'tank', name: 'タンクネコ', cost: 150, hp: 500, attack: 10, range: 40, speed: -0.8, cooldown: 5000, size: 45, kb: 1, attackFreq: 1500, area: false, baseUpgradeCost: 200, rarity: 'basic', icon: 'タンク' },
    battle: { id: 'battle', name: 'バトルネコ', cost: 200, hp: 200, attack: 30, range: 45, speed: -1.4, cooldown: 3500, size: 35, kb: 3, attackFreq: 800, area: false, baseUpgradeCost: 300, rarity: 'basic', icon: 'バトル' },
    ranged: { id: 'ranged', name: 'キモネコ', cost: 300, hp: 80, attack: 40, range: 200, speed: -1.2, cooldown: 6000, size: 40, kb: 3, attackFreq: 2000, area: false, baseUpgradeCost: 500, rarity: 'basic', icon: 'キモ' },
    cow: { id: 'cow', name: 'ウシネコ', cost: 400, hp: 250, attack: 15, range: 40, speed: -3.5, cooldown: 4000, size: 45, kb: 5, attackFreq: 300, area: false, baseUpgradeCost: 800, rarity: 'basic', icon: 'ウシ' },
    titan: { id: 'titan', name: '巨神ネコ', cost: 1000, hp: 1500, attack: 120, range: 100, speed: -0.6, cooldown: 15000, size: 80, kb: 1, attackFreq: 2500, area: true, baseUpgradeCost: 2000, rarity: 'basic', icon: '巨神' },
    // レア
    ninja: { id: 'ninja', name: '忍者ネコ', cost: 300, hp: 250, attack: 60, range: 40, speed: -2.5, cooldown: 2500, size: 30, kb: 3, attackFreq: 600, area: false, baseUpgradeCost: 600, rarity: 'rare', icon: '忍者' },
    zombie: { id: 'zombie', name: 'ゾンビネコ', cost: 450, hp: 800, attack: 20, range: 40, speed: -0.5, cooldown: 4000, size: 35, kb: 1, attackFreq: 2000, area: false, baseUpgradeCost: 700, rarity: 'rare', icon: 'ゾンビ' },
    pirate: { id: 'pirate', name: 'ネコ海賊', cost: 500, hp: 300, attack: 40, range: 120, speed: -1.0, cooldown: 5000, size: 40, kb: 3, attackFreq: 1500, area: false, baseUpgradeCost: 800, rarity: 'rare', icon: '海賊' },
    thief: { id: 'thief', name: 'ネコ泥棒', cost: 250, hp: 150, attack: 25, range: 40, speed: -3.0, cooldown: 2000, size: 30, kb: 5, attackFreq: 800, area: false, baseUpgradeCost: 500, rarity: 'rare', icon: '泥棒' },
    beauty: { id: 'beauty', name: 'ネコエステ', cost: 600, hp: 400, attack: 150, range: 250, speed: -1.2, cooldown: 5000, size: 45, kb: 3, attackFreq: 2500, area: true, baseUpgradeCost: 1000, rarity: 'rare', icon: '美脚' },
    jura: { id: 'jura', name: 'ネコジュラ', cost: 400, hp: 500, attack: 180, range: 50, speed: -1.5, cooldown: 3000, size: 35, kb: 3, attackFreq: 1200, area: false, baseUpgradeCost: 900, rarity: 'rare', icon: '恐竜' },
    // 激レア
    hacker: { id: 'hacker', name: 'ネコハッカー', cost: 1500, hp: 200, attack: 200, range: 400, speed: -0.4, cooldown: 20000, size: 50, kb: 1, attackFreq: 5000, area: true, baseUpgradeCost: 2500, rarity: 'super', icon: 'ハッカ' },
    apple: { id: 'apple', name: 'ネコリンゴ', cost: 800, hp: 600, attack: 80, range: 60, speed: -1.2, cooldown: 8000, size: 45, kb: 3, attackFreq: 1000, area: true, baseUpgradeCost: 1500, rarity: 'super', icon: 'リンゴ' },
    swimmer: { id: 'swimmer', name: 'ネコスイマー', cost: 1200, hp: 400, attack: 300, range: 50, speed: -4.0, cooldown: 12000, size: 40, kb: 5, attackFreq: 2000, area: false, baseUpgradeCost: 2000, rarity: 'super', icon: 'スイマ' },
    otaku: { id: 'otaku', name: 'オタクネコ', cost: 1200, hp: 150, attack: 100, range: 450, speed: -0.5, cooldown: 18000, size: 40, kb: 1, attackFreq: 4000, area: true, baseUpgradeCost: 2000, rarity: 'super', icon: 'ヲタ' },
    skate: { id: 'skate', name: 'ネコスケーター', cost: 900, hp: 700, attack: 120, range: 150, speed: -3.0, cooldown: 6000, size: 35, kb: 4, attackFreq: 1500, area: false, baseUpgradeCost: 1800, rarity: 'super', icon: '氷滑' },
    // 超激レア
    valkyrie: { id: 'valkyrie', name: 'ヴァルキリー', cost: 3000, hp: 2500, attack: 400, range: 250, speed: -2.0, cooldown: 25000, size: 60, kb: 2, attackFreq: 2500, area: true, baseUpgradeCost: 5000, rarity: 'uber', icon: '神槍' },
    bahamut: { id: 'bahamut', name: 'ネコムート', cost: 4500, hp: 5000, attack: 2000, range: 350, speed: -0.5, cooldown: 40000, size: 90, kb: 1, attackFreq: 8000, area: true, baseUpgradeCost: 8000, rarity: 'uber', icon: '竜王' },
    zeus: { id: 'zeus', name: '神さま', cost: 6000, hp: 8000, attack: 1500, range: 300, speed: -0.8, cooldown: 50000, size: 80, kb: 3, attackFreq: 5000, area: true, baseUpgradeCost: 10000, rarity: 'uber', icon: '全能' },
    machine: { id: 'machine', name: 'ネコマシン', cost: 3600, hp: 12000, attack: 1000, range: 60, speed: -0.6, cooldown: 30000, size: 85, kb: 1, attackFreq: 4000, area: true, baseUpgradeCost: 6000, rarity: 'uber', icon: '鉄機' },
    megalo: { id: 'megalo', name: 'メガロ', cost: 4200, hp: 3000, attack: 1800, range: 450, speed: -1.0, cooldown: 35000, size: 70, kb: 3, attackFreq: 6000, area: true, baseUpgradeCost: 7000, rarity: 'uber', icon: '超弓' },
    gaou: { id: 'gaou', name: '皇獣ガオウ', cost: 4800, hp: 6000, attack: 2500, range: 380, speed: -0.8, cooldown: 45000, size: 85, kb: 3, attackFreq: 5000, area: true, baseUpgradeCost: 9000, rarity: 'uber', icon: '皇獣' },
    amaterasu: { id: 'amaterasu', name: 'アマテラス', cost: 4400, hp: 4500, attack: 1800, range: 400, speed: -1.2, cooldown: 40000, size: 75, kb: 4, attackFreq: 6000, area: true, baseUpgradeCost: 8500, rarity: 'uber', icon: '天照' },
    // 伝説レア
    creator: { id: 'creator', name: '創造神ガイア', cost: 6500, hp: 15000, attack: 5000, range: 400, speed: -0.8, cooldown: 60000, size: 80, kb: 3, attackFreq: 6000, area: true, baseUpgradeCost: 15000, rarity: 'legend', icon: '創造' },
    ushiwaka: { id: 'ushiwaka', name: '牛若丸', cost: 1500, hp: 3000, attack: 1500, range: 250, speed: -2.5, cooldown: 15000, size: 45, kb: 5, attackFreq: 1500, area: true, baseUpgradeCost: 8000, rarity: 'legend', icon: '牛若' },
    momoko: { id: 'momoko', name: 'モモコ', cost: 3800, hp: 4000, attack: 1200, range: 300, speed: -2.5, cooldown: 25000, size: 50, kb: 5, attackFreq: 3000, area: true, baseUpgradeCost: 12000, rarity: 'legend', icon: '桃娘' }
};
