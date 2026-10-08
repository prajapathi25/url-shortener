import axios from 'axios';

const API_URL = '/api/auth';

// Register
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      userData
    );

    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Response:', error.response);

    if (error.response) {
      throw new Error(
        error.response.data?.error ||
        error.response.data?.message ||
        `Registration failed (${error.response.status})`
      );
    }

    if (error.request) {
      throw new Error(
        'Cannot connect to the server. Make sure the backend is running.'
      );
    }

    throw new Error(error.message || 'Registration failed.');
  }
};

// Login
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      userData
    );

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Response:', error.response);

    if (error.response) {
      throw new Error(
        error.response.data?.error ||
        error.response.data?.message ||
        `Login failed (${error.response.status})`
      );
    }

    if (error.request) {
      throw new Error(
        'Cannot connect to the server. Make sure the backend is running.'
      );
    }

    throw new Error(error.message || 'Login failed.');
  }
};