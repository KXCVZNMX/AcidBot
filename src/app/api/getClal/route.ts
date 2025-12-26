import {readFile} from "node:fs/promises";
import path from "node:path";
import {NextResponse} from "next/server";

export async function GET() {
    const filePath = path.join(process.cwd(), 'src/lib/getClalCode.js')
    const code = await readFile(filePath, 'utf8');

    return new NextResponse(code, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}