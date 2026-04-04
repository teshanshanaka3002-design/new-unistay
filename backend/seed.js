const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Accommodation = require("./models/Accommodation");
require("dotenv").config(); // Ensure this loads the .env correctly

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB for Seeding");

        // Load data from JSON file
        const dataPath = path.join(__dirname, "..", "accommodations.json");
        const rawData = fs.readFileSync(dataPath, "utf-8");
        const parsedData = JSON.parse(rawData);

        // Clear existing data to avoid duplicates
        await Accommodation.deleteMany({});
        console.log("🗑️ Cleared existing accommodations");

        // Remove the existing _ids so MongoDB can generate fresh ObjectIds
        const docs = parsedData.value.map((item) => {
            const { _id, __v, ...rest } = item;

            if (rest.reviews) {
                rest.reviews = rest.reviews.map(reviewer => {
                    const { _id, ...reviewRest } = reviewer;
                    return reviewRest;
                });
            }

            return rest;
        });

        // Insert fresh data
        await Accommodation.insertMany(docs);
        console.log(`🌱 Successfully seeded ${docs.length} accommodations into your Atlas Database!`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seedDatabase();
