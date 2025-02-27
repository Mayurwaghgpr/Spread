import Conversation from "../../models/messaging/Conversation.js";
import Members from "../../models/messaging/members.js";
import Messages from "../../models/messaging/Messages.js";
import User from "../../models/user.js";

export const getConversationsByUserId = async (req, res, next) => {
    const userId  = req.authUser.id;
    try {
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
            ]
        });

        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        next(error)
    }
};

export const getMessagesByConversationId = async(req, res, next) => {
    const { conversationId } = req.query;
    try {
        const messages = await Messages.findAll({where:{conversationId}})
        if (!messages) {
            res.status(404).json({message: 'No private messages found for this conversation.'})
        }
        res.status(200).json(messages);
    } catch (error) {
        next(error)
    }
}