self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('mon-cache-v1')
            .then(function(cache) {
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/assets/style.min.css',
                    '/assets/scripts.min.js',
                    '/assets/maugallery.min.js',
                    '/assets/bootstrap/bootstrap.bundle.min.js',
                    '/assets/bootstrap/bootstrap.min.css',
                    '/assets/images/maskable_icon-192x192.png',
                    '/assets/images/maskable_icon-512x512.png',
                    '/manifest.json'
                ]);
            })
            .catch(function(error) {
                console.error("Erreur lors de l'ouverture du cache : ", error);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
            .catch(function(error) {
                console.error("Erreur lors de la récupération de la ressource : ", error);
                return fetch(event.request);
            })
    );
});
