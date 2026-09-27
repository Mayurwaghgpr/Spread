import webpush from "web-push";
import PushSubscription from "../models/pushSubscription.model.js";

// Initialize VAPID
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:support@spread.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
} else {
  console.warn("VAPID keys not configured in environment variables.");
}

export const getVapidPublicKey = () => {
  return process.env.VAPID_PUBLIC_KEY || null;
};

/**
 * Register or update a browser push subscription for a user.
 */
export const saveSubscription = async ({ userId, subscription, userAgent }) => {
  if (!subscription || !subscription.endpoint || !subscription.keys) {
    throw new Error("Invalid push subscription object");
  }

  const { endpoint, keys } = subscription;
  const { p256dh, auth } = keys;

  if (!p256dh || !auth) {
    throw new Error("Missing encryption keys in push subscription");
  }

  // Upsert subscription based on unique endpoint
  const [record, created] = await PushSubscription.findOrCreate({
    where: { endpoint },
    defaults: {
      userId,
      endpoint,
      p256dh,
      auth,
      userAgent: userAgent || null,
    },
  });

  if (!created) {
    record.userId = userId;
    record.p256dh = p256dh;
    record.auth = auth;
    record.userAgent = userAgent || record.userAgent;
    await record.save();
  }

  return record;
};

/**
 * Unsubscribe a device endpoint.
 */
export const removeSubscription = async ({ endpoint, userId }) => {
  if (!endpoint) return false;

  const whereClause = { endpoint };
  if (userId) {
    whereClause.userId = userId;
  }

  const deletedCount = await PushSubscription.destroy({ where: whereClause });
  return deletedCount > 0;
};

/**
 * Check if user or specific endpoint has active push subscription.
 */
export const hasSubscription = async ({ userId, endpoint }) => {
  if (endpoint) {
    const existing = await PushSubscription.findOne({ where: { endpoint } });
    if (existing) return true;
  }

  if (userId) {
    const count = await PushSubscription.count({ where: { userId } });
    return count > 0;
  }

  return false;
};

/**
 * Dispatch web push notification to all active devices of a user.
 * Automatically prunes expired/invalid subscriptions (HTTP 410 / 404).
 */
export const sendPushToUser = async ({
  userId,
  title = "Spread",
  body = "",
  icon = "/spread_logo_03_robopus-min.png",
  badge = "/spread_logo_03_robopus-min.png",
  data = { url: "/" },
  tag = "spread-alert",
}) => {
  try {
    if (!userId) return null;

    const subscriptions = await PushSubscription.findAll({
      where: { userId },
    });

    if (!subscriptions || subscriptions.length === 0) {
      return null;
    }

    const payload = JSON.stringify({
      title,
      body,
      icon,
      badge,
      tag,
      data,
    });

    const sendPromises = subscriptions.map(async (sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushConfig, payload);
      } catch (err) {
        // HTTP 410 (Gone) or 404 (Not Found) means the user revoked permissions or uninstalled browser
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`Pruning expired push subscription: ${sub.id}`);
          await sub.destroy().catch((delErr) => console.error("Error pruning subscription:", delErr));
        } else {
          console.error(`Failed to deliver push to subscription ${sub.id}:`, err?.message || err);
        }
      }
    });

    await Promise.allSettled(sendPromises);
    return true;
  } catch (error) {
    console.error("Error in sendPushToUser:", error);
    return null;
  }
};
