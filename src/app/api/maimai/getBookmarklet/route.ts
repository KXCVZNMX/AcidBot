import fs from 'node:fs';
import { NextResponse } from 'next/server';
import { bookmarklet } from '@/lib/util/bookmarklet.js';

export async function GET() {
    return NextResponse.json({ bookmarklet: bookmarklet });
}
