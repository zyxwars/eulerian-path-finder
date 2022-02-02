var cacheName = "euler";
var contentToCache = [
  "./index.html",
  "./global.css",
  "./build/bundle.css",
  "./build/bundle.js",
  "./build/bundle.js.map",
  "./favicon.svg",
];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", function (e) {
  e.waitUntil(
    (async function () {
      const cache = await caches.open(cacheName);
      await cache.addAll(contentToCache);
    })()
  );
});

/* Serve cached content when offline */
self.addEventListener("fetch", function (e) {
  e.respondWith(
    (async function () {
      const r = await caches.match(e.request);
      // console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      // console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});
