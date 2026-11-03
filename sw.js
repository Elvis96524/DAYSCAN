// Scanner service worker: cache-first for the app shell, never caches FMP API calls.
// users.json is network-first so account changes reach everyone quickly.
// Bump VERSION on every release so phones pick up the new files.
const VERSION = 'scanner-v15';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.includes('financialmodelingprep.com')) return;   // API: always go to network
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith('/users.json')) {                        // accounts: network first, cached copy only when offline
    e.respondWith(
      fetch(req, { cache: 'no-store' }).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
