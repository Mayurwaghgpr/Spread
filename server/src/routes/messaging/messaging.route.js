import express from "express";
import { createPrivateConversation } from "../../controllers/messaging/private.controller.js";
import IsAuth from "../../middlewares/isAuth.middleware.js";
import {
  getConversationsByUserId,
  getMembers,
  getMessagesByConversationId,
  getConversationEncryptionKeys,
  postMessage,
  registerEncryptionIdentity,
  setIsMuteMessage,
} from "../../controllers/messaging/common.controller.js";
import {
  createGroupConversation,
  addAsGroupAdmin,
} from "../../controllers/messaging/group.controller.js";

const router = express.Router();

//Commen Messageing routes
//Get
router.get("/c/all", IsAuth, getConversationsByUserId);
router.get("/c/messages", IsAuth, getMessagesByConversationId);
router.get("/c/members", IsAuth, getMembers);
router.get("/c/encryption-keys", IsAuth, getConversationEncryptionKeys);
router.post("/c/send/message", IsAuth, postMessage);
router.put("/keys/identity", IsAuth, registerEncryptionIdentity);
//Put
router.put("/c/message/mute", IsAuth, setIsMuteMessage);

//Private Messageing routes (one to one)
router.post("/p/create", IsAuth, createPrivateConversation);

//Group Messageing routes (many to many)
router.post("/g/create", IsAuth, createGroupConversation);
router.get("/g/make/admin", IsAuth, addAsGroupAdmin);

export default router;
