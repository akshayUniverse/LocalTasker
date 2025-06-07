const JobRequest = require('../models/JobRequest');
const ProviderProfile = require('../models/providerProfile');

// Find providers that match a job request
exports.findMatchingProviders = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get the job request
    const jobRequest = await JobRequest.findById(jobId);

    if (!jobRequest) {
      return res.status(404).json({
        success: false,
        message: "Job request not found"
      });
    }

    // Extract job location coordinates
    // For now, we'll assume the job location is stored as a string address
    // In a real implementation, you would use a geocoding service to convert the address to coordinates
    // For demonstration purposes, we'll use a mock location
    const jobLocation = {
      type: 'Point',
      coordinates: [0, 0] // This would be the actual coordinates from geocoding
    };

    // Find providers that match the job's work type and are within service radius
    const matchingProviders = await ProviderProfile.find({
      serviceCategory: jobRequest.workType,
      // Use MongoDB's geospatial query to find providers within their service radius
      // This is a simplified version and would need to be adjusted based on your actual data model
      'location.coordinates': {
        $nearSphere: {
          $geometry: jobLocation,
          $maxDistance: 10000 // 10km in meters
        }
      }
    }).sort({ averageRating: -1 }); // Sort by rating, highest first

    res.status(200).json({
      success: true,
      data: matchingProviders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to find matching providers",
      error: error.message
    });
  }
};

// Find job requests that match a provider's profile
exports.findMatchingJobs = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Get the provider profile
    const providerProfile = await ProviderProfile.findOne({ userId: providerId });

    if (!providerProfile) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found"
      });
    }

    // Find job requests that match the provider's service category
    // In a real implementation, you would also filter by location proximity
    const matchingJobs = await JobRequest.find({
      workType: providerProfile.serviceCategory
    }).sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.status(200).json({
      success: true,
      data: matchingJobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to find matching jobs",
      error: error.message
    });
  }
};