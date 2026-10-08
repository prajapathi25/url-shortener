// client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Get login function from AuthContext
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    // Validate form
    if (!formData.email || !formData.password) {
      setError('Both email and password are required.');
      return;
    }

    try {
      const response = await loginUser(formData);

      // Check if token was received
      if (response?.token) {

        // IMPORTANT:
        // This stores the token AND updates AuthContext
        login(response.token);

        console.log('Login successful!');

        // Go to dashboard
        navigate('/dashboard');
      } else {
        setError('Login successful, but no token was provided.');
      }

    } catch (err) {
      console.error('Login error:', err);

      const errorMessage =
        err?.error ||
        err?.message ||
        'Login failed. Please check your credentials.';

      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto">

      <div className="bg-white p-8 mt-10 rounded-lg shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome Back!
        </h2>

        <p className="text-center text-slate-500 mb-6">
          Log in to access your dashboard.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>

        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-slate-600">

          Don't have an account?{' '}

          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register now
          </Link>

        </p>

      </div>

    </div>
  );
};

export default LoginPage;