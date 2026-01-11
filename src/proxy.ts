import { NextResponse, NextRequest } from 'next/server'
import {auth} from "@/auth";

export async function proxy(request: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { error: "Forbidden" },
            { status: 403 }
        )
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/pages/:path*'],
}