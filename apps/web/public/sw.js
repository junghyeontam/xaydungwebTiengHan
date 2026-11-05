// Tiếng Hàn JungHyeon - PWA Service Worker (Hỗ trợ học offline bài học đã tải)
const CACHE_NAME = "junghyeon-v1";
const STATIC_ASSETS = [
  "/",
  "/lo-trinh",
  "/on-tap",
  "/phat-am",
  "/topik",
  "/tu-van",
  "/ho-so",
  "/manifest.json",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Chỉ cache các request GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback offline nếu mất mạng
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      });
    })
  );
});
