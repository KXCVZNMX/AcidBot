import { NextRequest, NextResponse } from 'next/server';
import {
    DatabaseError,
    InvalidClalToken,
    MalformedRequest,
} from '@/app/api/v2/_shared/types';
import { UserClalSchema } from '@/app/api/v2/_shared/schemas';
import { MaimaiSongScore, MSSB50 } from '@/lib/types';
import fetchPage from '@/lib/fetchPage';
import { extractScore } from '@/lib/util';
import * as cheerio from 'cheerio';
import client from '@/lib/db';
import { SongInfo } from '@/app/api/_shared/types';
import {
    getLevelConst,
    getRatingByAchievement,
    isNewByDate,
} from '@/app/api/_shared/util';
import { ObjectId } from 'mongodb';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: u_id } = await params;
    const url = req.nextUrl;
    const u_clal = url.searchParams.get('clal');

    const parsed = UserClalSchema.safeParse({ id: u_id, clal: u_clal });

    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, { status: 400 });
    }

    const { id, clal } = parsed.data;

    try {
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
            return NextResponse.json(InvalidClalToken, { status: 401 });
            // TODO: This is assuming invalid clal token right now (which is most of the case). But there are cases of upstream maintenance as well
            // TODO: I don't know the error code for it right now. Once I find out i need to modify fetchPage to return those codes.
        }

        for (const html of htmls) {
            const $ = cheerio.load(html);
            res.push(...extractScore($, 'getB50'));
        }

        const collection = client.db().collection('maimaiIntlSongInfo');

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
                return NextResponse.json(DatabaseError, { status: 402 });
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
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(DatabaseError, { status: 500 });
    }
}
