import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
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

        const ret = NextResponse.json({}, { status: 200 });
        ret.cookies.set('clal', encodeURIComponent(clal), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
        });

        return ret;
    } catch (error) {
        return NextResponse.json((error as Error).message, { status: 500 });
    }
}
