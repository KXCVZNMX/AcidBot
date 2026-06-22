import { NextRequest, NextResponse } from 'next/server';
import {
    DatabaseError,
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

const UserB50Schema = z.object({
    id: z.string().min(1),
    clal: z
        .string()
        .length(64)
        .regex(/^[A-Za-z0-9]+$/),
    profile: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
    old: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: u_id } = await params;
    const url = req.nextUrl;
    const u_clal = url.searchParams.get('clal');
    const u_includeProfile = url.searchParams.get('profile');
    const u_oldB50 = url.searchParams.get('old');

    const parsed = UserB50Schema.safeParse({
        id: u_id,
        clal: u_clal,
        profile: u_includeProfile ?? undefined,
        old: u_oldB50 ?? undefined,
    });

    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, { status: 400 });
    }

    const { id, clal, profile, old } = parsed.data;

    const homeRedirect = 'https://maimaidx-eng.com/maimai-mobile/home/';

    try {
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

        const res: MaimaiSongScore[] = [];

        let htmls;
        try {
            htmls = await fetchPage(clal, redirects);
        } catch (fetchError) {
            console.error(fetchError);
            return NextResponse.json(InvalidClalToken, { status: 401 });
            // TODO: This is assuming invalid clal token right now (which is most of the case). But there are cases of upstream maintenance as well
            // TODO: I don't know the error code for it right now. Once I find out i need to modify fetchPage to return those codes.
        }

        const profileBlock = parseProfileBlock(htmls[htmls.length - 1]);

        if (old) {
            const db = client.db();
            const doc = await db
                .collection('userB50')
                .findOne({ _id: new ObjectId(id) });
            if (!doc) {
                return NextResponse.json(UserNotFoundOrNoPrev, { status: 404 });
            }

            return NextResponse.json(
                {
                    b35: doc.b35,
                    b15: doc.b15,
                    profile: profileBlock,
                },
                { status: 200 }
            );
        }

        try {
            for (const html of htmls.slice(0, -1)) {
                const $ = cheerio.load(html);
                res.push(...extractScore($, 'getB50'));
            }
        } catch (fetchError) {
            console.error(fetchError);
            return NextResponse.json(InvalidClalToken, { status: 401 });
            // TODO: This is assuming invalid clal token right now (which is most of the case). But there are cases of upstream maintenance as well
            // TODO: I don't know the error code for it right now. Once I find out i need to modify fetchPage to return those codes.
        }

        const finalRes: MSSB50[] = [];
        const docMap = await getSongInfoMap(client.db(), res);

        for (const r of res) {
            const qRes = docMap.get(r.name);
            if (!qRes) {
                return NextResponse.json(DatabaseError, { status: 500 });
            }

            if (!qRes.image_url) {
                console.warn(`Failed to find jacket information for ${r.name}`);
                continue;
            }

            finalRes.push(toB50Score(r, qRes));
        }

        const { b35: slicedB35, b15: slicedB15 } = splitB50(finalRes);

        if (slicedB15.length === 0 && slicedB35.length === 0) {
            return NextResponse.json(InvalidClalToken, { status: 401 });
        }

        await client
            .db()
            .collection('userB50')
            .updateOne(
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

        return NextResponse.json(
            {
                b35: slicedB35,
                b15: slicedB15,
                profile: profileBlock,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(DatabaseError, { status: 500 });
    }
}
