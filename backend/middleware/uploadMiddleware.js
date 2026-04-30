import multer from "multer";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadFolder = join(__dirname, "..", "uploads");
fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadFolder);
  },
  filename(req, file, cb) {
    const safeName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image uploads are allowed"), false);
};

export default multer({ storage, fileFilter });
