import { Server, Socket } from "socket.io";
import { socketProtectRoute } from "./getToken";
import {
  checkDataCompletions,
  createHabit,
  createLifeEvent,
  createRitual,
  generateReport,
  getUserLifeEvents,
  getUserMoodLog,
  getUserRituals,
  updateUserMoodlog,
} from "./tools";
import { SYSTEM_PROMPT } from "./system_prompt";
import axios from "axios";
import { callGeminiAPI } from "./callGemini";

const tools: Record<string, Function> = {
  getUserLifeEvents,
  getUserRituals,
  getUserMoodLog,
  createLifeEvent,
  createRitual,
  updateUserMoodlog,
  createHabit,
};



export default function listener(io: Server) {
  io.use(socketProtectRoute);
  io.on("connection", (socket: Socket) => {
    console.log("✅ Socket Connected");
    const userId = socket.data.userId;

    let messages = [{ role: "user", content: SYSTEM_PROMPT(userId) }];

    socket.on("user:message", async (text: string) => {
      try {
        const userMessage = JSON.stringify({ type: "user", user: text });
        messages.push({ role: "user", content: userMessage });


        let aiText = await callGeminiAPI(messages)
        const parsed = JSON.parse(aiText);
        switch (parsed.type) {
          case "START": {
            socket.emit("bot:reply", parsed.message);
            break;
          }
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
              console.error("❌ Unknown function:", fnName);
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

              const completion = await checkDataCompletions(userId);

              if (completion.isComplete) {
                
                const url = await generateReport(userId);
                socket.emit(
                  "bot:reply",
                  `I have have sent daily report to your email. Check the mail here ${url}`
                );
              } else {
                console.log("📛 Data not complete, skipping report generation");
              }
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
      } catch (err) {
        socket.emit("bot:error", "Failed to process AI response.");
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  });
}
