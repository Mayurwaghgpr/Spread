import Conversation from "../../models/messaging/Conversation.js"
import Members from "../../models/messaging/Members.js";
import User from "../../models/user.js";
import { getPrivateConversation } from "../../utils/getPrivateConversation.js";


export const createPrivateConversation = async (req, res,next) => {
  const { chatUserId } = req.body;
  const currentUserId = req.authUser.id;
   try {
     const exist = await getPrivateConversation(currentUserId, chatUserId);
     if (exist) {
       return  res.status(200).json({message:'conversation already exist' ,newPrivateConversation:exist})
     }
    const conversation = await Conversation.create({ conversationType: 'private' })
    const members = [{
            memberId:currentUserId,
            conversationId: conversation.id,
            memberType: 'user', // Default role, can be 'admin' if needed
        },{
            memberId:chatUserId,
            conversationId: conversation.id,
            memberType: 'user', // Default role, can be 'admin' if needed
       }]
     await Members.bulkCreate(members);
        const newPrivateConversation = await Conversation.findByPk(conversation.id, {
               include:{
                    model: User, //Get all users as member in conversation
                    as: 'members', 
                    through: { attributes: [] },
                    attributes: ['id', 'displayName', 'username','userImage'],
                }
        })
     
       res.status(201).json({message:'Conversation created successfully',newPrivateConversation})
   } catch (error) {
        console.error('Error fetching private conversation:', error);
     
    next(error)
   }
}

