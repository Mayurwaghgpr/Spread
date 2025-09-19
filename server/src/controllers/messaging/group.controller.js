import Conversation from "../../models/messaging/conversation.model.js";
import Members from "../../models/messaging/members.model.js";
import User from "../../models/user.model.js";

export const createGroupConversation = async (req, res, next) => {
  const { groupName, membersArr } = req.body;
  //Check if groupName is provide,members are more than one
  if (!groupName && membersArr.length < 1) {
    return res.status(401).json({
      message: "Invalid group credentials,please fill up all required field",
    });
  }
  let groupConversation;
  try {
    // Creating Group Conversation
    groupConversation = await Conversation.create({
      conversationType: "group",
      groupName,
    });

    // Prepare members data for add bulk members
    const members = membersArr.map((memberObj) => ({
      conversationId: groupConversation.id,
      ...memberObj,
    }));
    //Bulk members added
    await Members.bulkCreate(members);
    const newGroupConversation = await Conversation.findByPk(
      groupConversation.id,
      {
        include: {
          model: User, //Get all users as member in conversation
          as: "members",
          through: { attributes: [] },
          attributes: ["id", "displayName", "username"],
        },
      }
    );
    res
      .status(201)
      .json({ message: "Group created successfully", newGroupConversation });
  } catch (error) {
    if (groupConversation) await groupConversation.destroy(); // Cleanup if members creation fails
    next(error);
  }
};

export const addAsGroupAdmin = async (req, res, next) => {
  const { userId } = req.body;
  const currentUserId = req.authUser.id;
  if (!userId) {
    return res.status(401).json({
      message: "Please Provide user id,Can not make user admin without id",
    });
  }
  try {
    const isAddmin = await Members.find({
      where: { memberId: currentUserId, memberType: "admin" },
    });
    if (!isAddmin) {
      return res.status(401).json({
        message:
          "Your not allowed to make a user admin,only admin and make admins",
      });
    }
    const result = await Members.update(
      { memberType: "admin" },
      { where: { memberId: userId } }
    );
    res.status(200).json({ message: "Successfully made an admin", result });
  } catch (error) {
    next(error);
  }
};

export const removeAsGroupAdmin = async (req, res, next) => {
  const { userId } = req.body;
  const currentUserId = req.authUser.id;
  if (!userId) {
    return res.status(401).json({
      message: "Please Provide user id,Can not make user admin without id",
    });
  }
  try {
    const isAddmin = await Members.find({
      wher: { memberId: currentUserId, memberType: "admin" },
    });
    if (!isAddmin) {
      return res.status(401).json({
        message:
          "Your not allowed to demote admin to user,only admin and make demote a admin",
      });
    }
    const result = await Members.update(
      { memberType: "user" },
      { where: { memberId: userId } }
    );
    res.status(200).json({ message: "Successfully made an admin", result });
  } catch (error) {
    next(error);
  }
};
