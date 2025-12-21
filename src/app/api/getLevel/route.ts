import { NextRequest, NextResponse } from 'next/server';
import { MaimaiFetchData, MaimaiSongScore } from '@/lib/types';
import { COMBO_RULES, SYNC_RULES } from '@/lib/consts';
import * as cheerio from 'cheerio';
import fetchCookie from 'fetch-cookie';
import fetchPage from "@/lib/fetchPage";
import {determineRank, matchRule} from "@/lib/util";

export async function POST(req: NextRequest) {
    try {
        const { clal, redirect } = await req.json();

        const html = await fetchPage(clal, redirect);

        if (html.includes('ERROR')) {
            throw new Error(
                'This page either returned a 100001 or 200002 or 200004 error'
            );
        }

        const $ = cheerio.load(html);
        const results: MaimaiSongScore[] = [];

        $("div[class*='music_'][class*='_score_back']").each((_, el) => {
            const root = $(el);

            const icons = root.find("img[src*='music_icon_']");

            let syncState: string | null = null;
            let comboState: string | null = null;

            icons.each((_, img) => {
                const src = $(img).attr('src') ?? '';

                syncState ||= matchRule(src, SYNC_RULES);
                comboState ||= matchRule(src, COMBO_RULES);
            });

            const name = root.find('.music_name_block').text().trim();

            const scoreBlocks = root.find('.music_score_block');

            const score = scoreBlocks.eq(0).text().trim();
            const dx = scoreBlocks.eq(1).text().trim();

            if (score !== '' && dx !== '') {
                results.push({
                    name,
                    score,
                    dx,
                    sync: syncState,
                    rank: determineRank(score),
                    combo: comboState,
                });
            }
        });

        console.log(results);

        return NextResponse.json(results);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
