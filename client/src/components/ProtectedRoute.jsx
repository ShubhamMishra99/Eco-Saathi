import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredUserType }) => {
  const { isAuthenticated, userType } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Prevent going back in browser history
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, '', window.location.href);
    };
  }, []);

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to={`/${requiredUserType}/login`} state={{ from: location }} replace />;
  }

  if (userType !== requiredUserType) {
    // Redirect to appropriate dashboard if wrong user type
    return <Navigate to={`/${userType}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute; 