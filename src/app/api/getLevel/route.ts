import { NextRequest, NextResponse } from 'next/server';
import { MaimaiFetchData, MaimaiSongScore } from '@/lib/types';
import { COMBO_RULES, SYNC_RULES } from '@/lib/consts';
import * as cheerio from 'cheerio';
import fetchCookie from 'fetch-cookie';
import fetchPage from "@/lib/fetchPage";

export async function POST(req: NextRequest) {
    const matchRule = (
        src: string,
        rules: [string, string][]
    ): string | null => {
        for (const [needle, value] of rules) {
            if (src.includes(needle)) return value;
        }
        return null;
    };

    const determineRank = (achievement: string) => {
        const a = parseFloat(achievement.replace('%', ''));
        if (a > 100.5) {
            return 'SSS+';
        } else if (a > 100.0 && a < 100.5) {
            return 'SSS';
        } else if (a > 99.5 && a < 100.0) {
            return 'SS+';
        } else if (a > 99.0 && a < 99.5) {
            return 'SS';
        } else if (a > 98.0 && a < 99.0) {
            return 'S+';
        } else if (a > 97.0 && a < 98.0) {
            return 'S';
        } else if (a > 94.0 && a < 97.0) {
            return 'AAA';
        } else if (a > 90.0 && a < 94.0) {
            return 'AA';
        } else if (a > 80.0 && a < 90.0) {
            return 'A';
        } else if (a > 75.0 && a < 80.0) {
            return 'BBB';
        } else if (a > 70.0 && a < 75.0) {
            return 'BB';
        } else if (a > 60.0 && a < 70.0) {
            return 'B';
        } else if (a > 50.0 && a < 60.0) {
            return 'C';
        } else {
            return 'D';
        }
    };

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
