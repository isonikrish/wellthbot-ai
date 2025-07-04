import { Server, Socket } from "socket.io";
import { socketProtectRoute } from "./getToken";
import {
  createHabit,
  createLifeEvent,
  createRitual,
  getUserLifeEvents,
  getUserMoodLog,
  getUserRituals,
  updateUserMoodlog,
} from "./tools";
import { SYSTEM_PROMPT } from "./system_prompt";
import axios from "axios";

const tools: Record<string, Function> = {
  getUserLifeEvents,
  getUserRituals,
  getUserMoodLog,
  createLifeEvent,
  createRitual,
  updateUserMoodlog,
  createHabit,
};

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

function sanitizeAIResponse(raw: string): string {
  return raw
    .replace(/^\s*```(?:json)?/, "") // Remove leading ``` or ```json
    .replace(/\s*```[\s\n]*$/, "") // Remove trailing ``` even if on newline
    .trim();
}
export default function listener(io: Server) {
  io.use(socketProtectRoute);
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;

    let messages = [{ role: "user", content: SYSTEM_PROMPT(userId) }];

    socket.on("user:message", async (text: string) => {
      try {
        const userMessage = JSON.stringify({ type: "user", user: text });
        messages.push({ role: "user", content: userMessage });

        const response = await axios.post(GEMINI_API_URL, {
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
        });

        let aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiText) return;

        aiText = sanitizeAIResponse(aiText);
        const parsed = JSON.parse(aiText);
        switch (parsed.type) {
          case "PLAN": {
            socket.emit("bot:reply", parsed.plan);
            break;
          }
          case "ACTION": {
            const fnName =
              parsed.plan?.tool ||
              parsed.plan?.function ||
              parsed.action?.function ||
              parsed.function;

            const input =
              parsed.plan?.input || parsed.action?.input || parsed.input;

            const fn = tools[fnName];
            if (!fn) {
              socket.emit("bot:error", `Unknown function: ${fnName}`);
              return;
            }

            try {
              const result = await fn({ ...input, userId });

              const observation = {
                type: "OBSERVATION",
                observation: result,
              };

              messages.push({
                role: "assistant",
                content: JSON.stringify(observation),
              });

              socket.emit("bot:result", result);
            } catch (err) {
              socket.emit("bot:error", "Failed to execute action.");
            }
            break;
          }

          case "OUTPUT": {
            if (!parsed.output) {
              socket.emit("bot:error", "No output in response.");
              return;
            }

            socket.emit("bot:reply", parsed.output);
            break;
          }

          default: {
            socket.emit("bot:error", "Unrecognized response type.");
          }
        }
      } catch {
        socket.emit("bot:error", "Failed to process AI response.");
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  });
}
