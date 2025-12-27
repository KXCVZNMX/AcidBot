import {auth} from "@/auth";
import client from "@/lib/db";
import {ObjectId} from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    const id = session!.user?.id ?? '';

    const db = client.db();
    const doc = await db.collection('userB50').findOne({ _id: new ObjectId(id) });
    if (!doc) {
        return NextResponse.json({b15: [], b35: []});
    }

    return NextResponse.json({b15: doc.b15, b35: doc.b35});
}