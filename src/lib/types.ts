export interface MaimaiFetchData {
    clal: string;
    redirect: string;
}

export interface MaimaiSongScore {
    name: string;
    score: string;
    dx: string;
    sync: string | null;
    combo: string | null;
    rank: string | null;
}

export interface UserInfo {
    username: string;
    email: string;
    clal: string;
}
