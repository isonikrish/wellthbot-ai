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
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/lifeEvent", lifeEventRoutes);
app.use("/api/ritual", ritualRoutes);
app.use("/api/habit", habitRoutes);


listener(io);

server.listen(5003, () => {
  console.log("Server Started");
});
