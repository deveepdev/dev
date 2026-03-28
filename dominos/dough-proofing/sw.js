const CACHE = "dough-app-v3";
const BASE = "/dev/dominos/dough-proofing";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        `${BASE}/app/`,
        `${BASE}/app/index.html`,
        `${BASE}/app/styles.css`,
        `${BASE}/app/app.js`
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() =>
        caches.match(`${BASE}/app/index.html`)
      )
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request))
    );
  }
});