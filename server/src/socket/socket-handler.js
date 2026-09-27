import Members from "../models/messaging/members.model.js";
import redisClient from "../utils/redisClient.js";
import sockIo from "../socket.js";

const isConversationMember = (conversationId, userId) =>
  Members.findOne({ where: { conversationId, memberId: userId } });

const validConversationId = (value) =>
  typeof value === "string" &&
  (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value) ||
   /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(value));

export default function socketHandlers() {
  const io = sockIo.getIo();
  io.on("connection", async (socket) => {
    const userId = socket.data.userId;
    const cacheKey = `sockets:user:${userId}`;
    await redisClient.set(cacheKey, socket.id);
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on("joinConversation", async (conversationId, acknowledgement) => {
      try {
        if (!validConversationId(conversationId) || !(await isConversationMember(conversationId, userId))) {
          acknowledgement?.({ ok: false, error: "Access denied" });
          return;
        }
        await socket.join(`conversation:${conversationId}`);
        acknowledgement?.({ ok: true });
      } catch (err) {
        console.error(`[Socket] Error joining conversation: ${err.message}`);
        acknowledgement?.({ ok: false, error: err.message });
      }
    });

    socket.on("leaveConversation", (conversationId) => {
      if (validConversationId(conversationId)) {
        socket.leave(`conversation:${conversationId}`);
      }
    });

    socket.on("isTyping", async (data) => {
      try {
        const conversationId = typeof data === "string" ? data : data?.conversationId;
        if (!validConversationId(conversationId)) return;

        // Fast path: if socket already in room, broadcast directly
        if (!socket.rooms.has(`conversation:${conversationId}`)) {
          if (!(await isConversationMember(conversationId, userId))) return;
          await socket.join(`conversation:${conversationId}`);
        }
        socket.to(`conversation:${conversationId}`).emit("isTyping", {
          conversationId,
          senderId: userId,
        });
      } catch (err) {
        console.error(`[Socket] Error in isTyping: ${err.message}`);
      }
    });

    socket.on("isStopedTyping", async (data) => {
      try {
        const conversationId = typeof data === "string" ? data : data?.conversationId;
        if (!validConversationId(conversationId)) return;

        if (!socket.rooms.has(`conversation:${conversationId}`)) {
          if (!(await isConversationMember(conversationId, userId))) return;
          await socket.join(`conversation:${conversationId}`);
        }
        socket.to(`conversation:${conversationId}`).emit("isStopedTyping", {
          conversationId,
          senderId: userId,
        });
      } catch (err) {
        console.error(`[Socket] Error in isStopedTyping: ${err.message}`);
      }
    });

    socket.on("disconnect", async () => {
      try {
        // Do not remove a newer connection for the same user.
        if ((await redisClient.get(cacheKey)) === socket.id) {
          await redisClient.del(cacheKey);
        }
      } catch (err) {
        console.error(`[Socket] Error during disconnect: ${err.message}`);
      }
    });
  });
}
