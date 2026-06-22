import { NextRequest, NextResponse } from 'next/server';
import { MaimaiSongScore, MSSB50 } from '@/lib/types';
import * as cheerio from 'cheerio';
import fetchPage from '@/lib/fetchPage';
import { extractScore } from '@/lib/util';
import client from '@/lib/db';
import { getSongInfoMap, toB50Score } from '@/app/api/_shared/util';

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

        const finalRes: MSSB50[] = [];
        const docMap = await getSongInfoMap(db, results);

        for (const r of results) {
            const qRes = docMap.get(r.name);

            // console.log(qRes);
            // console.log(r.isDx);

            if (!qRes) {
                throw new Error(`Couldn't find song ${r.name} (${r.diff})`);
            }

            if (!qRes.image_url) {
                console.warn(`Failed to find jacket information for ${r.name}`);
                continue;
            }

            finalRes.push(toB50Score(r, qRes));
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
