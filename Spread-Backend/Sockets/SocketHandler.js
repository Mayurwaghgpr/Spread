import Message from '../models/Messanger/Messages.js';
import ReadReceipt from '../models/Messanger/ReadReceipt.js';

export default function socketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    socket.on('sendMessage', async ({ conversationId, senderId, content }) => {
      const message = await Message.create({ conversationId, senderId, content });
      io.to(conversationId).emit('newMessage', message);
    });

    socket.on('markAsRead', async ({ messageId, userId }) => {
      await ReadReceipt.create({ messageId, userId });
      io.emit('messageRead', { messageId, userId });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
