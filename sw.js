const CACHE_NAME = 'sb-league-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './Assets/football-field.jpeg',
  './Assets/Freshman.ttf',
  './Assets/afc.png',
  './Assets/nfc.png',
  './Assets/winnertbc.png',
  './Assets/losertbc.png'
];

// Install - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - network first for data, cache first for assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Always fetch fresh data from ESPN and JSON files
  if (url.hostname.includes('espn.com') || 
      url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }
  
  // Cache first for static assets
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
