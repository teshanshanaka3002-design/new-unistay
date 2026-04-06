const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Accommodation = require("../models/Accommodation");
const Canteen = require("../models/Canteen");
const Order = require("../models/Order");
const Booking = require("../models/Booking");
const HeroContent = require("../models/HeroContent");

// 📊 --- Analytics ---
router.get("/stats", async (req, res) => {
    try {
        const [totalUsers, totalAccs, totalCanteens, totalOrders, accs, canteens] = await Promise.all([
            User.countDocuments(),
            Accommodation.countDocuments(),
            Canteen.countDocuments(),
            Order.countDocuments(),
            Accommodation.find({}, 'rating'),
            Canteen.find({}, 'rating')
        ]);

        const allRatings = [...accs.map(a => a.rating), ...canteens.map(c => c.rating)].filter(r => r > 0);
        const avgRating = allRatings.length > 0 
            ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) 
            : 0;

        res.json({
            users: totalUsers,
            listings: totalAccs + totalCanteens,
            orders: totalOrders,
            avgRating: parseFloat(avgRating)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 👥 --- Owner Management ---
router.get("/owners", async (req, res) => {
    try {
        const owners = await User.find({ role: { $in: ['BOARDING_OWNER', 'RESTAURANT_OWNER'] } }).select("-password");
        res.json(owners);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get listings for a specific owner
router.get("/owner/:id/listings", async (req, res) => {
    try {
        const { id } = req.params;
        const [accommodations, canteens] = await Promise.all([
            Accommodation.find({ ownerId: id }),
            Canteen.find({ ownerId: id })
        ]);
        res.json({ accommodations, canteens });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Warn user
router.post("/warn/:id", async (req, res) => {
    try {
        const { note } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.warning = (user.warning || 0) + 1;
        if (note) user.warningNote = note;
        await user.save();
        res.json({ message: "Warning issued successfully", currentWarnings: user.warning });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ban user (Permanent Deletion)
router.delete("/ban/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Delete user listings and the user themselves
        await Promise.all([
            Accommodation.deleteMany({ ownerId: id }),
            Canteen.deleteMany({ ownerId: id }),
            User.findByIdAndDelete(id)
        ]);
        res.json({ message: "User and all associated listings permanently deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🖼️ --- Hero Content Management ---
router.get("/hero", async (req, res) => {
    try {
        const slides = await HeroContent.find();
        res.json(slides);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/hero", async (req, res) => {
    try {
        const newSlide = new HeroContent(req.body);
        await newSlide.save();
        res.json(newSlide);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/hero/:id", async (req, res) => {
    try {
        await HeroContent.findByIdAndDelete(req.params.id);
        res.json({ message: "Slide removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
