
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

let requestQueue = Promise.resolve();

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

    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });

function runChat(promptText, previousInteractionId = null, imageFile = null) {
  const request = requestQueue.then(async () => {
    const prompt = promptText?.trim() || "Describe this image.";
    let input = prompt;

    if (imageFile) {
      const imageBase64 = await fileToBase64(imageFile);

      input = [
        { type: "text", text: prompt },
        {
          type: "image",
          data: imageBase64,
          mime_type: imageFile.type,
        },
      ];
    }

    const payload = {
      model: "gemini-3.8-flash",
      input,
      stream: true,
    };

    if (previousInteractionId) {
      payload.previous_interaction_id = previousInteractionId;
    }

    return ai.interactions.create(payload);
  });

  requestQueue = request.then(
    () => undefined,
    () => undefined
  );

  return request;
}

export default runChat;
