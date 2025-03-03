import express from 'express';
import { createPrivateConversation} from '../../controllers/messaging/private.controller.js';
import IsAuth from '../../middlewares/isAuth.js';
import { getConversationsByUserId, getMessagesByConversationId } from '../../controllers/messaging/common.controller.js';

const router = express.Router();

//Commen Messageing routes
router.get('/c/all',IsAuth,getConversationsByUserId)
router.get('/c/messages',IsAuth,getMessagesByConversationId)
// router.post('/c/message/add')

//Private Messageing routes (one to one)
router.post('/p/create',IsAuth, createPrivateConversation);

//Group Messageing routes (many to many)
router.get('/g/create', IsAuth,)

export default router