import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { extractScore } from '@/lib/util';
import { MaimaiSongScore, MSSB50 } from '@/app/api/_shared/types';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';
import fetchPage from '@/lib/fetchPage';
import { getSongInfoMap, splitB50, toB50Score } from '@/app/api/_shared/util';
import { SongInfo } from '@/app/api/_shared/types';
import { Best50Songs } from '@/app/api/_shared/types';
import { Best50SongsWithDateRating } from '@/app/api/v1/_shared/types';
import { getAuthenticatedClal, getAuthenticatedUserId } from '@/app/api/_shared/auth';

type DBData = {
    userId: string;
    b50s: Best50SongsWithDateRating[];
};

export async function GET() {
    const encoder = new TextEncoder();

    const user = await getAuthenticatedClal();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!user.clal) {
        return NextResponse.json(
            { error: 'Missing clal. Set a new clal token from the guide.' },
            { status: 400 }
        );
    }
    const clal = user.clal;

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
                    htmls = await fetchPage(
                        clal,
                        redirects,
                        (current, total, url) => {
                            const progressPacket =
                                JSON.stringify({
                                    type: 'progress',
                                    current,
                                    total,
                                    url,
                                }) + '\n';
                            controller.enqueue(encoder.encode(progressPacket));
                        }
                    );
                } catch (fetchError) {
                    console.error(fetchError);
                    const errorMsg = `Page likely didn't return a redirect, get clal again. (${(fetchError as Error).message})`;
                    controller.enqueue(
                        encoder.encode(
                            JSON.stringify({
                                type: 'error',
                                message: errorMsg,
                            }) + '\n'
                        )
                    );
                    controller.close();
                    return;
                }

                controller.enqueue(
                    encoder.encode(
                        JSON.stringify({
                            type: 'status',
                            message: 'Parsing download structures...',
                        }) + '\n'
                    )
                );

                if (!Array.isArray(htmls)) {
                    controller.enqueue(
                        encoder.encode(
                            JSON.stringify({
                                type: 'error',
                                message: htmls || 'Unknown fetching issue',
                            }) + '\n'
                        )
                    );
                    controller.close();
                    return;
                }

                for (const html of htmls) {
                    const $ = cheerio.load(html);
                    res.push(...extractScore($, 'getB50'));
                }

                const db = client.db();

                const finalRes: MSSB50[] = [];
                const docMap = await getSongInfoMap(db, res);

                for (const r of res) {
                    let qRes = docMap.get(r.name);

                    if (!qRes) {
                        console.error(
                            'Lookup failed, fetching information from JP db'
                        );

                        const fetched = (await db
                            .collection('maimaiJpSongInfo')
                            .findOne({ title: r.name })) as SongInfo | null;

                        qRes = fetched ?? undefined;

                        if (!qRes) {
                            throw new Error(
                                `Couldn't find song ${r.name} (${r.diff})`
                            );
                        }
                    }

                    if (!qRes.image_url) {
                        console.warn(
                            `Failed to find jacket information for ${r.name}`
                        );
                        continue;
                    }

                    finalRes.push(toB50Score(r, qRes));
                }

                const { b35: slicedB35, b15: slicedB15 } = splitB50(finalRes);

                if (slicedB15.length === 0 && slicedB35.length === 0) {
                    return NextResponse.json(
                        {
                            error: 'Both of your B15 or B35 was empty, get clal again. (or you just haven\'t played)',
                        },
                        { status: 500 }
                    );
                }

                await db.collection('userB50').updateOne(
                    { _id: new ObjectId(user.id) },
                    {
                        $set: {
                            id: user.id,
                            b15: slicedB15,
                            b35: slicedB35,
                            updatedAt: new Date(),
                        },
                    },
                    { upsert: true }
                );

                const finalDataPacket =
                    JSON.stringify({
                        type: 'done',
                        b35: slicedB35,
                        b15: slicedB15,
                    }) + '\n';

                controller.enqueue(encoder.encode(finalDataPacket));
            } catch (error) {
                console.error(error);
                const catchMsg = (error as Error).message;
                controller.enqueue(
                    encoder.encode(
                        JSON.stringify({ type: 'error', message: catchMsg }) +
                            '\n'
                    )
                );
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    });
}

const calculateRating = (b50: Best50Songs) =>
    [...b50.b35, ...b50.b15].reduce((sum, s) => sum + s.rating, 0);

export async function POST(req: Request) {
    try {
        const id = await getAuthenticatedUserId();
        if (!id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
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
