const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["provider", "client"] },
  otp: String,
  isVerified: { type: Boolean, default: false },
  profile: {
    location: String,
    experience: String,
    workType: String, 
    portfolioImages: [String],
    pricing: String,
  },
});

module.exports = mongoose.model("User", userSchema);