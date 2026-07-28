import { NextResponse } from 'next/server';
import fetchPage from '@/lib/fetchPage';
import { parseProfileBlock } from '@/app/api/_shared/util';
import { getAuthenticatedClal } from '@/app/api/_shared/auth';

export async function GET() {
    try {
        const user = await getAuthenticatedClal();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        if (!user.clal) {
            return NextResponse.json(
                { error: 'Missing clal. Set a new clal token from the guide.' },
                { status: 400 }
            );
        }

        let html;
        try {
            html = await fetchPage(
                user.clal,
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
