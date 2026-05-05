import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { extractScore } from '@/lib/util';
import { MaimaiSongScore, MSSB50 } from '@/lib/types';
import client from '@/lib/db';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import fetchPage from '@/lib/fetchPage';
import { unauthorized } from 'next/navigation';
import {
    getLevelConst,
    getRatingByAchievement,
    isNewByDate,
} from '@/app/api/_shared/util';
import { SongInfo } from '@/app/api/_shared/types';

export async function GET(req: NextRequest) {
    const url = req.nextUrl;

    try {
        const session = await auth();

        if (!session) {
            unauthorized();
        }

        const id = session.user?.id ?? '';

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

        let htmls;
        try {
            htmls = await fetchPage(clal, redirects);
        } catch (fetchError) {
            console.error(fetchError);
            return NextResponse.json(
                {
                    error: `Page likely didn't return a redirect, get clal again. (${(fetchError as Error).message})`,
                },
                { status: 500 }
            );
        }

        for (const html of htmls) {
            const $ = cheerio.load(html);
            res.push(...extractScore($, 'getB50'));
        }

        const db = client.db();

        const collection = db.collection('maimaiIntlSongInfo');
        const finalRes: MSSB50[] = [];

        const titles = Array.from(new Set(res.map((r) => r.name)));

        const docs = await collection
            .find(
                { title: { $in: titles } },
                {
                    projection: {
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
                    },
                }
            )
            .toArray();

        const docMap = new Map<string, SongInfo>();
        for (const d of docs) {
            if (d && d.title) docMap.set(d.title, d as unknown as SongInfo);
        }

        for (const r of res) {
            const qRes = docMap.get(r.name);

            if (!qRes) {
                console.error('\n=== LOOKUP FAILED ===');
                console.error(`Looking for: "${r.name}"`);
                console.error(`Difficulty: ${r.diff}`);
                console.error(`Length: ${r.name.length}`);
                console.error(
                    'Character codes:',
                    r.name
                        .split('')
                        .map((c) => `${c}(${c.charCodeAt(0)})`)
                        .join(' ')
                );
                console.error('\nFirst 5 available titles in docMap:');
                Array.from(docMap.keys())
                    .slice(0, 5)
                    .forEach((title, i) => {
                        console.error(
                            `  ${i + 1}. "${title}" (len: ${title.length})`
                        );
                    });
                throw new Error(`Couldn't find song ${r.name} (${r.diff})`);
            }

            const levelConst: string = getLevelConst(r, qRes);

            if (!qRes.image_url) {
                console.warn(`Failed to find jacket information for ${r.name}`);
                continue;
            }

            finalRes.push({
                levelConst: parseFloat(levelConst),
                name: r.name,
                score: r.score,
                diff: r.diff,
                dx: r.dx,
                isDx: r.isDx,
                sync: r.sync,
                combo: r.combo,
                rank: r.rank,
                rating: 0,
                dateIntlAdded: qRes.date_intl_added,
                achievement: Number(r.score.slice(0, -1)),
                jacketURL: qRes.image_url,
            });
        }

        const b35: MSSB50[] = [];
        const b15: MSSB50[] = [];

        for (const r of finalRes) {
            r.rating = Math.floor(
                getRatingByAchievement(r.achievement, r.levelConst)
            );

            if (isNewByDate(r.dateIntlAdded)) b15.push(r);
            else b35.push(r);
        }

        b35.sort((a, b) => b.rating - a.rating);
        b15.sort((a, b) => b.rating - a.rating);

        const slicedB35 = b35.slice(0, 35);
        const slicedB15 = b15.slice(0, 15);

        if (slicedB15.length === 0 && b35.length === 0) {
            return NextResponse.json(
                {
                    error: 'Both of your B15 or B35 was empty, get clal again. (or you just haven\'t played)',
                },
                { status: 500 }
            );
        }

        await db.collection('userB50').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    id: id,
                    b15: slicedB15,
                    b35: slicedB35,
                    updatedAt: new Date(),
                },
            },
            { upsert: true }
        );

        return NextResponse.json({
            b35: slicedB35,
            b15: slicedB15,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
