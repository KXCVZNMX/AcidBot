import {describe, expect, it} from 'vitest';
import {FetchPageError} from '@/lib/fetchPage';
import {mapV1FetchPageError} from './fetchPageError';

describe('mapV1FetchPageError', () => {
    it('maps authentication failures to an actionable 401 response', () => {
        const result = mapV1FetchPageError(
            new FetchPageError('AUTHENTICATION_FAILED', 'Authentication gateway returned status 200', 200)
        );

        expect(result).toEqual({
            body: {
                error: 'Your maimai DX session is invalid. Get a new CLAL token and try again.',
                code: 'AUTHENTICATION_FAILED',
            },
            status: 401,
        });
    });

    it('maps exhausted retries to a 503 response', () => {
        const result = mapV1FetchPageError(new FetchPageError('UPSTREAM_UNAVAILABLE', 'Unavailable', 503));

        expect(result).toEqual({
            body: {
                error: 'maimai DX is temporarily unavailable. Please try again in a moment.',
                code: 'UPSTREAM_UNAVAILABLE',
            },
            status: 503,
        });
    });

    it('does not expose unknown exceptions to the client', () => {
        const result = mapV1FetchPageError(new Error('database credentials'));

        expect(result).toEqual({
            body: {
                error: 'Could not fetch data from maimai DX. Please try again.',
                code: 'UNKNOWN_FETCH_ERROR',
            },
            status: 502,
        });
    });
});
