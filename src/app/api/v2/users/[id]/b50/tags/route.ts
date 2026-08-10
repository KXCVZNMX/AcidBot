import {z} from 'zod';
import {NextRequest, NextResponse} from 'next/server';
import {DatabaseError, MalformedRequest, UserNotFoundOrNoPrev} from '@/app/api/v2/_shared/types';
import client from '@/lib/db';
import {ObjectId} from 'mongodb';
import {SongTags} from '@/app/api/_shared/types';

export const TagsSchema = z.object({
    id: z.string().min(1),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: u_id } = await params;
    const parsed = TagsSchema.safeParse({ id: u_id });
    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, { status: 400 });
    }

    const { id } = parsed.data;

    try {
        const db = client.db();
        const doc = await db.collection('userB50').findOne({ _id: new ObjectId(id) });
        if (!doc) {
            return NextResponse.json(UserNotFoundOrNoPrev, { status: 404 });
        }

        const res: SongTags[] = [];

        for (const song of doc.b15.concat(doc.b35)) {
            const doc = await db.collection('songTags').findOne({
                songName: song.name,
                sheetDifficulty: song.diff,
            });

            if (!doc) {
                console.warn(`Failed to fetch song tags for ${song.name} (${song.diff}) -- skipped`);
                continue;
            }

            res.push({
                achievement: song.achievement,
                levelConst: song.levelConst,
                tags: doc.tags,
            });
        }

        return NextResponse.json(res);
    } catch (error) {
        console.error(error);
        return NextResponse.json(DatabaseError, { status: 500 });
    }
}
