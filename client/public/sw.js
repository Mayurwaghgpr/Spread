// Spread Web Push Service Worker
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming Web Push notifications from server
self.addEventListener("push", (event) => {
  const promiseChain = (async () => {
    let payload = {};
    if (event.data) {
      try {
        payload = event.data.json();
      } catch (e) {
        payload = { title: "Spread Notification", body: event.data.text() };
      }
    }

    const title = payload.title || "Spread Notification";
    const origin = self.location.origin;
    const defaultIcon = `${origin}/spread_logo_03_robopus-min.png`;

    let iconUrl = payload.icon || defaultIcon;
    if (iconUrl.startsWith("/")) {
      iconUrl = `${origin}${iconUrl}`;
    }

    let badgeUrl = payload.badge || defaultIcon;
    if (badgeUrl.startsWith("/")) {
      badgeUrl = `${origin}${badgeUrl}`;
    }

    const options = {
      body: payload.body || "You have a new notification from Spread.",
      icon: iconUrl,
      badge: badgeUrl,
      tag: payload.tag || `spread-${Date.now()}`,
      renotify: true,
      requireInteraction: false,
      data: payload.data || { url: "/" },
    };

    try {
      await self.registration.showNotification(title, options);
    } catch (showErr) {
      console.warn("Failed with rich notification options, attempting minimal fallback:", showErr);
      await self.registration.showNotification(title, {
        body: options.body,
        data: options.data,
      });
    }
  })();

  event.waitUntil(promiseChain);
});

// Handle user clicking on a push notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";
  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // If an existing tab is open on this origin, focus it and navigate
        for (const client of windowClients) {
          if ("focus" in client) {
            client.focus();
            if (client.navigate) {
              return client.navigate(absoluteUrl);
            }
            return;
          }
        }
        // Otherwise, open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(absoluteUrl);
        }
      })
  );
});

// Support direct main-thread local OS notification dispatch via Service Worker
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_LOCAL_NOTIFICATION") {
    const { title, options } = event.data;
    const origin = self.location.origin;
    const defaultIcon = `${origin}/spread_logo_03_robopus-min.png`;

    const safeOptions = {
      body: options?.body || "You have a new update on Spread.",
      icon: options?.icon ? (options.icon.startsWith("/") ? `${origin}${options.icon}` : options.icon) : defaultIcon,
      tag: options?.tag || `spread-local-${Date.now()}`,
      data: options?.data || { url: "/" },
    };

    event.waitUntil(
      self.registration.showNotification(title || "Spread", safeOptions).catch((err) => {
        console.warn("ServiceWorker local showNotification fallback:", err);
      })
    );
  }
});

