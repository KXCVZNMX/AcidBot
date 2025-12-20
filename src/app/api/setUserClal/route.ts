import {NextRequest, NextResponse} from "next/server";
import client from "@/lib/db";
import {ObjectId} from "mongodb";

export async function POST(req: NextRequest) {
    const url = req.nextUrl;

    try {
        const id = url.searchParams.get('id');
        const clal = url.searchParams.get('clal');
        if (!id || !clal) {
            throw new Error('Missing either id or clal');
        }

        const db = client.db();
        await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    clal: clal,
                }
            }
        )

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return NextResponse.json((error as Error).message, { status: 500 });
    }
}