import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    city: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    description: { type: String, default: "" },
    images: [{ type: String }],
    fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"], default: "Petrol" },
    transmission: { type: String, enum: ["Manual", "Automatic"], default: "Manual" },
    seats: { type: Number, default: 5 },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
    available: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
