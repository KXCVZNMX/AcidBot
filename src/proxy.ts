import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import client from '@/lib/db';
import {ObjectId} from 'mongodb';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function proxy(request: NextRequest) {
    if (request.nextUrl.pathname === '/api/v1/profile/clal-script') {
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

    if (
        request.nextUrl.pathname.startsWith('/pages/Guides') ||
        request.nextUrl.pathname.startsWith('/pages/Abouts')
    ) {
        return NextResponse.next();
    }

    const session = await auth();

    const targetPages = ['/', '/pages/Best50', '/pages/LvScore'];

    if (targetPages.includes(request.nextUrl.pathname)) {
        const response = NextResponse.next();

        if (session) {
            const hasClalCookie = request.cookies.has('clal');

            if (!hasClalCookie) {
                const doc = await client.db().collection('users').findOne(
                    { _id: new ObjectId(session.user?.id ?? '') }
                );

                if (doc && doc.clal) {
                    response.cookies.set('clal', doc.clal, {
                        path: '/',
                        httpOnly: false,
                        secure: false,
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 24 * 7,
                    });
                }
            }
        }
        return response;
    }

    if (!session) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|assets|b50|maimaiJackets|rating_plates|.*\\.[a-zA-Z0-9]+$).*)'
    ],
};
