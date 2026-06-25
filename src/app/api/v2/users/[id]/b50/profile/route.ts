import { NextRequest, NextResponse } from 'next/server';
import {DatabaseError, MalformedRequest, UserNotFoundOrNoPrev} from '@/app/api/v2/_shared/types';
import fetchPage from '@/lib/fetchPage';
import { z } from 'zod';
import { parseProfileBlock } from '@/app/api/_shared/util';
import {ObjectId} from 'mongodb';
import client from '@/lib/db';

export const UserClalSchema = z.object({
    id: z.string().min(1),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: u_id } = await params;
    const parsed = UserClalSchema.safeParse({ id: u_id });
    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, { status: 400 });
    }

    const { id } = parsed.data;

    const db = client.db();
    const userInfo = await db
        .collection('users')
        .findOne(
            { _id: new ObjectId(id) },
            { projection: { clal: 1 } }
        );
    if (!userInfo) {
        return NextResponse.json(UserNotFoundOrNoPrev, { status: 404 });
    }

    const clal = userInfo.clal;

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
        return NextResponse.json(DatabaseError, { status: 500 });
    }
}
