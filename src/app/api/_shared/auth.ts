import { auth } from '@/auth';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function getAuthenticatedUserId(): Promise<string | null> {
    const session = await auth();
    return session?.user?.id ?? null;
}

export async function getAuthenticatedClal(): Promise<{
    id: string;
    clal: string | null;
} | null> {
    const id = await getAuthenticatedUserId();
    if (!id) {
        return null;
    }

    const user = await client
        .db()
        .collection('users')
        .findOne(
            { _id: new ObjectId(id) },
            { projection: { clal: 1 } }
        );

    return {
        id,
        clal: typeof user?.clal === 'string' && user.clal ? user.clal : null,
    };
}
