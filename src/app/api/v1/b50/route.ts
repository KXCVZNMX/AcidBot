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
import { Best50Songs, Best50SongsWithDateRating } from '@/lib/types';

type DBData = {
    userId: string;
    b50s: Best50SongsWithDateRating[];
};

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    const encoder = new TextEncoder();

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

    const stream = new ReadableStream({
        async start(controller) {
            try {
                const res: MaimaiSongScore[] = [];
                let htmls;

                try {
                    htmls = await fetchPage(clal, redirects, (current, total, url) => {
                        const progressPacket = JSON.stringify({
                            type: 'progress',
                            current,
                            total,
                            url
                        }) + '\n';
                        controller.enqueue(encoder.encode(progressPacket));
                    });
                } catch (fetchError) {
                    console.error(fetchError);
                    const errorMsg = `Page likely didn't return a redirect, get clal again. (${(fetchError as Error).message})`;
                    controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: errorMsg }) + '\n'));
                    controller.close();
                    return;
                }

                controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', message: 'Parsing download structures...' }) + '\n'));

                if (!Array.isArray(htmls)) {
                    controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: htmls || 'Unknown fetching issue' }) + '\n'));
                    controller.close();
                    return;
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
                    let qRes = docMap.get(r.name);

                    if (!qRes) {
                        console.error('Lookup failed, fetching information from JP db');

                        const fetched = (await db
                            .collection('maimaiJpSongInfo')
                            .findOne({ title: r.name })) as SongInfo | null;

                        qRes = fetched ?? undefined;

                        if (!qRes) {
                            throw new Error(`Couldn't find song ${r.name} (${r.diff})`);
                        }
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

                const finalDataPacket = JSON.stringify({
                    type: 'done',
                    b35: slicedB35,
                    b15: slicedB15
                }) + '\n';

                controller.enqueue(encoder.encode(finalDataPacket));
            } catch (error) {
                console.error(error);
                const catchMsg = (error as Error).message;
                controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: catchMsg }) + '\n'));
            } finally {
                controller.close()
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    });
}

const calculateRating = (b50: Best50Songs) =>
    [...b50.b35, ...b50.b15].reduce((sum, s) => sum + s.rating, 0);

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            unauthorized();
        }

        const id = session.user?.id ?? '';
        const b50: Best50Songs = await req.json();

        const newEntry: Best50SongsWithDateRating = {
            b50,
            createdAt: new Date(),
            rating: calculateRating(b50),
        };

        const db = client.db();
        await db
            .collection<DBData>('userOldB50')
            .updateOne(
                { _id: new ObjectId(id) },
                { $push: { b50s: newEntry } },
                { upsert: true }
            );

        return NextResponse.json({});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
