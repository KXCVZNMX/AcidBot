import {RANK_DEFINITIONS} from '@/lib/consts';
import {
    MaimaiSongScore,
    MSSB50,
    ParsedProfile,
    SongInfo,
    SongInfoProjection,
    UserCollectionCount
} from '@/app/api/_shared/types';
import * as cheerio from 'cheerio';
import {Db} from 'mongodb';
// import songs from '../_shared/temp_updates.json'

export const songInfoProjection: SongInfoProjection = {
    title: 1,
    image_url: 1,
    date_intl_added: 1,
    lev_bas_i: 1,
    lev_adv_i: 1,
    lev_exp_i: 1,
    lev_mas_i: 1,
    lev_remas_i: 1,
    dx_lev_bas_i: 1,
    dx_lev_adv_i: 1,
    dx_lev_exp_i: 1,
    dx_lev_mas_i: 1,
    dx_lev_remas_i: 1,
};

export function getRatingByAchievement(achievement: number, lvConstant: number) {
    const rank = RANK_DEFINITIONS.find((r) => achievement >= r.minA && achievement <= (r.maxA ?? Infinity));
    if (typeof rank === 'undefined') {
        console.error(`Achievement out of range: ${achievement}`);
        return -1;
    }

    if (rank.maxA && achievement === rank.maxA) {
        return achievement * (rank.maxFactor ?? -1) * lvConstant;
    } else {
        return (achievement > 100.5 ? 100.5 : achievement) * rank.factor * lvConstant;
    }
}

export function parseDate(input: string): Date {
    if (!/^\d{8}$/.test(input)) {
        throw new Error('Invalid format. Expected YYYYMMDD');
    }

    const year = Number(input.slice(0, 4));
    const month = Number(input.slice(4, 6)) - 1; // JS months are 0-based
    const day = Number(input.slice(6, 8));

    const date = new Date(year, month, day);

    // Validate to catch invalid dates like 20250230
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        throw new Error('Invalid date');
    }

    return date;
}

export function isNewByDate(date: string) {
    if (date === '000000') return true;
    return parseDate(date) >= parseDate('20260122'); // Circle Release Date
}

export function getLevelConst(r: MaimaiSongScore, qRes: SongInfo): string {
    if (r.isDx === 'dx') {
        if (r.diff === 'basic' && qRes.dx_lev_bas_i) return qRes.dx_lev_bas_i;
        else if (r.diff === 'advanced' && qRes.dx_lev_adv_i) return qRes.dx_lev_adv_i;
        else if (r.diff === 'expert' && qRes.dx_lev_exp_i) return qRes.dx_lev_exp_i;
        else if (r.diff === 'master' && qRes.dx_lev_mas_i) return qRes.dx_lev_mas_i;
        else if (r.diff === 'remaster' && qRes.dx_lev_remas_i) return qRes.dx_lev_remas_i;
        else return '0';
    } else if (r.isDx === 'std') {
        if (r.diff === 'basic' && qRes.lev_bas_i) return qRes.lev_bas_i;
        else if (r.diff === 'advanced' && qRes.lev_adv_i) return qRes.lev_adv_i;
        else if (r.diff === 'expert' && qRes.lev_exp_i) return qRes.lev_exp_i;
        else if (r.diff === 'master' && qRes.lev_mas_i) return qRes.lev_mas_i;
        else if (r.diff === 'remaster' && qRes.lev_remas_i) return qRes.lev_remas_i;
        else return '0';
    } else {
        console.warn(`No sheet info for ${r.name} diff ${r.diff} - skipping`);
        return '0';
    }
}

export async function getSongInfoMap(
    db: Db,
    scores: MaimaiSongScore[],
    collectionName = 'maimaiIntlSongInfo'
): Promise<Map<string, SongInfo>> {
    const titles = Array.from(new Set(scores.map((r) => r.name)));
    const docs = await db
        .collection<SongInfo>(collectionName)
        .find(
            { title: { $in: titles } },
            {
                projection: songInfoProjection,
            }
        )
        .toArray();

    // const tempUpdatedSongs = songs as unknown as SongInfo[];

    const docMap = new Map<string, SongInfo>();
    for (const d of docs) {
        if (d?.title) docMap.set(d.title, d);
    }
    //
    // for (const s of tempUpdatedSongs) {
    //     docMap.set(s.title, s);
    // }

    return docMap;
}

export function toB50Score(score: MaimaiSongScore, songInfo: SongInfo): MSSB50 {
    const levelConst = parseFloat(getLevelConst(score, songInfo));
    const achievement = Number(score.score.slice(0, -1));

    return {
        levelConst,
        name: score.name,
        score: score.score,
        diff: score.diff,
        dx: score.dx,
        isDx: score.isDx,
        sync: score.sync,
        combo: score.combo,
        rank: score.rank,
        rating: Math.floor(getRatingByAchievement(achievement, levelConst)),
        dateIntlAdded: songInfo.date_intl_added,
        achievement,
        jacketURL: songInfo.image_url,
    };
}

export function splitB50(scores: MSSB50[]) {
    const b35: MSSB50[] = [];
    const b15: MSSB50[] = [];

    for (const r of scores) {
        if (isNewByDate(r.dateIntlAdded)) b15.push(r);
        else b35.push(r);
    }

    b35.sort((a, b) => b.rating - a.rating);
    b15.sort((a, b) => b.rating - a.rating);

    return {
        b35: b35.slice(0, 35),
        b15: b15.slice(0, 15),
    };
}

export function toProxiedUrl(src: string): string {
    if (!src) return src;
    try {
        const u = new URL(src);
        // Only proxy http(s) URLs that are genuinely cross-origin.
        if (u.protocol === 'http:' || u.protocol === 'https:') {
            return `/api/v1/images/proxy?url=${encodeURIComponent(src)}`;
        }
    } catch {
        // relative URL or data: URI – leave as-is
    }
    return src;
}

export function parseProfileBlock(html: string): ParsedProfile | null {
    const $ = cheerio.load(html);

    const container = $('div.basic_block.p_10.f_0').first();
    if (container.length === 0) return null;

    const profilePicture = toProxiedUrl(container.find('img.w_112.f_l').first().attr('src') ?? '');
    const dan = toProxiedUrl(container.find('img.h_35.f_l:not(.p_l_10)').first().attr('src') ?? '');
    const rank = toProxiedUrl(container.find('img.p_l_10.h_35.f_l').first().attr('src') ?? '');
    const userName = container.find('div.name_block.f_l.f_16').first().text().trim();
    const userDetail = container.find('div.trophy_inner_block.f_13').first().text().trim();
    const collectionDiv = container.find('div.p_l_10.f_l.f_14').first();

    let userCollectionCount: UserCollectionCount | null = null;

    if (collectionDiv.length > 0) {
        const img = toProxiedUrl(collectionDiv.find('img.h_30.m_3.v_m').first().attr('src') ?? '');

        const text = collectionDiv.clone().children('img').remove().end().text().replace(/\s+/g, ' ').trim();

        userCollectionCount = {
            img,
            text,
        };
    }

    return {
        profilePicture,
        dan,
        rank,
        userName,
        userDetail,
        userCollectionCount,
    };
}
