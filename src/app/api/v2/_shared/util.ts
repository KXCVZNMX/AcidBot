import client from '@/lib/db';
import { ObjectId } from 'mongodb';
import { FetchError, InvalidClalToken, UpstreamMaintenance, type ErrorResponse } from './types';
import { FetchPageError } from '@/lib/fetchPage';

export function mapFetchPageError(error: unknown): { body: ErrorResponse; status: number } {
    if (error instanceof FetchPageError) {
        if (error.code === 'AUTHENTICATION_FAILED') {
            return { body: InvalidClalToken, status: 401 };
        }

        if (error.code === 'UPSTREAM_UNAVAILABLE') {
            return { body: UpstreamMaintenance, status: 503 };
        }
    }

    return { body: FetchError, status: 502 };
}

export async function getClal(id: string): Promise<string | null> {
    const db = client.db();
    const userInfo = await db.collection('users').findOne({ _id: new ObjectId(id) }, { projection: { clal: 1 } });

    return userInfo ? (userInfo.clal as string) : null;
}
