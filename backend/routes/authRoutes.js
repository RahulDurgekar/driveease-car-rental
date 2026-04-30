import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { signup, login, getProfile, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

export default router;
