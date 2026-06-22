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
    dateIntlAdded: string;
    achievement: number;
    jacketURL: string;
}

export interface SongTags {
    achievement: number;
    levelConst: number;
    tags: number[];
}

export interface Best50Songs {
    b35: MSSB50[];
    b15: MSSB50[];
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

export interface SongInfo {
    title: string;
    image_url: string;
    date_intl_added: string;
    lev_bas_i: string;
    lev_adv_i: string;
    lev_exp_i: string;
    lev_mas_i: string;
    lev_remas_i: string;
    dx_lev_bas_i: string;
    dx_lev_adv_i: string;
    dx_lev_exp_i: string;
    dx_lev_mas_i: string;
    dx_lev_remas_i: string;
}

export type SongInfoProjection = Record<keyof SongInfo, 1>;
