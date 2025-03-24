import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import doctor from '../assets/doctor.jpg'

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      setAppointments([]);

      try {
        const response = await axios.get(`http://127.0.0.1:8000/doctor-appointments/`, {
          headers: {
            'Authorization': `Bearer ${authToken}`, 
          },
        });

        const data = response.data;
        setAppointments(data);
        console.log(data);
      } catch (err) { 
        setError(err.response ? err.response.data.detail : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [authToken]); 

  return (
    <div className="flex h-screen">
      {/* Left Side: Greeting */}
      <div className="w-1/2 bg-blue-500 text-white flex items-center justify-center p-6">
        <div className="absolute top-0 left-0 items-center cursor-pointer w-fit ml-6 pt-5" onClick={() => navigate("/doctor")}>
          <Icon icon="famicons:arrow-back-circle-outline" width="30" height="30" style={{ color: 'white' }} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Hey Doctor, Check Your Appointments Here!</h1>
          <p className="text-lg">This is the list of patients who have booked your appointment:-</p>
        </div>
        <div className="mt-6 w-75 h-75">
          <img
            src={doctor}
            alt="Appointment Image"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      </div>

      {/* Right Side: Appointment Checking */}
      <div className="w-1/2 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center">Patient Record</h1>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        )}

        {/* Appointment Table */}
        {appointments.length > 0 && !loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border border-gray-300 text-left text-sm font-semibold">S.no</th>
                  <th className="py-2 px-4 border border-gray-300 text-left text-sm font-semibold">Patient Name</th>
                  <th className="py-2 px-4 border border-gray-300 text-left text-sm font-semibold">Date</th>
                  <th className="py-2 px-4 border border-gray-300 text-left text-sm font-semibold">Time Slot</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={appointment.id}>
                    <td className="py-2 px-4 border border-gray-300 text-sm">{index + 1}</td>
                    <td className="py-2 px-4 border border-gray-300 text-sm">{appointment.user?.username}</td>
                    <td className="py-2 px-4 border border-gray-300 text-sm">{appointment.date}</td>
                    <td className="py-2 px-4 border border-gray-300 text-sm">{appointment.time_slot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Appointments Found */}
        {appointments.length === 0 && !loading && !error && (
          <div className="text-center py-6 text-gray-600">No appointments found.</div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
