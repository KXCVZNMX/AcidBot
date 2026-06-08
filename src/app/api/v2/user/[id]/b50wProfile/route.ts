import {NextRequest, NextResponse} from 'next/server';
import {UserClalSchema} from '@/app/api/v2/_shared/schemas';
import {DatabaseError, InvalidClalToken, MalformedRequest} from '@/app/api/v2/_shared/types';
import {MaimaiSongScore, MSSB50, ParsedProfile, UserCollectionCount} from '@/lib/types';
import fetchPage from '@/lib/fetchPage';
import * as cheerio from 'cheerio';
import {extractScore} from '@/lib/util';
import client from '@/lib/db';
import {SongInfo} from '@/app/api/_shared/types';
import {getLevelConst, getRatingByAchievement, isNewByDate} from '@/app/api/_shared/util';
import {ObjectId} from 'mongodb';
import {SplitB50Schema} from '@/app/api/v2/_shared/schemas';
import {z} from 'zod';

function toProxiedUrl(src: string): string {
    if (!src) return src;
    const SITE_LINK = process.env.SITE_LINK ?? 'localhost:3000';
    try {
        const u = new URL(src);
        // Only proxy http(s) URLs that are genuinely cross-origin.
        if (u.protocol === 'http:' || u.protocol === 'https:') {
            return `${SITE_LINK}/api/v1/images/proxy?url=${encodeURIComponent(src)}`;
        }
    } catch {
        // relative URL or data: URI – leave as-is
    }
    return src;
}

export function parseProfileBlock(html: string): ParsedProfile | null {
    const $ = cheerio.load(html);

    const container = $('div.basic_block.p_10.f_0').first();
    if (container.length === 0) return null;

    const profilePicture = toProxiedUrl(
        container.find('img.w_112.f_l').first().attr('src') ?? ''
    );
    const dan = toProxiedUrl(
        container.find('img.h_35.f_l:not(.p_l_10)').first().attr('src') ?? ''
    );
    const rank = toProxiedUrl(
        container.find('img.p_l_10.h_35.f_l').first().attr('src') ?? ''
    );
    const userName = container
        .find('div.name_block.f_l.f_16')
        .first()
        .text()
        .trim();
    const userDetail = container
        .find('div.trophy_inner_block.f_13')
        .first()
        .text()
        .trim();
    const collectionDiv = container.find('div.p_l_10.f_l.f_14').first();

    let userCollectionCount: UserCollectionCount | null = null;

    if (collectionDiv.length > 0) {
        const img = toProxiedUrl(
            collectionDiv.find('img.h_30.m_3.v_m').first().attr('src') ?? ''
        );

        const text = collectionDiv
            .clone()
            .children('img')
            .remove()
            .end()
            .text()
            .replace(/\s+/g, ' ')
            .trim();

        userCollectionCount = {
            img,
            text,
        };
    }

    return {
        profilePicture,
        dan,
        rank,
        userName,
        userDetail,
        userCollectionCount,
    };
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const {id: u_id} = await params;
    const url = req.nextUrl;
    const u_clal = url.searchParams.get('clal');
    const u_old = url.searchParams.get('old');

    const parsed = UserClalSchema.extend({
        old: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
    }).safeParse({id: u_id, clal: u_clal, old: u_old ?? undefined});

    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, {status: 400});
    }

    const {id, clal, old} = parsed.data;

    try {
        const homeRedirect = 'https://maimaidx-eng.com/maimai-mobile/home/';
        const redirects = old
            ? [homeRedirect]
            : [
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=0',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=1',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=2',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=3',
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=4',
            homeRedirect,
        ];

        const res: MaimaiSongScore[] = [];
        const htmls = await fetchPage(clal, redirects);

        if (!Array.isArray(htmls)) {
            return NextResponse.json(InvalidClalToken, { status: 401 });
        }

        const profile = parseProfileBlock(htmls[htmls.length - 1]);

        if (old) {
            const oldB50Res = await fetch(
                `${url.origin}/api/v2/user/${id}/oldB50`
            );

            if (!oldB50Res.ok) {
                const body = await oldB50Res.json().catch(() => DatabaseError);
                return NextResponse.json(body, { status: oldB50Res.status });
            }

            const oldB50Data = SplitB50Schema.safeParse(await oldB50Res.json());

            if (!oldB50Data.success) {
                return NextResponse.json(DatabaseError, { status: 500 });
            }

            return NextResponse.json(
                {
                    b35: oldB50Data.data.b35,
                    b15: oldB50Data.data.b15,
                    profile,
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
                profile: profile,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(DatabaseError, { status: 500 });
    }
}