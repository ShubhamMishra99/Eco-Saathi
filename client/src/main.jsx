import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import Profile from './Home/Profile/Profile';
import PickupSchedule from './Home/PickupSchedule/PickupSchedule'; // ✅ import it
import './Home/Auth/auth.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pickup-schedule" element={<PickupSchedule />} /> {/* ✅ Add this line */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
