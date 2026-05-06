import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import sharp from "sharp";

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  city: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  description: { type: String, default: "" },
  images: [{ 
    data: { type: Buffer },
    contentType: { type: String }
  }],
  fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"], default: "Petrol" },
  transmission: { type: String, enum: ["Manual", "Automatic"], default: "Manual" },
  seats: { type: Number, default: 5 },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  available: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true, strict: false });

const Car = mongoose.model("Car", carSchema);

async function migrateImagesToBuffer() {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/car_rental_new";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");

    const cars = await Car.find({}).lean();
    console.log(`Found ${cars.length} cars to migrate`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const car of cars) {
      try {
        let needsUpdate = false;
        const newImages = [];

        for (const image of car.images || []) {
          // Check if already in Buffer format
          if (image.data && image.contentType) {
            newImages.push(image);
            continue;
          }

          // Check if it's a Base64 string
          if (typeof image === 'string' && image.startsWith('data:image')) {
            const matches = image.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
              const base64Data = matches[2];
              const buffer = Buffer.from(base64Data, 'base64');
              
              // Compress image
              const compressedBuffer = await sharp(buffer)
                .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toBuffer();
              
              newImages.push({ data: compressedBuffer, contentType: 'image/jpeg' });
              needsUpdate = true;
              console.log(`  ✓ Converted and compressed Base64 to Buffer`);
            }
            continue;
          }

          // Check if it's a URL
          if (typeof image === 'string' && image.startsWith("http://localhost:5050/uploads/")) {
            const filename = image.split("/uploads/")[1];
            const filePath = path.join(__dirname, "uploads", filename);

            if (fs.existsSync(filePath)) {
              try {
                // Compress image before storing
                const compressedBuffer = await sharp(filePath)
                  .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
                  .jpeg({ quality: 80 })
                  .toBuffer();

                newImages.push({ data: compressedBuffer, contentType: 'image/jpeg' });
                needsUpdate = true;
                console.log(`  ✓ Converted and compressed file to Buffer: ${filename}`);
              } catch (err) {
                console.log(`  ✗ Error converting ${filename}: ${err.message}`);
              }
            } else {
              console.log(`  ✗ File not found: ${filename}`);
            }
          }
        }

        if (needsUpdate && newImages.length > 0) {
          await Car.updateOne({ _id: car._id }, { $set: { images: newImages } });
          migrated++;
          console.log(`✓ Migrated car: ${car.title} (${car._id})`);
        } else {
          skipped++;
        }
      } catch (err) {
        console.log(`✗ Failed to migrate car: ${car.title} - ${err.message}`);
        failed++;
      }
    }

    console.log("\n=== Migration Complete ===");
    console.log(`Total cars: ${cars.length}`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Failed: ${failed}`);

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

migrateImagesToBuffer();
