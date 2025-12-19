import { NextRequest, NextResponse } from "next/server";
import {MaimaiFetchData, MaimaiSongScore} from "@/lib/types";
import {COMBO_RULES, SYNC_RULES} from '@/lib/consts'
import { chromium } from "playwright";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
    const matchRule = (src: string, rules: [string, string][]): string | null => {
        for (const [needle, value] of rules) {
            if (src.includes(needle)) return value;
        }
        return null;
    }

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

    const { clal, redirect }: MaimaiFetchData = await req.json();

    const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36";

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        extraHTTPHeaders: {
            'Referer': 'https://maimaidx-eng.com/',
        },
        userAgent
    });
    await context.addCookies([
        {
            name: 'clal',
            value: clal,
            url: 'https://lng-tgk-aime-gw.am-all.net',
            httpOnly: true,
            sameSite: 'Lax',
            secure: true,
        }
    ])
    const page = await context.newPage();

    try {
        await page.goto(
            'https://lng-tgk-aime-gw.am-all.net/common_auth/login?' +
            'site_id=maimaidxex&' +
            `redirect_url=https://maimaidx-eng.com/maimai-mobile/home/&` +
            'back_url=https://maimai.sega.com/'
        )

        await page.goto(redirect, { waitUntil: 'domcontentloaded' });

        const html = await page.content();

        if (html.includes('ERROR')) {
            throw new Error('This page either returned a 100001 or 200002 or 200004 error');
        }

        const $ = cheerio.load(html);
        const results: MaimaiSongScore[] = [];

        $("div[class*='music_'][class*='_score_back']").each((_, el) => {
            const root = $(el);

            const icons = root.find("img[src*='music_icon_']");

            let syncState: string | null = null;
            let comboState: string | null = null;

            icons.each((_, img) => {
                const src = $(img).attr("src") ?? "";

                syncState  ||= matchRule(src, SYNC_RULES);
                comboState ||= matchRule(src, COMBO_RULES);
            });

            const name = root.find(".music_name_block").text().trim();

            const scoreBlocks = root.find(".music_score_block");

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
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
