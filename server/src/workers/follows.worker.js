import redisClient from "../utils/redisClient.js";
import Notification from "../models/notification.model.js";

export const startedFollowing = async () => {
  try {
    const result = await redisClient.xRead(
      { key: "follow_notify_queue", id: lastId },
      { COUNT: 10, BLOCK: 5000 }
    );

    const cacheKey = `sockets:user:${receiverId}`;
    const userSocketId = await redisClient.get(cacheKey);
    const existing = await Notification.findOne({
      where: {
        receiverId,
        actorId,
        type: "follow",
      },
    });

    if (existing) {
      await existing.update({
        message: "started following you", // or updated timestamp, etc.
        read: false,
      });
    } else {
      await Notification.create({
        receiverId,
        actorId,
        type: "follow",
        message: "started following you",
      });
    }
    const { count: unreadCount, rows: notifications } =
      await Notification.findAndCountAll({
        where: { receiverId, read: false },
      });
    await redisClient.setEx(`unreadCount:${receiverId}`, 3600, unreadCount);
    await redisClient.set(
      `notifications:${receiverId}`,
      JSON.stringify(notifications)
    );

    if (userSocketId) {
      io.to(userSocketId).emit("notification", {});
    }
  } catch (error) {
    console.error("Error in startedFollowing:", error);
  }
};
