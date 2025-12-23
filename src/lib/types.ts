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

export interface UserInfo {
    username: string;
    email: string;
    clal: string;
}

export interface Rank {
    title: string;
    maxA?: number;
    minA: number;
    factor: number;
    maxFactor?: number;
}
