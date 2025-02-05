import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
dotenv.config();
const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY,});


const data={
    "id": "2f58f9d1-8b47-4ba6-b10a-4ef1a5568acf",
    "title": "The Power of JavaScript",
    "subtitelpagraph": "Exploring the language that powers the web",
    "titleImage": "https://res.cloudinary.com/dvjs0twtc/image/upload/v1736785833/pbbgkquesiymxhtydd7k.png",
    "topic": "javascript",
    "cloudinaryPubId": "pbbgkquesiymxhtydd7k",
    "authorId": "4764f8c1-aa8a-4634-a2e4-f7504143fd8c",
    "createdAt": "2025-01-13T16:30:33.924Z",
    "updatedAt": "2025-01-13T16:30:33.924Z",
    "User": {
        "id": "4764f8c1-aa8a-4634-a2e4-f7504143fd8c",
        "username": "Mayur Wagh",
        "userImage": "https://res.cloudinary.com/dvjs0twtc/image/upload/v1736101815/mrvnkwyprn5s3iqg0iz9.jpg"
    },
    "Likes": [
        {
            "id": "8f109fa0-dc0e-4e6d-9422-aebd5e11bdc4",
            "type": "smile",
            "likedBy": "4764f8c1-aa8a-4634-a2e4-f7504143fd8c",
            "postId": "2f58f9d1-8b47-4ba6-b10a-4ef1a5568acf",
            "createdAt": "2025-01-21T17:27:05.663Z",
            "updatedAt": "2025-01-26T14:44:29.035Z"
        }
    ],
    "postContent": [
        {
            "id": "f4833446-908f-43b8-9059-6ed5cc06e592",
            "type": "text",
            "content": "JavaScript is the backbone of modern web development. As the language of the web, it powers interactivity, dynamic content, and cutting-edge technologies. But what makes JavaScript so powerful, and why is it indispensable for developers?",
            "otherInfo": "",
            "cloudinaryPubId": "",
            "index": 3,
            "postId": "2f58f9d1-8b47-4ba6-b10a-4ef1a5568acf",
            "createdAt": "2025-01-13T16:30:43.858Z",
            "updatedAt": "2025-01-13T16:30:43.858Z"
        },
        {
            "id": "188367ed-c88d-4aa5-9bfd-da0d34e0c492",
            "type": "text",
            "content": "<h4><strong>1. Versatility Across Platforms</strong></h4><p>JavaScript is not limited to front-end development. With the advent of Node.js, it has become a powerful tool for building server-side applications. Developers can now use JavaScript for full-stack development, making it easier to create seamless and consistent applications.</p>",
            "otherInfo": "",
            "cloudinaryPubId": "",
            "index": 4,
            "postId": "2f58f9d1-8b47-4ba6-b10a-4ef1a5568acf",
            "createdAt": "2025-01-13T16:30:43.858Z",
            "updatedAt": "2025-01-13T16:30:43.858Z"
        },
        {
            "id": "a7680b53-fadf-463a-a011-1faf4708fd1d",
            "type": "text",
            "content": "<h4><strong>2. Rich Ecosystem of Frameworks and Libraries</strong></h4><p>Frameworks like React, Angular, and Vue.js, along with libraries such as jQuery and Lodash, have expanded JavaScript’s capabilities. These tools simplify complex tasks, improve code quality, and accelerate development. For instance, React’s virtual DOM enhances performance, while Angular’s two-way data binding streamlines user interaction.</p><h4></h4>",
            "otherInfo": "",
            "cloudinaryPubId": "",
            "index": 5,
            "postId": "2f58f9d1-8b47-4ba6-b10a-4ef1a5568acf",
            "createdAt": "2025-01-13T16:30:43.858Z",
            "updatedAt": "2025-01-13T16:30:43.858Z"
        },
        {
            "id": "e7c206b5-7d3d-4519-bbbf-b66999c8bdad",
            "type": "image",
            "content": "https://res.cloudinary.com/dvjs0twtc/image/upload/v1736785841/zn4xphr8zxekyk17ogni.jpg",
            "otherInfo": "",
            "cloudinaryPubId": "zn4xphr8zxekyk17ogni",
            "index": 6,
            "postId": "2f58f9d1-8b47-4ba6-b10a-4ef1a5568acf",
            "createdAt": "2025-01-13T16:30:43.858Z",
            "updatedAt": "2025-01-13T16:30:43.858Z"
        },
        {
            "id": "4a418475-b46c-4562-81f7-0c04fb7c7364",
            "type": "text",
            "content": "<h4><strong>3. Real-Time Web Applications</strong></h4><p>JavaScript excels at creating real-time applications, such as chat apps and collaborative tools. Libraries like Socket.IO enable bi-directional communication between the client and server, ensuring instant updates without refreshing the page.</p>",
            "otherInfo": "",
            "cloudinaryPubId": "",
            "index": 7,
            "postId": "2f58f9d1-8b47-4ba6-b10a-4ef1a5568acf",
            "createdAt": "2025-01-13T16:30:43.858Z",
            "updatedAt": "2025-01-13T16:30:43.858Z"
        },
        {
            "id": "9f35a3e5-d2c4-437a-af31-aa9b9f7ca855",
            "type": "image",
            "content": "https://res.cloudinary.com/dvjs0twtc/image/upload/v1736785842/euluprvwxuqlhz7bmbeo.png",
            "otherInfo": "",
            "cloudinaryPubId": "euluprvwxuqlhz7bmbeo",
            "index": 8,
            "postId": "2f58f9d1-8b47-4ba6-b10a-4ef1a5568acf",
            "createdAt": "2025-01-13T16:30:43.858Z",
            "updatedAt": "2025-01-13T16:30:43.858Z"
        },
        {
            "id": "6b23787b-d8d1-4686-98cb-e05a3f538e0a",
            "type": "text",
            "content": "<h4><strong>4. Future-Ready with ES6+ Features</strong></h4><p>Modern JavaScript includes powerful features like arrow functions, destructuring, template literals, and modules. These updates make the language more readable and developer-friendly, reducing the boilerplate code and improving maintainability.</p>",
            "otherInfo": "",
            "cloudinaryPubId": "",
            "index": 9,
            "postId": "2f58f9d1-8b47-4ba6-b10a-4ef1a5568acf",
            "createdAt": "2025-01-13T16:30:43.858Z",
            "updatedAt": "2025-01-13T16:30:43.858Z"
        },
        {
            "id": "568eaf37-85ac-4632-80dc-03336b002545",
            "type": "text",
            "content": "<h4><strong>Final Thoughts</strong></h4><p>JavaScript continues to dominate the tech world because of its adaptability and rich ecosystem. Whether you're building a website, a server, or even a game, JavaScript empowers developers to create powerful and interactive experiences.</p>",
            "otherInfo": "",
            "cloudinaryPubId": "",
            "index": 10,
            "postId": "2f58f9d1-8b47-4ba6-b10a-4ef1a5568acf",
            "createdAt": "2025-01-13T16:30:43.858Z",
            "updatedAt": "2025-01-13T16:30:43.858Z"
        }
    ],
    "comments": []
}

const prompt = `
You are an AI assistant analyzing blog posts. Understand the content and provide fresh insights every time. Return:

Summary: Key points without repetition.
Analysis: Topic significance, trends, and impact.
Suggestions: resources, and related topics to the post reader.
Actionable Advice: Practical takeaways and implementation ideas.
Resources: Relevant links, code snippets, or references.

Format: should return in html formate with a div styled using tailwind css and don't add background color and border on div.Note: return each time in same formate . Ensure originality and enrich with external sources if needed.
`;




const generateAIAnalysis = async (data) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Or any model you want to use
            messages: [
                { role: "system", content:prompt },
                { role: "user", content: JSON.stringify(data) }
            ],
        });

        console.log(response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

generateAIAnalysis(data);
