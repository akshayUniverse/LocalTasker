import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const WorkDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userId } = location.state || {};
  
  const [formData, setFormData] = useState({
    serviceCategory: '',
    experience: '',
    userId: userId || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Submit work details
      await axios.post('http://localhost:5000/api/provider-profiles/work-details', formData);

      // Navigate to next step
      navigate('/provider/portfolio-pricing', { state: { email, userId } });
    } catch (error) {
      console.error('Error submitting work details:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Provider Profile: Work Details</h2>
      <p className="text-gray-600 mb-6 text-center">Step 2 of 3</p>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceCategory">
            Service Category
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="serviceCategory"
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select a service category</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="painter">Painter</option>
            <option value="carpenter">Carpenter</option>
            <option value="cleaner">Cleaner</option>
            <option value="gardener">Gardener</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
            Years of Experience
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="experience"
            type="number"
            name="experience"
            min="0"
            max="50"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate('/provider/basic-details', { state: { email } })}
          >
            Back
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Next: Portfolio & Pricing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkDetailsForm;