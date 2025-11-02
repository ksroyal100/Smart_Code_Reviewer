import generateContent from "./aiService";

export async function getReview(reqBody: { code?: string }) {
  const { code } = reqBody;

  if (!code || !code.trim()) {
    throw new Error("Prompt is required");
  }

  const response = await generateContent(code);
  return response;
}
