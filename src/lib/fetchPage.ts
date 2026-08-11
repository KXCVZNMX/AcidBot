import fetchCookie from 'fetch-cookie';

export type FetchPageErrorCode =
    | 'AUTHENTICATION_FAILED'
    | 'UPSTREAM_UNAVAILABLE'
    | 'UPSTREAM_RESPONSE_ERROR'
    | 'REQUEST_FAILED'
    | 'INVALID_RESPONSE';

export class FetchPageError extends Error {
    constructor(
        public readonly code: FetchPageErrorCode,
        message: string,
        public readonly status?: number,
        public readonly originalError?: unknown
    ) {
        super(message);
        this.name = 'FetchPageError';
    }
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

/**
 * Fetches page data sequentially with adaptive delays and error retries.
 * @param clal - Sega authentication token
 * @param redirect - A single URL string or an array of URL strings to fetch
 * @param onProgress - Optional callback function triggered after each successful URL fetch
 * @returns Promise resolving to an array of HTML strings
 * @throws {FetchPageError} When authentication, an upstream response, or a network request fails
 */
export default async function fetchPage(
    clal: string,
    redirect: string | string[],
    onProgress?: (current: number, total: number, url: string) => void
): Promise<string[]> {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
        const jar = new fetchCookie.toughCookie.CookieJar();
        await jar.setCookie(
            `clal=${clal}; Domain=lng-tgk-aime-gw.am-all.net; Path=/; Secure; HttpOnly`,
            'https://lng-tgk-aime-gw.am-all.net/'
        );
        const fetchWithCookie = fetchCookie(fetch, jar);

        const userAgent =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';

        // Adaptive delay variables: start conservative, then adapt based on server responses
        let delay = 500; // initial delay in ms between sequential requests
        const maxDelay = 2000; // cap
        const jitter = 100; // random jitter to avoid perfectly regular intervals
        const maxAttempts = 3; // retries per request on network/5xx/429

        const makeTimeoutSignal = (ms: number) => {
            const ctrl = new AbortController();
            const id = setTimeout(() => ctrl.abort(), ms);
            return { signal: ctrl.signal, clear: () => clearTimeout(id) };
        };

        const res = await fetchWithCookie(
            'https://lng-tgk-aime-gw.am-all.net/common_auth/login?' +
                'site_id=maimaidxex&' +
                'redirect_url=https://maimaidx-eng.com/maimai-mobile/home/&' +
                'back_url=https://maimai.sega.com/',
            {
                method: 'GET',
                redirect: 'manual',
                headers: {
                    'User-Agent': userAgent,
                },
            }
        );

        if (res.status === 429 || res.status >= 500) {
            throw new FetchPageError(
                'UPSTREAM_UNAVAILABLE',
                `Authentication gateway returned status ${res.status}`,
                res.status
            );
        }

        if (res.status !== 302) {
            throw new FetchPageError(
                'AUTHENTICATION_FAILED',
                `Authentication gateway returned status ${res.status} instead of a redirect`,
                res.status
            );
        }

        const next = res.headers.get('location');

        if (!next) {
            throw new FetchPageError('INVALID_RESPONSE', 'Authentication gateway did not return a redirect URL');
        }

        const landingResponse = await fetchWithCookie(next, {
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
                Connection: 'keep-alive',
            },
        });

        if (landingResponse.status === 429 || landingResponse.status >= 500) {
            throw new FetchPageError(
                'UPSTREAM_UNAVAILABLE',
                `maimai DX login returned status ${landingResponse.status}`,
                landingResponse.status
            );
        }

        if (!landingResponse.ok) {
            throw new FetchPageError(
                'AUTHENTICATION_FAILED',
                `maimai DX login returned status ${landingResponse.status}`,
                landingResponse.status
            );
        }

        const result: string[] = [];

        // Normalize string or string[] into a uniform array to avoid code duplication
        const urls = typeof redirect === 'string' ? [redirect] : redirect;
        const total = urls.length;

        // Sequentially fetch each redirect URL using adaptive delays + retries
        for (let i = 0; i < total; i++) {
            const re = urls[i];
            let attempt = 0;
            let text: string | null = null;

            while (attempt < maxAttempts) {
                attempt++;
                const { signal, clear } = makeTimeoutSignal(15000); // 15s timeout
                let response: Response;

                try {
                    response = await fetchWithCookie(re, {
                        method: 'GET',
                        headers: {
                            'User-Agent': userAgent,
                            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            Connection: 'keep-alive',
                            Referer: next ?? undefined,
                        },
                        signal,
                    });
                } catch (error) {
                    clear();

                    if (attempt >= maxAttempts) {
                        throw new FetchPageError(
                            'REQUEST_FAILED',
                            `Failed to fetch ${re} after ${maxAttempts} attempts: ${getErrorMessage(error)}`,
                            undefined,
                            error
                        );
                    }

                    delay = Math.min(maxDelay, delay * 1.8);
                    await sleep(delay + Math.random() * jitter);
                    continue;
                } finally {
                    clear();
                }

                if (response.status === 429 || response.status >= 500) {
                    if (attempt >= maxAttempts) {
                        throw new FetchPageError(
                            'UPSTREAM_UNAVAILABLE',
                            `Upstream returned status ${response.status} for ${re} after ${maxAttempts} attempts`,
                            response.status
                        );
                    }

                    delay = Math.min(maxDelay, delay * 1.8);
                    await sleep(delay + Math.random() * jitter);
                    continue;
                }

                if (!response.ok) {
                    throw new FetchPageError(
                        'UPSTREAM_RESPONSE_ERROR',
                        `Upstream returned status ${response.status} for ${re}`,
                        response.status
                    );
                }

                try {
                    text = await response.text();
                } catch (error) {
                    throw new FetchPageError(
                        'INVALID_RESPONSE',
                        `Failed to read the response from ${re}: ${getErrorMessage(error)}`,
                        response.status,
                        error
                    );
                }

                if (!text) {
                    throw new FetchPageError('INVALID_RESPONSE', `Upstream returned an empty response for ${re}`);
                }

                break;
            }

            if (text === null) {
                throw new FetchPageError('REQUEST_FAILED', `Failed to fetch ${re}`);
            }

            result.push(text);

            // Safely pass status update back out if provided
            if (onProgress) {
                onProgress(i + 1, total, re);
            }
        }

        return result;
    } catch (error) {
        const fetchError =
            error instanceof FetchPageError
                ? error
                : new FetchPageError(
                      'REQUEST_FAILED',
                      `Failed to fetch maimai DX: ${getErrorMessage(error)}`,
                      undefined,
                      error
                  );

        console.error(fetchError);
        throw fetchError;
    }
}
