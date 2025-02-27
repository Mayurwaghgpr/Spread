import Conversation from "../../models/messaging/Conversation.js"
import Members from "../../models/messaging/members.js";
import { getPrivateConversation } from "../../utils/getPrivateConversation.js";


export const createPrivateConversation = async (req, res,next) => {
    const { userId1, userId2 } = req.body;
   try {
     const exist = await getPrivateConversation(userId1, userId2);
     if (exist) {
       return  res.status(200).json({message:'conversation already exist' ,conversation:exist})
     }
    const conversation = await Conversation.create({ convesationType: 'private' })
    const members = [{
            memberId:userId1,
            conversationId: conversation.id,
            memberType: 'user', // Default role, can be 'admin' if needed
        },{
            memberId:userId2,
            conversationId: conversation.id,
            memberType: 'user', // Default role, can be 'admin' if needed
        }]
       await Members.bulkCreate(members);
       res.status(200).json({message:'Conversation created successfully',conversation})
   } catch (error) {
    next(error)
   }
}

