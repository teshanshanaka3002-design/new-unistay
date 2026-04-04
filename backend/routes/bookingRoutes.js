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
        const bookings = await Booking.find({ accommodationId: { $in: propertyIds } }).populate("accommodationId");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get bookings for a specific student
router.get("/student/:studentId", async (req, res) => {
    try {
        const bookings = await Booking.find({ studentId: req.params.studentId })
            .populate("accommodationId")
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

module.exports = router;
