const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware: Authenticate
const authenticate = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// Middleware: Admin Only
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized access" });
    next();
};

// 📝 --- Public/User Endpoints ---

// POST /api/reviews - Submit a review (Student)
router.post("/", authenticate, async (req, res) => {
    try {
        const { type, targetId, rating, comment } = req.body;
        const user = await User.findById(req.user.id);
        
        const newReview = new Review({
            userId: req.user.id,
            userName: user.name,
            type,
            targetId: targetId || null,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json({ message: "Review submitted successfully", review: newReview });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/reviews/target/:type/:id? - Get reviews for a target or website
router.get(["/target/:type", "/target/:type/:id"], async (req, res) => {
    try {
        const { type, id } = req.params;
        const query = { type };
        if (id) query.targetId = id;
        
        const reviews = await Review.find(query).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🛠️ --- Admin Endpoints ---

// GET /api/reviews/admin/all - Admin fetch all reviews
router.get("/admin/all", authenticate, isAdmin, async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/reviews/admin/reply/:id - Admin reply to a review
router.post("/admin/reply/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { message } = req.body;
        const admin = await User.findById(req.user.id);
        
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: "Review not found" });

        review.adminReply = message;
        review.adminName = admin.name;
        review.replyDate = new Date();

        await review.save();
        res.json({ message: "Reply submitted", review });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/reviews/admin/:id - Admin delete a review
router.delete("/admin/:id", authenticate, isAdmin, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
