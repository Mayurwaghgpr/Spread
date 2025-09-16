import { Op, Sequelize } from "sequelize";
import Conversation from "../models/messaging/conversation.model.js";
import Members from "../models/messaging/members.model.js";
import User from "../models/user.model.js";

export const getPrivateConversation = async (userId1, userId2) => {
  try {
    console.log("cache miss");
    const memberCounts = await Members.findAll({
      attributes: ["conversationId"],
      where: {
        memberId: { [Op.in]: [userId1, userId2] },
      },
      group: ["conversationId"],
      having: Sequelize.literal('COUNT(DISTINCT "memberId") = 2'), // Ensure exactly two users in the conversation
    });

    if (!memberCounts.length) return false;
    const conversation = await Conversation.findOne({
      where: {
        id: memberCounts[0].conversationId,
        conversationType: "private",
      },
      include: {
        model: User, //Get all users as member in conversation
        as: "members",
        through: { attributes: [] },
        attributes: ["id", "displayName", "username", "userImage"],
      },
    });

    return conversation || false;
  } catch (error) {
    console.error("Error fetching private conversation:", error);
    throw error;
  }
};
