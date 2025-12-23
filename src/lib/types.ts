export interface MaimaiFetchData {
    clal: string;
    redirect: string;
}

export interface MaimaiSongScore {
    name: string;
    score: string;
    diff: string;
    dx: string;
    isDx: string;
    sync: string | null;
    combo: string | null;
    rank: string | null;
}

export interface MSSB50 extends MaimaiSongScore {
    levelConst: number;
    rating: number;
    version: string;
    achievement: number;
}

export interface Rank {
    title: string;
    maxA?: number;
    minA: number;
    factor: number;
    maxFactor?: number;
}
