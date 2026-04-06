const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword, role: role || 'STUDENT' });
        await newUser.save();
        res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Mock Mode Fallback (Emergency Recovery)
        const isMockMode = req.app.get('isMockMode');
        if (isMockMode && email === "student@test.com" && password === "password123") {
            return res.json({ 
                token: "mock_token", 
                user: { id: "mock_student_id", name: "Test Student", email: "student@test.com", role: "STUDENT" } 
            });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        // Fallback for plaintext test users we created earlier:
        const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
        if (!isMatch && password !== user.password) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1d" });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
