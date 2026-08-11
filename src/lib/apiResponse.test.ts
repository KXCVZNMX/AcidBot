import {describe, expect, it} from 'vitest';
import {getResponseError} from '@/lib/apiResponse';

describe('getResponseError', () => {
    it('reads an API error from JSON', async () => {
        const response = Response.json({ error: 'Invalid CLAL token', code: 'AUTHENTICATION_FAILED' }, { status: 401 });

        await expect(getResponseError(response)).resolves.toBe('Invalid CLAL token');
    });

    it('uses a plain-text response body', async () => {
        const response = new Response('Upstream fetch failed', { status: 502 });

        await expect(getResponseError(response)).resolves.toBe('Upstream fetch failed');
    });

    it('falls back to the status when the response is empty', async () => {
        const response = new Response(null, { status: 503, statusText: 'Service Unavailable' });

        await expect(getResponseError(response)).resolves.toBe('Service Unavailable');
    });
});
