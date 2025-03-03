import { Op, Sequelize } from 'sequelize';
import Conversation from '../models/messaging/Conversation.js';
import User from '../models/user.js';
import Members from '../models/messaging/Members.js';
import Database from './database.js';
import redisClient from './redisClient.js';
import { EXPIRATION } from '../config/constants.js';

export const getPrivateConversation = async (userId1, userId2) => {


    try {
    const cacheKey = `PrivateConv_${userId1}_${userId2}`
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
        console.log('cache hit')
        return JSON.parse(cachedData);
    }
        console.log('cache miss')
        const memberCounts = await Members.findAll({
            attributes: ['conversationId'],
            where: {
                memberId: { [Op.in]: [userId1, userId2] }
            },
            group: ['conversationId'],
            having: Sequelize.literal('COUNT(DISTINCT "memberId") = 2') // Ensure exactly two users in the conversation
        });

        if (!memberCounts.length) return false;
        console.log(memberCounts)
    await redisClient.setEx(cacheKey,300,JSON.stringify(memberCounts))
        const conversation = await Conversation.findOne({
            where: { id: memberCounts[0].conversationId, conversationType: 'private' }
        });

        return conversation || false;
    } catch (error) {
        console.error('Error fetching private conversation:', error);
        throw error;
    }
};

