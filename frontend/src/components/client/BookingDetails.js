import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, email } = location.state || {};
  
  const [booking, setBooking] = useState(null);
  const [provider, setProvider] = useState(null);
  const [jobRequest, setJobRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!bookingId) {
          setError('Booking information is missing.');
          setLoading(false);
          return;
        }

        // Fetch booking details
        const bookingResponse = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
        const bookingData = bookingResponse.data.data;
        setBooking(bookingData);

        // Fetch provider details
        const providerResponse = await axios.get(`http://localhost:5000/api/provider-profiles/${bookingData.providerId}`);
        setProvider(providerResponse.data.data);

        // Fetch job request details
        const jobResponse = await axios.get(`http://localhost:5000/api/job-requests/${bookingData.jobRequestId}`);
        setJobRequest(jobResponse.data.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`);
      
      // Refresh booking data
      const bookingResponse = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
      setBooking(bookingResponse.data.data);
      
      alert('Booking cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleLeaveReview = () => {
    navigate('/client/leave-review', { 
      state: { 
        bookingId,
        providerId: booking.providerId,
        email 
      } 
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading booking details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!booking || !provider || !jobRequest) {
    return <div className="text-center py-10">Booking information not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Booking Status</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600">Booking Date</p>
            <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Service Date</p>
            <p className="font-medium">{new Date(jobRequest.preferredDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Service Time</p>
            <p className="font-medium">{jobRequest.preferredTime}</p>
          </div>
          <div>
            <p className="text-gray-600">Service Type</p>
            <p className="font-medium capitalize">{jobRequest.serviceType}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Service Provider</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{provider.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Experience</p>
            <p className="font-medium">{provider.experience} years</p>
          </div>
          <div>
            <p className="text-gray-600">Rating</p>
            <div className="flex items-center">
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
                  {provider.averageRating ? `${provider.averageRating.toFixed(1)}` : 'No ratings yet'}
                </span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-600">Rate</p>
            <p className="font-medium">
              {provider.pricing?.amount} {provider.pricing?.currency} ({provider.pricing?.rateType})
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Job Details</h2>
        <div className="mb-4">
          <p className="text-gray-600">Location</p>
          <p className="font-medium">{jobRequest.location}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-600">Description</p>
          <p className="font-medium">{jobRequest.description}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {booking.status === 'pending' && (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCancelBooking}
          >
            Cancel Booking
          </button>
        )}
        
        {booking.status === 'completed' && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLeaveReview}
          >
            Leave a Review
          </button>
        )}
        
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => navigate('/client/dashboard', { state: { email } })}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BookingDetails;