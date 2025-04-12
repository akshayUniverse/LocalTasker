import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useState } from 'react';
import Modal from './Modal';
import Login from './Login';
import Signup from './Signup';
import JobRequestForm from './JobRequestForm';
import './LandingPage.css';

import heroImage from '../image/hero.jpg';
import plumbingImg from '../image/plumbing.jpg';
import ElectricalImg from '../image/electrical.jpg';
import PaintingImg from '../image/painting.jpg';

function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleGetWork = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/job-request');
    } else {
      setShowLogin(true);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <div className={`landing-page ${showLogin || showSignup ? 'blurred' : ''}`}>
        {/* Navigation Bar */}

        <nav className="navbar">
          <div className="logo">Local Tasker</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
          </ul>

          <div className="nav-buttons">
            <Button label="Login" onClick={() => setShowLogin(true)} />
            <Button label="Sign Up" onClick={() => setShowSignup(true)} />
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="hero-section" >
          <div className="hero-content">
            <h1>Are you here to do work or get work done?</h1>
            <p>Join our platform to connect with skilled professionals or find work easily.</p>
          </div>
          <div className="cta-buttons">
            <button className="work-btn" onClick={() => navigate('/welcome')}>Do Work</button>
            <button className="hire-btn" onClick={handleGetWork}>Get Work Done</button>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services">
          <h2>Our Services</h2>
          <div className="cards">
            <div className="card">
              <img src={plumbingImg} alt="Plumbing Service" className="card-image" />
              <h3>Plumbing</h3>
              <p>Expert plumbing services for homes and offices.</p>
            </div>
            <div className="card">
              <img src={ElectricalImg} alt="Electrical Service" className="card-image" />
              <h3>Electrical</h3>
              <p>Certified electricians ready to assist.</p>
            </div>
            <div className="card">
              <img src={PaintingImg} alt="Painting Service" className="card-image" />
              <h3>Painting</h3>
              <p>High-quality painting services for your space.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <h2>About Us</h2>
          <button onClick={() => navigate('/welcome')}>Go to Welcome</button>
          <p>We connect local talent with people who need their expertise.</p>
        </section>

      </div>
      <Login
        isVisible={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <Signup
        isVisible={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
      {/* Modal for Job Request Form */}
      <Modal isVisible={isModalVisible} onClose={closeModal}>
        <JobRequestForm />
      </Modal>
    </>
  );
}

export default LandingPage;