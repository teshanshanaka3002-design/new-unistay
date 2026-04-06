const mongoose = require("mongoose");

const heroContentSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    desc: { type: String, required: true },
    link: { type: String, default: "/student/find-accommodation" }
}, { timestamps: true });

const HeroContent = mongoose.model("HeroContent", heroContentSchema);

module.exports = HeroContent;
