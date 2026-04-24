self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("sos-cache").then(cache => {
            return cache.addAll([
                "/",
                "/index.html",
                "/style.css",
                "/script.js",
                "/manifest.json",
                "/icon-192.png",
                "/icon-512.png"
            ]);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== "sos-cache") {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});