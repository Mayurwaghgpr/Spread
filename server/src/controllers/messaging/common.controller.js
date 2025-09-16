import { Op } from "sequelize";
import { EXPIRATION } from "../../config/constants.js";
import Conversation from "../../models/messaging/conversation.model.js";
import Members from "../../models/messaging/members.model.js";
import Messages from "../../models/messaging/messages.model.js";
import User from "../../models/user.model.js";
import redisClient from "../../utils/redisClient.js";

export const getConversationsByUserId = async (req, res, next) => {
  const userId = req.authUser.id;
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 10, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  try {
    const cacheKey = `Conversation_Log_${lastTimestamp}_${userId}_${limit}`;
    const cachedConvData = await redisClient.get(cacheKey);

    if (cachedConvData !== null) {
      console.log("cach hit");
      return res.status(200).json(JSON.parse(cachedConvData)); // Send cached data
    }

    const conversations = await Conversation.findAll({
      attributes: [
        "id",
        "lastMessage",
        "conversationType",
        "groupName",
        "image",
        "updatedAt",
        "createdAt",
      ],
      include: [
        {
          model: Members, //find conversations where userId matches
          where: { memberId: userId },
          attributes: [],
        },
        {
          model: User,
          as: "members",
          through: { attributes: ["memberType", "isMuteMessage"] },
          attributes: ["id", "displayName", "username", "userImage"],
          required: false,
          // limit: 1,
        },
      ],
      where: { updatedAt: { [Op.lt]: lastTimestamp } },
      order: [["updatedAt", "DESC"]],
      limit,
    });
    await redisClient.setEx(
      cacheKey,
      EXPIRATION,
      JSON.stringify(conversations)
    );
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    next(error);
  }
};

export const getMembers = async (req, res, next) => {
  const { conversationId } = req.query;
  const userId = req.authUser.id;
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 10, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  try {
    const cacheKey = `Members_Log_${lastTimestamp}_${userId}_${limit}`;
    const cachedMemberData = await redisClient.get(cacheKey);
    if (cachedMemberData !== null) {
      console.log("cach hit");
      return res.status(200).json(JSON.parse(cachedMemberData)); // Send cached data
    }
    const members = await User.findAll({
      include: [
        {
          model: Members,
          where: { conversationId: conversationId },
          attributes: [],
        },
      ],
    });
    await redisClient.setEx(cacheKey, EXPIRATION, JSON.stringify(members));
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    next(error);
  }
};

const getMediaAttachments = async (req, res, next) => {};

export const setIsMuteMessage = async (req, res, next) => {
  const { isMuteMessage, conversationId } = req.body;
  const userId = req.authUser.id;

  try {
    const [count, updatedMember] = await Members.update(
      { isMuteMessage: !isMuteMessage },
      {
        where: {
          [Op.and]: [{ memberId: userId }, { conversationId }],
        },
        returning: true,
      }
    );

    res.status(200).json({
      message: "messages mute for this conversation",
      updatedMember: updatedMember[0],
    });
  } catch (error) {
    console.error("Error updating IsMuteMessage:", error);
    next(error);
  }
};

export const getMessagesByConversationId = async (req, res, next) => {
  const { conversationId } = req.query;
  // const limit = Math.max(parseInt(req.query.limit?.trim()) || 10, 1);
  // const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  try {
    const messages = await Messages.findAll({
      where: {
        // createdAt: { [Op.lt]: lastTimestamp },
        conversationId: conversationId,
      },
      // order: [["createdAt", "ASC"]],
      // limit
    });
    if (!messages) {
      res
        .status(204)
        .json({ message: "No private messages found for this conversation." });
    }
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
