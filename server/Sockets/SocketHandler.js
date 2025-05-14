import Messages from "../models/messaging/Messages.js";
import redisClient from "../utils/redisClient.js";
import Convarsation from "../models/messaging/Conversation.js";


export default function socketHandlers(io) {
  io.on("connection", async (socket) => {
    // console.log(socket.handshake.query)
    const { connectedUserId, activeConversationId } = socket.handshake.query;
    console.log(`Connected user: ${connectedUserId} (${socket.id})`);

    // Check and create room if server has restared and client is still in conversation
    const roomExists = io.sockets.adapter.rooms.get(activeConversationId)?.has(socket.id)
    if (!roomExists) {
      socket.join(activeConversationId);
      console.log(`User joined conversation: ${activeConversationId}`);
    }
    
    // Register user with socket ID
    socket.on("register", async (userId) => {
      const cacheKey = `socket_${userId}`;
      await redisClient.set(cacheKey, socket.id);
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    // Join a conversation room
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Leave a conversation room
    socket.on("leaveConversation", (conversationId) => {
      socket.leave(conversationId);
      console.log(`User left conversation: ${conversationId}`);
    });

    socket.on("IamTyping", ({ conversationId, senderId, image, typing }) => {
      console.log('userIsTyping', { conversationId, senderId })
      io.to(conversationId).emit("userIsTyping", {
        conversationId,
        senderId,
        image,
        typing,
      });
    });

    // Send message and broadcast to conversation
    socket.on(
      "sendMessage",
      async ({ conversationId, senderId, content, replyedTo, createdAt }) => {
        try {

          io.to(conversationId).emit("newMessage", {
            conversationId,
            senderId,
            content,
            replyedTo,
            createdAt,
          });
          // TEST: commented temporarly
          // Push to Redis Stream for async storage
          // await redisClient.xAdd(
          //   "message_queue",
          //   "*", // Auto-generate ID
          //   {
          //     conversationId: conversationId,
          //     senderId: senderId,
          //     content: content,
          //     replyedTo: replyedTo || "",
          //   }
          // );

          await Messages.create({
            conversationId,
            senderId,
            content,
            replyedTo,
          });
          await Convarsation.update(
            { lastMessage: content },
            { where: { id: conversationId } }
          );
        } catch (error) {
          console.error("Error sending message:", error);
          io.to(conversationId).emit("ErrorSendMessage", {
            message: "Failed to send message" + error,
          });
        }
      }
    );

    // Mark message as read
    socket.on("markAsRead", async ({ messageId, userId }) => {
      try {
        // await ReadReceipt.create({ messageId, userId });
        io.emit("messageRead", { messageId, userId });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    });

    // Handle user disconnect
    socket.on("disconnect", async() => {
      console.log("User disconnected:", socket.id);
    });
  });
}
