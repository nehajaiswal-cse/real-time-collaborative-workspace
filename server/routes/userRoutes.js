import express from "express";

import {
  getMe,
  updateProfile,
  getPreferences,
  updatePreferences,
  changePassword
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);

router.patch("/me", authMiddleware, updateProfile);

router.get(
  "/me/preferences",
  authMiddleware,
  getPreferences
);

router.patch(
  "/me/preferences",
  authMiddleware,
  updatePreferences
);

router.post(
  "/me/change-password",
  authMiddleware,
  changePassword
);

export default router;