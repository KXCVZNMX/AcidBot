import {NextRequest, NextResponse} from "next/server";
import {Best50Songs, Best50SongsWithDateRating} from "@/lib/types";
import { auth } from "@/auth";
import {unauthorized} from "next/navigation";
import client from "@/lib/db";
import { ObjectId } from "mongodb";

type DBData = {
    userId: string;
    b50s: Best50SongsWithDateRating[];
}

const calculateRating = (b50: Best50Songs) =>
    [...b50.b35, ...b50.b15].reduce((sum, s) => sum + s.rating, 0);

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            unauthorized();
        }

        const id = session.user?.id ?? '';
        const b50: Best50Songs = await req.json();

        const newEntry: Best50SongsWithDateRating = {
            b50,
            createdAt: new Date(),
            rating: calculateRating(b50)
        };

        const db = client.db();
        await db.collection<DBData>("userOldB50").updateOne(
            { _id: new ObjectId(id) },
            { $push: { b50s: newEntry }},
            { upsert: true },
        )

        return NextResponse.json({});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}