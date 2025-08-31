import redisClient from "../../utils/redisClient.js";
import Notification from "../../models/Notification.js";
// import { io } from "../../app.js";
// import User from "../../models/user.js";
await redisClient.connect();
const startedFollowing = async () => {
  let lastId = "$";
  while (true) {
    try {
      // console.log({ receiverId, actorId });
      const result = await redisClient.xRead(
        { key: "follow_notify_queue", id: lastId },
        { COUNT: 10, BLOCK: 5000 }
      );
      if (!result) continue;
      // console.log(result[0].messages);
      for (const {
        id,
        message: { receiverId, actorId },
      } of result[0].messages) {
        lastId = id; // update last processed ID

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
          io.to(userSocketId).emit("notification", {
            unreadCount,
            latest: notifications[0],
          });
        }
      }
    } catch (error) {
      console.error("Error in startedFollowing:", error);
    }
  }
};

startedFollowing();
