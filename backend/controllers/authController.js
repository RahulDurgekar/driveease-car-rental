import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "dotenv";

config();

const JWT_SECRET = process.env.JWT_SECRET || "car_rental_secret_key";
const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const trimmedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: trimmedEmail });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name: name.trim(), email: trimmedEmail, password });
    res.status(201).json({
      token: signToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: err.message || "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      token: signToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: err.message || "Login failed" });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, city, address, role } = req.body;
    const updateData = { name, phone, city, address, role };
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Update failed" });
  }
};
