import Notify from "../models/notification.model.js";
import User from "../models/user.model.js";
import redisClient from "../utils/redisClient.js";
import sockIo from "../socket.js";

export const createNotification = async ({
  receiverId,
  actorId,
  type,
  entityId = null,
  entityType = null,
  message,
}) => {
  try {
    // Prevent self-notifications
    if (receiverId === actorId) return null;

    // Fetch actor details for payload
    const actor = actorId
      ? await User.findByPk(actorId, {
          attributes: ["id", "displayName", "username", "userImage"],
        })
      : null;

    const actorName = actor?.displayName || actor?.username || "Someone";
    let formattedMessage = message;

    if (!formattedMessage || formattedMessage.includes("undefined")) {
      if (type === "like") {
        formattedMessage = `${actorName} liked your ${entityType || "post"}.`;
      } else if (type === "comment") {
        formattedMessage = `${actorName} commented on your post.`;
      } else if (type === "follow") {
        formattedMessage = `${actorName} started following you.`;
      } else {
        formattedMessage = `${actorName} interacted with you.`;
      }
    }

    // Create notification in DB
    const notification = await Notify.create({
      receiverId,
      actorId,
      type,
      entityId,
      entityType,
      message: formattedMessage,
    });

    // Invalidate Redis cache for receiver
    await redisClient.del(`notifications:${receiverId}`);
    await redisClient.del(`unreadCount:${receiverId}`);

    const payload = {
      ...notification.toJSON(),
      actor,
    };

    // Emit real-time socket event
    try {
      const io = sockIo.getIo();
      if (io) {
        io.to(`user:${receiverId}`).emit("notification", payload);
      }
    } catch (socketErr) {
      console.error("Failed to emit socket notification:", socketErr);
    }

    return payload;
  } catch (error) {
    console.error("Error in createNotification service:", error);
    return null;
  }
};
