import { MSSB50, SongTags } from '@/lib/types';
import { NextResponse } from 'next/server';
import client from '@/lib/db';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';

type OldB50Format = {
    b15: MSSB50[];
    b35: MSSB50[];
};

export async function GET() {
    try {
        const session = await auth();
        const id = session!.user?.id ?? '';

        const site_link = process.env.SITE_LINK ?? 'https://acid.kvznmx.com/';

        const db = client.db();
        const doc = await db
            .collection('userB50')
            .findOne({ _id: new ObjectId(id) });
        if (!doc) {
            return NextResponse.json({
                error: 'Error while fetching old B50, likely because you are not logged in, or you do not have a prior record',
            });
        }

        const res: SongTags[] = [];

        for (const song of doc.b15.concat(doc.b35)) {
            let doc = await db.collection('songTags').findOne({
                songName: song.name,
                sheetDifficulty: song.diff,
            });

            if (!doc) {
                console.warn(
                    `Failed to fetch song tags for ${song.name} (${song.diff}) -- skipped`
                );
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
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
