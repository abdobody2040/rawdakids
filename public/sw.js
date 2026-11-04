// Rawdakids - PWA Service Worker for Android Installation & Offline Cache
const CACHE_NAME = 'rawdakids-v2';

const STATIC_PRECACHE = [
  '/',
  '/manifest.json',
  '/assets/images/icon.png',
  '/assets/images/splash-screen.jpg',
  '/assets/images/android-icon-foreground.png',
  '/assets/images/mascot-noor.jpg',
  '/assets/images/hero-oasis.jpg',
  '/assets/images/quran-garden.jpg',
  '/assets/images/sunnah-path.jpg',
  '/assets/images/prophets-caravan.jpg',
  '/assets/images/manners-town.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn('Some pre-cache assets could not be loaded immediately:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Let API requests bypass the service worker cache directly to server
  if (requestUrl.pathname.startsWith('/api/')) {
    return;
  }

  // Skip cross-origin requests entirely (everyayah.com audio, files.quran.app Mushaf images, etc.)
  // These return opaque responses that cannot be cached safely and cause console errors if intercepted.
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  // Network First for privacy policy so updates are never stale
  if (requestUrl.pathname === '/privacy.html' || requestUrl.pathname === '/privacy') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Network First for HTML navigation requests (so new bundle hashes are loaded immediately)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
    );
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

          // Cache images and static files dynamically
          if (
            requestUrl.pathname.startsWith('/assets/') ||
            requestUrl.pathname.endsWith('.png') ||
            requestUrl.pathname.endsWith('.jpg') ||
            requestUrl.pathname.endsWith('.js') ||
            requestUrl.pathname.endsWith('.css')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          // Network failed and no cache — return nothing (browser handles gracefully)
          return undefined;
        });
    })
  );
});
