import Messages from '../models/messaging/Messages.js';
import redisClient from '../utils/redisClient.js';
const users = new Map();

export default function socketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register user with socket ID
    socket.on('register', async(userId) => {
      await redisClient.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    // Join a conversation room
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User left conversation: ${conversationId}`);
    });
    socket.on('IamTyping', ({ conversationId, senderId }) => {
      // console.log('userIsTyping', { conversationId, senderId })
      io.to(conversationId).emit('userIsTyping', { senderId })
    })
    // Send message and broadcast to conversation
    socket.on('sendMessage', async ({ conversationId, senderId, content,replyedTo,createdAt }) => {
      try {
         io.to(conversationId).emit('newMessage', { conversationId, senderId, content,replyedTo,createdAt });
        await Messages.create({ conversationId, senderId, content, replyedTo });
       
      } catch (error) {
        console.error('Error sending message:', error);
        io.to(conversationId).emit('ErrorSendMessage', { message: 'Failed to send message'+ error});
      }
    });

    // Mark message as read
    socket.on('markAsRead', async ({ messageId, userId }) => {
      try {
        // await ReadReceipt.create({ messageId, userId }); 
        io.emit('messageRead', { messageId, userId });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      for (let [userId, socketId] of users) {
        if (socketId === socket.id) {
          users.delete(userId);
          break;
        }
      }
      console.log('User disconnected:', socket.id);
    });
  });
}
