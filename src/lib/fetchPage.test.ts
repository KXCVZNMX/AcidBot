import { afterEach, describe, expect, it, vi } from 'vitest';
import fetchPage from '@/lib/fetchPage';

const loginUrl = 'https://maimaidx-eng.com/maimai-mobile/home/';

function redirectResponse() {
    return new Response(null, {
        status: 302,
        headers: { location: loginUrl },
    });
}

describe('fetchPage', () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('resolves with an array of fetched pages and reports progress', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(redirectResponse())
            .mockResolvedValueOnce(new Response('<html>home</html>'))
            .mockResolvedValueOnce(new Response('<html>first</html>'))
            .mockResolvedValueOnce(new Response('<html>second</html>'));
        vi.stubGlobal('fetch', fetchMock);
        const onProgress = vi.fn();
        const urls = ['https://example.com/first', 'https://example.com/second'];

        await expect(fetchPage('clal', urls, onProgress)).resolves.toEqual([
            '<html>first</html>',
            '<html>second</html>',
        ]);
        expect(onProgress).toHaveBeenNthCalledWith(1, 1, 2, urls[0]);
        expect(onProgress).toHaveBeenNthCalledWith(2, 2, 2, urls[1]);
    });

    it('rejects with a typed error when authentication does not redirect', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('<html>login</html>')));

        await expect(fetchPage('invalid-clal', loginUrl)).rejects.toMatchObject({
            name: 'FetchPageError',
            code: 'AUTHENTICATION_FAILED',
            status: 200,
        });
    });

    it('rejects instead of returning an empty page after exhausting retries', async () => {
        vi.useFakeTimers();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValueOnce(redirectResponse())
                .mockResolvedValueOnce(new Response('<html>home</html>'))
                .mockResolvedValueOnce(new Response(null, { status: 503 }))
                .mockResolvedValueOnce(new Response(null, { status: 503 }))
                .mockResolvedValueOnce(new Response(null, { status: 503 }))
        );

        const request = expect(fetchPage('clal', loginUrl)).rejects.toMatchObject({
            name: 'FetchPageError',
            code: 'UPSTREAM_UNAVAILABLE',
            status: 503,
        });

        await vi.runAllTimersAsync();
        await request;
    });
});
