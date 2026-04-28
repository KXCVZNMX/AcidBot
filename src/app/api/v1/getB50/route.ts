import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { extractScore } from '@/lib/util';
import { MaimaiSongScore, MSSB50 } from '@/lib/types';
import client from '@/lib/db';
import { RANK_DEFINITIONS } from '@/lib/consts';
import { auth } from '@/auth';
import fetchPage from '@/lib/fetchPage';

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

function parseDate(input: string): Date {
    if (!/^\d{8}$/.test(input)) {
        throw new Error('Invalid format. Expected YYYYMMDD');
    }

    const year = Number(input.slice(0, 4));
    const month = Number(input.slice(4, 6)) - 1; // JS months are 0-based
    const day = Number(input.slice(6, 8));

    const date = new Date(year, month, day);

    // Validate to catch invalid dates like 20250230
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
    ) {
        throw new Error('Invalid date');
    }

    return date;
}

function isNewByDate(date: string) {
    return parseDate(date) >= parseDate('20250724'); // Prism Plus Release Date
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl;

    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        const docMap = new Map<
            string,
            {
                title: string;
                image_url: string;
                date_intl_added: string;
                lev_bas_i: string;
                lev_adv_i: string;
                lev_exp_i: string;
                lev_mas_i: string;
                lev_remas_i: string;
                dx_lev_bas_i: string;
                dx_lev_adv_i: string;
                dx_lev_exp_i: string;
                dx_lev_mas_i: string;
                dx_lev_remas_i: string;
            }
        >();
        for (const d of docs) {
            if (d && d.title)
                docMap.set(
                    d.title,
                    d as unknown as {
                        title: string;
                        image_url: string;
                        date_intl_added: string;
                        lev_bas_i: string;
                        lev_adv_i: string;
                        lev_exp_i: string;
                        lev_mas_i: string;
                        lev_remas_i: string;
                        dx_lev_bas_i: string;
                        dx_lev_adv_i: string;
                        dx_lev_exp_i: string;
                        dx_lev_mas_i: string;
                        dx_lev_remas_i: string;
                    }
                );
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

            let levelConst: string = '0';

            if (r.isDx === 'dx') {
                if (r.diff === 'basic' && qRes.dx_lev_bas_i)
                    levelConst = qRes.dx_lev_bas_i;
                else if (r.diff === 'advanced' && qRes.dx_lev_adv_i)
                    levelConst = qRes.dx_lev_adv_i;
                else if (r.diff === 'expert' && qRes.dx_lev_exp_i)
                    levelConst = qRes.dx_lev_exp_i;
                else if (r.diff === 'master' && qRes.dx_lev_mas_i)
                    levelConst = qRes.dx_lev_mas_i;
                else if (r.diff === 'remaster' && qRes.dx_lev_remas_i)
                    levelConst = qRes.dx_lev_remas_i;
            } else if (r.isDx === 'std') {
                if (r.diff === 'basic' && qRes.lev_bas_i)
                    levelConst = qRes.lev_bas_i;
                else if (r.diff === 'advanced' && qRes.lev_adv_i)
                    levelConst = qRes.lev_adv_i;
                else if (r.diff === 'expert' && qRes.lev_exp_i)
                    levelConst = qRes.lev_exp_i;
                else if (r.diff === 'master' && qRes.lev_mas_i)
                    levelConst = qRes.lev_mas_i;
                else if (r.diff === 'remaster' && qRes.lev_remas_i)
                    levelConst = qRes.lev_remas_i;
            } else {
                console.warn(
                    `No sheet info for ${r.name} diff ${r.diff} - skipping`
                );
                levelConst = '0';
            }

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
            { userId: id },
            {
                $set: {
                    userId: id,
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
