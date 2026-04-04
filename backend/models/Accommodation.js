const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const accommodationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    city: { type: String, required: true },
    location: { type: String, required: true },
    university: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    roomType: { type: String },
    propertyType: { type: String },
    facilities: [{ type: String }],
    genderPreference: { type: String, enum: ['Male', 'Female', 'Mixed', 'Any'], default: 'Any' },
    mapEmbedUrl: { type: String },
    deposit: { type: String },
    utilitiesIncluded: [{ type: String }],
    ownerName: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviews: [reviewSchema]
}, { timestamps: true });

const Accommodation = mongoose.model("Accommodation", accommodationSchema);

module.exports = Accommodation;
