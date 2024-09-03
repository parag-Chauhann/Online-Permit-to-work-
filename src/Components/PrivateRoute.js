import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser !== undefined) {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
