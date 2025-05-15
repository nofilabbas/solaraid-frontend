import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import emailjs from 'emailjs-com';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/request_password_reset/', { email });
      const { token } = res.data;

      const templateParams = {
        email: email,
        link: `http://localhost:3000/customer/reset-password/${token}`,
      };


      await emailjs.send(
        'solaraidpk', // your service ID
        'template_ysyc6pr', // your template ID
        templateParams,
        'mghbfUv_kI1ffrh0a' // your user/public key
      );

      setMessage(`Password reset link sent to ${email}`);
      setError('');
      //setTimeout(() => navigate('/customer/login'), 3000);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen relative"
      style={{
        backgroundImage: 'url("/src/assets/loginbk.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md z-0"></div>

      <div className="p-8 rounded-2xl shadow-xl w-full sm:w-96 bg-white z-10 relative">
        <button
          onClick={() => navigate('/customer/login')}
          className="absolute top-4 left-4 text-primary hover:text-primary/80"
        >
          <ArrowLeft />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Forgot Password
        </h2>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-red-600 text-center mb-4 font-semibold">
            {error}
          </motion.div>
        )}

        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-green-600 text-center mb-4 font-semibold">
            {message}
          </motion.div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter your Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
