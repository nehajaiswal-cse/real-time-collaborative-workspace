import express from "express";

import {
  getWorkspaceDocuments,
  createDocument,
  updateDocument,
} from "../controllers/documentController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/workspace/:workspaceId", getWorkspaceDocuments);

router.post("/workspace/:workspaceId", createDocument);

router.put("/:documentId", updateDocument);

export default router;