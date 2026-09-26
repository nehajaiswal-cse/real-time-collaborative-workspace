import express from "express";

import {
  createList,
  getBoardLists,
  getListById,
  updateList,
  deleteList
} from "../controllers/listController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createList);

router.get("/board/:boardId", getBoardLists);

router.get("/:id", getListById);

router.put("/:id", updateList);

router.delete("/:id", deleteList);

export default router;