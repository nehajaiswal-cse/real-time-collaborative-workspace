import express from "express";

import {
  getRecentActivities,
} from "../controllers/activityController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// All activity routes require authentication
router.use(authMiddleware);

// Get workspace activities
router.get("/", getRecentActivities);

export default router;