import React , { useState } from 'react';
import image from '../assets/image.jpg';
import { Icon } from '@iconify/react/dist/iconify.js'
import { useNavigate } from 'react-router-dom';

const DoctorHome = () => {
  const navigate= useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  
  const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
  const handleLogout = () => {
        localStorage.removeItem('auth_token'); 
        localStorage.removeItem('username'); 
        navigate('/'); 
      };

  return (
    <>
    <div className="flex flex-row items-center justify-between p-10  bg-blue-300 h-screen w-full">
      {/* Left side: Material text */}
      <div className="absolute top-0 left-0 ml-6 mt-6 flex items-center">
        <Icon icon="fontisto:doctor" width="30" height="34" className="text-white" />
        <span className="text-white ml-2" onClick={toggleDropdown} >Dr. Shifa</span>
        {isDropdownOpen && (
            <div className="absolute right-2 top-15 mt-2 bg-white text-black rounded-md shadow-lg w-auto">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-center text-md w-auto rounded-md hover:text-red-600">
                Logout
              </button>
            </div>
          )}
    </div>
      <div className="text-black w-1/2">
        <div className="font-sans font-bold text-2xl mb-4">
          HIGHLY PROFESSIONAL PHYSIOTHERAPIST
        </div>
        <div className="font-sans font-bold text-5xl mb-4">
          Welcome Dr. Shifa <br /> Physiotherapist
        </div>
        <div className="font-sans text-xl mb-8">
          A celebrity physiotherapist for various TV Reality shows <br />
          such as Jhalak Dikhla Jaa & Nach Baliye.
        </div>
        <button className="bg-blue-500 text-white font-sans font-bold py-2 px-4 rounded-[3vw] hover:bg-blue-600" onClick={()=>navigate("/appointment")} >
          Check Appointments
        </button>
      </div>

      {/* Right side: Image */}
      <div className="w-1/2 flex justify-end">
        <img
          src={image}
          alt="Placeholder"
          className="object-cover rounded-full w-96 h-96"
        />
      </div>
    </div>
    </>
  );
};

export default DoctorHome;