import dotenv from "dotenv";
import redisClient from "../utils/redisClient.js";
import { GoogleGenAI } from "@google/genai";

const EXPIRATION = 3600;
dotenv.config();
// const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY,});
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(GEMINIAI_API_KEY);

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
// const prompt = `Analyze the given post data and generate a structured, point-by-point explanation.

// ### **Response Guidelines:**
// ✅ **First Point:** Provide a **concise summary** explaining the **main idea** of the post in detail.
// ✅ **Next Points:** Include **additional insights** related to the post’s topic that are **not explicitly mentioned** in the post.
//    - These insights should be **factual, informative, and come from trusted sources on the internet**.
//    - Include **at least one external link per point** to provide more information.
//    - Format links properly using: <a href="URL"  style="color:skyblue; text-decoration:underline; backgroundColor:  " target="_blank" rel="noopener noreferrer">Source</a>.
// ✅ **Response Format:**
//    - Return a **valid JSON array** where each string is a short, informative paragraph.
//    - Each point should be **concise (4-6 sentences), clear, and unique**.
//    - The response must contain **exactly 6 points**.
//    - Use **bold (<b>), strong (<strong>), and links (<a>)** for emphasis.
//    - **Do not include any extra text, explanations, or formatting outside the JSON array.**
//    - **Do not enclose the response with "json|" or unnecessary formatting.**

// ### **Example Output:**

// `;
const prompt = `You are a professional content analyst.

Analyze the given post and return exactly six short, informative points using clean and minimal HTML.

Instructions:
1. Start with a <h2>Summary</h2> — describe the main idea of the post in 2–3 sentences.
2. Then give five <h3>Insight</h3> sections — each with:
   - A <p> explanation (2–4 concise sentences).
   - One relevant external link formatted as:
     <a href="https://example.com" style="color:skyblue; text-decoration:underline;" target="_blank" rel="noopener noreferrer">Source</a>

Formatting Rules:
- Use clear, structured HTML tags only: <h2>, <h3>, <p>, <b>, <ul>, <li>, <code>, <blockquote>, <a>.
- Keep all text short, skimmable, and straight to the point.
- Do NOT include markdown or font styles.
- Ensure the entire output is clean, valid HTML and ready to be rendered directly in a web UI.`;


export const generateAIAnalysis = async (req, res, next) => {
  try {
    // const model = genAI.models.getGenerativeModel({ model: "gemini-2.0-flash" });
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.flushHeaders(); // flush the headers to establish SSE with client
    const { post } = req.body;
    const response = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: `${prompt}\n\nPost:\n${JSON.stringify(post)}`,
    });
      for await (const chunk of response) {
      res.write(`${chunk.text}\n\n`);
    }
    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    res.write(`event: error\ndata: ${JSON.stringify(error.message)}\n\n`);
    res.end();
    next(error);
  }
};

export const generateTagsForPosts = async (req, res, next) => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINIAI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent([
      {
        text: `You will receive a post as input. Analyze its content and generate up to 5 relevant tags related to the topic.  
                    - Each tag must be unique and contextually relevant.  
                    - Tags should be different each time the prompt is run.
                    - Tag should not be Log it should contain up to 10 character.
                    - Prefix each tag with either '#' or an appropriate emoji.  
                    - **Return only a valid JSON array of strings (e.g., ["#Tag1", "🔥Tag2", "#Tag3"]).**  
                    - **Do not include any extra text, explanations, or formatting outside of the JSON array.**  
            `,
      },
      { text: JSON.stringify(req.body) },
    ]);

    const response = result.response;
    const responseText = await response.text(); // Await the response text

    const tags = JSON.parse(responseText);
    res.status(201).json(tags);
  } catch (error) {
    console.error("Error:", error.message);
    next(error);
  }
};
