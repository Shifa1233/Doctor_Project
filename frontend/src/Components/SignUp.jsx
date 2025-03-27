import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            setError('Please fill in all fields');
            toast.error('Please fill in all fields');
            return;
        }

        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character');
            // toast.error('Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character');
            return;
        }

        setError(''); 
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/register/', {
                username,
                email,
                password
            });

            if (response.status === 201) {  
                setError('');
                setLoading(false);
                toast.success('Registration successful!');
                navigate('/verify'); 
            }
        } catch (err) {
            setError('Registration failed. Please try again later.');
            setLoading(false); 
            toast.error('Registration failed. Please try again later.');
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 bg-blue-500 text-white p-8 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-4">Welcome to Online Appointment Booking</h2>
                <p className="text-xl">Please create an account to get started.</p>
            </div>

            <div className="flex-1 p-8">
                <h2 className="text-3xl font-semibold mb-6">Sign Up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-lg font-medium">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
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
                    <div>
                        <label htmlFor="password" className="block text-lg font-medium">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                        disabled={loading}
                        // onClick={()=>navigate("/verify")}
                    >
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Already have an account? <a href="/" className="text-blue-500 hover:underline">Login here</a>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SignUp;
