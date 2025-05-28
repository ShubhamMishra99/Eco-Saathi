import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import './Home.css';
import Dashboard from './Dashboard/Dashboard';
import Profile from './Profile/Profile';
import Orders from './Orders/Orders';
import Earnings from './Earnings/Earnings';
import Footer from './Footer/Footer';

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isDarkTheme, toggleTheme } = useTheme();

  const handleNavigation = (section) => {
    if (section === 'about') {
      setActiveSection('dashboard');
      // Wait for the next render cycle to ensure Dashboard is mounted
      setTimeout(() => {
        const aboutSection = document.getElementById('about-section');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (section === 'dashboard') {
      setActiveSection('dashboard');
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className={`rider-home ${isDarkTheme ? 'dark-theme' : ''}`}>
      <nav className="rider-nav">
        <div className="nav-brand">
          <h1>♻️Eco-Saathi</h1>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-button ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard')}
          >
            <i className="fas fa-home"></i>
            Dashboard
          </button>
          <button 
            className={`nav-button ${activeSection === 'about' ? 'active' : ''}`}
            onClick={() => handleNavigation('about')}
          >
            <i className="fas fa-info-circle"></i>
            About
          </button>
          <button 
            className={`nav-button ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => handleNavigation('orders')}
          >
            <i className="fas fa-box"></i>
            Orders
          </button>
          <button 
            className={`nav-button ${activeSection === 'earnings' ? 'active' : ''}`}
            onClick={() => handleNavigation('earnings')}
          >
            <i className="fas fa-rupee-sign"></i>
            Earnings
          </button>
          <button 
            className={`nav-button ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavigation('profile')}
          >
            <i className="fas fa-user"></i>
            Profile
          </button>
          <button 
            className="nav-button theme"
            onClick={toggleTheme}
            title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <i className={`fas fa-${isDarkTheme ? 'sun' : 'moon'}`}></i>
          </button>
        </div>
      </nav>

      <main className="rider-main">
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'profile' && <Profile />}
        {activeSection === 'orders' && <Orders />}
        {activeSection === 'earnings' && <Earnings />}
      </main>

      <Footer />
    </div>
  );
};

export default Home; 









