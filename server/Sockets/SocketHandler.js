import Messages from "../models/messaging/Messages.js";
import redisClient from "../utils/redisClient.js";
import Convarsation from "../models/messaging/Conversation.js";
import { io } from "../app.js";

const users = new Map();

export default function socketHandlers() {
  io.on("connection", async(socket) => {
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
      // console.log('userIsTyping', { conversationId, senderId })
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

          // console.log({conversationId,senderId,content,replyedTo,createdAt});
          io.to(conversationId).emit("newMessage", {
            conversationId,
            senderId,
            content,
            replyedTo,
            createdAt,
          });
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
      for (let [userId, socketId] of users) {
        if (socketId === socket.id) {
            await redisClient.del(userId);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
}
