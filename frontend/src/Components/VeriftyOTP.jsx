import React, { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verify= () => {
    const [otp, setOTP] = useState('');
    const [error, setError] = useState('');
    const [forgetPassword, setForgetPassword] = useState(false); 
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!otp) {
            setError('Please fill in both fields');
            return;
        }

         try {
            const response = await axios.post('http://127.0.0.1:8000/verify-otp/', {
                otp
            });

            if (response.status === 200) {
                localStorage.setItem('userToken', response.data.token);  // Store token if returned
                setError('');
                navigate('/');
                toast.success('OTP verified successfully!');
            }
        } catch (err) {
            toast.error('Invalid OTP or server error');
            console.error('Verify error:', err);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 bg-blue-500 text-white p-8 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-4">Email Verification Portal</h2>
                <p className="text-xl">Kindly verify your email by entering the OTP code send at our registered mail.</p>
            </div>

            <div className="flex-1 p-8">
                <h2 className="text-3xl font-semibold mb-6">Email Verification</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="otp" className="block text-lg font-medium">OTP:</label>
                        <input
                            type="otp"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Verify
                    </button>

                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Verify;