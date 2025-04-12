
// /backend/src/controllers/jobRequestController.js
const JobRequest = require("../models/JobRequest");

exports.createJobRequest = async (req, res) => {
  try {
    // Destructure the necessary fields from the request body
    const { name, location, workType, description } = req.body;
    // Create a new instance of JobRequest with the provided data
    const newJobRequest = new JobRequest({ name, location, workType, description });
    // Save the new job request to the database
    await newJobRequest.save();
    // Return a success response with the created data
    res.status(201).json({
      success: true,
      message: "Job request created successfully",
      data: newJobRequest,
    });
  } catch (error) {
    // Handle errors and return a proper error message
    res.status(500).json({
      success: false,
      message: "Failed to create job request",
      error: error.message,
    });
  }
};

exports.getJobRequests = async (req, res) => {
  try {
    // Retrieve all job requests from the database
    const requests = await JobRequest.find();
    // Return the retrieved data in the response
    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    // Handle errors and return a proper error message
    res.status(500).json({
      success: false,
      message: "Failed to fetch job requests",
      error: error.message,
    });
  }
};
