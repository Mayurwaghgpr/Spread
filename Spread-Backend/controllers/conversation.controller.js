import Participant from '../models/Messanger/Participant.js';

import Conversation from '../models/Messanger/Conversation.js'
import Message from '../models/Messanger/Messages.js';
import User from '../models/user.js';
import sequelize from 'sequelize';
import Database from '../utils/database.js';

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { userId,senderId } = req.body; // The second participant

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if a conversation already exists between the two users
    let existingConversation = await Conversation.findOne({
      include: [
        {
          model: Participant,
          where: { userId: [senderId, userId] },
        },
      ],
      group: ["Conversation.id"], // Ensures unique conversations
    //   having: sequelize.literal(`COUNT(Participant.id) = 2`), // Ensure it's between exactly two users
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create a new conversation
    const conversation = await Conversation.create({ type: "direct" });

    // Add participants
    await Participant.bulkCreate([
      { conversationId: conversation.id, userId: senderId, role: "member" },
      { conversationId: conversation.id, userId, role: "member" },
    ]);

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Get all conversations for a logged-in user
export const getConversations = async (req, res) => {
  try {
    console.log("Fetching conversations...");

    const conversations = await Conversation.findAll({
      include: [
        {
          model: Participant,
          where: { userId: req.authUser.id }, // Ensure only conversations the user is part of are retrieved
          include: [{ model: User, attributes:{exclude: ["password"]} }], // Populate User details
        }
      ],
    });

    console.log(conversations);
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: error.message });
  }
};