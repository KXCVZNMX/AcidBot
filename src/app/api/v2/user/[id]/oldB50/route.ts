import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
    MalformedRequest,
    UserNotFoundOrNoPrev,
} from '@/app/api/v2/_shared/types';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';

const userIdParam = z.object({
    id: z.string().min(1),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: u_id } = await params;
    const parsed = userIdParam.safeParse({ id: u_id });
    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, { status: 400 });
    }
    const { id } = parsed.data;

    const db = client.db();
    const doc = await db
        .collection('userB50')
        .findOne({ _id: new ObjectId(id) });
    if (!doc) {
        return NextResponse.json(UserNotFoundOrNoPrev, { status: 404 });
    }

    return NextResponse.json({ b15: doc.b15, b35: doc.b35 }, { status: 200 });
}
