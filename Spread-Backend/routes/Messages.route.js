import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/:conversationId', getMessages);

export default router;
