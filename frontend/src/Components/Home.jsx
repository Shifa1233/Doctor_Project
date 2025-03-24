import React from 'react';
import image from '../assets/image.jpg';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate= useNavigate()
  return (
    <>
    <Navbar/>
    <div className="flex flex-row items-center justify-between p-10  bg-blue-300 h-screen w-full">
      {/* Left side: Material text */}
      <div className="text-black w-1/2">
        <div className="font-sans font-bold text-2xl mb-4">
          HIGHLY PROFESSIONAL PHYSIOTHERAPIST
        </div>
        <div className="font-sans font-bold text-5xl mb-4">
          Welcome to Dr. Shifa <br /> Physiotherapy
        </div>
        <div className="font-sans text-xl mb-8">
          A celebrity physiotherapist for various TV Reality shows <br />
          such as Jhalak Dikhla Jaa & Nach Baliye.
        </div>
        <button className="bg-blue-500 text-white font-sans font-bold py-2 px-4 rounded-[3vw] hover:bg-blue-600" onClick={()=>navigate("/booking")} >
          Book Now
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

export default Home;