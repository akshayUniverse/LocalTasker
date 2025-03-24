// frontend/src/components/ProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

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
    if(email){
      fetchProfile();
    }

  }, [email]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>{profile.name}'s Profile</h2>
      <p>Location: {profile.profile.location}</p>
      <p>Experience: {profile.profile.experience}</p>
      <p>Pricing: {profile.profile.pricing}</p>
      <h3>Portfolio</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {profile.profile.portfolioImages && profile.profile.portfolioImages.map((url, index) => (
          <img key={index} src={url} alt={`Portfolio ${index}`} style={{ width: '200px', height: 'auto' }} />
        ))}
      </div>
      {/* Add ratings display if available */}
    </div>
  );
}

export default ProfilePage;
