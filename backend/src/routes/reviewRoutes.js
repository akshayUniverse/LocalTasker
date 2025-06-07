const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Review routes
router.post('/', auth, reviewController.createReview);
router.get('/provider/:providerId', reviewController.getProviderReviews);

module.exports = router;