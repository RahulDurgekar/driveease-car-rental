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
    images: [{ 
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true }
    }],
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

carSchema.methods.toJSON = function() {
  const car = this.toObject();
  if (car.images && car.images.length > 0) {
    car.images = car.images.map(img => {
      if (img.data && img.contentType) {
        return `data:${img.contentType};base64,${img.data.toString('base64')}`;
      }
      return img;
    });
  }
  return car;
};

export default mongoose.model("Car", carSchema);
