import {
  getVapidPublicKey,
  saveSubscription,
  removeSubscription,
  hasSubscription,
  sendPushToUser,
} from "../services/pushNotification.service.js";

/**
 * Return VAPID Public Key for client subscription negotiation.
 */
export const getPublicKey = async (req, res, next) => {
  try {
    const key = getVapidPublicKey();
    if (!key) {
      return res.status(500).json({ message: "VAPID public key not configured on server" });
    }
    res.status(200).json({ publicKey: key });
  } catch (error) {
    next(error);
  }
};

/**
 * Save browser push subscription for authenticated user.
 */
export const subscribe = async (req, res, next) => {
  try {
    const { subscription, userAgent } = req.body;
    if (!subscription) {
      return res.status(400).json({ message: "Subscription payload is required" });
    }

    await saveSubscription({
      userId: req.authUser.id,
      subscription,
      userAgent: userAgent || req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      message: "Push notifications enabled successfully",
    });
  } catch (error) {
    console.error("Error subscribing to push:", error);
    next(error);
  }
};

/**
 * Unsubscribe a device endpoint.
 */
export const unsubscribe = async (req, res, next) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ message: "Endpoint is required to unsubscribe" });
    }

    await removeSubscription({
      endpoint,
      userId: req.authUser.id,
    });

    res.status(200).json({
      success: true,
      message: "Push notifications disabled successfully",
    });
  } catch (error) {
    console.error("Error unsubscribing from push:", error);
    next(error);
  }
};

/**
 * Check if the user has an active push subscription.
 */
export const getSubscriptionStatus = async (req, res, next) => {
  try {
    const { endpoint } = req.query;
    const isSubscribed = await hasSubscription({
      userId: req.authUser.id,
      endpoint,
    });

    res.status(200).json({ isSubscribed });
  } catch (error) {
    next(error);
  }
};

/**
 * Send a test notification to verify setup.
 */
export const sendTestPush = async (req, res, next) => {
  try {
    const delay = Math.min(Math.max(parseInt(req.body?.delay || req.query?.delay) || 0, 0), 30);
    const userId = req.authUser.id;

    const hasSub = await hasSubscription({ userId });
    if (!hasSub) {
      return res.status(404).json({
        message: "No active push subscriptions found for this account. Please enable notifications first.",
      });
    }

    if (delay > 0) {
      setTimeout(async () => {
        try {
          await sendPushToUser({
            userId,
            title: "Spread Background Alert",
            body: `🎉 Background notification received! Sent after a ${delay}s delay while tab was closed.`,
            icon: "/spread_logo_03_robopus-min.png",
            data: { url: "/setting/notifications" },
            tag: `test-notification-${Date.now()}`,
          });
        } catch (delayedErr) {
          console.error("Delayed test push delivery failed:", delayedErr);
        }
      }, delay * 1000);

      return res.status(200).json({
        success: true,
        message: `Alert scheduled in ${delay} seconds! You can minimize or close this tab now to test background delivery.`,
      });
    }

    const result = await sendPushToUser({
      userId,
      title: "Spread Push Notification",
      body: "🎉 Push notifications are working perfectly on this device!",
      icon: "/spread_logo_03_robopus-min.png",
      data: { url: "/setting/notifications" },
      tag: `test-notification-${Date.now()}`,
    });

    if (!result) {
      return res.status(404).json({
        message: "No active push subscriptions found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test push notification sent successfully",
    });
  } catch (error) {
    next(error);
  }
};
