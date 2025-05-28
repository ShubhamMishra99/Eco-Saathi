import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Input from './Pages/Input';
import UserLogin from './User/Login/Login';
import RiderLogin from './Rider/Login/Login';
import RiderHome from './Rider/Home/Home';
import UserHome from './User/Home/Home';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated, userType } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Input />} />
      
      {/* User Routes */}
      <Route 
        path="/user/login" 
        element={
          isAuthenticated && userType === 'user' ? 
          <Navigate to="/user/dashboard" replace /> : 
          <UserLogin />
        } 
      />
      <Route 
        path="/user/dashboard/*" 
        element={
          <ProtectedRoute requiredUserType="user">
            <UserHome />
          </ProtectedRoute>
        } 
      />

      {/* Rider Routes */}
      <Route 
        path="/rider/login" 
        element={
          isAuthenticated && userType === 'rider' ? 
          <Navigate to="/rider/dashboard" replace /> : 
          <RiderLogin />
        } 
      />
      <Route 
        path="/rider/dashboard/*" 
        element={
          <ProtectedRoute requiredUserType="rider">
            <RiderHome />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 