import express from "express";

import {
  addMember,
  getWorkspaceMembers,
  updateMemberRole,
  removeMember
} from "../controllers/workspaceMemberController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addMember);
router.get("/workspace/:workspaceId", getWorkspaceMembers);
router.put("/:id", updateMemberRole);
router.delete("/:id", removeMember);

export default router;