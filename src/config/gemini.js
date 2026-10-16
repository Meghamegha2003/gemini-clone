
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey,
});

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to read image."));
        return;
      }

      resolve(reader.result.split(",")[1]);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image."));
    };

    reader.readAsDataURL(file);
  });

async function runChat(
  promptText,
  previousInteractionId = null,
  imageFile = null
) {
  try {
    if (!apiKey) {
      throw new Error(
        "Gemini API key is missing. Check your .env file."
      );
    }

    const prompt =
      promptText?.trim() ||
      (imageFile ? "Describe this image." : "");

    if (!prompt && !imageFile) {
      throw new Error("Please enter a prompt.");
    }

    let input = prompt;

    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) {
        throw new Error("Please select a valid image file.");
      }

      const imageBase64 = await fileToBase64(imageFile);

      input = [
        {
          type: "text",
          text: prompt,
        },
        {
          type: "image",
          data: imageBase64,
          mime_type: imageFile.type,
        },
      ];
    }

    const payload = {
      model: "gemma-4-26b-a4b-it",
      input,
      stream: true,
    };

    if (previousInteractionId) {
      payload.previous_interaction_id = previousInteractionId;
    }

    return await ai.interactions.create(payload);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export default runChat;
