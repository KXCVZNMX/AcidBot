import * as cheerio from 'cheerio';
import { ParsedProfile, UserCollectionCount } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { unauthorized } from 'next/navigation';
import fetchPage from '@/lib/fetchPage';

/**
 * Rewrite an external image URL to a same-origin proxy path.
 * html-to-image captures the DOM via an SVG foreignObject drawn onto a
 * canvas.  On Safari and mobile WebKit, cross-origin <img> elements
 * silently fail to appear in the canvas output.  Routing all profile
 * images through our own /api/imageProxy endpoint keeps every resource
 * same-origin so the capture works correctly on all platforms.
 */
function toProxiedUrl(src: string): string {
    if (!src) return src;
    try {
        const u = new URL(src);
        // Only proxy http(s) URLs that are genuinely cross-origin.
        if (u.protocol === 'http:' || u.protocol === 'https:') {
            return `/api/imageProxy?url=${encodeURIComponent(src)}`;
        }
    } catch {
        // relative URL or data: URI – leave as-is
    }
    return src;
}

export function parseProfileBlock(html: string): ParsedProfile | null {
    const $ = cheerio.load(html);

    const container = $('div.basic_block.p_10.f_0').first();
    if (container.length === 0) return null;

    const profilePicture = toProxiedUrl(
        container.find('img.w_112.f_l').first().attr('src') ?? ''
    );
    const dan = toProxiedUrl(
        container.find('img.h_35.f_l:not(.p_l_10)').first().attr('src') ?? ''
    );
    const rank = toProxiedUrl(
        container.find('img.p_l_10.h_35.f_l').first().attr('src') ?? ''
    );
    const userName = container
        .find('div.name_block.f_l.f_16')
        .first()
        .text()
        .trim();
    const userDetail = container
        .find('div.trophy_inner_block.f_13')
        .first()
        .text()
        .trim();
    const collectionDiv = container.find('div.p_l_10.f_l.f_14').first();

    let userCollectionCount: UserCollectionCount | null = null;

    if (collectionDiv.length > 0) {
        const img = toProxiedUrl(
            collectionDiv.find('img.h_30.m_3.v_m').first().attr('src') ?? ''
        );

        const text = collectionDiv
            .clone()
            .children('img')
            .remove()
            .end()
            .text()
            .replace(/\s+/g, ' ')
            .trim();

        userCollectionCount = {
            img,
            text,
        };
    }

    return {
        profilePicture,
        dan,
        rank,
        userName,
        userDetail,
        userCollectionCount,
    };
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    try {
        const session = await auth();

        if (!session) {
            unauthorized();
        }

        const clal = url.searchParams.get('clal');

        if (!clal) {
            throw new Error('Missing clal');
        }

        let html;
        try {
            html = await fetchPage(
                clal,
                'https://maimaidx-eng.com/maimai-mobile/home/'
            );
        } catch (fetchError) {
            console.error(fetchError);
            return NextResponse.json(
                {
                    error: `Page likely didn't return a redirect, get clal again. (${(fetchError as Error).message})`,
                },
                { status: 500 }
            );
        }

        const res = parseProfileBlock(html[0]);

        if (!res) {
            return NextResponse.json(
                { error: 'Missing profile block' },
                { status: 500 }
            );
        }

        return NextResponse.json(res);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
