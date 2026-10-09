import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function runChat(promptText) {
  try {
    const streamResult = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: promptText,
      stream: true,
    });

    return streamResult
  } catch (error) {
    console.error("Gemini error:", error.message);
    return "Something went wrong. Please try again.";
  }
}

export default runChat;