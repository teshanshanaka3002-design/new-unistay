const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Accommodation = require("../models/Accommodation");

// Create a new booking
router.post("/", async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get bookings for properties belonging to a specific owner
router.get("/owner/:ownerId", async (req, res) => {
    try {
        // 1. Find all accommodations owned by this user
        const properties = await Accommodation.find({ ownerId: req.params.ownerId });
        const propertyIds = properties.map(p => p._id);

        // 2. Find all bookings that reference those accommodations
        const bookings = await Booking.find({ accommodationId: { $in: propertyIds } })
            .select("-paymentProof -monthlyPayments.proof")
            .populate("accommodationId", "name city location")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single booking with full details (including proofs)
router.get("/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("accommodationId");
        if (!booking) return res.status(404).json({ error: "Booking not found" });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get bookings for a specific student
router.get("/student/:studentId", async (req, res) => {
    try {
        const bookings = await Booking.find({ studentId: req.params.studentId })
            .select("-paymentProof -monthlyPayments.proof")
            .populate("accommodationId", "name city image location price propertyType")
            .sort({ createdAt: -1 }); // newest first
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update booking status
router.put("/:id/status", async (req, res) => {
    try {
        const { status, notes } = req.body;
        const updateData = { status };
        if (notes) updateData.notes = notes;
        
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updatedBooking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a monthly payment receipt
router.post("/:id/payments", async (req, res) => {
    try {
        const { amount, proof } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        booking.monthlyPayments.push({
            date: new Date(),
            amount,
            proof,
            status: "Pending"
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a booking
router.delete("/:id", async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json({ message: "Booking deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
