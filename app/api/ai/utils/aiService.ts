import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export default async function generateContent(prompt: string) {
  try {
    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: [
        {
          role: "system",
          content: `
You are a Senior Code Reviewer with 7+ years of experience.

Focus on:
- ✅ Code Quality & Readability
- 🧠 Best Practices & SOLID Principles
- ⚙️ Efficiency & Performance
- 🧩 Scalability & Maintainability
- 🛡️ Security & Error Handling

Tone:
Professional, encouraging, precise, and educational.

Respond in Markdown with sections:
❌ Bad Code
🔍 Issues
✅ Recommended Fix
💡 Improvements
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.output_text;
  } catch (error: any) {
    console.error("Groq API Error:", error?.message);
    throw new Error("AI service unavailable");
  }
}
