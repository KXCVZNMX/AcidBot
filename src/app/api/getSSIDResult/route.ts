import { NextRequest, NextResponse } from "next/server";
import { MaimaiFetchData, MaimaiSongScore } from "@/lib/types";
import {chromium} from "playwright";

export async function POST(req: NextRequest) {
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

            const name = root.find(".music_name_block").text().trim();

            const scoreBlocks = root.find(".music_score_block");

            const score = scoreBlocks.eq(0).text().trim();
            const dx = scoreBlocks.eq(1).text().trim();

            if (score !== '' && dx !== '') {
                results.push({
                    name,
                    score,
                    dx,
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
