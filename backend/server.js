const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingRoutes);

// Base route for sanity check
app.get("/", (req, res) => {
    res.send("UniStay API is running...");
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");

        // Start server ONLY after DB connects
        app.listen(PORT, () => {
            console.log(`🔥 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:");
        console.error(err);
    });

// Handle unexpected errors
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err);
});

