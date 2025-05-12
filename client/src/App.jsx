import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PriceChart from './components/PriceChart/PriceChart'; // Updated import path
import PickupSchedule from './components/PickupSchedule/PickupSchedule'; // Updated import path
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Profile Page */}
        <Route path="/profile" element={<Profile />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Additional Pages */}
        <Route path="/price-chart" element={<PriceChart />} />
        <Route path="/schedule" element={<PickupSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;