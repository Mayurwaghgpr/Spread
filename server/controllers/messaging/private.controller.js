import Conversation from "../../models/messaging/Conversation.js"
import Members from "../../models/messaging/Members.js";
import { getPrivateConversation } from "../../utils/getPrivateConversation.js";


export const createPrivateConversation = async (req, res,next) => {
  const { chatUserId } = req.body;
  const currentUserId = req.authUser.id;
  console.log(chatUserId,currentUserId)
   try {
     const exist = await getPrivateConversation(currentUserId, chatUserId);
     if (exist) {
       return  res.status(200).json({message:'conversation already exist' ,conversation:exist})
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
       res.status(201).json({message:'Conversation created successfully',conversation})
   } catch (error) {
    next(error)
   }
}

