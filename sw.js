// sw.js
const CACHE_NAME = 'jpv-news-v4'; // V4 para forzar recarga limpia
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  // URLs de librerías externas para que funcionen offline
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Al instalar, guardar los archivos base en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto, guardando assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Al hacer una petición (fetch), intentar servir desde la caché primero
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, devolverlo. Si no, hacer la petición a la red.
        return response || fetch(event.request);
      })
  );
});