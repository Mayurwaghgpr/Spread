import Messages from '../models/messaging/Messages.js';
// import ReadReceipt from '../models/Messanger/ReadReceipt.js';
const users = new Map();
export default function socketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // socket.on('register', (userId) => {
    //     users.set(userId, socket.id); // Store user ID with their socket ID
    //     console.log(`User ${userId} registered with socket ID ${socket.id}`);
    // });
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    socket.on('sendMessage', async ({ conversationId, senderId, content}) => {
       
      const messages = await Messages.create({ conversationId, senderId, content });
      io.to(conversationId).emit('newMessage', messages);
    });

    
    // const recipientSocketId = users.get(to);
    //     if (recipientSocketId) {
    //         io.to(recipientSocketId).emit('newMessage', {
    //             from: socket.id,
    //             message,
    //         });
    //         console.log(`Message sent from ${socket.id} to ${recipientSocketId}: ${message}`);
    //     } else {
    //         console.log(`User ${to} is not connected.`);
    //     }

    socket.on('markAsRead', async ({ messageId, userId }) => {
      // await ReadReceipt.create({ messageId, userId });
      io.emit('messageRead', { messageId, userId });
    });

    socket.on('disconnect', () => {
      for (let [userId, socketId] of users) {
            if (socketId === socket.id) {
                users.delete(userId); // Remove user from map on disconnect
                break;
            }
        }
      console.log('User disconnected:', socket.id);
    });
  });
}
