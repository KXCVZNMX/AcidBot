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
    jacketURL: string;
}

export interface SongTags {
    achievement: number;
    levelConst: number;
    tags: number[];
}

export interface Rank {
    title: string;
    maxA?: number;
    minA: number;
    factor: number;
    maxFactor?: number;
}

export interface Best50Songs {
    b35: MSSB50[];
    b15: MSSB50[];
}

export interface Best50SongsWithDateRating {
    b50: Best50Songs;
    createdAt: Date;
    rating: number;
}

export interface UserCollectionCount {
    img: string | null;
    text: string | null;
}

export interface ParsedProfile {
    profilePicture: string | null;
    dan: string | null;
    rank: string | null;
    userName: string | null;
    userDetail: string | null;
    userCollectionCount: UserCollectionCount | null;
}

export interface SongEntry {
    songId: string;
    category: string;
    title: string;
    artist: string;
    imageURL: string;
    version: string;
    isNew: boolean;
    sheets: SheetEntry[];
}

export interface SheetEntry {
    type: 'dx' | 'std';
    difficulty: 'remaster' | 'master' | 'expert' | 'advanced' | 'basic';
    internalLevelValue: number;
    isSpecial: boolean;
    version: string;
}
