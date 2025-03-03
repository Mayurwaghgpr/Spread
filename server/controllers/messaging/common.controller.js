import { Op } from "sequelize";
import { EXPIRATION } from "../../config/constants.js";
import Conversation from "../../models/messaging/Conversation.js";
import Members from "../../models/messaging/Members.js";
import Messages from "../../models/messaging/Messages.js";
import User from "../../models/user.js";
import redisClient from "../../utils/redisClient.js";

export const getConversationsByUserId = async (req, res, next) => {
    const userId = req.authUser.id;
      const limit = Math.max(parseInt(req.query.limit?.trim()) || 10, 1);
    const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
    console.log(lastTimestamp)
    try {
    const cacheKey = `Conversation_Log_${lastTimestamp}_${userId}_${limit}`;
    const cachedConvData = await redisClient.get(cacheKey);
    if (cachedConvData !== null) {
      console.log('cach hit')
      return res.status(200).json(JSON.parse(cachedConvData));// Send cached data
    }
      console.log('cach miss')
        const conversations = await Conversation.findAll({
           include: [
                {
                    model: Members,//find conversations where userId matches
                    where: { memberId: userId },
                    attributes: [], 
                },
                {
                    model: User,//Get all users as member in conversation
                    as: 'members', 
                    through: { attributes: [] },
                    attributes: ['id', 'displayName', 'username', 'userImage', 'email', 'createdAt', 'updatedAt'],
                
                }
            ],
            where: { createdAt: { [Op.lt]: lastTimestamp } },
           order: [
        ["createdAt", "DESC"],
      ],
      limit,
        });
    await redisClient.setEx(cacheKey,EXPIRATION,JSON.stringify(conversations))

        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        next(error)
    }
};

export const getMessagesByConversationId = async(req, res, next) => {
    const { conversationId } = req.query;
    console.log(conversationId)
    try {
        const messages = await Messages.findAll({
            where: { conversationId:conversationId },
            include: [{
                model: User,
                as: "sender",
                attributes: ['id', 'displayName', 'username', 'userImage', 'email', 'createdAt', 'updatedAt'],
            }]
        })
        if (!messages) {
            res.status(204).json({message: 'No private messages found for this conversation.'})
        }
        res.status(200).json(messages);
    } catch (error) {
        next(error)
    }
}