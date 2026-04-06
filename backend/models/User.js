const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['STUDENT', 'BOARDING_OWNER', 'RESTAURANT_OWNER', 'ADMIN'],
            default: 'STUDENT',
            required: true
        },
        warning: {
            type: Number,
            default: 0
        },
        warningNote: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
