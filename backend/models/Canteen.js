const mongoose = require("mongoose");

const canteenSchema = new mongoose.Schema({
    ownerId: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    university: { type: String, required: true },
    contactNo: { type: String },
    rating: { type: Number, default: 0 },
    description: { type: String, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

// Add indexes for faster searches
canteenSchema.index({ ownerId: 1 });
canteenSchema.index({ university: 1 });

const Canteen = mongoose.model("Canteen", canteenSchema);

module.exports = Canteen;
