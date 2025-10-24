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

        const query = {
            $or: results.results.map(r => ({
                songName: r.name,
                isDX: r.isDX,
                sheetDifficulty: r.difficulty,
            })),
        };

        const songTagsList = await tags.find(query).toArray();

        const returnList = songTagsList.flatMap(st => st.tags);

        return NextResponse.json(returnList);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
