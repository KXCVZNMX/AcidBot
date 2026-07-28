import { NextResponse, NextRequest } from 'next/server';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function proxy(request: NextRequest) {
    if (
        request.nextUrl.pathname === '/api/v1/profile/clal-script' ||
        request.nextUrl.pathname.startsWith('/api/auth')
    ) {
        return NextResponse.next();
    }

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

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|assets|b50|maimaiJackets|rating_plates|.*\\.[a-zA-Z0-9]+$).*)',
    ],
};
