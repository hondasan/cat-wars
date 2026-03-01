// お宝データ定義
// 各ステージに3種（下・中・上）のお宝が対応
// Canvas描画用のdraw関数を各お宝に定義

export const TREASURES = [
    // ステージ1: 九州
    {
        id: 't_01_1', stageId: 1, name: '九州の温泉石', rarity: 'common', tier: 1, dropRate: 0.7,
        desc: '温泉地から採れた不思議な石。ほんのり温かい。',
        color: '#ff7043', shape: 'stone'
    },
    {
        id: 't_01_2', stageId: 1, name: '溶岩のカケラ', rarity: 'rare', tier: 2, dropRate: 0.3,
        desc: '阿蘇山の溶岩が冷えて固まった赤い結晶。',
        color: '#d32f2f', shape: 'crystal'
    },
    {
        id: 't_01_3', stageId: 1, name: '伝説の焼酎壺', rarity: 'legendary', tier: 3, dropRate: 0.05,
        desc: '千年物の焼酎が入っていたとされる壺。全ステータス微UP。',
        color: '#bf360c', shape: 'vase', effect: { hpMul: 1.02, atkMul: 1.02 }
    },

    // ステージ2: 四国
    {
        id: 't_02_1', stageId: 2, name: 'お遍路の数珠', rarity: 'common', tier: 1, dropRate: 0.7,
        desc: '八十八ヶ所巡りで使われた古い数珠。',
        color: '#8d6e63', shape: 'beads'
    },
    {
        id: 't_02_2', stageId: 2, name: 'うどんの秘伝書', rarity: 'rare', tier: 2, dropRate: 0.3,
        desc: '讃岐うどんの極意が記された巻物。',
        color: '#ffd54f', shape: 'scroll'
    },
    {
        id: 't_02_3', stageId: 2, name: '坊っちゃん時計', rarity: 'legendary', tier: 3, dropRate: 0.05,
        desc: '道後温泉に伝わる不思議な時計。クールタイム微DOWN。',
        color: '#5d4037', shape: 'clock', effect: { cdMul: 0.98 }
    },

    // ステージ3: 中国
    {
        id: 't_03_1', stageId: 3, name: '砂丘の砂金', rarity: 'common', tier: 1, dropRate: 0.7,
        desc: '鳥取砂丘で見つかった小さな砂金。',
        color: '#ffd700', shape: 'dust'
    },
    {
        id: 't_03_2', stageId: 3, name: '宮島のしゃもじ', rarity: 'rare', tier: 2, dropRate: 0.3,
        desc: '厳島神社の宮大工が作った特製しゃもじ。',
        color: '#a1887f', shape: 'paddle'
    },
    {
        id: 't_03_3', stageId: 3, name: '出雲の勾玉', rarity: 'legendary', tier: 3, dropRate: 0.05,
        desc: '出雲大社から授かった翡翠の勾玉。攻撃力微UP。',
        color: '#00c853', shape: 'magatama', effect: { atkMul: 1.05 }
    },

    // ステージ4: 関西
    {
        id: 't_04_1', stageId: 4, name: 'たこ焼きピック', rarity: 'common', tier: 1, dropRate: 0.7,
        desc: '大阪名物たこ焼き専用の黄金ピック。',
        color: '#ff8f00', shape: 'pick'
    },
    {
        id: 't_04_2', stageId: 4, name: '金の鯱鉾', rarity: 'rare', tier: 2, dropRate: 0.3,
        desc: '名古屋城の屋根から落ちた小さな金の鯱。',
        color: '#ffd700', shape: 'shachi'
    },
    {
        id: 't_04_3', stageId: 4, name: '伏見の狐面', rarity: 'legendary', tier: 3, dropRate: 0.05,
        desc: '伏見稲荷の神使が残した狐のお面。スピード微UP。',
        color: '#ff5722', shape: 'mask', effect: { spdMul: 1.05 }
    },

    // ステージ5: 近畿
    {
        id: 't_05_1', stageId: 5, name: '奈良の鹿せんべい', rarity: 'common', tier: 1, dropRate: 0.7,
        desc: '鹿が食べ残した特別なせんべい。',
        color: '#d7ccc8', shape: 'cracker'
    },
    {
        id: 't_05_2', stageId: 5, name: '大仏の涙', rarity: 'rare', tier: 2, dropRate: 0.3,
        desc: '東大寺の大仏が流したとされる青い涙石。',
        color: '#42a5f5', shape: 'tear'
    },
    {
        id: 't_05_3', stageId: 5, name: '天守閣の鍵', rarity: 'legendary', tier: 3, dropRate: 0.05,
        desc: '姫路城の最上階に伝わる秘宝の鍵。HP微UP。',
        color: '#9e9e9e', shape: 'key', effect: { hpMul: 1.05 }
    },

    // ステージ6: 中部
    {
        id: 't_06_1', stageId: 6, name: 'きしめんの麺', rarity: 'common', tier: 1, dropRate: 0.7,
        desc: '異常に長い金のきしめん。',
        color: '#ffe082', shape: 'noodle'
    },
    {
        id: 't_06_2', stageId: 6, name: '合掌造りの模型', rarity: 'rare', tier: 2, dropRate: 0.3,
        desc: '白川郷の合掌造りミニチュア。精巧。',
        color: '#795548', shape: 'house'
    },
    {
        id: 't_06_3', stageId: 6, name: '黒部ダムの水晶', rarity: 'legendary', tier: 3, dropRate: 0.05,
        desc: '黒部ダムの底で見つかった巨大水晶。全ステ微UP。',
        color: '#80deea', shape: 'crystal', effect: { hpMul: 1.03, atkMul: 1.03 }
    },

    // ステージ7: 関東
    {
        id: 't_07_1', stageId: 7, name: '雷門の提灯', rarity: 'common', tier: 1, dropRate: 0.7,
        desc: '浅草雷門の赤い提灯のミニチュア。',
        color: '#e53935', shape: 'lantern'
    },
    {
        id: 't_07_2', stageId: 7, name: 'スカイツリーの先端', rarity: 'rare', tier: 2, dropRate: 0.3,
        desc: 'スカイツリーの避雷針のかけら。',
        color: '#78909c', shape: 'spire'
    },
    {
        id: 't_07_3', stageId: 7, name: '徳川の印籠', rarity: 'legendary', tier: 3, dropRate: 0.05,
        desc: '「この紋所が目に入らぬか」あの印籠。攻撃UP。',
        color: '#4a148c', shape: 'inro', effect: { atkMul: 1.08 }
    },

    // ステージ8: 東北
    {
        id: 't_08_1', stageId: 8, name: 'ずんだ餅', rarity: 'common', tier: 1, dropRate: 0.7,
        desc: '枝豆の甘い香りが漂う仙台銘菓。',
        color: '#aed581', shape: 'mochi'
    },
    {
        id: 't_08_2', stageId: 8, name: 'なまはげの面', rarity: 'rare', tier: 2, dropRate: 0.3,
        desc: '秋田のなまはげが落としたお面。',
        color: '#c62828', shape: 'mask'
    },
    {
        id: 't_08_3', stageId: 8, name: '黄金の騎馬像', rarity: 'legendary', tier: 3, dropRate: 0.05,
        desc: '伊達政宗の黄金の騎馬像。全ステ大UP。',
        color: '#ffd700', shape: 'statue', effect: { hpMul: 1.05, atkMul: 1.05, spdMul: 1.03 }
    },

    // ステージ9: 北海道
    {
        id: 't_09_1', stageId: 9, name: 'メロンの種', rarity: 'common', tier: 1, dropRate: 0.7,
        desc: '夕張メロンの金色に輝く種。',
        color: '#ff9800', shape: 'seed'
    },
    {
        id: 't_09_2', stageId: 9, name: '時計台の歯車', rarity: 'rare', tier: 2, dropRate: 0.3,
        desc: '札幌時計台から外れた精密な歯車。',
        color: '#607d8b', shape: 'gear'
    },
    {
        id: 't_09_3', stageId: 9, name: '流氷の宝石', rarity: 'legendary', tier: 3, dropRate: 0.05,
        desc: 'オホーツク海の流氷に閉じ込められた宝石。HP大UP。',
        color: '#b3e5fc', shape: 'gem', effect: { hpMul: 1.1 }
    },

    // ステージ10: 西表島
    {
        id: 't_10_1', stageId: 10, name: '星砂', rarity: 'common', tier: 1, dropRate: 0.65,
        desc: '星の形をした不思議な砂。願いが叶うとか。',
        color: '#fff9c4', shape: 'star'
    },
    {
        id: 't_10_2', stageId: 10, name: 'サンゴの王冠', rarity: 'rare', tier: 2, dropRate: 0.25,
        desc: '海底のサンゴ礁が変形した天然の王冠。',
        color: '#f48fb1', shape: 'crown'
    },
    {
        id: 't_10_3', stageId: 10, name: '古代イリオモテヤマネコの牙', rarity: 'legendary', tier: 3, dropRate: 0.03,
        desc: '伝説のイリオモテヤマネコの牙化石。全ステ超UP。',
        color: '#ffab00', shape: 'fang', effect: { hpMul: 1.08, atkMul: 1.08, spdMul: 1.05, cdMul: 0.95 }
    },
];

