import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function proxy(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/v2')) {
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 204,
                headers: corsHeaders,
            });
        }

        const response = NextResponse.next();
        for (const [key, value] of Object.entries(corsHeaders)) {
            response.headers.set(key, value);
        }

        return response;
    }

    if (
        request.nextUrl.pathname.startsWith('/pages/Guides') ||
        request.nextUrl.pathname.startsWith('/pages/Abouts')
    ) {
        return NextResponse.next();
    }

    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/pages/:path*', '/api/v2/:path*'],
};
