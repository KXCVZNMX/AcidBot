import fs from 'node:fs';
import { NextResponse } from 'next/server';

export async function GET() {
    const bookmarklet = fs.readFileSync(
        process.cwd() + '/src/lib/util/bookmarklet.js',
        'utf-8'
    );
    return NextResponse.json({ bookmarklet: bookmarklet });
}
