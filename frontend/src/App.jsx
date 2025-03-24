import { useState } from 'react'
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import './App.css'
import Home from './Components/Home';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Navbar from './Components/Navbar';
import Booking from './Components/Booking';
import CheckBooking from './Components/CheckBooking';
import Verify from './Components/VeriftyOTP';
import DoctorHome from './Components/DoctorHome';
import Appointments from './Components/AppointmentChecking';
import Forget from './Components/Forgot';
import SetPassword from './Components/SetPassword';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home/>} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/booking" element={<Booking />} /> 
          <Route path="/check" element={<CheckBooking />} /> 
          <Route path="/verify" element={<Verify />} /> 
          <Route path="/doctor" element={<DoctorHome />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/forget" element={<Forget />} />
          <Route path="/set" element={<SetPassword />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
