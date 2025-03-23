// backend/src/routes/userRoutes.js
const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const router = express.Router();

router.get("/profile/:id", getUserProfile);

module.exports = router;
