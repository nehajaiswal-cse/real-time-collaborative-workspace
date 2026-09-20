import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Collaborative Workspace API is running"
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/workspaces", workspaceRoutes);

/*
  Socket.io
*/

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});