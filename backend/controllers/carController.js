import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

export const createCar = async (req, res) => {
  try {
    const images = req.files ? req.files.map((f) => `http://localhost:5050/uploads/${f.filename}`) : [];
    const car = await Car.create({ ...req.body, owner: req.user._id, images });
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create car" });
  }
};

export const getCars = async (req, res) => {
  try {
    const { city, startDate, endDate } = req.query;
    const filter = {};
    if (city) filter.city = { $regex: city, $options: "i" };

    let cars = await Car.find(filter).populate("owner", "name email phone address");

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      cars = await Promise.all(
        cars.map(async (car) => {
          const conflict = await Booking.findOne({
            car: car._id,
            status: { $in: ["pending", "confirmed"] },
            $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
          });
          return { ...car.toObject(), isAvailableForDates: !conflict };
        })
      );
      cars = cars.filter((car) => car.isAvailableForDates);
    }

    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get cars" });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate("owner", "name email phone address");
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get car" });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const conflict = await Booking.findOne({
      car: carId,
      status: { $in: ["pending", "confirmed"] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });
    res.json({ available: !conflict });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to check availability" });
  }
};

export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (car.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    const updated = await Car.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update car" });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (car.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    await car.deleteOne();
    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete car" });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (car.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    car.available = !car.available;
    await car.save();
    res.json({ available: car.available });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to toggle availability" });
  }
};

export const getMyCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get cars" });
  }
};
