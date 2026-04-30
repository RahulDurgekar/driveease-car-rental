import express from "express";
import {
  createCar, getCars, getCarById, updateCar,
  deleteCar, toggleAvailability, getMyCars, checkAvailability,
} from "../controllers/carController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getCars);
router.get("/check/availability", checkAvailability);
router.get("/my", protect, getMyCars);
router.get("/:id", getCarById);
router.post("/", protect, upload.array("images", 6), createCar);
router.put("/:id", protect, updateCar);
router.delete("/:id", protect, deleteCar);
router.patch("/:id/toggle", protect, toggleAvailability);

export default router;
