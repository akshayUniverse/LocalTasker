const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


const sendOTP = async (email, otp) => {
  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,  // e.g., smtp.mailtrap.io
      port: process.env.SMTP_PORT,  // e.g., 2525
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,   // e.g., no-reply@yourdomain.com
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending OTP email: ", error);
    throw error;
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const newUser = new User({ name, email, password: hashedPassword, role, otp });
    await newUser.save();
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, otp });

  if (!user) return res.status(400).json({ error: "Invalid OTP" });

  user.isVerified = true;
  user.otp = null;
  await user.save();
  res.json({ message: "Email verified successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
};