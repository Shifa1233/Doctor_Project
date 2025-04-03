import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import check from '../assets/check.avif';
import { ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, bookingTime: null, bookingDate: null });
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
        toast.error('Failed to load bookings'); 
      }
    };

    if (accessToken) {
      fetchBookings();
    } else {
      setError('User is not authenticated');
      setLoading(false);
      toast.error('User is not authenticated');  
    }
  }, [accessToken]);

  const handleDelete = async (appointmentTime , appointmentDate) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          date: appointmentDate,
          time_slot: appointmentTime
        }
      });
      setBookings(bookings.filter(booking => !(booking.date === appointmentDate && booking.time_slot === appointmentTime)));
      
      setConfirmDelete({ show: false, bookingTime: null, bookingDate: null });
      toast.success('Appointment deleted successfully');
    } catch (error) {
      console.error("Error deleting appointment", error);
      toast.error('Failed to delete appointment');
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ show: false, bookingTime: null, bookingDate: null });
  };

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
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-100 bg-blue-200">
                  <td className="px-4 py-2 border">{booking.date}</td>
                  <td className="px-4 py-2 border">{booking.time_slot}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setConfirmDelete({ show: true, bookingTime: booking.time_slot, bookingDate: booking.date })}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmDelete.show && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white border-2 p-6 rounded-lg w-1/3">
            <h3 className="text-xl text-center mb-4">Are you sure you want to cancel this appointment?</h3>
            <div className="flex justify-around">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleDelete(confirmDelete.bookingTime , confirmDelete.bookingDate)}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={handleCancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
};

export default BookingTable;
