const Booking = require('../models/Booking');
const JobRequest = require('../models/JobRequest');
const User = require('../models/User');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { jobRequestId, providerId, clientId, scheduledDate, scheduledTime, price, notes } = req.body;

    // Validate required fields
    if (!jobRequestId || !providerId || !clientId || !scheduledDate || !scheduledTime || !price) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Create new booking
    const booking = new Booking({
      jobRequestId,
      providerId,
      clientId,
      scheduledDate,
      scheduledTime,
      price,
      notes
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message
    });
  }
};

// Get bookings for a provider
exports.getProviderBookings = async (req, res) => {
  try {
    const { providerId } = req.params;

    const bookings = await Booking.find({ providerId })
      .populate('jobRequestId')
      .populate('clientId', 'name email')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch provider bookings",
      error: error.message
    });
  }
};

// Get bookings for a client
exports.getClientBookings = async (req, res) => {
  try {
    const { clientId } = req.params;

    const bookings = await Booking.find({ clientId })
      .populate('jobRequestId')
      .populate('providerId', 'name email')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch client bookings",
      error: error.message
    });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        status,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message
    });
  }
};