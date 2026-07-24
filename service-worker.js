const CACHE_VERSION = "punya-yatra-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/offline.html",
  "/404.html",
  "/manifest.webmanifest",
  "/assets/css/style.css",
  "/assets/js/main.js",
  "/assets/js/search.js",
  "/assets/data/content.json",
  "/assets/data/search-index.json",
  "/assets/images/brand/logo.svg",
  "/assets/images/brand/icon-192.png",
  "/assets/images/brand/icon-512.png",
  "/assets/images/brand/icon-maskable-512.png",
  "/includes/header.html",
  "/includes/footer.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          return cachedPage || caches.match("/offline.html");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
