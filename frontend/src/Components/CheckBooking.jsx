import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import check from '../assets/check.avif'

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('authToken');  

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/my-appointments/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bookings');
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchBookings();
    } else {
      setError('User is not authenticated');
      setLoading(false);
    }
  }, [accessToken]);

  return (
    <div className="flex h-screen">
      {/* Left Side: Blue Background with Text */}
      <div className="w-1/2 bg-blue-500 text-white flex flex-col justify-center items-center">
        <div className="absolute top-0 left-0 items-center cursor-pointer w-fit ml-6 pt-5" onClick={() => navigate("/home")}>
          <Icon icon="famicons:arrow-back-circle-outline" width="30" height="30" style={{ color: 'white' }} />
        </div>
        <h2 className="text-4xl font-semibold mb-4">My Bookings</h2>
        <p className="text-lg">View all of your appointments here</p>
        <div className="mt-6 w-75 h-75">
        <img
          src={check}
          alt="Appointment Image"
          className="object-cover w-full h-full rounded-lg"
            />
      </div>
      </div>

      {/* Right Side: Table with White Background */}
      <div className="w-1/2 bg-white p-6">
        <h2 className="text-2xl text-center font-semibold mb-4">Your Booked Appointments</h2>

        {/* Show loading indicator if data is being fetched */}
        {loading ? (
          <div className="text-center text-blue-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <table className="min-w-[50%] text-center table-auto border-2 rounded-lg mx-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Slot</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-100 bg-blue-200">
                  <td className="px-4 py-2 border">{booking.date}</td>
                  <td className="px-4 py-2 border">{booking.time_slot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingTable;
