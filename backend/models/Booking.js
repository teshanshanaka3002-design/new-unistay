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
    contactNo: { type: String },
    moveInDate: { type: Date },
    notes: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Canceled"], default: "Pending" },
    monthlyPayments: [
        {
            date: { type: Date, default: Date.now },
            amount: Number,
            proof: String, // base64 receipt
            status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
        }
    ]
}, { timestamps: true });

// Add indexes for faster lookups
bookingSchema.index({ studentId: 1 });
bookingSchema.index({ accommodationId: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
