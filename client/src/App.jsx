import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Input from './Pages/Input';
import UserLogin from './User/Login/Login';
import RiderLogin from './Rider/Login/Login';
import RiderHome from './Rider/Home/Home';
import UserHome from './User/Home/Home';
import { ThemeProvider } from './components/context/ThemeContext';
import './components/styles/global.css';

const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Input />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/rider/login" element={<RiderLogin />} />
        <Route path="/user/dashboard" element={<UserHome />} />
        <Route path="/rider/dashboard" element={<RiderHome />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
