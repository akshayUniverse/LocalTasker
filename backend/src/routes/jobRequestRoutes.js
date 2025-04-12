// backend/src/routes/jobRequestRoutes.js
const express = require("express");
const router = express.Router();
const { createJobRequest, getJobRequests } = require("../controllers/jobRequestController");

router.post("/", createJobRequest);
router.get("/", getJobRequests);
module.exports = router;
