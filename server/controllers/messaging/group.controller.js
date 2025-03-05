import Conversation from "../../models/messaging/Conversation.js"
import Members from "../../models/messaging/Members.js";


export const createGroupConversation = async (req, res, next) => {
    const {groupName,users} = req.body
   try {
     const groupConversation = await Conversation.create({ conversationType: 'group', groupName });
     const members = users.map((users) => ({
         conversationId:groupConversation.id,
     ...users
     }))
     await Members.bulkCreate(members);
     res.status(201).json({message:'Group created successfully',groupConversation})
   } catch (error) {
    next(error)
   }
}

export const addAsGroupAdmin = async (req, res, next) => {
    const { userId } = req.body;
try {
    const result = await Members.update({ memberType: 'admin' }, { where: { memberId: userId } })
    res.status(200).json({message:'Successfully made an admin',result})
} catch (error) {
    next(error)
}
}

export const removeAsGroupAdmin = async (req, res, next) => {
    const { userId } = req.body;
try {
    const result = await Members.update({ memberType: 'user' }, { where: { memberId: userId } })
    res.status(200).json({message:'Successfully made an admin',result})
} catch (error) {
    next(error)
}
}