// backend/src/controllers/jobRequestController.js
const JobRequest = require("../models/JobRequest"); // Create this model as needed

exports.createJobRequest = async (req, res) => {
  try {
    const jobRequest = new JobRequest(req.body);
    await jobRequest.save();
    res.status(201).json({ message: "Job request created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create job request" });
  }
};
