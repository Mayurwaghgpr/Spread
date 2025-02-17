import express from 'express'
import {createConversation, getConversations} from '../controllers/conversation.controller.js';
import IsAuth from '../middlewares/isAuth.js';

const router = express.Router();

router.get('/', IsAuth, getConversations);// Get all conversations for a user
router.post('/', createConversation);  // Create new conversation


 export default router;
