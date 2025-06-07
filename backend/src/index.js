// backend/src/index.js
require('dotenv').config({ path: __dirname + '/../.env' });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.log("Error connecting to MongoDB", error);
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRequestRoutes = require('./routes/jobRequestRoutes');
const providerProfileRoutes = require('./routes/providerProfileRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/job-requests', jobRequestRoutes);
app.use('/api/provider-profiles', providerProfileRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
// app.use("/api/upload", require("./routes/uploadRoutes"));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send("Welcome to the LocalTasker API!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
