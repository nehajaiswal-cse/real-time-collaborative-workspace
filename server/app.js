import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
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

export default app;