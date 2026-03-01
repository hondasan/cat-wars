// キャラクター定義 (進化形態対応・全種)
// evolutions: [{form: 2, name, levelReq, cost/hp/attack等の差分}]
// GameEngine側でlevelに応じたformを取得し、ステータスを上書きする

export const PLAYER_UNITS = {
    // ======== 基本ネコ (6体) ========
    basic: {
        id: 'basic', name: 'ネコ', cost: 50, hp: 100, attack: 15, range: 40, speed: -1.5, cooldown: 2000, size: 30, kb: 3, attackFreq: 1000, area: false, baseUpgradeCost: 100, rarity: 'basic', evolutions: [
            { form: 2, name: 'モヒカンネコ', levelReq: 10, hp: 200, attack: 30, size: 35 },
            { form: 3, name: 'ネコキング', levelReq: 25, hp: 400, attack: 60, size: 40, range: 50, area: true }
        ]
    },
    tank: {
        id: 'tank', name: 'タンクネコ', cost: 150, hp: 500, attack: 10, range: 40, speed: -0.8, cooldown: 5000, size: 45, kb: 1, attackFreq: 1500, area: false, baseUpgradeCost: 200, rarity: 'basic', evolutions: [
            { form: 2, name: 'ゴムネコ', levelReq: 10, hp: 1000, attack: 15, size: 50 },
            { form: 3, name: 'ネコカベ', levelReq: 25, hp: 2000, attack: 30, size: 55, kb: 2 }
        ]
    },
    battle: {
        id: 'battle', name: 'バトルネコ', cost: 200, hp: 200, attack: 30, range: 45, speed: -1.4, cooldown: 3500, size: 35, kb: 3, attackFreq: 800, area: false, baseUpgradeCost: 300, rarity: 'basic', evolutions: [
            { form: 2, name: 'アタッカーネコ', levelReq: 10, hp: 400, attack: 65, size: 40 },
            { form: 3, name: 'ドラゴンスレイヤー', levelReq: 25, hp: 800, attack: 130, size: 50, area: true }
        ]
    },
    ranged: {
        id: 'ranged', name: 'キモネコ', cost: 300, hp: 80, attack: 40, range: 200, speed: -1.2, cooldown: 6000, size: 40, kb: 3, attackFreq: 2000, area: false, baseUpgradeCost: 500, rarity: 'basic', evolutions: [
            { form: 2, name: 'ムキアシネコ', levelReq: 10, hp: 160, attack: 80, range: 250, size: 45 },
            { form: 3, name: 'ネコレッグ', levelReq: 25, hp: 300, attack: 160, range: 300, size: 50, area: true }
        ]
    },
    cow: {
        id: 'cow', name: 'ウシネコ', cost: 400, hp: 250, attack: 15, range: 40, speed: -3.5, cooldown: 4000, size: 45, kb: 5, attackFreq: 300, area: false, baseUpgradeCost: 800, rarity: 'basic', evolutions: [
            { form: 2, name: '闘牛ネコ', levelReq: 10, hp: 500, attack: 30, speed: -4.0, size: 50 },
            { form: 3, name: '暴走ネコ', levelReq: 25, hp: 1000, attack: 60, speed: -5.0, size: 55, area: true }
        ]
    },
    titan: {
        id: 'titan', name: '巨神ネコ', cost: 1000, hp: 1500, attack: 120, range: 100, speed: -0.6, cooldown: 15000, size: 80, kb: 1, attackFreq: 2500, area: true, baseUpgradeCost: 2000, rarity: 'basic', evolutions: [
            { form: 2, name: '巨神ネコ改', levelReq: 10, hp: 3000, attack: 250, size: 90 },
            { form: 3, name: '覚醒巨神ネコ', levelReq: 25, hp: 6000, attack: 500, size: 100, range: 130 }
        ]
    },

    // ======== レア (8体) ========
    ninja: {
        id: 'ninja', name: '忍者ネコ', cost: 300, hp: 250, attack: 60, range: 40, speed: -2.5, cooldown: 2500, size: 30, kb: 3, attackFreq: 600, area: false, baseUpgradeCost: 600, rarity: 'rare', evolutions: [
            { form: 2, name: '影忍者ネコ', levelReq: 10, hp: 500, attack: 120, speed: -3.0, size: 35 },
            { form: 3, name: '暗殺者ネコ', levelReq: 25, hp: 1000, attack: 250, speed: -3.5, size: 40, area: true }
        ]
    },
    zombie: {
        id: 'zombie', name: 'ゾンビネコ', cost: 450, hp: 800, attack: 20, range: 40, speed: -0.5, cooldown: 4000, size: 35, kb: 1, attackFreq: 2000, area: false, baseUpgradeCost: 700, rarity: 'rare', evolutions: [
            { form: 2, name: 'グールネコ', levelReq: 10, hp: 1600, attack: 40, size: 40 },
            { form: 3, name: 'リッチネコ', levelReq: 25, hp: 3200, attack: 80, size: 50, area: true }
        ]
    },
    pirate: {
        id: 'pirate', name: 'ネコ海賊', cost: 500, hp: 300, attack: 40, range: 120, speed: -1.0, cooldown: 5000, size: 40, kb: 3, attackFreq: 1500, area: false, baseUpgradeCost: 800, rarity: 'rare', evolutions: [
            { form: 2, name: 'ネコ船長', levelReq: 10, hp: 600, attack: 80, range: 150, size: 45 },
            { form: 3, name: '海賊王ネコ', levelReq: 25, hp: 1200, attack: 160, range: 180, size: 55, area: true }
        ]
    },
    thief: {
        id: 'thief', name: 'ネコ泥棒', cost: 250, hp: 150, attack: 25, range: 40, speed: -3.0, cooldown: 2000, size: 30, kb: 5, attackFreq: 800, area: false, baseUpgradeCost: 500, rarity: 'rare', evolutions: [
            { form: 2, name: 'ネコ怪盗', levelReq: 10, hp: 300, attack: 50, speed: -3.5, size: 35 },
            { form: 3, name: 'ファントムネコ', levelReq: 25, hp: 600, attack: 100, speed: -4.0, size: 40 }
        ]
    },
    beauty: {
        id: 'beauty', name: 'ネコエステ', cost: 600, hp: 400, attack: 150, range: 250, speed: -1.2, cooldown: 5000, size: 45, kb: 3, attackFreq: 2500, area: true, baseUpgradeCost: 1000, rarity: 'rare', evolutions: [
            { form: 2, name: 'ネコモデル', levelReq: 10, hp: 800, attack: 300, range: 280, size: 50 },
            { form: 3, name: 'ネコクイーン', levelReq: 25, hp: 1600, attack: 600, range: 320, size: 55 }
        ]
    },
    jura: {
        id: 'jura', name: 'ネコジュラ', cost: 400, hp: 500, attack: 180, range: 50, speed: -1.5, cooldown: 3000, size: 35, kb: 3, attackFreq: 1200, area: false, baseUpgradeCost: 900, rarity: 'rare', evolutions: [
            { form: 2, name: 'ネコティラノ', levelReq: 10, hp: 1000, attack: 360, size: 45 },
            { form: 3, name: 'ネコレックス', levelReq: 25, hp: 2000, attack: 700, size: 55, area: true }
        ]
    },
    // 新キャラ
    witch: {
        id: 'witch', name: 'ネコ魔女', cost: 350, hp: 200, attack: 55, range: 180, speed: -1.0, cooldown: 4000, size: 35, kb: 3, attackFreq: 1800, area: true, baseUpgradeCost: 700, rarity: 'rare', evolutions: [
            { form: 2, name: 'ネコ魔導師', levelReq: 10, hp: 400, attack: 110, range: 220, size: 40 },
            { form: 3, name: '大魔王ネコ', levelReq: 25, hp: 800, attack: 220, range: 260, size: 50 }
        ]
    },
    archer: {
        id: 'archer', name: 'ネコ射手', cost: 280, hp: 180, attack: 45, range: 200, speed: -1.3, cooldown: 3500, size: 30, kb: 3, attackFreq: 1400, area: false, baseUpgradeCost: 600, rarity: 'rare', evolutions: [
            { form: 2, name: 'ネコスナイパー', levelReq: 10, hp: 360, attack: 90, range: 250, size: 35 },
            { form: 3, name: 'ネコ弓聖', levelReq: 25, hp: 700, attack: 180, range: 320, size: 40, area: true }
        ]
    },

    // ======== 激レア (7体) ========
    hacker: {
        id: 'hacker', name: 'ネコハッカー', cost: 1500, hp: 200, attack: 200, range: 400, speed: -0.4, cooldown: 20000, size: 50, kb: 1, attackFreq: 5000, area: true, baseUpgradeCost: 2500, rarity: 'super', evolutions: [
            { form: 2, name: 'ネコAI', levelReq: 10, hp: 400, attack: 400, range: 450, size: 55 },
            { form: 3, name: 'ネコシンギュラリティ', levelReq: 25, hp: 800, attack: 800, range: 500, size: 60 }
        ]
    },
    apple: {
        id: 'apple', name: 'ネコリンゴ', cost: 800, hp: 600, attack: 80, range: 60, speed: -1.2, cooldown: 8000, size: 45, kb: 3, attackFreq: 1000, area: true, baseUpgradeCost: 1500, rarity: 'super', evolutions: [
            { form: 2, name: 'ネコフルーツ', levelReq: 10, hp: 1200, attack: 160, size: 50 },
            { form: 3, name: 'ネコエデン', levelReq: 25, hp: 2400, attack: 320, range: 80, size: 60 }
        ]
    },
    swimmer: {
        id: 'swimmer', name: 'ネコスイマー', cost: 1200, hp: 400, attack: 300, range: 50, speed: -4.0, cooldown: 12000, size: 40, kb: 5, attackFreq: 2000, area: false, baseUpgradeCost: 2000, rarity: 'super', evolutions: [
            { form: 2, name: 'ネコダイバー', levelReq: 10, hp: 800, attack: 600, speed: -4.5, size: 45 },
            { form: 3, name: 'ネコ大海王', levelReq: 25, hp: 1600, attack: 1200, speed: -5.0, size: 55, area: true }
        ]
    },
    otaku: {
        id: 'otaku', name: 'オタクネコ', cost: 1200, hp: 150, attack: 100, range: 450, speed: -0.5, cooldown: 18000, size: 40, kb: 1, attackFreq: 4000, area: true, baseUpgradeCost: 2000, rarity: 'super', evolutions: [
            { form: 2, name: 'メガオタクネコ', levelReq: 10, hp: 300, attack: 200, range: 480, size: 45 },
            { form: 3, name: 'ネコ配信者', levelReq: 25, hp: 600, attack: 400, range: 520, size: 50 }
        ]
    },
    skate: {
        id: 'skate', name: 'ネコスケーター', cost: 900, hp: 700, attack: 120, range: 150, speed: -3.0, cooldown: 6000, size: 35, kb: 4, attackFreq: 1500, area: false, baseUpgradeCost: 1800, rarity: 'super', evolutions: [
            { form: 2, name: 'ネコボーダー', levelReq: 10, hp: 1400, attack: 240, range: 170, size: 40 },
            { form: 3, name: 'ネコプロライダー', levelReq: 25, hp: 2800, attack: 480, range: 200, size: 50, area: true }
        ]
    },
    // 新キャラ
    angel: {
        id: 'angel', name: 'ネコエンジェル', cost: 1000, hp: 800, attack: 100, range: 200, speed: -1.5, cooldown: 10000, size: 45, kb: 3, attackFreq: 2000, area: true, baseUpgradeCost: 1800, rarity: 'super', evolutions: [
            { form: 2, name: 'ネコ大天使', levelReq: 10, hp: 1600, attack: 200, range: 250, size: 50 },
            { form: 3, name: 'ネコセラフィム', levelReq: 25, hp: 3200, attack: 400, range: 300, size: 60 }
        ]
    },
    samurai: {
        id: 'samurai', name: 'ネコサムライ', cost: 1100, hp: 900, attack: 250, range: 60, speed: -2.0, cooldown: 8000, size: 40, kb: 2, attackFreq: 1200, area: false, baseUpgradeCost: 2000, rarity: 'super', evolutions: [
            { form: 2, name: 'ネコ武将', levelReq: 10, hp: 1800, attack: 500, range: 70, size: 50 },
            { form: 3, name: 'ネコ将軍', levelReq: 25, hp: 3600, attack: 1000, range: 80, size: 60, area: true }
        ]
    },

    // ======== 超激レア (9体) ========
    valkyrie: {
        id: 'valkyrie', name: 'ヴァルキリー', cost: 3000, hp: 2500, attack: 400, range: 250, speed: -2.0, cooldown: 25000, size: 60, kb: 2, attackFreq: 2500, area: true, baseUpgradeCost: 5000, rarity: 'uber', evolutions: [
            { form: 2, name: '聖戦ヴァルキリー', levelReq: 10, hp: 5000, attack: 800, range: 280, size: 65 },
            { form: 3, name: '覚醒ヴァルキリー', levelReq: 25, hp: 10000, attack: 1600, range: 320, size: 75 }
        ]
    },
    bahamut: {
        id: 'bahamut', name: 'ネコムート', cost: 4500, hp: 5000, attack: 2000, range: 350, speed: -0.5, cooldown: 40000, size: 90, kb: 1, attackFreq: 8000, area: true, baseUpgradeCost: 8000, rarity: 'uber', evolutions: [
            { form: 2, name: '覚醒ムート', levelReq: 10, hp: 10000, attack: 4000, range: 380, size: 95 },
            { form: 3, name: '真・ネコムート', levelReq: 25, hp: 20000, attack: 8000, speed: -1.5, range: 400, size: 100 }
        ]
    },
    zeus: {
        id: 'zeus', name: '神さま', cost: 6000, hp: 8000, attack: 1500, range: 300, speed: -0.8, cooldown: 50000, size: 80, kb: 3, attackFreq: 5000, area: true, baseUpgradeCost: 10000, rarity: 'uber', evolutions: [
            { form: 2, name: '雷神ゼウス', levelReq: 10, hp: 16000, attack: 3000, range: 330, size: 85 },
            { form: 3, name: '全能神ゼウス', levelReq: 25, hp: 32000, attack: 6000, range: 380, size: 95 }
        ]
    },
    machine: {
        id: 'machine', name: 'ネコマシン', cost: 3600, hp: 12000, attack: 1000, range: 60, speed: -0.6, cooldown: 30000, size: 85, kb: 1, attackFreq: 4000, area: true, baseUpgradeCost: 6000, rarity: 'uber', evolutions: [
            { form: 2, name: 'ネコマシンMk-II', levelReq: 10, hp: 24000, attack: 2000, range: 80, size: 90 },
            { form: 3, name: 'ネコマシンMk-III', levelReq: 25, hp: 48000, attack: 4000, range: 100, size: 100 }
        ]
    },
    megalo: {
        id: 'megalo', name: 'メガロ', cost: 4200, hp: 3000, attack: 1800, range: 450, speed: -1.0, cooldown: 35000, size: 70, kb: 3, attackFreq: 6000, area: true, baseUpgradeCost: 7000, rarity: 'uber', evolutions: [
            { form: 2, name: 'メガロス', levelReq: 10, hp: 6000, attack: 3600, range: 480, size: 75 },
            { form: 3, name: 'メガロドン', levelReq: 25, hp: 12000, attack: 7200, range: 520, size: 85 }
        ]
    },
    gaou: {
        id: 'gaou', name: '皇獣ガオウ', cost: 4800, hp: 6000, attack: 2500, range: 380, speed: -0.8, cooldown: 45000, size: 85, kb: 3, attackFreq: 5000, area: true, baseUpgradeCost: 9000, rarity: 'uber', evolutions: [
            { form: 2, name: '魔皇ガオウ', levelReq: 10, hp: 12000, attack: 5000, range: 400, size: 90 },
            { form: 3, name: '超獣ガオウ', levelReq: 25, hp: 24000, attack: 10000, range: 450, size: 100 }
        ]
    },
    amaterasu: {
        id: 'amaterasu', name: 'アマテラス', cost: 4400, hp: 4500, attack: 1800, range: 400, speed: -1.2, cooldown: 40000, size: 75, kb: 4, attackFreq: 6000, area: true, baseUpgradeCost: 8500, rarity: 'uber', evolutions: [
            { form: 2, name: '天照大神', levelReq: 10, hp: 9000, attack: 3600, range: 430, size: 80 },
            { form: 3, name: '太陽神アマテラス', levelReq: 25, hp: 18000, attack: 7200, range: 480, size: 90 }
        ]
    },
    // 新キャラ
    dragon: {
        id: 'dragon', name: 'ネコドラゴン', cost: 3500, hp: 7000, attack: 1200, range: 200, speed: -1.0, cooldown: 28000, size: 80, kb: 2, attackFreq: 3000, area: true, baseUpgradeCost: 6000, rarity: 'uber', evolutions: [
            { form: 2, name: '黒龍ネコ', levelReq: 10, hp: 14000, attack: 2400, range: 240, size: 85 },
            { form: 3, name: '究極龍ネコ', levelReq: 25, hp: 28000, attack: 4800, range: 280, size: 95 }
        ]
    },
    ice: {
        id: 'ice', name: 'ネコ氷結', cost: 3800, hp: 5000, attack: 1500, range: 320, speed: -0.7, cooldown: 32000, size: 70, kb: 2, attackFreq: 4000, area: true, baseUpgradeCost: 7000, rarity: 'uber', evolutions: [
            { form: 2, name: 'ネコブリザード', levelReq: 10, hp: 10000, attack: 3000, range: 350, size: 75 },
            { form: 3, name: '絶対零度ネコ', levelReq: 25, hp: 20000, attack: 6000, range: 400, size: 85 }
        ]
    },

    // ======== 伝説レア (5体) ========
    creator: {
        id: 'creator', name: '創造神ガイア', cost: 6500, hp: 15000, attack: 5000, range: 400, speed: -0.8, cooldown: 60000, size: 80, kb: 3, attackFreq: 6000, area: true, baseUpgradeCost: 15000, rarity: 'legend', evolutions: [
            { form: 2, name: '超創造神ガイア', levelReq: 10, hp: 30000, attack: 10000, range: 430, size: 90 },
            { form: 3, name: '至高創造神ガイア', levelReq: 25, hp: 60000, attack: 20000, range: 480, size: 100 }
        ]
    },
    ushiwaka: {
        id: 'ushiwaka', name: '牛若丸', cost: 1500, hp: 3000, attack: 1500, range: 250, speed: -2.5, cooldown: 15000, size: 45, kb: 5, attackFreq: 1500, area: true, baseUpgradeCost: 8000, rarity: 'legend', evolutions: [
            { form: 2, name: '源義経', levelReq: 10, hp: 6000, attack: 3000, range: 280, speed: -3.0, size: 50 },
            { form: 3, name: '伝説の義経', levelReq: 25, hp: 12000, attack: 6000, range: 320, speed: -3.5, size: 60 }
        ]
    },
    momoko: {
        id: 'momoko', name: 'モモコ', cost: 3800, hp: 4000, attack: 1200, range: 300, speed: -2.5, cooldown: 25000, size: 50, kb: 5, attackFreq: 3000, area: true, baseUpgradeCost: 12000, rarity: 'legend', evolutions: [
            { form: 2, name: 'モモタロウ', levelReq: 10, hp: 8000, attack: 2400, range: 330, size: 55 },
            { form: 3, name: '最強桃太郎', levelReq: 25, hp: 16000, attack: 4800, range: 380, size: 65 }
        ]
    },
    // 新キャラ
    chaos: {
        id: 'chaos', name: '混沌の支配者', cost: 7000, hp: 20000, attack: 6000, range: 380, speed: -0.6, cooldown: 65000, size: 90, kb: 2, attackFreq: 7000, area: true, baseUpgradeCost: 18000, rarity: 'legend', evolutions: [
            { form: 2, name: '無限の混沌', levelReq: 10, hp: 40000, attack: 12000, range: 420, size: 95 },
            { form: 3, name: '終焉の混沌王', levelReq: 25, hp: 80000, attack: 24000, range: 480, size: 105 }
        ]
    },
    phoenix: {
        id: 'phoenix', name: '不死鳥ネコ', cost: 5500, hp: 10000, attack: 3500, range: 350, speed: -1.5, cooldown: 45000, size: 70, kb: 4, attackFreq: 4000, area: true, baseUpgradeCost: 14000, rarity: 'legend', evolutions: [
            { form: 2, name: '火焔鳳凰ネコ', levelReq: 10, hp: 20000, attack: 7000, range: 380, size: 80 },
            { form: 3, name: '永遠の不死鳥', levelReq: 25, hp: 40000, attack: 14000, range: 420, size: 90 }
        ]
    }
};

// ユーティリティ: IDとレベルから現在の形態情報を取得
export const getUnitForm = (unitId, level) => {
    const base = PLAYER_UNITS[unitId];
    if (!base) return null;
    let currentForm = { ...base, form: 1, formName: base.name, drawId: unitId };
    if (base.evolutions) {
        for (const evo of base.evolutions) {
            if (level >= evo.levelReq) {
                currentForm = { ...currentForm, ...evo, formName: evo.name, drawId: `${unitId}_${evo.form}` };
            }
        }
    }
    return currentForm;
};
