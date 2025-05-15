import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Your backend API URL

// Register a new user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    // More informative error handling
    throw error.response ? error.response.data : 'Something went wrong during registration';
  }
};

// Login user
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    
    // Assuming the response contains a JWT token or user data
    const userData = response.data;
    
    // Store the user data and token in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData; // Return user data (or token, depending on your API response)
  } catch (error) {
    // More informative error handling
    throw error.response ? error.response.data : 'Login failed. Please try again.';
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user'); // Remove user data from localStorage
};

// Get the current logged-in user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user')); // Fetch user data from localStorage
};
