import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const SellerLoginPage = () => {
  const navigate = useNavigate();
  const baseUrl = 'http://127.0.0.1:8000/api/';
  const [formError, setFormError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: '',
  });

  const inputHandler = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  const submitHandler = () => {
  if (!loginFormData.username || !loginFormData.password) {
    setFormError(true);
    setErrorMsg('Please enter both username and password');
    return;
  }

  setLoading(true);
  const formData = new FormData();
  formData.append('username', loginFormData.username);
  formData.append('password', loginFormData.password);

  axios
    .post(baseUrl + 'seller/login/', formData)
    .then((response) => {
      if (response.data.bool === false) {
        setFormError(true);
        setErrorMsg(response.data.msg);
      } else {
        const now = new Date().getTime();
        const sessionDuration = 30 * 60 * 1000; // 30 minutes

        // Store data in sessionStorage
        sessionStorage.setItem('seller_id', response.data.id);
        sessionStorage.setItem('seller_login', true);
        sessionStorage.setItem('seller_username', response.data.user);
        sessionStorage.setItem('login_time', now);
        sessionStorage.setItem('session_expiry', now + sessionDuration);

        window.location.href = '/seller/dashboard';
      }
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setFormError(true);
      setErrorMsg('Something went wrong');
      setLoading(false);
    });
};

  const handleForgotPassword = () => {
    navigate('/seller-forgot-password');
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100 relative"
      style={{
        backgroundImage: 'url("/src/assets/loginbk.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md z-0"></div>

      <div className="p-8 rounded-2xl shadow-xl w-full sm:w-96 bg-white z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">Seller Login</h2>

        {formError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-600 text-center mb-4 font-semibold"
          >
            {errorMsg}
          </motion.div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginFormData.username}
              onChange={inputHandler}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={loginFormData.password}
              onChange={inputHandler}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
            />
            <span
              className="absolute top-10 right-3 cursor-pointer text-gray-500"
              onClick={togglePassword}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="button"
            onClick={submitHandler}
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-primary hover:text-primary/80 text-sm"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerLoginPage;
