// backend/src/controllers/userController.js
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  const { email, name, location, workType, experience, pricing } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    user.name = name || user.name;
    user.profile = {
      ...user.profile,
      location: location || user.profile.location,
      workType: workType || user.profile.workType,
      experience: experience || user.profile.experience,
      pricing: pricing || user.profile.pricing,
    };

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error: ", error);
    res.status(500).json({ error: "Error updating profile" });
  }
};

// You might also have a function to get the profile:
exports.getProfileByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile: ", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
};
