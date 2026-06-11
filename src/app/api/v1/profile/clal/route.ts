import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
    const url = req.nextUrl;

    try {
        const id = url.searchParams.get('id');
        const clal = url.searchParams.get('clal');
        if (!id || !clal) throw new Error('Missing params');

        const db = client.db();
        await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: { clal: clal } }
        );

        // Instead of redirecting the HTTP request, we send back JavaScript
        // that forces the browser to navigate to your success page!
        const successUrl = new URL('/pages/ClalFetchSuccess', url).toString();
        const jsCode = `window.location.href = "${successUrl}";`;
        // Use window.open("${successUrl}", "_blank"); if you want a new window!

        const ret = new NextResponse(jsCode, {
            status: 200,
            headers: { 'Content-Type': 'application/javascript' },
        });

        ret.cookies.set('clal', encodeURIComponent(clal), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
        });

        return ret;
    } catch {
        const failureUrl = new URL('/pages/ClalFetchFailure', url).toString();
        return new NextResponse(`window.location.href = "${failureUrl}";`, {
            status: 200,
            headers: { 'Content-Type': 'application/javascript' },
        });
    }
}