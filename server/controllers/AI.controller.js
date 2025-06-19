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

Analyze the given post and output structured HTML as follows:

1. First, wrap a short 2–3 sentence summary of the post inside a <p> tag.
2. Then, create an unordered list using <ul> with exactly six <li> elements.
3. Each <li> must:
   - Contain a distinct point related to or inspired by the post.
   - Be written in 4–6 short, skimmable sentences.
   - Start with a <b>bolded summary</b> of the point (first few words only).
4. You must use valid and clean HTML only — no markdown, no extra formatting.
5. Only these HTML tags are allowed: <p>, <ul>, <li>, <b>, <a>, <code>, <blockquote>.
6. If adding a link, wrap it like: <a href="URL" target="_blank" className="text-blue-500" rel="noopener noreferrer">link text</a> — only one link allowed.
7. Do NOT include any headers, titles, or introductory/explanatory text outside the HTML.
8. The final output must contain only valid HTML and must always include both <p> and <ul><li> elements.

Strict Rule: If you do not return the <ul> with exactly six <li> elements, the response is considered invalid.`;


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
