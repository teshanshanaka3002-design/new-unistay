const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    accommodationId: { type: mongoose.Schema.Types.ObjectId, ref: "Accommodation", required: true },
    roomType: { type: String, required: true },
    duration: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentProof: { type: String },
    fullName: { type: String, required: true },
    university: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: String, required: true },
    studentId: { type: String, required: true },
    nationalId: { type: String, required: true },
    moveInDate: { type: Date },
    notes: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
