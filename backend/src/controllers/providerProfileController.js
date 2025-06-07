const ProviderProfile = require('../models/providerProfile');
const User = require('../models/user');

// Create or update provider profile - Step 1: Basic Details
exports.updateBasicDetails = async (req, res) => {
  try {
    const { userId, name, address, longitude, latitude, phone, email } = req.body;

    // Validate required fields
    if (!userId || !name || !address || !longitude || !latitude || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if profile exists
    let profile = await ProviderProfile.findOne({ userId });

    if (profile) {
      // Update existing profile
      profile.name = name;
      profile.location.coordinates = [longitude, latitude];
      profile.location.address = address;
      profile.contact.phone = phone;
      profile.contact.email = email;
      profile.updatedAt = Date.now();
    } else {
      // Create new profile
      profile = new ProviderProfile({
        userId,
        name,
        location: {
          coordinates: [longitude, latitude],
          address
        },
        contact: {
          phone,
          email
        }
      });
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Basic details updated successfully",
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update basic details",
      error: error.message
    });
  }
};

// Update provider profile - Step 2: Work Details
exports.updateWorkDetails = async (req, res) => {
  try {
    const { userId, serviceCategory, experience } = req.body;

    // Validate required fields
    if (!userId || !serviceCategory || !experience) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Find profile
    const profile = await ProviderProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please complete basic details first."
      });
    }

    // Update work details
    profile.serviceCategory = serviceCategory;
    profile.experience = experience;
    profile.updatedAt = Date.now();

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Work details updated successfully",
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update work details",
      error: error.message
    });
  }
};

// Update provider profile - Step 3: Portfolio & Pricing
exports.updatePortfolioAndPricing = async (req, res) => {
  try {
    const { userId, rateType, amount, currency, serviceRadius, availability } = req.body;
    
    // Portfolio images will be handled separately with file uploads

    // Validate required fields
    if (!userId || !rateType || !amount || !serviceRadius || !availability) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Find profile
    const profile = await ProviderProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please complete previous steps first."
      });
    }

    // Update pricing and availability
    profile.pricing = {
      rateType,
      amount,
      currency: currency || 'USD'
    };
    profile.serviceRadius = serviceRadius;
    profile.availability = availability;
    profile.updatedAt = Date.now();

    await profile.save();

    // Update user status to indicate profile completion
    await User.findByIdAndUpdate(userId, { profileCompleted: true });

    res.status(200).json({
      success: true,
      message: "Portfolio and pricing updated successfully",
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update portfolio and pricing",
      error: error.message
    });
  }
};

// Upload portfolio images
exports.uploadPortfolioImages = async (req, res) => {
  try {
    const { userId } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded"
      });
    }

    // Find profile
    const profile = await ProviderProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Add uploaded images to portfolio
    // Note: In a real implementation, files would be uploaded to AWS S3
    // and the returned URLs would be stored in the portfolio array
    const portfolioItems = files.map(file => ({
      imageUrl: file.path, // This would be the S3 URL in production
      description: file.originalname,
      uploadedAt: Date.now()
    }));

    profile.portfolio = [...profile.portfolio, ...portfolioItems];
    profile.updatedAt = Date.now();

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Portfolio images uploaded successfully",
      data: profile.portfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload portfolio images",
      error: error.message
    });
  }
};

// Get provider profile by userId
exports.getProviderProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await ProviderProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch provider profile",
      error: error.message
    });
  }
};