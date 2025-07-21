import axios from "axios";

const GEMINI_KEYS = (process.env.GEMINI_API_KEYS?.split(",") || []).map(k =>
  k.replace(/^"|"$/g, "").trim()
);
function sanitizeAIResponse(raw: string): string {
  return raw
    .replace(/^\s*```(?:json)?/, "") // Remove leading ``` or ```json
    .replace(/\s*```[\s\n]*$/, "") // Remove trailing ``` even if on newline
    .trim();
}
export async function callGeminiAPI(messages: any[]) {

  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const key = GEMINI_KEYS[i];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

    try {
      const response = await axios.post(url, {
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      });
      const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) throw new Error("Empty response from Gemini");

      return sanitizeAIResponse(aiText);
    } catch (error) {
      const status = error?.response?.status;

      console.warn(`⚠️ Gemini API key ${i + 1} failed with status ${status}`);

      if (i === GEMINI_KEYS.length - 1) {
        throw new Error("All Gemini API keys failed.");
      }

      // Retry only on rate limit or transient error
      if (![429, 500, 502, 503, 504].includes(status)) {
        throw error; // exit immediately on other errors
      }
    }
  }
}
