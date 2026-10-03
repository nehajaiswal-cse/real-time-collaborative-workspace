import express from "express";
import {
  getWorkspaceMessages,
  createMessage,
} from "../controllers/messageController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/workspace/:workspaceId", getWorkspaceMessages);
router.post("/workspace/:workspaceId", createMessage);

export default router;