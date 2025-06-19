import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import lifeEventRoutes from "./routes/lifeEvent";
import ritualRoutes from "./routes/ritual";
import habitRoutes from "./routes/habit";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

import listener from "./lib/listener";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/lifeEvent", lifeEventRoutes);
app.use("/api/ritual", ritualRoutes);
app.use("/api/habit", habitRoutes);

listener(io);

server.listen(process.env.PORT, () => {
  console.log("Server Started");
});
