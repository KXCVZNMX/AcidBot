import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/db';

type OldB50 = {
    createdAt: Date;
    rating: number;
};

export async function POST(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id') ?? '';

    try {
        const db = client.db();
        const result = await db.collection('userOldB50').findOne(
            { userId: id },
            {
                projection: {
                    _id: 0,
                    'b50s.createdAt': 1,
                    'b50s.rating': 1,
                },
            }
        );

        const flatList: OldB50[] = result?.b50s ?? [];

        return NextResponse.json(flatList);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
