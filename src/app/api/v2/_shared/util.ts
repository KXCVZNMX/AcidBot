import client from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function getClal(id: string): Promise<string | null> {
    const db = client.db();
    const userInfo = await db
        .collection('users')
        .findOne({ _id: new ObjectId(id) }, { projection: { clal: 1 } });

    return userInfo ? (userInfo.clal as string) : null;
}
