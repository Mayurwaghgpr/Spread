
import sequelize, { Sequelize } from 'sequelize';
import Conversation from '../../models/messaging/Conversation.js';
import Messages from '../../models/messaging/Messages.js';
import redisClient from '../../utils/redisClient.js';
import Database from '../../utils/database.js';
await redisClient.connect()
async function processMessages() {
    console.log('🎉 worker running')
  while (true) {
    try {
      const result = await redisClient.xRead(
        { key: 'message_queue', id: '0' }, // Start from oldest
        { COUNT: 10, BLOCK: 5000} // Process 10 at a time
      );

      if (!result) continue;

      for (const { id, message } of result[0].messages) {
        console.log(message)
        await Database.transaction(async (t) => {
          await Messages.create(message, );
          await Conversation.update(
            { lastMessage: message.content },
            { where: { id: message.conversationId } }
          );
        });
        await redisClient.xDel("message_queue", id); // Remove processed message
      }
    } catch (error) {
      console.error("Failed to process message:", error.message);
        await new Promise(res => setTimeout(res, 1000)); // Retry after delay
        break
    }
  }
}

processMessages()