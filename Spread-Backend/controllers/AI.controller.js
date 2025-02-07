import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
dotenv.config();
// const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY,});
const GEMINIAI_API_KEY =process.env.GEMINI_API_KEY

const prompt = `Analyze the given post data and generate an explanation in a structured, point-by-point format. 
                Each point should be a detailed paragraph providing insights, analysis, and additional relevant information about the post's topic.
                Ensure the response follows these guidelines:
                - Each point must be at least a paragraph long (3-5 sentences).
                - The response must be a valid JSON array of strings where each string is a paragraph.
                - There should be at least three points.
                - Each time you must provide new information.
                - Do not include any extra text, explanations, or formatting outside the JSON array.
            `;


export const generateAIAnalysis = async (req, res) => {
    // console.log(req.body)
    try {
        const genAI = new GoogleGenerativeAI(GEMINIAI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent([
            { text:prompt },
            { text: JSON.stringify(req.body) }
        ]);

        const response = result.response;
        console.log(response.text())
           const responseText = response.text(); 
    
        const analysis = JSON.parse(responseText);
        res.status(201).json(analysis)
    } catch (error) {
        console.error("Error:", error.message);
    }
};




export const generateTagsForPosts = async (req, res) => {
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
    }
};