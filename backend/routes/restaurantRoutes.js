const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

router.get("/:id/menu", async (req, res) => {
    try {
        const menu = await MenuItem.find({ canteenId: req.params.id });
        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
