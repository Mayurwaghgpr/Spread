import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
dotenv.config();
// const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY,});
const GEMINIAI_API_KEY =process.env.GEMINI_API_KEY

const prompt = `Analyze the given post data and generate a structured, point-by-point explanation.  

Ensure the response follows these rules:  

**First Point:** Provide a **concise summary** explaining the main idea of the post.  
**Next Points:** Include **additional relevant insights** related to the post's topic that are **not mentioned in the post**.  
   - These insights should come from **trusted sources on the internet**.  
   - Include **at least one external link per point** for more information.  
   - Links should be properly styled: <a href="link" style="color:blue; text-decoration:underline;">source</a>.  
**Response Format:**  
   - Return a **valid JSON array** where each string is a short paragraph.  
   - Each point must be **accurate, concise (2-3 sentences), and unique**.  
   - Use **bold (<b>), strong (<strong>), and links (<a>)** for emphasis.  
   - **No extra text, explanations, or formatting outside the JSON array.**  
**Example Output:**  

`;
export const generateAIAnalysis = async (req, res, next) => {
    try {
        const genAI = new GoogleGenerativeAI(GEMINIAI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent([
            { text: prompt },
            { text: JSON.stringify(req.body) }
        ]);

        let responseText = result.response.text();

        // Clean the response (remove unwanted code block syntax or extra text)
        responseText = responseText.replace(/```json|```/g, "").trim(); // Remove code block syntax

        // Ensure the response is a valid JSON array before parsing
        let analysis;
        try {
            analysis = JSON.parse(responseText);
            if (!Array.isArray(analysis)) {
                throw new Error("Invalid response format: Expected an array.");
            }
        } catch (err) {
            throw new Error("Error parsing AI response: " + err.message);
        }

        // If everything looks good, send the result as JSON
        res.status(201).json(analysis);

    } catch (error) {
        console.error("Error:", error.message);
        next(error); // Forward error to error handling middleware
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