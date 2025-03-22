import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import WelcomingPage from './components/WelcomingPage';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Theme (Choose any)
import 'primereact/resources/primereact.min.css';  // Core PrimeReact styles
import 'primeicons/primeicons.css';  // PrimeIcons for icons
import 'primereact/resources/themes/lara-light-blue/theme.css'; // Change theme if needed


function Home() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => response.text())
      .then(message => {
        setMessage(message);
      });
  }, []);

  return (
    <div className="App">
      {/* <button onClick={() => navigate('/landing')}>Go to Landing Page</button>
      <button onClick={() => navigate('/welcome')}>Go to Welcoming Page</button> */}

      <header className="App-header">
        <p>{message}</p>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<WelcomingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
