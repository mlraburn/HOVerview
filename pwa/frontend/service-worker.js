// Service Worker for HOVerview

const CACHE_NAME = 'hoverview-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/js/app.js',
    '/images/icon.png',
    '/css/styles.css'
]

// Install event - cache assets
self.addEventListener('install', event => {
   event.waitUntil(
       caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
   );

   //activate immediately
   self.skipWaiting();
});

//activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhiteList = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhiteList.indexOf(cacheName) === -1) {
                        // Delete old caches
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );


    // Claim clients immediately
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Special handling for API requests
    if (event.request.url.includes('/api/lane-status')) {
        event.respondWith(
            // Try network first, then fall back to cached response
            fetch(event.request)
                .then(response => {
                    // Clone response to store in cache
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                })
                .catch(() => {
                    // If network request fails, try to return the cached response
                    return caches.match(event.request);
                })
        );
        return;
    }

    // For all other requests, use cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Return from cache if available
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Return the response if it's bad
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone and cache the response
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

// Handle background sync for when user comes back online
self.addEventListener('sync', event => {
    if (event.tag === 'refresh-lane-status') {
        event.waitUntil(
            // Notify all clients to update
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'REFRESH_STATUS'
                    });
                });
            })
        );
    }
});

// Handle push notifications
/*self.addEventListener('push', event => {
    const data = event.data.json();

    const options = {
        body: data.body || 'Express Lane direction has changed',
        icon: '/images/icon-192x192.png',
        badge: '/images/icon-192x192.png',
        data: {
            url: '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification('HOVerview Update', options)
    );
});*/

// Handle notification click
/*self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});*/