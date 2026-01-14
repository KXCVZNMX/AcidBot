import {NextRequest, NextResponse} from "next/server";
import client from "@/lib/db";
import {ObjectId} from "mongodb";

type OldB50 = {
    createdAt: Date;
    rating: number;
}

export async function POST(req: NextRequest) {
    let id = req.nextUrl.searchParams.get('id') ?? '';

    try {
        const db = client.db();
        const result = await db.collection('userOldB50').findOne(
            { _id: new ObjectId(id) },
            {
                projection: {
                    _id: 0,
                    "b50s.createdAt": 1,
                    "b50s.rating": 1
                }
            }
        );

        const flatList: OldB50[] = result?.b50s ?? [];

        return NextResponse.json(flatList);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}