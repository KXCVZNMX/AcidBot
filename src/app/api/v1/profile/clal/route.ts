import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getAuthenticatedUserId } from '@/app/api/_shared/auth';

export async function GET(req: NextRequest) {
    const url = req.nextUrl;

    try {
        const clal = url.searchParams.get('clal');
        const id = await getAuthenticatedUserId();
        if (!id || !clal) {
            throw new Error('Missing clal or authenticated user');
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

        return NextResponse.redirect(
            new URL('/pages/clal-fetch-success', url),
            { status: 302 }
        );
    } catch {
        return NextResponse.redirect(
            new URL('/pages/clal-fetch-failure', url),
            {
                status: 302,
            }
        );
    }
}
