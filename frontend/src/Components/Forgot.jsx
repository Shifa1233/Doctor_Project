import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const Forget = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [otp, setOtp] = useState(''); 
    const [showOtpField, setShowOtpField] = useState(false); 
    const [loading, setLoading] = useState(false);  
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Please fill in the email field');
            toast.error('Please fill in the email field');
            return;
        }

        setError(''); 
        setLoading(true); 

        try {
            const response = await axios.post('http://127.0.0.1:8000/forget/', { email });

            if (response) {
                setMessage('OTP has been sent to your email.');
                setShowOtpField(true);  
                toast.success('OTP has been sent to your email.');
            } else {
                setError(response.data.message || 'An error occurred. Please try again.');
                toast.error(response.data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        if (!otp) {
            setError('Please enter the OTP.');
            toast.error('Please enter the OTP.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/verify-otp/', { otp });

            if (response) {
                console.log(response);
                localStorage.setItem("resetToken", response.data.reset_token);
                navigate('/set');  
                toast.success('OTP verified successfully, you can reset your password.');
            } else {
                setError('Invalid OTP. Please try again.');
                toast.error('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 bg-blue-500 text-white p-8 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-4">Forgot Password Portal</h2>
                <p className="text-xl">Kindly verify your email by entering the OTP code sent to your registered email.</p>
            </div>

            <div className="flex-1 p-8">
                <h2 className="text-3xl font-semibold mb-6">Forgot Password</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {message && <p className="text-green-500 mb-4">{message}</p>} {/* Success Message */}

                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                        disabled={loading}  
                    >
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            'Send OTP'
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Back to login? <a href="/" className="text-blue-500 hover:underline">Login here</a>
                    </p>
                </div>

                {showOtpField && (
                    <form onSubmit={handleOtpSubmit} className="space-y-4 mt-6">
                        <div>
                            <label htmlFor="otp" className="block text-lg font-medium">OTP:</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                placeholder="Enter the OTP"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Submit OTP
                        </button>
                    </form>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Forget;
