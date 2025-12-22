import { NextRequest, NextResponse } from 'next/server';
import { MaimaiFetchData, MaimaiSongScore } from '@/lib/types';
import { COMBO_RULES, SYNC_RULES } from '@/lib/consts';
import * as cheerio from 'cheerio';
import fetchCookie from 'fetch-cookie';
import fetchPage from "@/lib/fetchPage";
import {determineRank, extractScore, matchRule} from "@/lib/util";

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
