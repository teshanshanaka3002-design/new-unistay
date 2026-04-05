const express = require("express");
const router = express.Router();
const Canteen = require("../models/Canteen");
const MenuItem = require("../models/MenuItem");

// ─── Canteen / Cafe CRUD ─────────────────────────────────────

// GET all canteens (student view)
router.get("/", async (req, res) => {
    try {
        const canteens = await Canteen.find();
        res.json(canteens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET canteens belonging to a specific owner
router.get("/owner/:ownerId", async (req, res) => {
    try {
        const canteens = await Canteen.find({ ownerId: req.params.ownerId });
        res.json(canteens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a new canteen
router.post("/", async (req, res) => {
    try {
        const newCanteen = new Canteen(req.body);
        await newCanteen.save();
        res.status(201).json(newCanteen);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update canteen
router.put("/:id", async (req, res) => {
    try {
        const updated = await Canteen.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE canteen
router.delete("/:id", async (req, res) => {
    try {
        await Canteen.findByIdAndDelete(req.params.id);
        res.json({ message: "Canteen deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─── Menu Items CRUD ──────────────────────────────────────────

// GET menu for a specific canteen
router.get("/:id/menu", async (req, res) => {
    try {
        const menu = await MenuItem.find({ canteenId: req.params.id });
        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add menu item to canteen
router.post("/:id/menu", async (req, res) => {
    try {
        const newItem = new MenuItem({ ...req.body, canteenId: req.params.id });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update menu item
router.put("/menu/:id", async (req, res) => {
    try {
        const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE menu item
router.delete("/menu/:id", async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: "Menu item deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
