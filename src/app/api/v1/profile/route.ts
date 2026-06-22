import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { unauthorized } from 'next/navigation';
import fetchPage from '@/lib/fetchPage';
import { parseProfileBlock } from '@/app/api/_shared/util';

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    try {
        const session = await auth();

        if (!session) {
            unauthorized();
        }

        const clal = url.searchParams.get('clal');

        if (!clal) {
            throw new Error('Missing clal');
        }

        let html;
        try {
            html = await fetchPage(
                clal,
                'https://maimaidx-eng.com/maimai-mobile/home/'
            );
        } catch (fetchError) {
            console.error(fetchError);
            return NextResponse.json(
                {
                    error: `Page likely didn't return a redirect, get clal again. (${(fetchError as Error).message})`,
                },
                { status: 500 }
            );
        }

        const res = parseProfileBlock(html[0]);

        if (!res) {
            return NextResponse.json(
                { error: 'Missing profile block' },
                { status: 500 }
            );
        }

        return NextResponse.json(res);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
