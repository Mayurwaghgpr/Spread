import express from 'express';
import { generateAIAnalysis, generateTagsForPosts } from '../controllers/AI.controller.js';
const router = express.Router();

router.post('/analysis',generateAIAnalysis)
router.post('/tags', generateTagsForPosts);

export default router;