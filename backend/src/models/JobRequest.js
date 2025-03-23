// backend/src/models/JobRequest.js
const mongoose = require('mongoose');

const jobRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  workType: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobRequest', jobRequestSchema);
