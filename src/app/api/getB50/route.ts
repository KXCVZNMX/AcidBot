import fetchPages from '@/lib/fetchPage';
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { extractScore } from '@/lib/util';
import { MaimaiSongScore, MSSB50 } from '@/lib/types';
import client from '@/lib/db';
import { RANK_DEFINITIONS } from '@/lib/consts';

type MoreInfo = {
    type: 'dx' | 'std';
    difficulty: 'basic' | 'advanced' | 'expert' | 'master' | 'remaster';
    internalLevelValue: number;
    version: string;
};

function getRatingByAchievement(achievement: number, lvConstant: number) {
    const rank = RANK_DEFINITIONS.find(
        (r) => achievement >= r.minA && achievement <= (r.maxA ?? Infinity)
    );
    if (typeof rank === 'undefined') {
        console.error(`Achievement out of range: ${achievement}`);
        return -1;
    }

    if (rank.maxA && achievement === rank.maxA) {
        return achievement * (rank.maxFactor ?? -1) * lvConstant;
    } else {
        return (
            (achievement > 100.5 ? 100.5 : achievement) *
            rank.factor *
            lvConstant
        );
    }
}

function isNew(version: string, name: string) {
    return (
        version === 'PRiSM PLUS' ||
        // Hotfixes: KOP Songs and songs that somehow miss the first check
        name ===
            'False Amber (from the Black Bazaar, Or by A Kervan Trader from the Lands Afar, Or Buried Beneath the Shifting Sands That Lead Everywhere but Nowhere)' ||
        name ===
            'Åntinomiε' ||
        name ===
            'World\'s end BLACKBOX'
    );
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl;

    try {
        const clal = url.searchParams.get('clal');

        if (!clal) {
            throw new Error('Missing clal');
        }

        const redirects = [
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=0',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=1',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=2',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=3',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=4',
        ];

        const res: MaimaiSongScore[] = [];

        const htmls = await fetchPages(clal, redirects);

        for (const html of htmls) {
            const $ = cheerio.load(html);
            res.push(...extractScore($));
        }

        let db = client.db();

        const collection = db.collection('maimaiSongs');
        const finalRes: MSSB50[] = [];

        const titles = Array.from(new Set(res.map((r) => r.name)));

        const docs = await collection
            .find(
                { title: { $in: titles } },
                { projection: { title: 1, sheets: 1 } }
            )
            .toArray();

        const docMap = new Map<string, { title: string; sheets: MoreInfo[] }>();
        for (const d of docs) {
            if (d && d.title) docMap.set(d.title, d as any);
        }

        for (const r of res) {
            const qRes = docMap.get(r.name);

            if (!qRes) {
                throw new Error(`Couldn't find song ${r.name} (${r.diff})`);
            }

            const sheets: MoreInfo[] = qRes.sheets;

            const sheet = sheets.find(s => s.type === r.isDx && s.difficulty === r.diff);

            if (!sheets || !sheet) {
                console.warn(
                    `No sheet info for ${r.name} diff ${r.diff} — skipping`
                );
                continue;
            }

            finalRes.push({
                levelConst: sheet.internalLevelValue,
                name: r.name,
                score: r.score,
                diff: r.diff,
                dx: r.dx,
                isDx: r.isDx,
                sync: r.sync,
                combo: r.combo,
                rank: r.rank,
                rating: 0,
                version: sheet.version,
                achievement: Number(r.score.slice(0, -1)),
            });
        }

        let b35: MSSB50[] = [];
        let b15: MSSB50[] = [];

        for (const r of finalRes) {
            r.rating = Math.floor(
                getRatingByAchievement(r.achievement, r.levelConst)
            );

            if (isNew(r.version, r.name)) b15.push(r);
            else b35.push(r);
        }

        b35.sort((a, b) => b.rating - a.rating);
        b15.sort((a, b) => b.rating - a.rating);

        return NextResponse.json({
            b35: b35.slice(0, 35),
            b15: b15.slice(0, 15),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
