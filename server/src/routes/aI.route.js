import express from "express";
import rateLimit from "express-rate-limit";
import IsAuth from "../middlewares/isAuth.middleware.js";
import {
  generateAIAnalysis,
  generateAIChat,
  generateTagsForPosts,
} from "../controllers/ai.controller.js";

const router = express.Router();

// Rate limiter for AI endpoints (30 requests per hour)
const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { message: "AI request quota reached. Please try again after 1 hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/analysis", IsAuth, aiRateLimiter, generateAIAnalysis);
router.post("/chat", IsAuth, aiRateLimiter, generateAIChat);
router.post("/tags", IsAuth, aiRateLimiter, generateTagsForPosts);

export default router;
