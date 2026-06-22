import { NextRequest, NextResponse } from 'next/server';
import { MalformedRequest } from '@/app/api/v2/_shared/types';
import fetchPage from '@/lib/fetchPage';
import { z } from 'zod';
import { parseProfileBlock } from '@/app/api/_shared/util';

export const UserClalSchema = z.object({
    id: z.string().min(1),
    clal: z
        .string()
        .length(64)
        .regex(/^[A-Za-z0-9]+$/),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: u_id } = await params;
    const url = req.nextUrl;
    const u_clal = url.searchParams.get('clal');

    const parsed = UserClalSchema.safeParse({ id: u_id, clal: u_clal });

    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, { status: 400 });
    }

    const { clal } = parsed.data;

    try {
        let html;
        try {
            html = await fetchPage(
                clal,
                'https://maimaidx-eng.com/maimai-mobile/home/'
            );
        } catch (fetchError) {
            console.error(fetchError);
            return;
            // TODO: Return errors
        }
        const res = parseProfileBlock(html[0]);

        if (!res) {
            // TODO: Return errors
        }

        return NextResponse.json(res);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
