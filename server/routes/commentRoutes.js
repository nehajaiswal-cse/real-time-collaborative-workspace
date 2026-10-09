import express from "express";

import {
  getCardComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get(
  "/card/:cardId",
  authMiddleware,
  getCardComments
);

router.post(
  "/card/:cardId",
  authMiddleware,
  createComment
);

router.put(
  "/:commentId",
  authMiddleware,
  updateComment
);

router.delete(
  "/:commentId",
  authMiddleware,
  deleteComment
);

export default router;