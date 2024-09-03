import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser, error } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser !== undefined) {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('ProtectedRoute error:', error);
    return <Navigate to="/" />;
  }

  return currentUser && currentUser.isAdmin ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
