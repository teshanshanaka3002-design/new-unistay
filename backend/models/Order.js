const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    canteenId: { type: mongoose.Schema.Types.ObjectId, ref: "Canteen", required: true },
    canteenName: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    studentUniversity: { type: String, required: true },
    studentYear: { type: String, required: true },
    studentIdNumber: { type: String, required: true },
    studentPhone: { type: String, required: true },
    identityProof: { type: String },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    pickupTime: { type: Date, required: true },
    notes: { type: String },
    status: { type: String, enum: ["Pending", "Preparing", "Ready", "Collected"], default: "Pending" }
}, { timestamps: true });

// Add indexes for faster lookups
orderSchema.index({ studentId: 1 });
orderSchema.index({ canteenId: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
