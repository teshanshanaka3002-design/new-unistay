const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Canteen = require("../models/Canteen");

// POST place a new order
router.post("/", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET orders for all cafes belonging to an owner
router.get("/owner/:ownerId", async (req, res) => {
    try {
        const canteens = await Canteen.find({ ownerId: req.params.ownerId });
        const canteenIds = canteens.map(c => c._id);
        const orders = await Order.find({ canteenId: { $in: canteenIds } })
            .select("-identityProof")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single order with full details (including identity proof)
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET orders placed by a specific student
router.get("/student/:studentId", async (req, res) => {
    try {
        const orders = await Order.find({ studentId: req.params.studentId })
            .select("-identityProof")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update order status
router.put("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
