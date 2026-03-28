const CACHE = "dough-app-v2";

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE).then(cache =>
            cache.addAll([
                "./dev/app/",
                "./dev/app/index.html"
            ])
        )
    );
});

self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() =>
        caches.match("/dev/app/index.html")
      )
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request))
    );
  }
});