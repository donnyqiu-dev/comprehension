/* Offline cache for the app shell. Videos and the dictionary still need internet. */
const CACHE = 'readquest-v8';
const FILES = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest', 'assets/icon.svg',
  'js/store.js', 'js/ui.js', 'js/srs.js', 'js/rewards.js', 'js/app.js',
  'js/data/readings.js', 'js/data/videos.js', 'js/data/rewards.js',
  'js/views/common.js', 'js/views/home.js', 'js/views/reading.js', 'js/views/video.js',
  'js/views/words.js', 'js/views/me.js', 'js/views/parent.js', 'js/views/builder.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Network first for our own files (so updates arrive), cache as fallback when offline. */
self.addEventListener('fetch', function (e) {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      const copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (r) { return r || caches.match('index.html'); });
    })
  );
});
