import fetchPages from "@/lib/fetchPage";
import {NextRequest, NextResponse} from "next/server";
import * as cheerio from 'cheerio';
import {extractScore} from "@/lib/util";
import {MaimaiSongScore} from "@/lib/types";
import client from '@/lib/db';
import {DIFF_INDEX, RANK_DEFINITIONS} from "@/lib/consts";

type Song = {
    name: string;
    level: string;
    score: string;
};

type MoreInfo = {
    internalLevelValue: number;
    version: string;
}

interface MSSB50 extends MaimaiSongScore {
    levelConst: number;
    rating: number;
    version: string;
    achievement: number;
}

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

function isNew(version: string) {
    return version === 'PRiSM PLUS';
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl;

    try {
        const clal = url.searchParams.get("clal");

        if (!clal) {
            throw new Error('Missing clal');
        }

        const redirects = [
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=0',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=1',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=2',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=3',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=4'
        ]

        const res: MaimaiSongScore[] = [];

        for (const url of redirects) {
            const html = await fetchPages(clal, url);
            const $ = cheerio.load(html);
            res.push(...extractScore($));
        }

        let db = client.db();

        const collection = db.collection('maimaiSongs');
        const finalRes: MSSB50[] = [];

        for (const r of res) {
            const qRes = await collection.findOne(
                {
                    'title': r.name,
                    'sheets.difficulty': r.diff,
                }
            );

            if (!qRes) {
                throw new Error(`Couldn't find song ${r.name} (${r.diff})`);
            }

            const sheets: MoreInfo[] = qRes.sheets;

            const index = DIFF_INDEX[r.diff] ?? 0;

            finalRes.push({
                levelConst: sheets[index].internalLevelValue,
                name: r.name,
                score: r.score,
                diff: r.diff,
                dx: r.dx,
                isDx: r.isDx,
                sync: r.sync,
                combo: r.combo,
                rank: r.rank,
                rating: 0,
                version: sheets[index].version,
                achievement: Number(r.score.slice(0, -1)),
            })
        }

        let b35: MSSB50[] = [];
        let b15: MSSB50[] = [];

        for (const r of finalRes) {
            r.rating = Math.floor(
                getRatingByAchievement(
                    r.achievement,
                    r.levelConst
                )
            );

            if (isNew(r.version)) b15.push(r);
            else b35.push(r);
        }

        b35.sort((a, b) => b.rating - a.rating);
        b15.sort((a, b) => b.rating - a.rating);

        return NextResponse.json({b35: b35.slice(0, 35), b15: b15.slice(0, 15)});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: (error as Error).message}, {status: 500})
    }
}