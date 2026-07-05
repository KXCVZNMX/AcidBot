import { NextRequest, NextResponse } from 'next/server';
import {
    DatabaseError,
    ErrorResponse,
    InvalidClalToken,
    MalformedRequest,
    UserNotFoundOrNoPrev,
} from '@/app/api/v2/_shared/types';
import { MaimaiSongScore, MSSB50 } from '@/app/api/_shared/types';
import fetchPage from '@/lib/fetchPage';
import { extractScore } from '@/lib/util';
import * as cheerio from 'cheerio';
import client from '@/lib/db';
import {
    getSongInfoMap,
    parseProfileBlock,
    splitB50,
    toB50Score,
} from '@/app/api/_shared/util';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getClal } from '@/app/api/v2/_shared/util';

type B50Payload = {
    b35: MSSB50[];
    b15: MSSB50[];
    profile: ReturnType<typeof parseProfileBlock> | null;
};

type ApiError = {
    response: ErrorResponse;
    status: number;
};

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
    stream: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
});

const homeRedirect = 'https://maimaidx-eng.com/maimai-mobile/home/';

const b50Redirects = [
    'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=0',
    'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=1',
    'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=2',
    'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=3',
    'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=4',
];

const toApiError = (response: ErrorResponse, status: number): ApiError => ({
    response,
    status,
});

const buildRedirects = (old?: boolean, profile?: boolean) =>
    old
        ? profile
            ? [homeRedirect]
            : []
        : [...b50Redirects, ...(profile ? [homeRedirect] : [])];

const loadB50 = async (
    id: string,
    profile?: boolean,
    old?: boolean,
    onProgress?: (current: number, total: number, url: string) => void,
    onFetched?: () => void
): Promise<B50Payload> => {
    const db = client.db();
    const clal = await getClal(id);

    if (!clal) {
        throw toApiError(UserNotFoundOrNoPrev, 404);
    }

    const redirects = buildRedirects(old, profile);
    let htmls: string[] = [];

    if (redirects.length > 0) {
        const fetched = await fetchPage(clal, redirects, onProgress);

        if (!Array.isArray(fetched)) {
            throw toApiError(InvalidClalToken, 401);
        }

        htmls = fetched;
    }

    const profileBlock = profile
        ? parseProfileBlock(htmls[htmls.length - 1])
        : null;

    if (old) {
        const doc = await db
            .collection('userB50')
            .findOne({ _id: new ObjectId(id) });

        if (!doc) {
            throw toApiError(UserNotFoundOrNoPrev, 404);
        }

        return {
            b35: doc.b35,
            b15: doc.b15,
            profile: profileBlock,
        };
    }

    onFetched?.();

    const res: MaimaiSongScore[] = [];
    const scoreHtmls = profile ? htmls.slice(0, -1) : htmls;

    try {
        for (const html of scoreHtmls) {
            const $ = cheerio.load(html);
            res.push(...extractScore($, 'getB50'));
        }
    } catch (fetchError) {
        console.error(fetchError);
        throw toApiError(InvalidClalToken, 401);
    }

    const finalRes: MSSB50[] = [];
    const docMap = await getSongInfoMap(db, res);

    for (const r of res) {
        const qRes = docMap.get(r.name);
        if (!qRes) {
            throw toApiError(DatabaseError, 500);
        }

        if (!qRes.image_url) {
            console.warn(`Failed to find jacket information for ${r.name}`);
            continue;
        }

        finalRes.push(toB50Score(r, qRes));
    }

    const { b35: slicedB35, b15: slicedB15 } = splitB50(finalRes);

    if (slicedB15.length === 0 && slicedB35.length === 0) {
        throw toApiError(InvalidClalToken, 401);
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

    return {
        b35: slicedB35,
        b15: slicedB15,
        profile: profileBlock,
    };
};

const isApiError = (error: unknown): error is ApiError =>
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    'status' in error;

const createB50Stream = (
    id: string,
    profile?: boolean,
    old?: boolean
): Response => {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const sendPacket = (packet: unknown) => {
                controller.enqueue(
                    encoder.encode(`${JSON.stringify(packet)}\n`)
                );
            };

            try {
                const payload = await loadB50(
                    id,
                    profile,
                    old,
                    (current, total, url) => {
                        sendPacket({
                            type: 'progress',
                            current,
                            total,
                            url,
                        });
                    },
                    () => {
                        sendPacket({
                            type: 'status',
                            message: 'Parsing download structures...',
                        });
                    }
                );

                sendPacket({
                    type: 'done',
                    ...payload,
                });
            } catch (error) {
                console.error(error);
                const message = isApiError(error)
                    ? error.response.error
                    : (error as Error).message;

                sendPacket({
                    type: 'error',
                    message,
                });
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
};

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: u_id } = await params;
    const url = req.nextUrl;
    const u_includeProfile = url.searchParams.get('profile');
    const u_oldB50 = url.searchParams.get('old');
    const u_stream = url.searchParams.get('stream');

    const parsed = UserB50Schema.safeParse({
        id: u_id,
        profile: u_includeProfile ?? undefined,
        old: u_oldB50 ?? undefined,
        stream: u_stream ?? undefined,
    });

    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, { status: 400 });
    }

    const { id, profile, old, stream } = parsed.data;

    try {
        if (stream) {
            return createB50Stream(id, profile, old);
        }

        return NextResponse.json(await loadB50(id, profile, old), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        if (isApiError(error)) {
            return NextResponse.json(error.response, { status: error.status });
        }

        return NextResponse.json(DatabaseError, { status: 500 });
    }
}
