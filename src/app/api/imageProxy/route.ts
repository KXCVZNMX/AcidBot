import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy external images through the Next.js server so that html-to-image
 * can fetch them as same-origin resources when generating the capture.
 * Without this, Safari and mobile browsers block cross-origin canvas reads,
 * causing the generated image to show only CSS layout with no photo assets.
 *
 * Only URLs whose hostnames are in ALLOWED_HOSTNAMES are proxied.
 */
const ALLOWED_HOSTNAMES = new Set([
    'maimaidx-eng.com',
    'dp4p6x0xfi5o9.cloudfront.net',
    'pbs.twimg.com',
    'avatars.githubusercontent.com',
    'lh3.googleusercontent.com',
]);

export async function GET(req: NextRequest) {
    const rawUrl = req.nextUrl.searchParams.get('url');

    if (!rawUrl) {
        return NextResponse.json(
            { error: 'Missing url parameter' },
            { status: 400 }
        );
    }

    let parsed: URL;
    try {
        parsed = new URL(rawUrl);
    } catch {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    if (!ALLOWED_HOSTNAMES.has(parsed.hostname)) {
        return NextResponse.json(
            { error: 'URL hostname not allowed' },
            { status: 403 }
        );
    }

    const upstream = await fetch(rawUrl);

    if (!upstream.ok) {
        return NextResponse.json(
            { error: 'Failed to fetch upstream image' },
            { status: upstream.status }
        );
    }

    const contentType =
        upstream.headers.get('content-type') ?? 'image/png';
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400, immutable',
            'Access-Control-Allow-Origin': '*',
        },
    });
}
