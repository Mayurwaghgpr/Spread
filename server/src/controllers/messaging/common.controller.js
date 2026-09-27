import { Op } from "sequelize";
import { EXPIRATION } from "../../config/constants.js";
import Conversation from "../../models/messaging/conversation.model.js";
import Members from "../../models/messaging/members.model.js";
import Messages from "../../models/messaging/messages.model.js";
import User from "../../models/user.model.js";
import redisClient from "../../utils/redisClient.js";
import sockIo from "../../socket.js";
import { sendPushToUser } from "../../services/pushNotification.service.js";

const MAX_ENVELOPE_BYTES = 64 * 1024;
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

const isP256PublicJwk = (key) =>
  key &&
  key.kty === "EC" &&
  key.crv === "P-256" &&
  typeof key.x === "string" &&
  typeof key.y === "string" &&
  key.x.length >= 40 &&
  key.y.length >= 40;

const isBase64 = (value) =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= MAX_ENVELOPE_BYTES &&
  BASE64.test(value);

const isEncryptedEnvelope = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  if (value.v !== 1 || !isP256PublicJwk(value.ephemeralPublicKey) || !isBase64(value.salt)) {
    return false;
  }

  const recipients = value.recipients;
  return (
    recipients &&
    typeof recipients === "object" &&
    !Array.isArray(recipients) &&
    Object.keys(recipients).length > 0 &&
    Object.values(recipients).every(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        isBase64(entry.iv) &&
        isBase64(entry.ciphertext),
    )
  );
};

const clearConversationCache = async (memberIds) => {
  // Conversation list entries contain no plaintext previews. Clear the cached
  // list after a send so timestamps and the encrypted-message marker refresh.
  if (!memberIds || memberIds.length === 0) return;
  try {
    for (const memberId of memberIds) {
      const keys = [];
      for await (const key of redisClient.scanIterator({
        MATCH: `Conversation_Log_*_${memberId}_*`,
        COUNT: 100,
      })) {
        keys.push(key);
      }
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }
  } catch (error) {
    console.error("Error clearing conversation cache:", error);
  }
};

const areP256KeysEqual = (keyA, keyB) => {
  if (!keyA || !keyB) return false;
  try {
    const a = typeof keyA === "string" ? JSON.parse(keyA) : keyA;
    const b = typeof keyB === "string" ? JSON.parse(keyB) : keyB;
    return (
      a.kty === b.kty &&
      a.crv === b.crv &&
      a.x === b.x &&
      a.y === b.y
    );
  } catch {
    return false;
  }
};

