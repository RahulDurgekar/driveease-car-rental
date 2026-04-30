import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

export const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, startTime, endTime, paymentTransactionId } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (!car.available) return res.status(400).json({ message: "Car not available" });
    if (car.owner.toString() === req.user._id.toString())
      return res.status(400).json({ message: "You cannot book your own car" });
    if (!paymentTransactionId)
      return res.status(400).json({ message: "Payment transaction ID required" });

    const start = new Date(startDate);
    const end = new Date(endDate);

    const conflict = await Booking.findOne({
      car: carId,
      status: { $in: ["pending", "confirmed"] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (conflict)
      return res.status(400).json({ message: "Car is already booked for these dates" });

    const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const totalPrice = totalDays * car.pricePerDay;

    const booking = await Booking.create({
      car: carId,
      renter: req.user._id,
      owner: car.owner,
      startDate: start,
      endDate: end,
      startTime: startTime || "10:00",
      endTime: endTime || "10:00",
      totalDays,
      totalPrice,
      paymentTransactionId,
      paymentStatus: "completed",
      status: "pending",
      ownerNotified: true,
    });

    const populated = await booking.populate([
      { path: "car", select: "title brand model images contactPhone contactEmail" },
      { path: "renter", select: "name email phone" },
      { path: "owner", select: "name email phone address" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Booking failed" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user._id })
      .populate("car", "title brand model images city pricePerDay contactPhone contactEmail")
      .populate("owner", "name email phone address")
      .sort("-createdAt");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get bookings" });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car", "title brand model images")
      .populate("renter", "name email phone")
      .sort("-createdAt");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get bookings" });
  }
};

export const getUnseenNotifications = async (req, res) => {
  try {
    const count = await Booking.countDocuments({ owner: req.user._id, ownerSeen: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markNotificationsSeen = async (req, res) => {
  try {
    await Booking.updateMany({ owner: req.user._id, ownerSeen: false }, { ownerSeen: true });
    res.json({ message: "Marked as seen" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isRenter = booking.renter.toString() === req.user._id.toString();
    if (!isOwner && !isRenter)
      return res.status(403).json({ message: "Not authorized" });
    if (isRenter && req.body.status !== "cancelled")
      return res.status(403).json({ message: "Renters can only cancel bookings" });
    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update status" });
  }
};
