import Conversation from "../../models/messaging/Conversation.js";
import Messages from "../../models/messaging/Messages.js";
import redisClient from "../../utils/redisClient.js";
import Database from "../../db/database.js";
import dotenv from "dotenv";
dotenv.config();
await redisClient.connect();

async function processMessages() {
  console.log("meesage worker running...");

  let lastId = "0"; // Change to "$" if you only want new messages

  while (true) {
    try {
      const result = await redisClient.xRead(
        { key: "message_queue", id: lastId },
        { COUNT: 10, BLOCK: 5000 }
      );

      if (!result) continue;

      for (const {
        id,
        message: { content, conversationId, senderId, replyedTo },
      } of result[0].messages) {
        console.log(`Processing message ID: ${id}`, {
          content,
          conversationId,
          senderId,
          replyedTo,
        });
        await Database.transaction(async (t) => {
          await Messages.create(
            {
              content,
              conversationId,
              senderId,
              replyedTo: replyedTo ? replyedTo : null,
            },
            { transaction: t }
          );
          await Conversation.update(
            { lastMessage: content },
            { where: { id: conversationId }, transaction: t }
          );
        });

        await redisClient.xDel("message_queue", id);
        lastId = id; // Update last ID to avoid re-processing
      }
    } catch (error) {
      console.error("Failed to process message:", error.message);
      await new Promise((res) => setTimeout(res, 1000)); // Retry after delay
      continue;
    }
  }
}

processMessages();
