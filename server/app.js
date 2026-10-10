import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import workspaceMemberRoutes from "./routes/workspaceMemberRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import commentRoutes from "./routes/commentRoutes.js"
import notificationRoute from "./routes/notificationRoute.js"

dotenv.config();

const app = express();

// Middleware


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Collaborative Workspace API is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/workspace-members", workspaceMemberRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoute);

export default app;