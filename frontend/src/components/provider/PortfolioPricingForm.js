import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const PortfolioPricingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userId } = location.state || {};
  
  const [formData, setFormData] = useState({
    rateType: 'hourly',
    amount: '',
    currency: 'USD',
    serviceRadius: 10,
    availability: [
      { day: 'monday', startTime: '09:00', endTime: '17:00' },
      { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'friday', startTime: '09:00', endTime: '17:00' }
    ],
    userId: userId || ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updatedAvailability = [...formData.availability];
    updatedAvailability[index] = {
      ...updatedAvailability[index],
      [field]: value
    };
    setFormData({
      ...formData,
      availability: updatedAvailability
    });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Submit portfolio and pricing details
      await axios.post('http://localhost:5000/api/provider-profiles/portfolio-pricing', formData);

      // Upload portfolio images if any
      if (files.length > 0) {
        const formDataFiles = new FormData();
        formDataFiles.append('userId', userId);
        files.forEach(file => {
          formDataFiles.append('images', file);
        });

        await axios.post('http://localhost:5000/api/provider-profiles/upload-portfolio', formDataFiles, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/provider/dashboard', { state: { email, userId } });
      }, 2000);
    } catch (error) {
      console.error('Error submitting portfolio and pricing:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Provider Profile: Portfolio & Pricing</h2>
      <p className="text-gray-600 mb-6 text-center">Step 3 of 3</p>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Profile completed successfully! Redirecting to dashboard...</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rate Type</label>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="hourly"
              name="rateType"
              value="hourly"
              checked={formData.rateType === 'hourly'}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="hourly" className="mr-4">Hourly</label>
            
            <input
              type="radio"
              id="fixed"
              name="rateType"
              value="fixed"
              checked={formData.rateType === 'fixed'}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="fixed">Fixed</label>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Rate Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              name="amount"
              min="1"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currency">
              Currency
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceRadius">
            Service Radius (km)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="serviceRadius"
            type="number"
            name="serviceRadius"
            min="1"
            max="100"
            value={formData.serviceRadius}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Availability
          </label>
          {formData.availability.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                  value={item.day}
                  onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
              <div>
                <input
                  type="time"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                  value={item.startTime}
                  onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="time"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                  value={item.endTime}
                  onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="portfolioImages">
            Portfolio Images (up to 5)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="portfolioImages"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-500 mt-1">Max 5 images, each under 5MB</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate('/provider/work-details', { state: { email, userId } })}
          >
            Back
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Complete Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioPricingForm;