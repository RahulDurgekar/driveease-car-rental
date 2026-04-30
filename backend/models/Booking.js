import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    totalDays: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentTransactionId: { type: String, default: "" },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    ownerNotified: { type: Boolean, default: false },
    ownerSeen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
