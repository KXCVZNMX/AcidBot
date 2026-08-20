import { FetchPageError, type FetchPageErrorCode } from '@/lib/fetchPage';

export interface V1FetchPageErrorResponse {
    error: string;
    code: FetchPageErrorCode | 'UNKNOWN_FETCH_ERROR';
}

export function mapV1FetchPageError(error: unknown): { body: V1FetchPageErrorResponse; status: number } {
    if (!(error instanceof FetchPageError)) {
        return {
            body: {
                error: 'Could not fetch data from maimai DX. Please try again.',
                code: 'UNKNOWN_FETCH_ERROR',
            },
            status: 502,
        };
    }

    switch (error.code) {
        case 'AUTHENTICATION_FAILED':
            return {
                body: {
                    error: 'Your maimai DX session is invalid. Get a new CLAL token and try again.',
                    code: error.code,
                },
                status: 401,
            };
        case 'UPSTREAM_UNAVAILABLE':
            return {
                body: {
                    error: 'maimai DX is temporarily unavailable. Please try again in a moment.',
                    code: error.code,
                },
                status: 503,
            };
        case 'UPSTREAM_RESPONSE_ERROR':
            return {
                body: {
                    error: `maimai DX rejected the request${error.status ? ` with status ${error.status}` : ''}.`,
                    code: error.code,
                },
                status: 502,
            };
        case 'INVALID_RESPONSE':
            return {
                body: {
                    error: 'maimai DX returned an empty or invalid response. Please try again.',
                    code: error.code,
                },
                status: 502,
            };
        case 'REQUEST_FAILED':
            return {
                body: {
                    error: 'Could not connect to maimai DX. Check your connection and try again.',
                    code: error.code,
                },
                status: 502,
            };
    }
}
