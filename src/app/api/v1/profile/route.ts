import { NextResponse } from 'next/server';
import fetchPage from '@/lib/fetchPage';
import { parseProfileBlock } from '@/app/api/_shared/util';
import { getAuthenticatedClal } from '@/app/api/_shared/auth';
import { mapV1FetchPageError } from '@/app/api/v1/_shared/fetchPageError';

export async function GET() {
    try {
        const user = await getAuthenticatedClal();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!user.clal) {
            return NextResponse.json({ error: 'Missing clal. Set a new clal token from the guide.' }, { status: 400 });
        }

        let html: string[];
        try {
            html = await fetchPage(user.clal, 'https://maimaidx-eng.com/maimai-mobile/home/');
        } catch (fetchError) {
            console.error(fetchError);
            const failure = mapV1FetchPageError(fetchError);
            return NextResponse.json(failure.body, { status: failure.status });
        }

        const res = parseProfileBlock(html[0]);

        if (!res) {
            return NextResponse.json(
                { error: 'maimai DX returned a page without profile data.', code: 'MISSING_PROFILE' },
                { status: 502 }
            );
        }

        return NextResponse.json(res);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: (error as Error).message, code: 'PROFILE_ERROR' }, { status: 500 });
    }
}
