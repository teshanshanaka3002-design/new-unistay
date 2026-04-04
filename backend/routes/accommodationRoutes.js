const express = require("express");
const router = express.Router();
const Accommodation = require("../models/Accommodation");

router.get("/", async (req, res) => {
    try {
        // Return mostly everything right now. A robust app would parse filters.
        const data = await Accommodation.find({});
        res.json({
            value: data,
            count: data.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const data = await Accommodation.findById(req.params.id);
        if (!data) return res.status(404).json({ error: "Not found" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/owner/:ownerId", async (req, res) => {
    try {
        const data = await Accommodation.find({ ownerId: req.params.ownerId });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newAcc = new Accommodation(req.body);
        await newAcc.save();
        res.status(201).json(newAcc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updated = await Accommodation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Accommodation.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
