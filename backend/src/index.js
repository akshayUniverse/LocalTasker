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

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/job-requests", require("./routes/jobRequestRoutes"));
// app.use("/api/upload", require("./routes/uploadRoutes"));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send("Welcome to the LocalTasker API!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
