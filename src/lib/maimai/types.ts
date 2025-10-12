export interface MaimaiResultEntry {
    level: string;
    name: string;
    score: string;
    dx_score: string;
    diff: string;
    difficulty: string;
}

export interface MaimaiResults {
    results: MaimaiResultEntry[];
}

export interface SongDiffInfo {
    type: string;
    difficulty: string;
    level: string;
    levelValue: number;
    isSpecial: boolean;
}

export interface SongInfo {
    songId: string;
    title: string;
    artist: string;
    imageName: string;
    isNew: boolean;
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

const RANK_SSS_PLUS: Readonly<Rank> = {
    title: 'SSS+',
    minA: 100.5000,
    factor: 0.224,
}

export const RANK_S: Rank = {
    minA: 97.0,
    factor: 0.2,
    title: 'S',
};

export const RANK_DEFINITIONS: ReadonlyArray<Rank> = [
    RANK_SSS_PLUS,
    {minA: 100.0, factor: 0.216, title: 'SSS', maxA: 100.4999, maxFactor: 0.222},
    {minA: 99.5, factor: 0.211, title: 'SS+', maxA: 99.9999, maxFactor: 0.214},
    {minA: 99.0, factor: 0.208, title: 'SS'},
    {minA: 98.0, factor: 0.203, title: 'S+', maxA: 98.9999, maxFactor: 0.206},
    RANK_S,
    {
        minA: 94.0,
        factor: 0.168,
        title: 'AAA',
        maxA: 96.9999,
        maxFactor: 0.176,
    },
    {minA: 90.0, factor: 0.152, title: 'AA'},
    {minA: 80.0, factor: 0.136, title: 'A'},
    {
        minA: 75.0,
        factor: 0.12,
        title: 'BBB',
        maxA: 79.9999,
        maxFactor: 0.128,
    },
    {minA: 70.0, factor: 0.112, title: 'BB'},
    {minA: 60.0, factor: 0.096, title: 'B'},
    {minA: 50.0, factor: 0.08, title: 'C'},
    {minA: 0.0, factor: 0.016, title: 'D'},
];
