import express from "express";

import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace
} from "../controllers/workspaceController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createWorkspace);

router.get("/", getMyWorkspaces);

router.get("/:id", getWorkspaceById);
router.patch("/:id", authMiddleware, updateWorkspace);

export default router;