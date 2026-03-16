// The Key Co. — Intentional Bingo Service Worker
const CACHE_NAME = 'thekey-bingo-v1';

const ASSETS = [
  '/intentional-bingo/',
  '/intentional-bingo/index.html',
  '/intentional-bingo/manifest.json',
  '/intentional-bingo/icon-192.png',
  '/intentional-bingo/icon-512.png',
  '/intentional-bingo/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap'
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // If both cache and network fail, return the main app
        if (event.request.destination === 'document') {
          return caches.match('/intentional-bingo/index.html');
        }
      });
    })
  );
});
