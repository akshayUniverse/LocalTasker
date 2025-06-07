import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

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
        setBookings(bookingsResponse.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  const handleViewBooking = (bookingId) => {
    navigate('/client/booking-details', { 
      state: { 
        bookingId,
        email 
      } 
    });
  };

  const handleNewRequest = () => {
    navigate('/job-request', { state: { email } });
  };

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
        
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Service</th>
                  <th className="py-2 px-4 border-b text-left">Provider</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="py-2 px-4 border-b">{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b capitalize">{booking.serviceType}</td>
                    <td className="py-2 px-4 border-b">{booking.providerName}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleViewBooking(booking._id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">You don't have any bookings yet.</p>
            <button
              className="mt-4 bg-blue-500