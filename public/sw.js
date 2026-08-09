const CACHE_VERSION = 'acidbot-pwa-v3';
const ASSETS_TO_CACHE = ['/manifest.webmanifest', '/favicon.ico'];

const shouldBypassCache = (request) => {
    const url = new URL(request.url);

    return (
        url.origin !== self.location.origin ||
        url.pathname === '/' ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/pages') ||
        url.pathname.startsWith('/auth') ||
        request.mode === 'navigate' ||
        request.cache === 'no-store'
    );
};

const isCacheableRequest = (request, response) => {
    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return false;
    }

    if (
        url.pathname === '/' ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/pages') ||
        url.pathname.startsWith('/auth')
    ) {
        return false;
    }

    if (
        request.mode === 'navigate' ||
        request.cache === 'no-store' ||
        response.headers.get('Cache-Control')?.includes('no-store')
    ) {
        return false;
    }

    return response.status === 200 && response.type === 'basic' && ['image', 'manifest'].includes(request.destination);
};

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_VERSION)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('Service worker install caching failed:', error);
                throw error;
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || shouldBypassCache(event.request)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then((networkResponse) => {
                    if (!networkResponse || !isCacheableRequest(event.request, networkResponse)) {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    event.waitUntil(
                        caches
                            .open(CACHE_VERSION)
                            .then((cache) => cache.put(event.request, responseToCache))
                            .catch((error) => {
                                console.error('Service worker cache put failed:', error);
                            })
                    );

                    return networkResponse;
                })
                .catch((error) => {
                    console.error('Service worker fetch failed:', error);
                    return new Response('You appear to be offline and this content is not cached yet.', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: { 'Content-Type': 'text/plain' },
                    });
                });
        })
    );
});
