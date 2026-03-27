const CACHE = "dough-app-v4";

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE).then(cache =>
            cache.addAll([
                "./app",
                "./app/index.html"
            ])
        )
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
