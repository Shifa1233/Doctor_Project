import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const SetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');  
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        if (token) {
            localStorage.setItem('reset_token', token);  
        }
    }, [token]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError('Please fill in both fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.');
            return;
        }

        setError('');

        try {
            const resetToken = localStorage.getItem('resetToken');

            const response = await axios.put('http://127.0.0.1:8000/set/', {
                token: resetToken, 
                new_password: password,
                confirm_password: confirmPassword
            });

            

            if (response.data.message) {
                setMessage(response.data.message);
                localStorage.removeItem('resetToken');

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(response.data.error || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 bg-blue-500 text-white p-8 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-4">Set Your New Password</h2>
                <p className="text-xl">Please enter your new password to continue.</p>
            </div>

            <div className="flex-1 p-8">
                <h2 className="text-3xl font-semibold mb-6">Set Password</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {message && <p className="text-green-500 mb-4">{message}</p>} 

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-lg font-medium">New Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-lg font-medium">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Confirm your new password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Set Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPassword;
