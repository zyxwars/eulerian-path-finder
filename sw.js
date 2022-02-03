var cacheName = "euler";
var contentToCache = [
  // Turns out caching "/" is very important
  "./",
  "./index.html",
  "./offline.html",
  "./global.css",
  "./build/bundle.css",
  "./build/bundle.js",
  "./build/bundle.js.map",
  "./favicon.svg",
  "./manifest.json",
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
  if (navigator.onLine) {
    e.respondWith(
      fetch(e.request).catch(function () {
        caches.match(e.request).then(function (response) {
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return (
          response ||
          function () {
            if (e.request.url.endsWith(".html"))
              caches.match("offline.html").then(function (response) {
                return response;
              });
          } ||
          null
        );
      })
    );
  }
});
