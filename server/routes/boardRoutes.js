import express from "express";

import {
  createBoard,
  getWorkspaceBoards,
  getBoardById,
  updateBoard,
  deleteBoard
} from "../controllers/boardController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// All board routes require authentication
router.use(authMiddleware);

// Create board
router.post("/", createBoard);

// Get all boards of a workspace
router.get("/workspace/:workspaceId", getWorkspaceBoards);

// Get single board
router.get("/:id", getBoardById);

// Update board
router.put("/:id", updateBoard);

// Delete board
router.delete("/:id", deleteBoard);

export default router;