// Canvas描画関数
export const drawTreasure = (ctx, treasure, size) => {
    const s2 = size / 2;
    const { color, shape } = treasure;

    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    if (shape === 'stone') {
        ctx.beginPath(); ctx.ellipse(0, 0, s2 * 0.8, s2 * 0.6, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(-s2 * 0.2, -s2 * 0.2, s2 * 0.2, 0, Math.PI * 2); ctx.fill();
    }
    else if (shape === 'crystal') {
        ctx.beginPath(); ctx.moveTo(0, -s2); ctx.lineTo(s2 * 0.5, -s2 * 0.3); ctx.lineTo(s2 * 0.3, s2); ctx.lineTo(-s2 * 0.3, s2); ctx.lineTo(-s2 * 0.5, -s2 * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.moveTo(-s2 * 0.2, -s2 * 0.5); ctx.lineTo(0, -s2 * 0.8); ctx.lineTo(s2 * 0.1, -s2 * 0.3); ctx.fill();
    }
    else if (shape === 'vase') {
        ctx.beginPath(); ctx.moveTo(-s2 * 0.2, -s2); ctx.lineTo(s2 * 0.2, -s2); ctx.lineTo(s2 * 0.5, s2 * 0.3); ctx.quadraticCurveTo(s2 * 0.5, s2, 0, s2); ctx.quadraticCurveTo(-s2 * 0.5, s2, -s2 * 0.5, s2 * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = color === '#bf360c' ? '#ffab91' : '#fff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-s2 * 0.4, 0); ctx.lineTo(s2 * 0.4, 0); ctx.stroke();
    }
    else if (shape === 'beads') {
        for (let i = 0; i < 8; i++) { let a = (i / 8) * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(a) * s2 * 0.5, Math.sin(a) * s2 * 0.5, s2 * 0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    }
    else if (shape === 'scroll') {
        ctx.beginPath(); ctx.rect(-s2 * 0.6, -s2 * 0.4, s2 * 1.2, s2 * 0.8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = color === '#ffd54f' ? '#f57f17' : '#333'; ctx.beginPath(); ctx.arc(-s2 * 0.6, 0, s2 * 0.15, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(s2 * 0.6, 0, s2 * 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-s2 * 0.4, -s2 * 0.2 + i * s2 * 0.2); ctx.lineTo(s2 * 0.4, -s2 * 0.2 + i * s2 * 0.2); ctx.stroke(); }
    }
    else if (shape === 'clock') {
        ctx.beginPath(); ctx.arc(0, 0, s2 * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, s2 * 0.55, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s2 * 0.35); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s2 * 0.25, 0); ctx.stroke();
    }
    else if (shape === 'dust') {
        for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(Math.random() * s2 - s2 * 0.5, Math.random() * s2 - s2 * 0.5, s2 * 0.1 + Math.random() * s2 * 0.1, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(0, -s2 * 0.1, s2 * 0.08, 0, Math.PI * 2); ctx.fill();
    }
    else if (shape === 'paddle') {
        ctx.beginPath(); ctx.ellipse(0, -s2 * 0.2, s2 * 0.5, s2 * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#5d4037'; ctx.beginPath(); ctx.rect(-s2 * 0.1, s2 * 0.3, s2 * 0.2, s2 * 0.5); ctx.fill(); ctx.stroke();
    }
    else if (shape === 'magatama') {
        ctx.beginPath(); ctx.arc(0, -s2 * 0.15, s2 * 0.5, 0, Math.PI, true); ctx.arc(0, s2 * 0.15, s2 * 0.2, Math.PI, 0, true); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -s2 * 0.15, s2 * 0.1, 0, Math.PI * 2); ctx.fill();
    }
    else if (shape === 'pick' || shape === 'spire') {
        ctx.beginPath(); ctx.moveTo(0, -s2); ctx.lineTo(s2 * 0.3, s2 * 0.5); ctx.lineTo(-s2 * 0.3, s2 * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#795548'; ctx.beginPath(); ctx.rect(-s2 * 0.15, s2 * 0.3, s2 * 0.3, s2 * 0.5); ctx.fill(); ctx.stroke();
    }
    else if (shape === 'shachi') {
        ctx.beginPath(); ctx.ellipse(0, 0, s2 * 0.4, s2 * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -s2 * 0.5); ctx.quadraticCurveTo(s2 * 0.5, -s2 * 0.8, s2 * 0.3, -s2); ctx.stroke();
        ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(s2 * 0.1, -s2 * 0.1, 2, 0, Math.PI * 2); ctx.fill();
    }
    else if (shape === 'mask') {
        ctx.beginPath(); ctx.ellipse(0, 0, s2 * 0.6, s2 * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(-s2 * 0.2, -s2 * 0.15, s2 * 0.15, s2 * 0.1, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(s2 * 0.2, -s2 * 0.15, s2 * 0.15, s2 * 0.1, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(0, s2 * 0.1, s2 * 0.08, 0, Math.PI * 2); ctx.fill();
    }
    else if (shape === 'cracker') {
        ctx.beginPath(); ctx.arc(0, 0, s2 * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(139,90,43,0.3)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(Math.cos(i) * s2 * 0.2, Math.sin(i) * s2 * 0.2, 2, 0, Math.PI * 2); ctx.fill(); }
    }
    else if (shape === 'tear') {
        ctx.beginPath(); ctx.moveTo(0, -s2 * 0.8); ctx.quadraticCurveTo(s2 * 0.6, 0, 0, s2 * 0.6); ctx.quadraticCurveTo(-s2 * 0.6, 0, 0, -s2 * 0.8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(-s2 * 0.1, -s2 * 0.2, s2 * 0.12, 0, Math.PI * 2); ctx.fill();
    }
    else if (shape === 'key') {
        ctx.beginPath(); ctx.arc(0, -s2 * 0.3, s2 * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.rect(-s2 * 0.1, 0, s2 * 0.2, s2 * 0.7); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.rect(s2 * 0.1, s2 * 0.5, s2 * 0.2, s2 * 0.1); ctx.fill(); ctx.stroke();
    }
    else if (shape === 'noodle') {
        ctx.strokeStyle = color; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-s2 * 0.5, -s2 * 0.5); ctx.quadraticCurveTo(0, -s2 * 0.3, s2 * 0.3, 0); ctx.quadraticCurveTo(0, s2 * 0.3, -s2 * 0.3, s2 * 0.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-s2 * 0.3, -s2 * 0.6); ctx.quadraticCurveTo(s2 * 0.2, -s2 * 0.2, s2 * 0.5, s2 * 0.2); ctx.stroke();
        ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    }
    else if (shape === 'house') {
        ctx.beginPath(); ctx.moveTo(-s2 * 0.5, s2 * 0.5); ctx.lineTo(-s2 * 0.5, -s2 * 0.2); ctx.lineTo(0, -s2 * 0.8); ctx.lineTo(s2 * 0.5, -s2 * 0.2); ctx.lineTo(s2 * 0.5, s2 * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#3e2723'; ctx.beginPath(); ctx.rect(-s2 * 0.15, s2 * 0.1, s2 * 0.3, s2 * 0.4); ctx.fill(); ctx.stroke();
    }
    else if (shape === 'lantern') {
        ctx.beginPath(); ctx.ellipse(0, 0, s2 * 0.5, s2 * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#333'; ctx.beginPath(); ctx.rect(-s2 * 0.3, -s2 * 0.7, s2 * 0.6, s2 * 0.15); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -s2 * 0.85); ctx.lineTo(0, -s2 * 0.7); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = `bold ${s2 * 0.5}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('雷', 0, s2 * 0.15);
    }
    else if (shape === 'inro') {
        ctx.beginPath(); ctx.rect(-s2 * 0.35, -s2 * 0.5, s2 * 0.7, s2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(0, 0, s2 * 0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -s2 * 0.5); ctx.lineTo(0, -s2 * 0.7); ctx.stroke();
    }
    else if (shape === 'mochi') {
        ctx.beginPath(); ctx.ellipse(0, s2 * 0.1, s2 * 0.6, s2 * 0.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(-s2 * 0.1, -s2 * 0.05, s2 * 0.15, 0, Math.PI * 2); ctx.fill();
    }
    else if (shape === 'statue') {
        ctx.beginPath(); ctx.moveTo(0, -s2 * 0.8); ctx.lineTo(s2 * 0.5, -s2 * 0.3); ctx.lineTo(s2 * 0.3, s2 * 0.5); ctx.lineTo(-s2 * 0.3, s2 * 0.5); ctx.lineTo(-s2 * 0.5, -s2 * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, -s2 * 0.4, s2 * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    else if (shape === 'seed') {
        ctx.beginPath(); ctx.ellipse(0, 0, s2 * 0.3, s2 * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(-s2 * 0.05, -s2 * 0.15, s2 * 0.08, 0, Math.PI * 2); ctx.fill();
    }
    else if (shape === 'gear') {
        for (let i = 0; i < 8; i++) { let a = (i / 8) * Math.PI * 2; ctx.beginPath(); ctx.rect(Math.cos(a) * s2 * 0.4 - s2 * 0.08, Math.sin(a) * s2 * 0.4 - s2 * 0.08, s2 * 0.16, s2 * 0.16); ctx.fill(); ctx.stroke(); }
        ctx.beginPath(); ctx.arc(0, 0, s2 * 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ccc'; ctx.beginPath(); ctx.arc(0, 0, s2 * 0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    else if (shape === 'gem') {
        ctx.beginPath(); ctx.moveTo(0, -s2 * 0.7); ctx.lineTo(s2 * 0.6, -s2 * 0.2); ctx.lineTo(s2 * 0.4, s2 * 0.6); ctx.lineTo(-s2 * 0.4, s2 * 0.6); ctx.lineTo(-s2 * 0.6, -s2 * 0.2); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.moveTo(-s2 * 0.3, -s2 * 0.3); ctx.lineTo(0, -s2 * 0.6); ctx.lineTo(s2 * 0.1, -s2 * 0.2); ctx.fill();
    }
    else if (shape === 'star') {
        for (let i = 0; i < 5; i++) {
            let a = (i / 5) * Math.PI * 2 - Math.PI / 2; let ia = a + Math.PI / 5;
            ctx.beginPath(); ctx.moveTo(Math.cos(a) * s2 * 0.6, Math.sin(a) * s2 * 0.6); ctx.lineTo(Math.cos(ia) * s2 * 0.25, Math.sin(ia) * s2 * 0.25);
            if (i === 0) ctx.moveTo(Math.cos(a) * s2 * 0.6, Math.sin(a) * s2 * 0.6);
        }
        // 星型
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            let a = (i / 10) * Math.PI * 2 - Math.PI / 2; let r = i % 2 === 0 ? s2 * 0.6 : s2 * 0.25;
            if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    else if (shape === 'crown') {
        ctx.beginPath(); ctx.moveTo(-s2 * 0.6, s2 * 0.3); ctx.lineTo(-s2 * 0.6, -s2 * 0.2); ctx.lineTo(-s2 * 0.3, -s2 * 0.5); ctx.lineTo(0, -s2 * 0.1); ctx.lineTo(s2 * 0.3, -s2 * 0.5); ctx.lineTo(s2 * 0.6, -s2 * 0.2); ctx.lineTo(s2 * 0.6, s2 * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(i * s2 * 0.3, s2 * 0.05, s2 * 0.08, 0, Math.PI * 2); ctx.fill(); }
    }
    else if (shape === 'fang') {
        ctx.beginPath(); ctx.moveTo(0, -s2 * 0.8); ctx.quadraticCurveTo(s2 * 0.4, -s2 * 0.2, s2 * 0.2, s2 * 0.7); ctx.lineTo(-s2 * 0.2, s2 * 0.7); ctx.quadraticCurveTo(-s2 * 0.4, -s2 * 0.2, 0, -s2 * 0.8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(-s2 * 0.05, -s2 * 0.3, s2 * 0.08, 0, Math.PI * 2); ctx.fill();
    }
    else {
        // フォールバック
        ctx.beginPath(); ctx.arc(0, 0, s2 * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }

    // レアリティ光彩
    if (treasure.rarity === 'legendary') {
        ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(0, 0, s2 * 0.9, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1.0;
    } else if (treasure.rarity === 'rare') {
        ctx.strokeStyle = '#42a5f5'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.arc(0, 0, s2 * 0.85, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    ctx.restore();
};

// ドロップ判定
export const rollTreasureDrop = (stageId) => {
    const stageTreasures = TREASURES.filter(t => t.stageId === stageId);
    const dropped = [];
    for (const t of stageTreasures) {
        if (Math.random() < t.dropRate) {
            dropped.push(t);
        }
    }
    return dropped;
};

// お宝効果の合算を計算
export const calcTreasureEffects = (collectedIds) => {
    const effects = { hpMul: 1, atkMul: 1, spdMul: 1, cdMul: 1 };
    for (const id of collectedIds) {
        const t = TREASURES.find(tr => tr.id === id);
        if (t && t.effect) {
            if (t.effect.hpMul) effects.hpMul *= t.effect.hpMul;
            if (t.effect.atkMul) effects.atkMul *= t.effect.atkMul;
            if (t.effect.spdMul) effects.spdMul *= t.effect.spdMul;
            if (t.effect.cdMul) effects.cdMul *= t.effect.cdMul;
        }
    }
    return effects;
};
