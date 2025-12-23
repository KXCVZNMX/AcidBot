'use server';

import fetchCookie from 'fetch-cookie';

export default async function fetchPage(clal: string, redirect: string) {
    try {
        const jar = new fetchCookie.toughCookie.CookieJar();
        await jar.setCookie(
            `clal=${clal}; Domain=lng-tgk-aime-gw.am-all.net; Path=/; Secure; HttpOnly`,
            'https://lng-tgk-aime-gw.am-all.net/'
        );
        const fetchWithCookie = fetchCookie(fetch, jar);

        const userAgent =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';

        const res = await fetchWithCookie(
            'https://lng-tgk-aime-gw.am-all.net/common_auth/login?' +
                'site_id=maimaidxex&' +
                `redirect_url=https://maimaidx-eng.com/maimai-mobile/home/&` +
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

        let next = res.headers.get('location');

        if (!next) {
            throw new Error('The Link did not return a valid redirect');
        }

        await fetchWithCookie(next, {
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
            },
        });

        const result = await fetchWithCookie(redirect, {
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
            },
        });

        return await result.text();
    } catch (error) {
        console.error(error);
        return (error as Error).message;
    }
}
