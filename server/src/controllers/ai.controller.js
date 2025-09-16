import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { promptP1 } from "../prompts/post-analysis.js";

dotenv.config();
// const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY,});
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(GEMINIAI_API_KEY);

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateAIAnalysis = async (req, res, next) => {
  try {
    // const model = genAI.models.getGenerativeModel({ model: "gemini-2.0-flash" });
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.flushHeaders(); // flush the headers to establish SSE with client
    const { post } = req.body;
    console.log(post);
    const response = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: `${promptP1}\n\nPost:\n${JSON.stringify(post)}`,
    });
    for await (const chunk of response) {
      console.log(chunk.text);
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
