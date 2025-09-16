// export const promptP0 = `Analyze the given post data and generate a structured, point-by-point explanation.

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
export const promptP1 = `You are a professional content analyst.

Analyze the given post and output minimal, clean HTML with exactly three concise insights.

Structure:
1. Begin with a <p> tag summarizing the main idea of the post in 2–3 short sentences.
2. Follow with a <ul> element containing exactly three <li> elements.

Each <li> must:
- Start with a <b>highlighted key phrase</b>.
- Be a short, unique point (2–4 sentences max).
- Be skimmable and informative.
- Optionally include an <a href="..." target="_blank" className="text-blue-500" rel="noopener noreferrer">link</a> if relevant (only one total).

Formatting Rules:
- Use only the following tags: <p>, <ul>, <li>, <b>, <a>.
- Output must be valid, clean HTML only — no markdown, no headers, no extra text.

Important:
- Do NOT return more than 3 bullet points.
- Do NOT include any content outside of the HTML structure.`;
