/**
 * SokakDostum - Service Worker
 * Çevrimdışı önbellekleme ve PWA desteği (Network-First Stratejisi)
 */

const CACHE_NAME = 'sokak-dostum-v2.5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/config.js',
  './js/store.js',
  './js/map.js',
  './js/ui.js',
  './js/app.js',
  './favicon.svg',
  './favicon.png',
  './favicon.ico',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isLocal = url.origin === self.location.origin;

  // Yerel proje dosyaları: Ağ öncelikli (Network First) - Canlı güncellemelerin anında tarayıcıya yansıması için
  if (isLocal) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('./index.html');
            }
          });
        })
    );
    return;
  }

  // Harici kaynaklar: Önbellek öncelikli
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
