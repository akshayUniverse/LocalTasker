// backend/src/routes/userRoutes.js
const express = require("express");
const { updateProfile, getProfileByEmail } = require("../controllers/userController");
const router = express.Router();

router.post("/updateProfile", updateProfile);
router.get("/profileByEmail/:email", getProfileByEmail);

module.exports = router;
