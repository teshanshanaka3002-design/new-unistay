const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['WEBSITE', 'STAY', 'MEAL'], 
        required: true 
    },
    targetId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: false // Website reviews don't have a specific target
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: { type: String, required: true },
    adminReply: { type: String },
    adminName: { type: String },
    replyDate: { type: Date }
}, { timestamps: true });

// Add indexes for faster filtering in Admin Panel
reviewSchema.index({ type: 1 });
reviewSchema.index({ targetId: 1 });
reviewSchema.index({ userId: 1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
