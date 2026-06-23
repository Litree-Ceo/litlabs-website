/**
 * LiTTree Lab Studios - Service Worker v5
 * Asset caching only — navigation requests pass through to the network
 * so Lighthouse and browser devtools can record traces correctly.
 */

const CACHE_NAME = "litlabs-v5";
const STATIC_ASSETS = ["/manifest.json", "/logo.webp", "/logo-sm.png"];

// Install — pre-cache static assets only (not pages)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

// Activate — purge old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)),
        ),
      ),
  );
  self.clients.claim();
});

// Fetch — network-first for navigation, cache-first for static assets
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = event.request.url;

  // Always pass navigation requests straight to the network
  // (prevents NO_NAVSTART in Lighthouse and keeps pages fresh)
  if (event.request.mode === "navigate") return;

  // Skip API, external, and non-basic requests
  if (url.includes("/api/")) return;
  if (!url.startsWith(self.location.origin)) return;

  // Cache-first with background revalidation for static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response.ok && response.type === "basic") {
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => cached || new Response("Offline", { status: 503 }));

      return cached || networkFetch;
    }),
  );
});

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || "LiTTree Lab Studios", {
      body: data.body || "New notification from LiTTree Lab",
      icon: "/logo.webp",
      badge: "/logo.webp",
      tag: data.tag || "default",
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [],
      data: data.data || {},
    }),
  );
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client)
            return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(urlToOpen);
      }),
  );
});

// Background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-forms") {
    event.waitUntil(Promise.resolve());
  }
});
