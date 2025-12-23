import { NextRequest, NextResponse } from 'next/server';
import { MaimaiSongScore } from '@/lib/types';
import * as cheerio from 'cheerio';
import fetchPage from '@/lib/fetchPage';
import { extractScore } from '@/lib/util';

export async function POST(req: NextRequest) {
    try {
        const { clal, redirect } = await req.json();

        const html = await fetchPage(clal, redirect);

        if (html.includes('ERROR')) {
            throw new Error(
                'This page either returned a 100001 or 200002 or 200004 error'
            );
        }

        const $ = cheerio.load(html);
        const results: MaimaiSongScore[] = extractScore($);

        console.log(results);

        return NextResponse.json(results);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