export const registerEncryptionIdentity = async (req, res, next) => {
  const { publicKey, resetIdentity } = req.body;
  if (!isP256PublicJwk(publicKey)) {
    return res.status(400).json({ message: "A valid P-256 public key is required" });
  }

  try {
    const user = await User.findByPk(req.authUser.id, {
      attributes: ["id", "encryptionPublicKey"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingKey = user.encryptionPublicKey;
    if (existingKey) {
      if (areP256KeysEqual(existingKey, publicKey)) {
        return res.status(200).json({ publicKey: existingKey });
      }

      if (resetIdentity) {
        await user.update({ encryptionPublicKey: publicKey });
        return res.status(200).json({ publicKey });
      }

      return res.status(409).json({
        message:
          "This account already has an encryption identity. Restore the original device key before using encrypted conversations.",
      });
    }

    await user.update({ encryptionPublicKey: publicKey });
    return res.status(200).json({ publicKey });
  } catch (error) {
    next(error);
  }
};

export const getConversationEncryptionKeys = async (req, res, next) => {
  const { conversationId } = req.query;
  const userId = req.authUser.id;
  try {
    const isMember = await Members.findOne({ where: { conversationId, memberId: userId } });
    if (!isMember) return res.status(403).json({ message: "Access denied" });

    const members = await Members.findAll({
      where: { conversationId },
      attributes: ["memberId"],
      include: [{
        model: User,
        attributes: ["id", "encryptionPublicKey"],
        required: true,
      }],
    });
    const keys = members.map((member) => ({
      userId: member.memberId,
      publicKey: member.user?.encryptionPublicKey,
    }));
    const missingUserIds = keys.filter((key) => !isP256PublicJwk(key.publicKey)).map((key) => key.userId);
    if (missingUserIds.length) {
      return res.status(409).json({
        message: "Every member must initialize secure messaging before this conversation can send encrypted messages.",
        missingUserIds,
      });
    }
    return res.status(200).json({ keys });
  } catch (error) {
    next(error);
  }
};
export const getConversationsByUserId = async (req, res, next) => {
  const userId = req.authUser.id;
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 10, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  try {
    const cacheKey = `Conversation_Log_${lastTimestamp}_${userId}_${limit}`;
    const cachedConvData = await redisClient.get(cacheKey);
    if (cachedConvData !== null) {
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
      JSON.stringify(conversations),
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
    const isMember = await Members.findOne({ where: { conversationId, memberId: userId } });
    if (!isMember) return res.status(403).json({ message: "Access denied" });
    const cacheKey = `Members_Log_${conversationId}_${lastTimestamp}_${userId}_${limit}`;
    const cachedMemberData = await redisClient.get(cacheKey);
    if (cachedMemberData !== null) {
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
      },
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
  const userId = req.authUser.id;
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 10, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  try {
    // Verify membership
    const isMember = await Members.findOne({
      where: { conversationId, memberId: userId },
    });

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Messages.findAll({
      where: {
        createdAt: { [Op.lt]: lastTimestamp },
        conversationId: conversationId,
      },
      order: [["createdAt", "DESC"]],
      limit,
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

export const postMessage = async (req, res, next) => {
  const { id, conversationId, content, replyedTo } = req.body;
  const senderId = req.authUser.id;
  const createdAt = new Date();
  const io = sockIo.getIo();

  try {
    if (!conversationId || !isEncryptedEnvelope(content)) {
      return res.status(400).json({ message: "A valid encrypted message envelope is required" });
    }
    if (JSON.stringify(content).length > MAX_ENVELOPE_BYTES) {
      return res.status(413).json({ message: "Encrypted message is too large" });
    }
    if (id && (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id))) {
      return res.status(400).json({ message: "Invalid message id" });
    }

    const isMember = await Members.findOne({
      where: { conversationId, memberId: senderId },
    });

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this conversation" });
    }

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const members = await Members.findAll({
      where: { conversationId },
      attributes: ["memberId"],
    });
    const memberIds = members.map((member) => member.memberId).sort();
    const recipientIds = Object.keys(content.recipients).sort();
    if (
      memberIds.length !== recipientIds.length ||
      memberIds.some((memberId, index) => memberId !== recipientIds[index])
    ) {
      return res.status(400).json({
        message: "The encrypted envelope must contain exactly one payload for every conversation member",
      });
    }

    if (replyedTo) {
      const replyMessage = await Messages.findOne({
        where: { id: replyedTo, conversationId },
      });
      if (!replyMessage) {
        return res.status(400).json({ message: "Invalid reply message" });
      }
    }

    const newMessage = await Messages.create({
      ...(id ? { id } : {}),
      conversationId,
      senderId,
      content,
      replyedTo: replyedTo || null,
      createdAt,
    });

    await Conversation.update(
      { lastMessage: "Encrypted message", updatedAt: createdAt },
      { where: { id: conversationId } },
    );
    await clearConversationCache(memberIds);
    io?.to(`conversation:${conversationId}`).emit("newMessage", newMessage.toJSON());
    res.status(201).json(newMessage);

    // Asynchronously dispatch real-time in-app & Web Push notifications
    try {
      const recipientIds = memberIds.filter((mid) => mid !== senderId);
      if (recipientIds.length > 0) {
        Promise.all([
          User.findByPk(senderId, {
            attributes: ["id", "username", "displayName", "userImage"],
          }),
          Conversation.findByPk(conversationId, {
            attributes: ["id", "conversationType", "groupName", "image"],
          }),
        ]).then(([sender, conversation]) => {
          const senderName = sender?.displayName || sender?.username || "Someone";
          const isGroup = conversation?.conversationType === "group";
          const title = isGroup
            ? (conversation?.groupName || "Group Chat")
            : senderName;
          const body = isGroup
            ? `${senderName}: Sent a message`
            : "Sent you an encrypted message";
          const icon = isGroup
            ? (conversation?.image || sender?.userImage || "/spread_logo_03_robopus-min.png")
            : (sender?.userImage || "/spread_logo_03_robopus-min.png");
          const targetUrl = `/messages/c?Id=${conversationId}`;

          const inAppPayload = {
            id: newMessage.id,
            conversationId,
            senderId,
            senderName,
            senderImage: sender?.userImage || null,
            isGroup,
            groupName: conversation?.groupName || null,
            conversationImage: conversation?.image || null,
            createdAt: newMessage.createdAt,
          };

          recipientIds.forEach((recipientId) => {
            // 1. Real-time in-app message notification
            io?.to(`user:${recipientId}`).emit("chatMessageNotification", inAppPayload);

            // 2. Web Push for offline / background tabs
            sendPushToUser({
              userId: recipientId,
              title,
              body,
              icon,
              data: { url: targetUrl },
              tag: `message-${conversationId}`,
            }).catch((err) => console.error("Error dispatching chat push:", err));
          });
        }).catch((err) => console.error("Error fetching sender/conversation for notifications:", err));
      }
    } catch (pushErr) {
      console.error("Error initiating chat notifications:", pushErr);
    }
  } catch (error) {
    console.error("Error posting message:", error);
    next(error);
  }
};
