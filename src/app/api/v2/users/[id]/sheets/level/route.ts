import {NextRequest, NextResponse} from 'next/server';
import {MaimaiSongScore, MSSB50} from '@/app/api/_shared/types';
import * as cheerio from 'cheerio';
import fetchPage from '@/lib/fetchPage';
import {extractScore} from '@/lib/util';
import client from '@/lib/db';
import {getSongInfoMap, parseProfileBlock, toB50Score} from '@/app/api/_shared/util';
import {z} from 'zod';
import {DatabaseError, MalformedRequest, UserNotFoundOrNoPrev} from '@/app/api/v2/_shared/types';
import {getClal, mapFetchPageError} from '@/app/api/v2/_shared/util';

const UserLevelSchema = z.object({
    id: z.string().min(1),
    level: z.string().regex(/^(?:[1-9]|1\d|2[0-3])$/, 'Level must be between 1 and 23'),
    profile: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: u_id } = await params;
    const url = req.nextUrl;
    const u_level = url.searchParams.get('level');
    const u_includeProfile = url.searchParams.get('profile');

    const parsed = UserLevelSchema.safeParse({
        id: u_id,
        level: u_level,
        profile: u_includeProfile ?? undefined,
    });

    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, { status: 400 });
    }

    const { id, profile, level } = parsed.data;

    const clal = await getClal(id);

    if (!clal) {
        return NextResponse.json(UserNotFoundOrNoPrev, { status: 404 });
    }

    try {
        const redirect = profile
            ? [
                  `https://maimaidx-eng.com/maimai-mobile/record/musicLevel/search/?level=${level}`,
                  'https://maimaidx-eng.com/maimai-mobile/home/',
              ]
            : `https://maimaidx-eng.com/maimai-mobile/record/musicLevel/search/?level=${level}`;

        let html;
        try {
            html = await fetchPage(clal, redirect);
        } catch (fetchError) {
            console.error(fetchError);
            const failure = mapFetchPageError(fetchError);
            return NextResponse.json(failure.body, { status: failure.status });
        }

        const $ = cheerio.load(html[0]);
        const results: MaimaiSongScore[] = extractScore($, 'getLevel');

        if (results.length === 0) {
            return NextResponse.json(UserNotFoundOrNoPrev, { status: 404 });
        }

        const db = client.db();
        const finalRes: MSSB50[] = [];
        const docMap = await getSongInfoMap(db, results);

        for (const r of results) {
            const qRes = docMap.get(r.name);

            if (!qRes) {
                throw new Error(`Couldn't find song ${r.name} (${r.diff})`);
            }

            if (!qRes.image_url) {
                console.warn(`Failed to find jacket information for ${r.name}`);
                continue;
            }

            finalRes.push(toB50Score(r, qRes));
        }

        if (profile) {
            const profileBlock = parseProfileBlock(html[1]);
            return NextResponse.json({
                level: finalRes,
                profile: profileBlock,
            });
        }

        return NextResponse.json({
            level: finalRes,
            profile: null,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(DatabaseError, { status: 500 });
    }
}
