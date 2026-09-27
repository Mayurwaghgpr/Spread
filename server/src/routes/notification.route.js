import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import {
  getPublicKey,
  subscribe,
  unsubscribe,
  getSubscriptionStatus,
  sendTestPush,
} from "../controllers/pushNotification.controller.js";
import IsAuth from "../middlewares/isAuth.middleware.js";

const router = express.Router();

// In-app notifications
router.get("/all", IsAuth, getNotifications);
router.get("/unread-count", IsAuth, getUnreadCount);
router.patch("/mark-all-read", IsAuth, markAllAsRead);
router.patch("/:id/read", IsAuth, markAsRead);

// Web Push Notifications
router.get("/push/vapid-public-key", getPublicKey);
router.post("/push/subscribe", IsAuth, subscribe);
router.post("/push/unsubscribe", IsAuth, unsubscribe);
router.get("/push/status", IsAuth, getSubscriptionStatus);
router.post("/push/test", IsAuth, sendTestPush);

export default router;

