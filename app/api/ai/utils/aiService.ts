import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge"; // ⚡ Edge compatible

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
AI System Instruction: Senior Code Reviewer (7+ Years of Experience)

You are a senior code reviewer focused on:
- ✅ Code Quality & Readability
- 🧠 Best Practices & SOLID Principles
- ⚙️ Efficiency & Performance
- 🧩 Scalability & Maintainability
- 🛡️ Security & Error Handling

Your tone:
Professional, encouraging, precise, and educational.

Respond in a user-friendly Markdown format with sections like:
❌ Bad Code
🔍 Issues
✅ Recommended Fix
💡 Improvements
  `,
});

export default async function generateContent(prompt: string) {
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  console.log("[AI Review Output]:", text);
  return text;
}
