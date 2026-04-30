import Review from "../models/Review.js";
import Car from "../models/Car.js";

export const addReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;
    const existing = await Review.findOne({ car: carId, user: req.user._id });
    if (existing) return res.status(400).json({ message: "You already reviewed this car" });

    const review = await Review.create({ car: carId, user: req.user._id, rating, comment });

    const reviews = await Review.find({ car: carId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Car.findByIdAndUpdate(carId, {
      averageRating: parseFloat(avg.toFixed(1)),
      totalReviews: reviews.length,
    });

    const populated = await review.populate("user", "name avatar");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to add review" });
  }
};

export const getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate("user", "name avatar")
      .sort("-createdAt");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get reviews" });
  }
};
