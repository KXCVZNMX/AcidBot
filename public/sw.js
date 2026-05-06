const CACHE_VERSION = 'acidbot-pwa-v1';
const ASSETS_TO_CACHE = ['/', '/manifest.webmanifest', '/favicon.ico'];

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
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_VERSION)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then((networkResponse) => {
                    if (
                        !networkResponse ||
                        networkResponse.status !== 200 ||
                        networkResponse.type !== 'basic'
                    ) {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    void caches.open(CACHE_VERSION).then((cache) => {
                        cache.put(event.request, responseToCache);
                    }).catch((error) => {
                        console.error('Service worker cache put failed:', error);
                    });

                    return networkResponse;
                })
                .catch((error) => {
                    console.error('Service worker fetch failed:', error);
                    return caches.match('/');
                });
        })
    );
});
