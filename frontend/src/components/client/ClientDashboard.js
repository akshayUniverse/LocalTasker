  import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!email) {
          setError('User information is missing.');
          setLoading(false);
          return;
        }

        // Get user ID from backend using email
        const userResponse = await axios.get(`http://localhost:5000/api/users/profile/${email}`);
        const userId = userResponse.data._id;

        // Fetch bookings
        const bookingsResponse = await axios.get(`http://localhost:5000/api/bookings/client/${userId}`);
        setBookings(bookingsResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  const handleBookingClick = (bookingId) => {
    navigate('/client/booking-details', { state: { bookingId, email } });
  };

  const handleNewRequest = () => {
    navigate('/job-request', { state: { email } });
  };

  return (
    <div className="client-dashboard-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleNewRequest}
        >
          New Service Request
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
        
        {loading ? (
          <div className="loader">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">You have no bookings yet.</div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card" onClick={() => handleBookingClick(booking._id)}>
                <div className="booking-info">
                  <div><strong>Status:</strong> {booking.status}</div>
                  <div><strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString()}</div>
                  <div><strong>Time:</strong> {booking.scheduledTime}</div>
                  <div><strong>Provider:</strong> {booking.providerId?.name || 'N/A'}</div>
                  <div><strong>Service:</strong> {booking.jobRequestId?.workType || 'N/A'}</div>
                </div>
                <button className="details-btn">View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;