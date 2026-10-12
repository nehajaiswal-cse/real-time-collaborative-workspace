import express from "express";

import {
  getRecentActivities,
} from "../controllers/activityController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();



// Get workspace activities
router.get("/", getRecentActivities);

export default router;