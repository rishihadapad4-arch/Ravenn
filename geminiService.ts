
import { GoogleGenAI, Type } from "@google/genai";
import { ModerationResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const moderateContent = async (text: string): Promise<ModerationResult> => {
  if (!process.env.API_KEY) {
    return { isSafe: true }; // Fallback if no API key
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate the following text for community safety (hate speech, severe toxicity, vulgarity). Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: {
              type: Type.BOOLEAN,
              description: "Whether the text is safe to be posted in a private community."
            },
            reason: {
              type: Type.STRING,
              description: "Short reason if the text is unsafe."
            }
          },
          required: ["isSafe"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return result as ModerationResult;
  } catch (error) {
    console.error("Moderation error:", error);
    return { isSafe: true }; // Allow on error to avoid breaking UX
  }
};
