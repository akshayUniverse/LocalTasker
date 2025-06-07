const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ProviderProfile = require('../models/providerProfile');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { bookingId, providerId, clientId, rating, comment } = req.body;

    // Validate required fields
    if (!bookingId || !providerId || !clientId || !rating) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: "Cannot review a booking that is not completed"
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "A review already exists for this booking"
      });
    }

    // Create new review
    const review = new Review({
      bookingId,
      providerId,
      clientId,
      rating,
      comment
    });

    await review.save();

    // Update provider's average rating
    const providerReviews = await Review.find({ providerId });
    const totalRating = providerReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / providerReviews.length;

    await ProviderProfile.findOneAndUpdate(
      { userId: providerId },
      { 
        averageRating,
        totalReviews: providerReviews.length
      }
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message
    });
  }
};

// Get reviews for a provider
exports.getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;

    const reviews = await Review.find({ providerId })
      .populate('clientId', 'name')
      .populate('bookingId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch provider reviews",
      error: error.message
    });
  }
};