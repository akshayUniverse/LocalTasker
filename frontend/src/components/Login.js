// /frontend/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';          // ①
import './Modal.css';                // ensure styling
import './AuthForm.css';             // ensure styling

function Login({ isVisible, onClose, onSwitchToSignup }) {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'client' }); // ②
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      const { token, user } = data;  // assuming backend returns { token, user }
      if (user.role !== formData.role) {
        setError(`Please select the correct role (${user.role}).`);
        setLoading(false);
        return;
      }
      localStorage.setItem('token', token);
      onClose();  // close modal
      // ③ redirect based on role
      if (user.role === 'client') {
        navigate('/job-request');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email, password, or role.');
      setLoading(false);
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose}>  {/* ① */}
      <div className="auth-form-container">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" onChange={handleChange} required />
          {error && <div className="error-message">{error}</div>}

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" onChange={handleChange} required />
          {/* no extra error under password */}

          <label htmlFor="role">I am a</label>
          <select id="role" name="role" onChange={handleChange} value={formData.role}>
            <option value="client">Client</option>
            <option value="provider">Service Provider</option>
          </select>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="toggle-link">
            New user?{' '}
            <button type="button" onClick={() => { onClose(); onSwitchToSignup(); }}>
              Sign up
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default Login;
