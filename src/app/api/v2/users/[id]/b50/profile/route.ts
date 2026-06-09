import {NextRequest, NextResponse} from 'next/server';
import {MalformedRequest} from '@/app/api/v2/_shared/types';
import fetchPage from '@/lib/fetchPage';
import {ParsedProfile, UserCollectionCount} from '@/lib/types';
import * as cheerio from 'cheerio';
import {z} from 'zod';

export const UserClalSchema = z.object({
    id: z.string().min(1),
    clal: z
        .string()
        .length(64)
        .regex(/^[A-Za-z0-9]+$/),
});

function toProxiedUrl(src: string): string {
    if (!src) return src;
    try {
        const u = new URL(src);
        // Only proxy http(s) URLs that are genuinely cross-origin.
        if (u.protocol === 'http:' || u.protocol === 'https:') {
            return `/api/v1/images/proxy?url=${encodeURIComponent(src)}`;
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

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const {id: u_id} = await params;
    const url = req.nextUrl;
    const u_clal = url.searchParams.get('clal');

    const parsed = UserClalSchema.safeParse({id: u_id, clal: u_clal});

    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, {status: 400});
    }

    const {clal} = parsed.data;

    try {
        let html;
        try {
            html = await fetchPage(
                clal,
                'https://maimaidx-eng.com/maimai-mobile/home/'
            );
        } catch (fetchError) {
            console.error(fetchError);
            return;
            // TODO: Return errors
        }
        const res = parseProfileBlock(html[0]);

        if (!res) {
            // TODO: Return errors
        }

        return NextResponse.json(res);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}