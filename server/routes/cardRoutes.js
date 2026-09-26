import express from "express";

import {
  createCard,
  getListCards,
  getCardById,
  updateCard,
  deleteCard
} from "../controllers/cardController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createCard);
router.get("/list/:listId", getListCards);
router.get("/:id", getCardById);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);

export default router;