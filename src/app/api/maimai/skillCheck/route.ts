import { NextRequest, NextResponse } from 'next/server';
import { MaimaiResults, SongTagsDBEntry } from '@/lib/types/maimai';
import { MongoClient } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        const results: MaimaiResults = await req.json();

        console.log('got detail to get skill check');

        const uri = process.env.MONGODB_URI ?? '';
        const client = new MongoClient(uri);

        await client.connect();

        const db = client.db('SongTag');
        const tags = db.collection<SongTagsDBEntry>('tags');

        let returnList: number[] = [];

        // console.log(results.results)

        for (const r of results.results) {
            const songTags = tags.find({
                song_id: r.name,
                sheet_difficulty: r.difficulty,
                sheet_type: r.isDX ? 'dx' : 'std',
            });

            for await (const s of songTags) {
                returnList.push(s.tag_id);
            }
        }

        // console.log(returnList);

        return NextResponse.json(returnList);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
