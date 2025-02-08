import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import redisClient from "../utils/redisClient.js";
import fs from "fs";
import { Readable } from "stream";

const EXPIRATION = 3600;
dotenv.config();
// const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY,});
const GEMINIAI_API_KEY =process.env.GEMINI_API_KEY

const prompt = `Analyze the given post data and generate a structured, point-by-point explanation.

### **Response Guidelines:**
✅ **First Point:** Provide a **concise summary** explaining the **main idea** of the post.  
✅ **Next Points:** Include **additional insights** related to the post’s topic that are **not explicitly mentioned** in the post.  
   - These insights should be **factual, informative, and come from trusted sources on the internet**.  
   - Include **at least one external link per point** to provide more information.  
   - Format links properly using: <a href="URL" style="color:blue; text-decoration:underline;" target="_blank" rel="noopener noreferrer">Source</a>.  
✅ **Response Format:**  
   - Return a **valid JSON array** where each string is a short, informative paragraph.  
   - Each point should be **concise (2-3 sentences), clear, and unique**.  
   - The response must contain **exactly 6 points**.  
   - Use **bold (<b>), strong (<strong>), and links (<a>)** for emphasis.  
   - **Do not include any extra text, explanations, or formatting outside the JSON array.**  
   - **Do not enclose the response with "json|" or unnecessary formatting.**  

### **Example Output:**

`;
export const generateAIAnalysis = async (req, res, next) => {
    try {
        const genAI = new GoogleGenerativeAI(GEMINIAI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const postId = req.body.id;
        if (!postId) {
            return res.status(400).json({ error: "Missing post ID" });
        }

        // Fetch data from Redis
        const postdata = await redisClient.get(postId);
        if (!postdata) {
            return res.status(404).json({ error: "Data not found in cache" });
        }

        const result = await model.generateContent([
            { text: JSON.stringify(prompt) },
            { text: JSON.stringify(postdata) }
        ]);

        let responseText;
        if (result?.response?.text) {
            responseText = result.response.text();
        } else {
            throw new Error("Invalid response structure from AI model.");
        }

        // Clean response (remove code block markers and trim)
        responseText = responseText.replace(/```json|```/g, "").trim();

        let analysis;
        try {
            analysis = JSON.parse(responseText);
            if (!Array.isArray(analysis)) {
                throw new Error("Expected an array in AI response.");
            }
        } catch (err) {
            throw new Error("Error parsing AI response: " + err.message);
        }

        // // Stream the response
        // const readable = new Readable({
        //     objectMode: true,
        //     read() {
        //         while (analysis.length) {
        //             this.push(analysis.shift()); // Push data chunks
        //         }
        //         this.push(null); // End the stream
        //     }
        // });

        // readable.pipe(res);

        res.status(201).json(analysis);

    } catch (error) {
        console.error("Error:", error.message);
        next(error);
    }
};

export const generateTagsForPosts = async (req, res,next) => {
    try {
        const genAI = new GoogleGenerativeAI(GEMINIAI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent([
            {text:`You will receive a post as input. Analyze its content and generate up to 5 relevant tags related to the topic.  
                    - Each tag must be unique and contextually relevant.  
                    - Tags should be different each time the prompt is run.
                    - Tag should not be Log it should contain up to 10 character.
                    - Prefix each tag with either '#' or an appropriate emoji.  
                    - **Return only a valid JSON array of strings (e.g., ["#Tag1", "🔥Tag2", "#Tag3"]).**  
                    - **Do not include any extra text, explanations, or formatting outside of the JSON array.**  
            ` },
            { text: JSON.stringify(req.body) }
        ]);

        const response = result.response;
           const responseText = await response.text(); // Await the response text
    
        const tags = JSON.parse(responseText);
        res.status(201).json(tags)
    } catch (error) {
        console.error("Error:", error.message);
        next(error);
    }
};