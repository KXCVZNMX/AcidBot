import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';

function corsResponse(response: NextResponse) {
    // You can change '*' to 'https://lng-tgk-aime-gw.am-all.net' for strict security
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}

export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
    return corsResponse(response);
}

export async function PUT(req: NextRequest) {
    const url = req.nextUrl;

    try {
        const id = url.searchParams.get('id');
        const clal = url.searchParams.get('clal');
        if (!id || !clal) {
            throw new Error('Missing either id or clal');
        }

        const db = client.db();
        await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    clal: clal,
                },
            }
        );

        const ret = NextResponse.redirect(
            new URL('/pages/ClalFetchSuccess', url),
            { status: 302 }
        );
        ret.cookies.set('clal', encodeURIComponent(clal), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
        });

        return corsResponse(ret);
    } catch {
        const errRet = NextResponse.redirect(new URL('/pages/ClalFetchFailure', url), {
            status: 302,
        });

        return corsResponse(errRet);
    }
}