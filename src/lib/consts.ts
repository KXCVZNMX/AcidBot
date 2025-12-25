import { Rank } from '@/lib/types';

export const MaimaiLevelMap: Readonly<Record<number, string>> = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '7+',
    9: '8',
    10: '8+',
    11: '9',
    12: '9+',
    13: '10',
    14: '10+',
    15: '11',
    16: '11+',
    17: '12',
    18: '12+',
    19: '13',
    20: '13+',
    21: '14',
    22: '14+',
    23: '15',
};

export const SYNC_RULES: [string, string][] = [
    ['music_icon_fdxp', 'FDX+'],
    ['music_icon_fdx', 'FDX'],
    ['music_icon_fsp', 'FS+'],
    ['music_icon_fs', 'FS'],
    ['music_icon_sync', 'SYNC'],
];

export const COMBO_RULES: [string, string][] = [
    ['music_icon_app', 'AP+'],
    ['music_icon_ap', 'AP'],
    ['music_icon_fcp', 'FC+'],
    ['music_icon_fc', 'FC'],
];

export const DX_RULES: [string, string][] = [
    ['music_dx', 'dx'],
    ['music_standard', 'std'],
];

export const DIFF_RULES: [string, string][] = [
    ['diff_basic', 'basic'],
    ['diff_advanced', 'advanced'],
    ['diff_expert', 'expert'],
    ['diff_master', 'master'],
    ['diff_remaster', 'remaster'],
];

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

