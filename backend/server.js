const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Port
const PORT = process.env.PORT || 5000;

// Debug logs (VERY IMPORTANT)
console.log("🚀 Server starting...");
console.log("📦 PORT:", PORT);
console.log("🔑 MONGO_URI:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");

// Import routes
const authRoutes = require("./routes/authRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);

// Ensure default admin exists
const initializeAdmin = async () => {
    try {
        const adminEmail = "admin@unistay.com";
        const exists = await User.findOne({ email: adminEmail });
        if (!exists) {
            const hashedPassword = await bcrypt.hash("admin@password123", 10);
            const admin = new User({
                name: "System Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN"
            });
            await admin.save();
            console.log("✅ Default Admin Created: admin@unistay.com / admin@password123");
        }
    } catch (err) {
        console.error("❌ Error initializing admin:", err.message);
    }
};

// Base route for sanity check
app.get("/", (req, res) => {
    res.send("UniStay API is running...");
});

// MongoDB connection with fallback
let isMockMode = false;
mongoose
    .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log("✅ MongoDB Connected");
        initializeAdmin();
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error. Entering MOCK MODE for development.");
        isMockMode = true;
    })
    .finally(() => {
        app.set('isMockMode', isMockMode);
        // Start server regardless of DB status
        app.listen(PORT, () => {
            console.log(`🔥 Server running on http://localhost:${PORT}`);
            if (isMockMode) console.log("⚠️  WARNING: Running in MOCK MODE (No DB connectivity)");
        });
    });

// Handle unexpected errors
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err);
});

