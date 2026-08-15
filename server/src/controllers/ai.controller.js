import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import {
  ANALYSIS_SYSTEM_PROMPT,
  CHAT_SYSTEM_PROMPT,
} from "../prompts/post-analysis.js";
import redisClient from "../utils/redisClient.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Fallback in-memory cache if Redis is not connected
const memoryCache = new Map();

const getCache = async (key) => {
  try {
    if (redisClient.isOpen) {
      const cached = await redisClient.get(key);
      if (cached) return cached;
    }
  } catch (err) {
    console.warn("Redis get error, using memory cache fallback:", err.message);
  }
  const item = memoryCache.get(key);
  if (item && item.expiresAt > Date.now()) {
    return item.value;
  }
  memoryCache.delete(key);
  return null;
};

const setCache = async (key, value, ttlSeconds = 86400) => {
  try {
    if (redisClient.isOpen) {
      await redisClient.setEx(key, ttlSeconds, value);
      return;
    }
  } catch (err) {
    console.warn("Redis set error, using memory cache fallback:", err.message);
  }
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

/**
 * Utility to extract and download remote image binary as inlineData object for Gemini multimodal vision.
 */
const fetchImagePart = async (url) => {
  try {
    if (!url || typeof url !== "string") return null;
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 4000,
    });
    const contentType = response.headers["content-type"] || "image/jpeg";
    const base64Data = Buffer.from(response.data, "binary").toString("base64");
    return {
      inlineData: {
        mimeType: contentType,
        data: base64Data,
      },
    };
  } catch (err) {
    console.warn("Failed to fetch image for Gemini vision:", err.message);
    return null;
  }
};

const CANDIDATE_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

/**
 * Executes a streaming generation call with fallback across candidate Gemini models.
 */
const executeStreamWithFallback = async (params) => {
  let lastError = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await genAI.models.generateContentStream({
        ...params,
        model,
      });
      return response;
    } catch (err) {
      console.warn(
        `Gemini model '${model}' error (${err.status || err.message}). Attempting next candidate...`
      );
      lastError = err;
    }
  }
  throw lastError || new Error("All AI service models are currently busy.");
};

/**
 * Executes a single generation call with fallback across candidate Gemini models.
 */
const executeContentWithFallback = async (params) => {
  let lastError = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await genAI.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err) {
      console.warn(
        `Gemini model '${model}' error (${err.status || err.message}). Attempting next candidate...`
      );
      lastError = err;
    }
  }
  throw lastError || new Error("All AI service models are currently busy.");
};

/**
 * Generate Structured AI Analysis with Streaming and Caching
 */
