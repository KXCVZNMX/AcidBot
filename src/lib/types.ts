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