// frontend/src/components/ProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ProfilePage.css'; // Import your CSS file for styling

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  const email = location.state?.email || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/profileByEmail/${email}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    if (email) {
      fetchProfile();
    }

  }, [email]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{profile.name}'s Profile</h2>
        <p>{profile.profile.workType}</p>
      </div>
      <div className="profile-details">
        <p><strong>Location:</strong> {profile.profile.location}</p>
        <p><strong>Experience:</strong> {profile.profile.experience}</p>
        <p><strong>Pricing:</strong> ₹{profile.profile.pricing}</p>
      </div>
      <div className="profile-portfolio">
        <h3>Portfolio</h3>
        <div className="portfolio-grid">
          {profile.profile.portfolioImages && profile.profile.portfolioImages.map((url, index) => (
            <img key={index} src={url} alt={`Portfolio ${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
