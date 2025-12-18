import { NextRequest, NextResponse } from "next/server";
import {COMBO_RULES, MaimaiFetchData, MaimaiSongScore, RANK_RULES, SYNC_RULES} from "@/lib/types";
import { chromium } from "playwright";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
    const matchRule = (src: string, rules: [string, string][]): string | null => {
        for (const [needle, value] of rules) {
            if (src.includes(needle)) return value;
        }
        return null;
    }

    const { clal, redirect }: MaimaiFetchData = await req.json();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        extraHTTPHeaders: {
            'Referer': 'https://maimaidx-eng.com/',
        }
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
            throw new Error('This page either returned a 100001 or 200002 error');
        }

        const $ = cheerio.load(html);
        const results: MaimaiSongScore[] = [];

        $("div[class*='music_'][class*='_score_back']").each((_, el) => {
            const root = $(el);

            const icons = root.find("img[src*='music_icon_']");

            let syncState: string | null = null;
            let comboState: string | null = null;
            let rankState: string | null = null;

            icons.each((_, img) => {
                const src = $(img).attr("src") ?? "";

                syncState  ||= matchRule(src, SYNC_RULES);
                comboState ||= matchRule(src, COMBO_RULES);
                rankState  ||= matchRule(src, RANK_RULES);
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
                    rank: rankState,
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
