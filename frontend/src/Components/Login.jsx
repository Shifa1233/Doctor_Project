import React, { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';

const Login= () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            // setError('Please fill in both fields');
            toast.error('Please fill in both fields')
            return;
        }

         try {
            const response = await axios.post('http://127.0.0.1:8000/login/', {
                username,
                password
            });
            
            if (response.status === 200) {
                console.log("4456789")
                
                console.log(response)
                localStorage.setItem('authToken', response.data.access_token);  
                localStorage.setItem('refreshToken', response.data.refresh_token);  
                localStorage.setItem('username',response.data.username)
                setError('');
                toast.success('Login Successful'); 
                if (username === 'Rahman') {
                    navigate('/doctor');
                } else {
                    navigate('/home');
                    
                }
                
            }
        } catch (err) {
            setError('Invalid credentials or server error');
            // toast.error('Invalid credentials or server error');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 bg-blue-500 text-white p-8 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-4">Welcome to Online Appointment Booking</h2>
                <p className="text-xl">Book your appointment to our proffestional Dr. Shifa and get the best physiotherapy</p>
            </div>

            <div className="flex-1 p-8">
                <h2 className="text-3xl font-semibold mb-6">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-lg font-medium">Username:</label>
                        <input
                            type="username"
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
                    >
                        Login
                    </button>

                </form>
                {/* Sign up option */}
                <div className="mt-4 text-center">
                    <p className="text-sm">
                        New user? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
                    </p>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm">
                        forgot password? <a href="/forget" className="text-blue-500 hover:underline">Change password</a>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;