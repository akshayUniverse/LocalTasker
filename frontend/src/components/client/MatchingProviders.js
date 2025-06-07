import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const MatchingProviders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobRequestId, email } = location.state || {};
  
  const [providers, setProviders] = useState([]);
  const [jobRequest, setJobRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!jobRequestId) {
          setError('Job request information is missing.');
          setLoading(false);
          return;
        }

        // Fetch job request details
        const jobResponse = await axios.get(`http://localhost:5000/api/job-requests/${jobRequestId}`);
        setJobRequest(jobResponse.data.data);

        // Fetch matching providers
        const providersResponse = await axios.get(`http://localhost:5000/api/provider-profiles/match/${jobRequestId}`);
        setProviders(providersResponse.data.data);
      } catch (error) {
        console.error('Error fetching matching providers:', error);
        setError('Failed to load matching providers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobRequestId]);

  const handleBookProvider = async (providerId) => {
    try {
      // Get user ID from backend using email
      const userResponse = await axios.get(`http://localhost:5000/api/users/profile/${email}`);
      const userId = userResponse.data._id;

      // Create booking
      const response = await axios.post('http://localhost:5000/api/bookings', {
        jobRequestId,
        clientId: userId,
        providerId,
        status: 'pending'
      });

      // Navigate to booking details page
      navigate('/client/booking-details', { 
        state: { 
          bookingId: response.data.data._id,
          email 
        } 
      });
    } catch (error) {
      console.error('Error booking provider:', error);
      alert('Failed to book provider. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Finding the best service providers for you...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!jobRequest) {
    return <div className="text-center py-10">Job request not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Matching Service Providers</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Request</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Service Type</p>
            <p className="font-medium capitalize">{jobRequest.serviceType}</p>
          </div>
          <div>
            <p className="text-gray-600">Location</p>
            <p className="font-medium">{jobRequest.location}</p>
          </div>
          <div>
            <p className="text-gray-600">Preferred Date</p>
            <p className="font-medium">{new Date(jobRequest.preferredDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Preferred Time</p>
            <p className="font-medium">{jobRequest.preferredTime}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-600">Description</p>
          <p className="font-medium">{jobRequest.description}</p>
        </div>
      </div>
      
      {providers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div key={provider._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{provider.name}</h3>
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.round(provider.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-600">
                      {provider.averageRating ? `${provider.averageRating.toFixed(1)} (${provider.totalReviews} reviews)` : 'No ratings yet'}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-600">Service</p>
                  <p className="font-medium capitalize">{provider.serviceCategory}</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-600">Experience</p>
                  <p className="font-medium">{provider.experience} years</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-600">Rate</p>
                  <p className="font-medium">
                    {provider.pricing?.amount} {provider.pricing?.currency} ({provider.pricing?.rateType})
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600">Distance</p>
                  <p className="font-medium">{provider.distance ? `${provider.distance.toFixed(1)} km away` : 'Distance not available'}</p>
                </div>
                
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleBookProvider(provider._id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-lg text-gray-600 mb-4">No matching service providers found in your area.</p>
          <p className="mb-4">Try adjusting your service type or location.</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate('/job-request', { state: { email } })}
          >
            Modify Request
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchingProviders;