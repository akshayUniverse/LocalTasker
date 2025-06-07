import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ProviderDashboard = () => {
  const location = useLocation();
  const { email, userId } = location.state || {};
  
  const [profile, setProfile] = useState(null);
  const [jobRequests, setJobRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provider profile
        if (userId) {
          const profileResponse = await axios.get(`http://localhost:5000/api/provider-profiles/${userId}`);
          setProfile(profileResponse.data.data);
        }

        // Fetch job requests that match the provider's service category
        const jobsResponse = await axios.get('http://localhost:5000/api/job-requests');
        setJobRequests(jobsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Provider Dashboard</h1>
      
      {profile && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Name:</span> {profile.name}</p>
              <p><span className="font-semibold">Service:</span> {profile.serviceCategory}</p>
              <p><span className="font-semibold">Experience:</span> {profile.experience} years</p>
              <p><span className="font-semibold">Rate:</span> {profile.pricing.amount} {profile.pricing.currency} ({profile.pricing.rateType})</p>
            </div>
            <div>
              <p><span className="font-semibold">Address:</span> {profile.location.address}</p>
              <p><span className="font-semibold">Service Radius:</span> {profile.serviceRadius} km</p>
              <p><span className="font-semibold">Phone:</span> {profile.contact.phone}</p>
              <p><span className="font-semibold">Email:</span> {profile.contact.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Job Requests</h2>
        {jobRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobRequests.map((job) => (
              <div key={job._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg">{job.workType}</h3>
                <p className="text-sm text-gray-600 mb-2">{job.location}</p>
                <p className="mb-4">{job.description}</p>
                <p className="text-xs text-gray-500">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                <button 
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                  onClick={() => alert('Booking functionality will be implemented next')}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No job requests available at the moment.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
        <p className="text-gray-600">No upcoming bookings at the moment.</p>
        {/* Bookings will be displayed here once the booking system is implemented */}
      </div>
    </div>
  );
};

export default ProviderDashboard;