import fetchCookie from 'fetch-cookie';

/**
 * Fetches page data sequentially with adaptive delays and error retries.
 * @param clal - Sega authentication token
 * @param redirect - A single URL string or an array of URL strings to fetch
 * @param onProgress - Optional callback function triggered after each successful URL fetch
 * @returns Promise resolving to an array of HTML strings, or an error message string
 */
export default async function fetchPage(
    clal: string,
    redirect: string | string[],
    onProgress?: (current: number, total: number, url: string) => void
) {
    const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

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
        const minDelay = 100; // don't go below this
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

        if (res.status !== 302) {
            throw new Error('The link did not return a redirect');
        }

        const next = res.headers.get('location');

        if (!next) {
            throw new Error('The Link did not return a valid redirect');
        }

        await fetchWithCookie(next, {
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
                Connection: 'keep-alive',
            },
        });

        const result: string[] = [];

        // Normalize string or string[] into a uniform array to avoid code duplication
        const urls = typeof redirect === 'string' ? [redirect] : redirect;
        const total = urls.length;

        // Sequentially fetch each redirect URL using adaptive delays + retries
        for (let i = 0; i < total; i++) {
            const re = urls[i];
            let attempt = 0;
            let text = '';

            while (attempt < maxAttempts) {
                attempt++;
                const { signal, clear } = makeTimeoutSignal(15000); // 15s timeout
                try {
                    const res = await fetchWithCookie(re, {
                        method: 'GET',
                        headers: {
                            'User-Agent': userAgent,
                            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            Connection: 'keep-alive',
                            Referer: next ?? undefined,
                        },
                        signal,
                    });
                    clear();

                    // If we got a server busy / rate limit, retry with backoff
                    if (res.status === 429 || res.status >= 500) {
                        delay = Math.min(maxDelay, delay * 1.8);
                        await sleep(delay + Math.random() * jitter);
                        continue; // retry
                    }

                    // Success path: read body and adapt delay down
                    text = await res.text();
                    delay = Math.max(minDelay, Math.floor(delay * 0.85));
                    break; // exit retry loop
                } catch (err) {
                    // Network or abort error - backoff and retry
                    delay = Math.min(maxDelay, delay * 1.8);
                    await sleep(delay + Math.random() * jitter);
                    if (attempt >= maxAttempts) throw err;
                }
            }

            // Push the body we obtained
            result.push(text);

            // Safely pass status update back out if provided
            if (onProgress) {
                onProgress(i + 1, total, re);
            }

            // Wait before the next sequential request (skip sleeping on the final item)
            if (i < total - 1) {
                await sleep(delay + Math.random() * jitter);
            }
        }

        return result;
    } catch (error) {
        console.error(error);
        return (error as Error).message;
    }
}