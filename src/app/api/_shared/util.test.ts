import { describe, it, expect } from 'vitest';
import {
    getRatingByAchievement,
    parseDate,
    isNewByDate,
    getLevelConst,
    toProxiedUrl,
    parseProfileBlock,
    splitB50,
    toB50Score,
} from '@/app/api/_shared/util';
import { MaimaiSongScore, MSSB50 } from '@/app/api/_shared/types';
import { SongInfo } from '@/app/api/_shared/types';

describe('parseDate', () => {
    it('parses a valid YYYYMMDD string into a local Date', () => {
        const d = parseDate('20250724');
        expect(d.getFullYear()).toBe(2025);
        expect(d.getMonth()).toBe(6); // July, 0-based
        expect(d.getDate()).toBe(24);
    });

    it('rejects strings that are not 8 digits', () => {
        expect(() => parseDate('2025-07-24')).toThrow('Invalid format');
        expect(() => parseDate('2025724')).toThrow('Invalid format');
    });

    it('rejects calendar-invalid dates that overflow', () => {
        expect(() => parseDate('20250230')).toThrow('Invalid date');
    });
});

describe('isNewByDate', () => {
    it('treats the sentinel 000000 as new', () => {
        expect(isNewByDate('000000')).toBe(true);
    });

    it('marks charts added on/after the CiRCLE release as new', () => {
        expect(isNewByDate('20260122')).toBe(true); // CiRCLE
        expect(isNewByDate('20261231')).toBe(true);
    });

    it('marks charts added before the CiRCLE release as old', () => {
        expect(isNewByDate('20260121')).toBe(false);
        expect(isNewByDate('20200101')).toBe(false);
    });
});

describe('getRatingByAchievement', () => {
    it('caps achievement at 100.5 for SSS+ and uses its factor', () => {
        // achievement above 100.5 is clamped to 100.5 before applying 0.224
        expect(getRatingByAchievement(100.6, 15)).toBeCloseTo(100.5 * 0.224 * 15, 6);
    });

    it('uses the standard factor for an S score', () => {
        expect(getRatingByAchievement(97.0, 10)).toBeCloseTo(97.0 * 0.2 * 10, 6);
    });

    it('applies maxFactor when achievement equals a band ceiling', () => {
        // SSS band: maxA 100.4999, maxFactor 0.222
        expect(getRatingByAchievement(100.4999, 12)).toBeCloseTo(100.4999 * 0.222 * 12, 6);
    });

    it('returns -1 when achievement is below every band', () => {
        expect(getRatingByAchievement(-5, 15)).toBe(-1);
    });
});

describe('getLevelConst', () => {
    const sheet = {
        dx_lev_mas_i: '14.8',
        lev_exp_i: '12.5',
        lev_mas_i: '13.2',
    } as unknown as SongInfo;

    const base: MaimaiSongScore = {
        name: 'Song',
        score: '100.0000%',
        dx: '0',
        isDx: 'dx',
        diff: 'master',
        sync: null,
        combo: null,
        rank: 'SSS',
    };

    it('reads the DX master constant', () => {
        expect(getLevelConst({ ...base, isDx: 'dx', diff: 'master' }, sheet)).toBe('14.8');
    });

    it('reads the standard expert constant', () => {
        expect(getLevelConst({ ...base, isDx: 'std', diff: 'expert' }, sheet)).toBe('12.5');
    });

    it('falls back to "0" when the chart type is unknown', () => {
        expect(getLevelConst({ ...base, isDx: 'unknown', diff: 'master' }, sheet)).toBe('0');
    });

    it('falls back to "0" when the requested constant is missing', () => {
        expect(getLevelConst({ ...base, isDx: 'dx', diff: 'basic' }, sheet)).toBe('0');
    });
});

describe('toB50Score', () => {
    it('builds a rated score row from a parsed score and song info', () => {
        const score: MaimaiSongScore = {
            name: 'Song',
            score: '100.0000%',
            dx: '1,000/1,000',
            isDx: 'dx',
            diff: 'master',
            sync: 'FS',
            combo: 'FC',
            rank: 'SSS',
        };

        const songInfo = {
            title: 'Song',
            image_url: 'jacket.png',
            date_intl_added: '20250724',
            dx_lev_mas_i: '14.8',
        } as unknown as SongInfo;

        expect(toB50Score(score, songInfo)).toMatchObject({
            levelConst: 14.8,
            name: 'Song',
            rating: Math.floor(getRatingByAchievement(100, 14.8)),
            dateIntlAdded: '20250724',
            achievement: 100,
            jacketURL: 'jacket.png',
        });
    });
});

describe('splitB50', () => {
    it('splits old and new songs by date, sorts by rating, and caps B35/B15', () => {
        const oldSongs = Array.from({ length: 40 }, (_, i) => ({
            rating: i,
            dateIntlAdded: '20200101',
        }));
        const newSongs = Array.from({ length: 20 }, (_, i) => ({
            rating: i,
            dateIntlAdded: '20260122',
        }));

        const { b35, b15 } = splitB50([...oldSongs, ...newSongs] as MSSB50[]);

        expect(b35).toHaveLength(35);
        expect(b15).toHaveLength(15);
        expect(b35[0].rating).toBe(39);
        expect(b35.at(-1)?.rating).toBe(5);
        expect(b15[0].rating).toBe(19);
        expect(b15.at(-1)?.rating).toBe(5);
    });
});

describe('toProxiedUrl', () => {
    it('routes absolute http(s) URLs through the image proxy', () => {
        const src = 'https://maimaidx-eng.com/img/jacket.png';
        expect(toProxiedUrl(src)).toBe(`/api/v1/images/proxy?url=${encodeURIComponent(src)}`);
    });

    it('leaves relative URLs untouched', () => {
        expect(toProxiedUrl('/assets/x.png')).toBe('/assets/x.png');
    });

    it('leaves data URIs untouched', () => {
        const data = 'data:image/png;base64,AAAA';
        expect(toProxiedUrl(data)).toBe(data);
    });

    it('passes empty input straight through', () => {
        expect(toProxiedUrl('')).toBe('');
    });
});

describe('parseProfileBlock', () => {
    const html = `
        <div class="basic_block p_10 f_0">
            <img class="w_112 f_l" src="https://maimaidx-eng.com/pfp.png">
            <img class="h_35 f_l" src="https://maimaidx-eng.com/dan.png">
            <img class="p_l_10 h_35 f_l" src="https://maimaidx-eng.com/rank.png">
            <div class="name_block f_l f_16">PlayerOne</div>
            <div class="trophy_inner_block f_13">Trophy Text</div>
            <div class="p_l_10 f_l f_14">
                <img class="h_30 m_3 v_m" src="https://maimaidx-eng.com/star.png">
                42
            </div>
        </div>`;

    it('extracts profile fields and proxies image URLs', () => {
        const profile = parseProfileBlock(html);
        expect(profile).not.toBeNull();
        expect(profile!.userName).toBe('PlayerOne');
        expect(profile!.userDetail).toBe('Trophy Text');
        expect(profile!.profilePicture).toContain('/api/v1/images/proxy');
        expect(profile!.userCollectionCount?.text).toBe('42');
        expect(profile!.userCollectionCount?.img).toContain('/api/v1/images/proxy');
    });

    it('returns null when the profile container is absent', () => {
        expect(parseProfileBlock('<div>nothing here</div>')).toBeNull();
    });
});
