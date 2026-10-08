// client/src/services/apiService.js

import axios from 'axios';

/**
 * Create a shortened URL
 */
export const createShortUrl = async (longUrl) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Please log in to shorten a URL.');
    }

    const response = await axios.post(
      '/api/shorten',
      { longUrl },
      {
        headers: {
          'x-auth-token': token,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      'API Error: Failed to create short URL',
      error
    );

    if (error.response?.data) {
      throw error.response.data;
    }

    throw new Error(
      error.message ||
      'An unexpected error occurred. Please try again.'
    );
  }
};