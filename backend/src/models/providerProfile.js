const mongoose = require('mongoose');

const providerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Basic Details
  name: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  // Work Details
  serviceCategory: {
    type: String,
    required: true,
    enum: ['electrician', 'plumber', 'painter', 'carpenter', 'cleaner', 'gardener', 'other']
  },
  experience: {
    type: Number, // Years of experience
    required: true
  },
  // Portfolio & Pricing
  portfolio: [{
    imageUrl: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  pricing: {
    rateType: {
      type: String,
      enum: ['hourly', 'fixed'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  serviceRadius: {
    type: Number, // in kilometers
    required: true,
    default: 10
  },
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    startTime: {
      type: String, // Format: "HH:MM" in 24-hour format
      required: true
    },
    endTime: {
      type: String, // Format: "HH:MM" in 24-hour format
      required: true
    }
  }],
  // Verification and Rating
  isVerified: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a geospatial index on the location field
providerProfileSchema.index({ "location.coordinates": "2dsphere" });

const ProviderProfile = mongoose.model('ProviderProfile', providerProfileSchema);

module.exports = ProviderProfile;