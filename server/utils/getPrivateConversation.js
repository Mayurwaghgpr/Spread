import { Op } from 'sequelize';
import Conversation from '../models/messaging/Conversation.js';
import User from '../models/user.js';

export const getPrivateConversation = async (userId1, userId2) => {
    console.log(userId1,userId2)
    try {
      //Find the private conversation where both users are members
        const conversation = await Conversation.findOne({
            where: { convesationType: 'group' }, 
            include:[ {
               model: User,
                    as: 'members', 
                    through: { attributes: [] }, // Hide join table fields
                    where: {
                        id: { [Op.in]: [userId1, userId2] } // Find users in conversation
                    }

            },
                // {
                // model: Messages,
                // as:'messages',
                // attributes: ['id', 'content', 'senderId', 'replyedTo'],
                // order: [['createdAt', 'ASC']], 
                // include:[{
                //     model: Attachments,
                //     as:'attachments',
                //     attributes: ['id', 'AttachmentType', 'attachmentUrl']
                    
                // }, {
                //     model: ReadReceipt,
                //     as:'readReceipt',
                //     attributes:['id','status','messageId','userId']
                // }]
                // }
            ],
            group: ['Conversation.id'], 
        });

        if (!conversation) {
            return ;
        }

        return conversation;
    } catch (error) {
        console.error('Error fetching private conversation:', error);
        throw error;
    }
};

