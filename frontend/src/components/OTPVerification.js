import React, { useState } from "react";
import axios from "axios";

function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      alert("Email verified!");
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
      <button type="submit">Verify OTP</button>
    </form>
  );
}

export default OTPVerification;
