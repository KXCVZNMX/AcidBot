import { NextRequest, NextResponse } from 'next/server';
import { MaimaiFetchData, MaimaiSongScore } from '@/lib/types';
import { COMBO_RULES, SYNC_RULES } from '@/lib/consts';
import * as cheerio from 'cheerio';
import fetchCookie from "fetch-cookie";

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
        const { clal, redirect }: MaimaiFetchData = await req.json();

        const jar = new fetchCookie.toughCookie.CookieJar();
        await jar.setCookie(
            `clal=${clal}; Domain=lng-tgk-aime-gw.am-all.net; Path=/; Secure; HttpOnly`,
            "https://lng-tgk-aime-gw.am-all.net/"
        );
        const fetchWithCookie = fetchCookie(fetch, jar)

        const userAgent =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';

        const res = await fetchWithCookie(
            'https://lng-tgk-aime-gw.am-all.net/common_auth/login?' +
            'site_id=maimaidxex&' +
            `redirect_url=https://maimaidx-eng.com/maimai-mobile/home/&` +
            'back_url=https://maimai.sega.com/',
            {
                method: 'GET',
                redirect: 'manual',
                headers: {
                    'User-Agent': userAgent,
                }
            }
        )

        if (res.status !== 302) {
            throw new Error('The link did not return a redirect');
        }

        let next = res.headers.get('location');

        if (!next) {
            throw new Error('The Link did not return a valid redirect');
        }

        await fetchWithCookie(next, {
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
            }
        })

        const resultsRes =  await fetchWithCookie(redirect, {
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
            }
        })

        const html = await resultsRes.text();

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
