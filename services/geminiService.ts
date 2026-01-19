import { GoogleGenAI } from "@google/genai";
import { AppRoute } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSupportAdvice = async (
  currentRoute: AppRoute,
  userQuery: string,
  screenContext: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Unavailable: Missing API Key.";

  const prompt = `
    You are an expert technical support agent assisting a user in real-time.
    
    Context:
    - The user is currently on the "${currentRoute}" page.
    - Visible elements/Screen state: ${screenContext}
    - The user (or admin) is asking: "${userQuery}"

    Task:
    Provide a short, actionable suggestion for the Admin to tell the user. 
    Explain exactly where the Admin should click to guide the user (e.g., "Click the blue 'Save' button in the top right").
    Keep it under 2 sentences.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No suggestion available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate advice at this time.";
  }
};