export const generateAIAnalysis = async (req, res, next) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const { post } = req.body;
    if (!post) {
      res.write(
        `data: ${JSON.stringify({ type: "error", message: "Post content is required" })}\n\n`
      );
      return res.end();
    }

    const postId = post.id || post._id || "temp_id";
    const updatedAt = post.updatedAt || "v1";
    const cacheKey = `ai:analysis:${postId}:${updatedAt}`;

    // Check cache
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        res.write(`data: ${JSON.stringify({ type: "cached", data: parsed })}\n\n`);
        return res.end();
      } catch (e) {
        // invalid cached json, proceed with generation
      }
    }

    // Extract text content from post
    let postTextContent = `Title: ${post.title || ""}\nSubtitle: ${post.subtitelpagraph || post.subtitle || ""}\n\nContent:\n`;
    if (Array.isArray(post.postBlocks)) {
      postTextContent += post.postBlocks
        .map((b) => {
          if (typeof b === "string") return b;
          if (b.content) return b.content;
          if (b.text) return b.text;
          return "";
        })
        .join("\n");
    } else if (Array.isArray(post.postContent)) {
      postTextContent += post.postContent
        .map((b) => (typeof b === "string" ? b : b.content || ""))
        .join("\n");
    } else if (typeof post.content === "string") {
      postTextContent += post.content;
    }

    // Extract comment context if present
    let commentsText = "";
    if (Array.isArray(post.comments) && post.comments.length > 0) {
      commentsText = post.comments
        .slice(0, 8)
        .map((c) => `- ${c.comment || c.text || ""}`)
        .join("\n");
    }

    // Prepare multimodal image parts if available
    const imageParts = [];
    if (post.previewImage) {
      const part = await fetchImagePart(post.previewImage);
      if (part) imageParts.push(part);
    } else if (post.titleImage) {
      const part = await fetchImagePart(post.titleImage);
      if (part) imageParts.push(part);
    }

    const userPrompt = `
Analyze the following post and return structured JSON:

<post_content>
${postTextContent}
</post_content>

${commentsText ? `<comments>\n${commentsText}\n</comments>` : ""}
`;

    const contents = [
      { text: ANALYSIS_SYSTEM_PROMPT },
      { text: userPrompt },
      ...imageParts,
    ];

    const response = await executeStreamWithFallback({
      contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    let fullOutput = "";
    for await (const chunk of response) {
      const chunkText = chunk.text || "";
      fullOutput += chunkText;
      res.write(
        `data: ${JSON.stringify({ type: "chunk", text: chunkText })}\n\n`
      );
    }

    // Try parsing final output and save to cache
    let parsedResult;
    try {
      parsedResult = JSON.parse(fullOutput);
    } catch (e) {
      // Fallback if model wraps in markdown json blocks
      const cleaned = fullOutput.replace(/```json|```/g, "").trim();
      try {
        parsedResult = JSON.parse(cleaned);
      } catch (err) {
        parsedResult = {
          summary: fullOutput,
          promptChips: [],
          keyTakeaways: [],
          sentiment: { overall: "NEUTRAL", score: 70, breakdown: "Automated summary generated." },
          actionableItems: [],
        };
      }
    }

    // Save to cache for 24 hours
    await setCache(cacheKey, JSON.stringify(parsedResult), 86400);

    res.write(
      `data: ${JSON.stringify({ type: "done", data: parsedResult })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error("AI Analysis Streaming error:", error);
    const is503 = error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("high demand");
    const userMessage = is503
      ? "Spread AI is currently experiencing high demand. Please try again in a few moments."
      : error.message || "AI Analysis Failed";
    res.write(
      `data: ${JSON.stringify({ type: "error", message: userMessage })}\n\n`
    );
    res.end();
  }
};

/**
 * Continuous Follow-up Chat Stream Endpoint
 */
export const generateAIChat = async (req, res, next) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const { post, message, chatHistory = [] } = req.body;

    if (!message) {
      res.write(
        `data: ${JSON.stringify({ type: "error", message: "Message is required" })}\n\n`
      );
      return res.end();
    }

    let postContext = "";
    if (post) {
      postContext = `Title: ${post.title || ""}\nSubtitle: ${post.subtitelpagraph || post.subtitle || ""}\nContent: ${
        typeof post.content === "string"
          ? post.content
          : Array.isArray(post.postBlocks)
          ? post.postBlocks.map((b) => b.content || b.text || "").join("\n")
          : ""
      }`;
    }

    const formattedHistory = chatHistory
      .map((h) => `${h.sender === "user" ? "User" : "Assistant"}: ${h.text}`)
      .join("\n");

    const promptText = `
${CHAT_SYSTEM_PROMPT}

<post_content>
${postContext}
</post_content>

${formattedHistory ? `Previous Chat History:\n${formattedHistory}\n` : ""}

User Question: ${message}
`;

    const response = await executeStreamWithFallback({
      contents: promptText,
    });

    for await (const chunk of response) {
      res.write(
        `data: ${JSON.stringify({ type: "chat_chunk", text: chunk.text || "" })}\n\n`
      );
    }

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (error) {
    console.error("AI Chat Streaming error:", error);
    const is503 = error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("high demand");
    const userMessage = is503
      ? "Spread AI is currently experiencing high demand. Please try again in a few moments."
      : error.message || "AI Chat Failed";
    res.write(
      `data: ${JSON.stringify({ type: "error", message: userMessage })}\n\n`
    );
    res.end();
  }
};

/**
 * Generate Tags for Posts using @google/genai SDK
 */
export const generateTagsForPosts = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const prompt = `Analyze the given post content and generate up to 5 relevant tags.
- Each tag must be unique and contextually relevant.
- Max 10 characters per tag.
- Prefix each tag with '#' or a relevant emoji.
- Return ONLY a valid JSON array of strings (e.g. ["#Tech", "🔥AI", "#Code"]).

Post Title: ${title || ""}
Post Content: ${typeof content === "string" ? content : JSON.stringify(content)}`;

    const response = await executeContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "[]";
    const tags = JSON.parse(responseText);
    res.status(200).json(tags);
  } catch (error) {
    console.error("Generate Tags Error:", error.message);
    res.status(500).json({ message: "Failed to generate tags" });
  }
};
