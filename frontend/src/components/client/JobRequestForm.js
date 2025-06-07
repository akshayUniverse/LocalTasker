import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const JobRequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    serviceType: '',
    description: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serviceCategories, setServiceCategories] = useState([
    'electrician', 'plumber', 'painter', 'carpenter', 'cleaner', 'gardener', 'other'
  ]);

  useEffect(() => {
    // Fetch user details if email is available
    const fetchUserDetails = async () => {
      try {
        if (email) {
          const response = await axios.get(`http://localhost:5000/api/users/profile/${email}`);
          setFormData(prevData => ({
            ...prevData,
            name: response.data.name || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get user ID from backend using email
      const userResponse = await axios.get(`http://localhost:5000/api/users/profile/${email}`);
      const userId = userResponse.data._id;

      // Submit job request
      const response = await axios.post('http://localhost:5000/api/job-requests', {
        ...formData,
        clientId: userId
      });

      // Navigate to matching providers page
      navigate('/client/matching-providers', { 
        state: { 
          jobRequestId: response.data.data._id,
          email 
        } 
      });
    } catch (error) {
      console.error('Error submitting job request:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit a Job Request</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Your Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            readOnly={formData.name ? true : false}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            type="text"
            name="location"
            placeholder="Enter your address"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceType">
            Service Type
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
          >
            <option value="">Select a service type</option>
            {serviceCategories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            rows="4"
            placeholder="Describe what you need help with"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preferredDate">
            Preferred Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="preferredDate"
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preferredTime">
            Preferred Time
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="preferredTime"
            type="time"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Find Service Providers'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobRequestForm;