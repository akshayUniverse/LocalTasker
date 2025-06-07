const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');
const auth = require('../middleware/auth');

// Routes for matching system
router.get('/providers/:jobId', auth, matchingController.findMatchingProviders);
router.get('/jobs/:providerId', auth, matchingController.findMatchingJobs);

module.exports = router;