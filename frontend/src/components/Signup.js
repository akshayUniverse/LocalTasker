// /frontend/src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';         // ①
import './Modal.css';
import './AuthForm.css';          // ensure styling

function Signup({ isVisible, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'client'
  });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('OTP sent to email!');
      onClose();  // close signup modal
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose}>  {/* ① */}
      <div className="auth-form-container">
        <h2>Sign Up</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Your Name" onChange={handleChange} required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" onChange={handleChange} required />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />

          <label htmlFor="role">I want to</label>
          <select id="role" name="role" onChange={handleChange} value={formData.role}>
            <option value="provider">worker</option>
            <option value="client">client</option>
          </select>

          <button type="submit" className="submit-btn">Sign Up</button>

          <div className="toggle-link">
            Already have an account?{' '}
            <button type="button" onClick={() => { onClose(); onSwitchToLogin(); }}>
              Login
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default Signup;
