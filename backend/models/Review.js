import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

reviewSchema.index({ car: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
