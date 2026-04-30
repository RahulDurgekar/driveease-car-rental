import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "dotenv";

config();

export const JWT_SECRET = process.env.JWT_SECRET || "car_rental_secret_key";

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
