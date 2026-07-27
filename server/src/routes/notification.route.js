import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import IsAuth from "../middlewares/isAuth.middleware.js";

const router = express.Router();

router.get("/all", IsAuth, getNotifications);
router.get("/unread-count", IsAuth, getUnreadCount);
router.patch("/mark-all-read", IsAuth, markAllAsRead);
router.patch("/:id/read", IsAuth, markAsRead);

export default router;
