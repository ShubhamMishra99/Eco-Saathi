import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Input from './Pages/Input';
import UserLogin from './User/Login/Login';
import RiderLogin from './Rider/Login/Login';
import RiderHome from './Rider/Home/Home';
import UserHome from './User/Home/Home';
import { ThemeProvider } from './components/context/ThemeContext';
import { PickupProvider } from './components/context/PickupContext';
import PickupNotification from './components/PickupNotification/PickupNotification';
import './components/styles/global.css';

// Wrapper component for rider routes
const RiderRouteWrapper = ({ children }) => {
  return (
    <PickupProvider>
      {children}
      <PickupNotification />
    </PickupProvider>
  );
};

const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Input />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<UserHome />} />
        
        {/* Rider routes wrapped with PickupProvider */}
        <Route path="/rider/*" element={
          <RiderRouteWrapper>
            <Routes>
              <Route path="login" element={<RiderLogin />} />
              <Route path="dashboard" element={<RiderHome />} />
            </Routes>
          </RiderRouteWrapper>
        } />
      </Routes>
    </Router>

import AppRoutes from './routes';

function App() {
  return (
    <AppRoutes />

  );
}

export default App;
