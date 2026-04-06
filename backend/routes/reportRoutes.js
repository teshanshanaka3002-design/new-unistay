const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware: Authenticate Request
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

// POST /api/reports/submit - Submit a new report (Student)
router.post("/submit", authenticate, async (req, res) => {
    try {
        const { fullName, studentIdNumber, university, contactNumber, title, description, images } = req.body;
        
        const newReport = new Report({
            studentId: req.user.id,
            fullName,
            studentIdNumber,
            university,
            contactNumber,
            title,
            description,
            images: images || [],
            status: 'Pending',
            replies: []
        });

        await newReport.save();
        res.status(201).json({ message: "Report submitted successfully", report: newReport });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/reports/my-reports - Get reports for the logged-in student
router.get("/my-reports", authenticate, async (req, res) => {
    try {
        const reports = await Report.find({ studentId: req.user.id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/reports/admin/all - Get all reports (Admin)
router.get("/admin/all", authenticate, isAdmin, async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/reports/:id/reply - Admin reply to a report
router.post("/:id/reply", authenticate, isAdmin, async (req, res) => {
    try {
        const { message, status } = req.body;
        const admin = await User.findById(req.user.id);
        
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ error: "Report not found" });

        if (message) {
            report.replies.push({
                adminName: admin.name,
                message,
                createdAt: new Date()
            });
        }
        
        if (status) {
            report.status = status;
        }

        await report.save();
        res.json({ message: "Reply submitted", report });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
