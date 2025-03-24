import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function OTPVerification() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  // const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      alert("Email verified!");
      console.log("The step form opning",email);
      navigate("/complete-profile", { state: { email } });
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Verifying for: {email}</p>
      <input 
        type="text" 
        placeholder="Enter OTP" 
        value={otp} 
        onChange={(e) => setOtp(e.target.value)} 
        required 
      />
      <button type="submit">Verify OTP</button>
    </form>
  );
}

export default OTPVerification;
