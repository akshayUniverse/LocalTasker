const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Booking routes
router.post('/', auth, bookingController.createBooking);
router.get('/provider/:providerId', auth, bookingController.getProviderBookings);
router.get('/client/:clientId', auth, bookingController.getClientBookings);
router.patch('/:bookingId/status', auth, bookingController.updateBookingStatus);

module.exports = router;