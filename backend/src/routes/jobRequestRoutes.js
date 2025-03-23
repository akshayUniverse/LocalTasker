// backend/src/routes/jobRequestRoutes.js
const express = require("express");
const { createJobRequest } = require("../controllers/jobRequestController");
const router = express.Router();

router.post("/", createJobRequest);

module.exports = router;
