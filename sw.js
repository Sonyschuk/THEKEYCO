// The Key Co. — Intentional Bingo Service Worker
const CACHE_NAME = 'thekey-bingo-v6';

const ASSETS = [
  '/THEKEYCO/',
  '/THEKEYCO/index.html',
  '/THEKEYCO/manifest.json',
  '/THEKEYCO/icon-192.png',
  '/THEKEYCO/icon-512.png',
  '/THEKEYCO/apple-touch-icon.png',
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
          return caches.match('/THEKEYCO/index.html');
        }
      });
    })
  );
});
