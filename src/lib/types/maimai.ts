// e.g.
// {
//     "name": "ATLAS RUSH",
//     "level": "14+",
//     "score": "100.5037",
//     "dx_score": "",
//     "isDX": true,
//     "diff": 3,
//     "difficulty": "master"
// },
export interface MaimaiResultEntry {
    level: string;
    name: string;
    score: string;
    dx_score: string;
    isDX: boolean;
    diff: string;
    difficulty: string;
    sync?: string;
    playStat?: string;
}

export interface MaimaiResults {
    results: MaimaiResultEntry[];
}

// e.g.
// {
//     "type": "dx",
//     "difficulty": "basic",
//     "level": "3",
//     "levelValue": 3,
//     "isSpecial": false,
// },
export interface SongDiffInfo {
    type: string;
    difficulty: string;
    level: string;
    internalLevelValue: number;
    isSpecial: boolean;
}

export interface SongInfo {
    songId: string;
    title: string;
    artist: string;
    imageName: string;
    version: string;
    sheets: SongDiffInfo[];
}

export interface SongInfoList {
    songs: SongInfo[];
}

export interface Rank {
    // use maxFactor when maxA
    title: string;
    maxA?: number;
    minA: number;
    factor: number;
    maxFactor?: number;
}

export interface Output {
    title: string;
    imageName: string;
    level: string;
    levelValue: number;
    difficulty: string;
    dx_score: string;
    achievement: string;
    rating: number;
    isDX: boolean;
    isNew: boolean;
    sync?: string;
    playStat?: string;
}

// The format in the db
export interface SongTagsDBEntry {
    song_id: string;
    sheet_type: string;
    sheet_difficulty: string;
    tag_id: number;
}

const RANK_SSS_PLUS: Readonly<Rank> = {
    title: 'SSS+',
    minA: 100.5,
    factor: 0.224,
};

export const RANK_S: Rank = {
    minA: 97.0,
    factor: 0.2,
    title: 'S',
};

export const RANK_DEFINITIONS: ReadonlyArray<Rank> = [
    RANK_SSS_PLUS,
    {
        minA: 100.0,
        factor: 0.216,
        title: 'SSS',
        maxA: 100.4999,
        maxFactor: 0.222,
    },
    {
        minA: 99.5,
        factor: 0.211,
        title: 'SS+',
        maxA: 99.9999,
        maxFactor: 0.214,
    },
    { minA: 99.0, factor: 0.208, title: 'SS' },
    { minA: 98.0, factor: 0.203, title: 'S+', maxA: 98.9999, maxFactor: 0.206 },
    RANK_S,
    {
        minA: 94.0,
        factor: 0.168,
        title: 'AAA',
        maxA: 96.9999,
        maxFactor: 0.176,
    },
    { minA: 90.0, factor: 0.152, title: 'AA' },
    { minA: 80.0, factor: 0.136, title: 'A' },
    {
        minA: 75.0,
        factor: 0.12,
        title: 'BBB',
        maxA: 79.9999,
        maxFactor: 0.128,
    },
    { minA: 70.0, factor: 0.112, title: 'BB' },
    { minA: 60.0, factor: 0.096, title: 'B' },
    { minA: 50.0, factor: 0.08, title: 'C' },
    { minA: 0.0, factor: 0.016, title: 'D' },
];

export const PATTERN_TAG: Readonly<Record<string, number>> = {
    "转圈": 3,
    "绝赞": 4,
    "扫键": 6,
    "散打": 7,
    "交互": 8,
    "反手": 9,
    "一笔画": 10,
    "水": 11,
    "错位": 1,
    "跳拍": 17,
    "纵连": 18,
    "爆发": 19,
    "拆弹": 20,
    "诈称": 13,
    "定拍": 23,
    "大位移": 24,
};

export const EVAL_TAG: Readonly<Record<string, number>> = {
    "键盘谱": 15,
    "星星谱": 14,
    "体力谱": 21,
    "底力谱": 16,
    "高物量": 22,
}
