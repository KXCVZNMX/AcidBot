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

export const SYNC_RULES: [string, string][] = [
    ["music_icon_fdxp", "FDX+"],
    ["music_icon_fdx",  "FDX"],
    ["music_icon_fsp",  "FS+"],
    ["music_icon_fs",   "FS"],
    ["music_icon_sync", "SYNC"],
];

export const COMBO_RULES: [string, string][] = [
    ["music_icon_app", "AP+"],
    ["music_icon_ap",  "AP"],
    ["music_icon_fcp", "FC+"],
    ["music_icon_fc",  "FC"],
];

export const RANK_RULES: [string, string][] = [
    ["music_icon_sssp", "SSS+"],
    ["music_icon_sss",  "SSS"],
    ["music_icon_ssp",  "SS+"],
    ["music_icon_ss",   "SS"],
    ["music_icon_s+",   "S+"],
    ["music_icon_s",    "S"],
    ["music_icon_aaa",  "AAA"],
    ["music_icon_aa",   "AA"],
    ["music_icon_a",    "A"],
    ["music_icon_bbb",  "BBB"],
    ["music_icon_bb",   "BB"],
    ["music_icon_b",    "B"],
    ["music_icon_c",    "C"],
    ["music_icon_d",    "D"],
];