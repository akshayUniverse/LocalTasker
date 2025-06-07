import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const PortfolioAndPricingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userId } = location.state || {};
  
  const [formData, setFormData] = useState({
    rateType: 'hourly',
    amount: '',
    currency: 'USD',
    serviceRadius: '10',
    userId: userId || ''
  });
  const [availability, setAvailability] = useState([
    { day: 'monday', startTime: '09:00', endTime: '17:00' }
  ]);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setAvailability(newAvailability);
  };

  const addAvailabilitySlot = () => {
    setAvailability([...availability, { day: 'monday', startTime: '09:00', endTime: '17:00' }]);
  };

  const removeAvailabilitySlot = (index) => {
    const newAvailability = [...availability];
    newAvailability.splice(index, 1);
    setAvailability(newAvailability);
  };

  const handleFileChange = (e) => {
    setPortfolioImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Submit portfolio and pricing details
      await axios.post('http://localhost:5000/api/provider-profiles/portfolio-pricing', {
        ...formData,
        availability
      });

      // Upload portfolio images if any
      if (portfolioImages.length > 0) {
        const formDataImages = new FormData();
        formDataImages.append('userId', userId);
        
        portfolioImages.forEach(file => {
          formDataImages.append('images', file);
        });

        await axios.post(
          'http://localhost:5000/api/provider-profiles/upload-portfolio',
          formDataImages,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      // Navigate to dashboard or profile page
      navigate('/provider/dashboard', { state: { email } });
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

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Portfolio Images (Optional)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-500 mt-1">Upload up to 5 images of your previous work</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rateType">
            Rate Type
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="rateType"
            name="rateType"
            value={formData.rateType}
            onChange={handleChange}
            required
          >
            <option value="hourly">Hourly Rate</option>
            <option value="fixed">Fixed Rate (per visit)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount
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
              required
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

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Availability
          </label>
          
          {availability.map((slot, index) => (
            <div key={index} className="mb-3 p-3 border rounded">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <label className="block text-gray-700 text-xs mb-1" htmlFor={`day-${index}`}>
                    Day
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm"
                    id={`day-${index}`}
                    value={slot.day}
                    onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                    required
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
                  <label className="block text-gray-700 text-xs mb-1" htmlFor={`startTime-${index}`}>
                    Start Time
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm"
                    id={`startTime-${index}`}
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs mb-1" htmlFor={`endTime-${index}`}>
                    End Time
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm"
                    id={`endTime-${index}`}
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {availability.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 text-xs"
                  onClick={() => removeAvailabilitySlot(index)}
                >
                  Remove Slot
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="text-blue-500 text-sm font-semibold"
            onClick={addAvailabilitySlot}
          >
            + Add Another Time Slot
          </button>
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

export default PortfolioAndPricingForm;