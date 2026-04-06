const mongoose = require("mongoose");
require("dotenv").config();

const Accommodation = require("./models/Accommodation");

const MOCK_NAMES = [
  'SLIIT Green Residence',
  'Kaduwela Student Inn', 
  'NSBM Premium Annex', 
  'Moratuwa Scholars Hostel'
];

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for cleanup");

    const result = await Accommodation.deleteMany({ name: { $in: MOCK_NAMES } });
    console.log(`🗑️ Successfully deleted ${result.deletedCount} mockup listings!`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  }
}

cleanup();
