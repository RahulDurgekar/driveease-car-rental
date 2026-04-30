import express from "express";
import {
  createBooking, getMyBookings, getOwnerBookings,
  getUnseenNotifications, markNotificationsSeen, updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/owner", protect, getOwnerBookings);
router.get("/notifications/count", protect, getUnseenNotifications);
router.patch("/notifications/seen", protect, markNotificationsSeen);
router.patch("/:id/status", protect, updateBookingStatus);

export default router;
