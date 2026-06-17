import multer from "multer";
import { tmpdir } from "os";
import { join } from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, tmpdir());
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
