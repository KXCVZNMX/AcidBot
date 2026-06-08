import { NextRequest, NextResponse } from 'next/server';
import { MaimaiSongScore, MSSB50, SongEntry } from '@/lib/types';
import * as cheerio from 'cheerio';
import fetchPage from '@/lib/fetchPage';
import { extractScore } from '@/lib/util';
import client from '@/lib/db';
import { RANK_DEFINITIONS } from '@/lib/consts';

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

export async function POST(req: NextRequest) {
    try {
        const { clal, redirect } = await req.json();

        let html;
        try {
            html = await fetchPage(clal, redirect);
        } catch (fetchError) {
            console.error(fetchError);
            return NextResponse.json(
                {
                    error: `Page likely didn't return a redirect, get clal again. (${(fetchError as Error).message})`,
                },
                { status: 500 }
            );
        }

        if (html.includes('ERROR')) {
            throw new Error(
                'This page either returned a 100001 or 200002 or 200004 error'
            );
        }

        const $ = cheerio.load(html[0]);
        const results: MaimaiSongScore[] = extractScore($, 'getLevel');

        if (results.length === 0) {
            return NextResponse.json(
                {
                    error: 'Either the page didn\'t return a redirect (get a new clal), or you don\'t have any results for this level',
                },
                { status: 500 }
            );
        }

        const db = client.db();

        const collection = db.collection<SongEntry>('maimaiIntlSongInfo');
        const finalRes: MSSB50[] = [];

        const titles = Array.from(new Set(results.map((r) => r.name)));

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

        for (const r of results) {
            const qRes = docMap.get(r.name);

            // console.log(qRes);
            // console.log(r.isDx);

            if (!qRes) {
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

        for (const r of finalRes) {
            r.rating = Math.floor(
                getRatingByAchievement(r.achievement, r.levelConst)
            );
        }

        return NextResponse.json(finalRes);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
