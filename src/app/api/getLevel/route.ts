import { NextRequest, NextResponse } from 'next/server';
import { MaimaiSongScore } from '@/lib/types';
import * as cheerio from 'cheerio';
import fetchPage from '@/lib/fetchPage';
import { extractScore } from '@/lib/util';

export async function POST(req: NextRequest) {
    try {
        const { clal, redirect } = await req.json();

        let html;
        try {
            html = await fetchPage(clal, redirect);
        } catch (fetchError) {
            console.error(fetchError);
            return NextResponse.json({ error: `Page likely didn't return a redirect, get clal again. (${(fetchError as Error).message})` }, { status: 500 })
        }

        if (html.includes('ERROR')) {
            throw new Error(
                'This page either returned a 100001 or 200002 or 200004 error'
            );
        }

        const $ = cheerio.load(html[0]);
        const results: MaimaiSongScore[] = extractScore($);

        if (results.length === 0) {
            return NextResponse.json({ error: `Page likely didn't return a redirect, get clal again.` }, { status: 500 })
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
