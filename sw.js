/* DayScan Service Worker
 * - 缓存应用外壳与 CDN 脚本，使应用可离线打开
 * - FMP API 请求一律走网络，绝不缓存（保证数据真实，也不会误吞额度计数）
 * 更新网页后，请把下面的版本号 +1，手机才会拉取新版本。 */
const VERSION = 'dayscan-v4';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.includes('financialmodelingprep.com')) return;   // API：不拦截
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;                                              // 缓存优先，后台更新
    })
  );
});
