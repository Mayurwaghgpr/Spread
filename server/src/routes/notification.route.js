import express from "express";
import {
  getNotifications,
  getUnreadCount,
} from "../controllers/notification.controller.js";
import IsAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/all", IsAuth, getNotifications);
router.get("/unread-count", IsAuth, getUnreadCount);

export default router;
