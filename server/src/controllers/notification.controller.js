import Notify from "../models/notification.model.js";
import User from "../models/user.model.js";
import redisClient from "../utils/redisClient.js";

export const getNotifications = async (req, res, next) => {
  try {
    const cacheKey = `notifications:${req.authUser.id}`;
    const cachedNotifications = await redisClient.get(cacheKey);
    if (cachedNotifications) {
      return res.status(200).json(JSON.parse(cachedNotifications));
    }
    const notifications = await Notify.findAll({
      where: { receiverId: req.authUser.id },
      include: [
        {
          model: User,
          as: "actor",
          attributes: ["id", "displayName", "userImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    // Cache the notifications for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(notifications));
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    error.statusCode = 500; // Set a default status code
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const cacheKey = `unreadCount:${req.authUser.id}`;
    const cachedCount = await redisClient.get(cacheKey);
    if (cachedCount) {
      return res.status(200).json({ count: JSON.parse(cachedCount) });
    }
    const unreadCount = await Notify.count({
      where: { receiverId: req.authUser.id, read: false },
    });
    // Cache the unread count for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(unreadCount));

    res.status(200).json({ count: unreadCount });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    error.statusCode = 500; // Set a default status code
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notify.update(
      { read: true, status: "read" },
      { where: { id, receiverId: req.authUser.id } }
    );
    await redisClient.del(`notifications:${req.authUser.id}`);
    await redisClient.del(`unreadCount:${req.authUser.id}`);
    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notify.update(
      { read: true, status: "read" },
      { where: { receiverId: req.authUser.id, read: false } }
    );
    await redisClient.del(`notifications:${req.authUser.id}`);
    await redisClient.del(`unreadCount:${req.authUser.id}`);
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    next(error);
  }
};
