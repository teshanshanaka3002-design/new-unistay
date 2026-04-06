const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    studentIdNumber: { type: String, required: true },
    university: { type: String, required: true },
    contactNumber: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // Array of Base64 strings
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
    replies: [{
        adminName: { type: String, required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", ReportSchema);
