// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Loading state while checking user
  if (!user) return <Navigate to="/login" />; // Redirect to login page if not authenticated

  return children;
};

export default ProtectedRoute;
