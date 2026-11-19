/* GitHub Pages / subpath-friendly offline shell. Bump version when changing assets. */
const CACHE = "mathe-hero-shell-v4";
const ASSETS = ["./","./index.html","./styles.css","./app.js","./lessons.js","./math-engine.js","./curriculum.js","./additional-lessons.js","./visuals.js","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("mathe-hero-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put("./index.html", copy));
      }
      return response;
    }).catch(async () => (await caches.match("./index.html")) || Response.error()));
  } else {
    event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request,copy));
      }
      return response;
    })));
  }
});