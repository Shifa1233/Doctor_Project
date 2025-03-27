import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useNavigate} from 'react-router-dom'
import axios from 'axios';

const Navbar = () => {
  const profilename  =  localStorage.getItem("username")
  console.log('Username:',profilename ); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token'); 
    localStorage.removeItem('username'); 
    navigate('/'); 
  };

  return (
    <div className="bg-blue-300 p-4">
      <div className="flex items-center justify-between">

        <div className="flex items-center space-x-6">
            {/* <div className="flex flex-col items-center ml-6">
                <Icon icon="fontisto:doctor" width="30" height="34" className="text-white "/>
            </div> */}
          <div className="flex space-x-6">
            <button className="bg-blue-500 text-white font-bold py-2 px-4  rounded-[3vw] hover:bg-blue-600" onClick={()=>navigate("/booking")}>
              Book Appointment
            </button>
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-[3vw] hover:bg-blue-600" onClick={()=>navigate("/check")}>
              Check Appointment
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center ml-6">
            <Icon icon="si:user-alt-4-fill" width="24" height="24" className="text-white" />
          
            <span className="text-white mt-2" onClick={toggleDropdown}>{profilename}</span> 
            {isDropdownOpen && (
            <div className="absolute right-2 top-15 mt-2 bg-white text-black rounded-md shadow-lg w-auto">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-center text-md w-auto rounded-md hover:text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        
            {/* <span className="text-white mt-2">Loading...</span> // Show loading if username isn't available yet */}
            
          </div>
      </div>
    </div>
  )
}


export default Navbar
