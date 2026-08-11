import {NextRequest, NextResponse} from 'next/server';
import {
    DatabaseError,
    FetchError,
    InvalidClalToken,
    MalformedRequest,
    UserNotFoundOrNoPrev,
} from '@/app/api/v2/_shared/types';
import {MaimaiSongScore, MSSB50, SongInfo} from '@/app/api/_shared/types';
import fetchPage from '@/lib/fetchPage';
import {extractScore} from '@/lib/util';
import * as cheerio from 'cheerio';
import client from '@/lib/db';
import {getSongInfoMap, parseProfileBlock, splitB50, toB50Score} from '@/app/api/_shared/util';
import {ObjectId} from 'mongodb';
import {z} from 'zod';
import {getClal} from '@/app/api/v2/_shared/util';

const UserB50Schema = z.object({
    id: z.string().min(1),
    profile: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
    old: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: u_id } = await params;
    const url = req.nextUrl;
    const u_includeProfile = url.searchParams.get('profile');
    const u_oldB50 = url.searchParams.get('old');

    const parsed = UserB50Schema.safeParse({
        id: u_id,
        profile: u_includeProfile ?? undefined,
        old: u_oldB50 ?? undefined,
    });

    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, { status: 400 });
    }

    const { id, profile, old } = parsed.data;

    const clal = await getClal(id);

    if (!clal) {
        return NextResponse.json(InvalidClalToken, { status: 401 });
    }

    const homeRedirect = 'https://maimaidx-eng.com/maimai-mobile/home/';

    const redirects = old
        ? profile
            ? [homeRedirect]
            : []
        : [
              'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=0',
              'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=1',
              'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=2',
              'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=3',
              'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=4',
              ...(profile ? [homeRedirect] : []),
          ];

    console.log(redirects);

    const db = client.db();

    if (old) {
        const doc = await db.collection('userB50').findOne({ _id: new ObjectId(id) });
        if (!doc) {
            return NextResponse.json(DatabaseError, { status: 500 });
        }
        const b15 = doc.b15;
        const b35 = doc.b35;
        let profileBlock: ParsedProfile | null = null;
        if (profile) {
            const profilePage = await fetchPage(clal, redirects);
            profileBlock = parseProfileBlock(profilePage[0]);
            if (!profileBlock) {
                return NextResponse.json(FetchError, { status: 400 });
            }
        }

        return NextResponse.json({ b15, b35, profileBlock }, { status: 200 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            try {
                const res: MaimaiSongScore[] = [];
                let htmls;

                try {
                    htmls = await fetchPage(clal, redirects, (current, total, url) => {
                        const progressPacket =
                            JSON.stringify({
                                type: 'progress',
                                current,
                                total,
                                url,
                            }) + '\n';
                        controller.enqueue(encoder.encode(progressPacket));
                    });
                } catch (fetchError) {
                    console.error(fetchError);
                    controller.enqueue(
                        encoder.encode(
                            JSON.stringify({
                                type: 'error',
                                code: InvalidClalToken.code,
                                message: InvalidClalToken.error,
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
                                code: FetchError.code,
                                message: FetchError.error,
                            }) + '\n'
                        )
                    );
                    controller.close();
                    return;
                }

                for (const html of htmls.slice(0, -1)) {
                    const $ = cheerio.load(html);
                    res.push(...extractScore($, 'getB50'));
                }

                const profileBlock = parseProfileBlock(htmls.at(-1) ?? '');

                const finalRes: MSSB50[] = [];
                const docMap = await getSongInfoMap(db, res);

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

                    if (!qRes.image_url) {
                        console.warn(`Failed to find jacket information for ${r.name}`);
                        continue;
                    }

                    finalRes.push(toB50Score(r, qRes));
                }

                const { b35: slicedB35, b15: slicedB15 } = splitB50(finalRes);

                if (slicedB15.length === 0 && slicedB35.length === 0) {
                    controller.enqueue(
                        encoder.encode(
                            JSON.stringify({
                                type: 'error',
                                code: UserNotFoundOrNoPrev.code,
                                message: UserNotFoundOrNoPrev.error,
                            }) + '\n'
                        )
                    );

                    controller.close();
                    return;
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

                const finalDataPacket =
                    JSON.stringify({
                        type: 'done',
                        b35: slicedB35,
                        b15: slicedB15,
                        profile: profileBlock,
                    }) + '\n';

                controller.enqueue(encoder.encode(finalDataPacket));
            } catch (error) {
                console.error(error);
                const catchMsg = (error as Error).message;
                controller.enqueue(
                    encoder.encode(
                        JSON.stringify({
                            type: 'error',
                            code: 'UNKNOWN',
                            message: catchMsg,
                        }) + '\n'
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
