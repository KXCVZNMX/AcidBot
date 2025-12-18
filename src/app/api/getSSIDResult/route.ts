import { NextRequest, NextResponse } from "next/server";
import { MaimaiFetchData, MaimaiSongScore } from "@/lib/types";
import {chromium} from "playwright";

export async function POST(req: NextRequest) {
    const { clal, redirect }: MaimaiFetchData = await req.json();

    const browser = await chromium.launch({ headless: false });
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

        return NextResponse.json({});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
