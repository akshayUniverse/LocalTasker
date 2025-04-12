import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./OTPVerification.css"; // Import your CSS file for styling

function OTPVerification() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  // const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      alert("Email verified!");
      const { role } = response.data;
      console.log("The step form opning", email);
      alert("Email verified successfully!");

      if(role === "client") {
        navigate("/job-request", { state: { email } });
      } else if(role === "provider") {
       // navigate("/dashboard", { state: { email } });
        navigate("/complete-profile", { state: { email } });
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Server Error:", error.response.data);
        alert(`Error: ${error.response.data.error || 'An error occurred'}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Network Error:", error.request);
        alert("Network error. Please try again.");
      } else {
        // Something else happened
        console.error("Error:", error.message);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="otp-container">
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
    </div>
  );
}

export default OTPVerification;
