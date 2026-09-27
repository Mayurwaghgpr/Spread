/**
 * Universal Native OS Notification Dispatcher for Spread
 * Ensures native alerts work seamlessly across all browsers (Chrome, Brave, Safari, Firefox, Edge)
 * even if remote FCM push services are blocked by browser privacy shields.
 */

export async function dispatchNativeNotification({
  title = "Spread",
  body = "",
  icon = "/spread_logo_03_robopus-min.png",
  badge = "/spread_logo_03_robopus-min.png",
  tag,
  data = { url: "/" },
  onClick,
}) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }

  const origin = window.location.origin;
  const iconUrl = icon.startsWith("/") ? `${origin}${icon}` : icon;
  const badgeUrl = badge.startsWith("/") ? `${origin}${badge}` : badge;
  const notificationTag = tag || `spread-${Date.now()}`;

  // 1. Try Service Worker showNotification first (best OS integration and background persistence)
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && typeof reg.showNotification === "function") {
        await reg.showNotification(title, {
          body,
          icon: iconUrl,
          badge: badgeUrl,
          tag: notificationTag,
          renotify: true,
          data,
        });
        return true;
      }
    } catch (swErr) {
      console.warn("ServiceWorker showNotification failed, trying window.Notification fallback:", swErr);
    }
  }

  // 2. Direct window.Notification fallback (works immediately in browser thread)
  try {
    const notification = new Notification(title, {
      body,
      icon: iconUrl,
      tag: notificationTag,
      data,
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      if (onClick) {
        onClick();
      } else if (data?.url) {
        window.location.href = data.url;
      }
      notification.close();
    };

    return true;
  } catch (windowErr) {
    console.warn("window.Notification fallback failed:", windowErr);
    return false;
  }
}
