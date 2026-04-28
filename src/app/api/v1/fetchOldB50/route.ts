import { auth } from '@/auth';
import client from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = session.user.id;

    const db = client.db();
    const doc = await db
        .collection('userB50')
        .findOne({ userId: id });
    if (!doc) {
        return NextResponse.json({ b15: [], b35: [] });
    }

    return NextResponse.json({ b15: doc.b15, b35: doc.b35 });
}
