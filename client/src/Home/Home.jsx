import React, { useEffect, useState } from 'react';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import PriceChart from './PriceChart/PriceChart';
import About from './About/About';
import PickupSchedule from './PickupSchedule/PickupSchedule';
import { useNavigate } from 'react-router-dom';
import './home.css';
import HomeImage from '../assets/HomeImage.png';
import Footer from './Footer/Footer';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    setSchedules(JSON.parse(localStorage.getItem('schedules')) || []);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setSchedules(JSON.parse(localStorage.getItem('schedules')) || []);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNavButtonClick = (targetId) => {
    if (targetId === 'price-chart-section') {
      document.getElementById('price-chart-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (targetId === 'pickup-schedule') {
      setShowPickupModal(true);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert(`${targetId.replace('-', ' ')} section not found or page not implemented.`);
      }
    }
  };

  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSidebarOpen(false);
    setShowLogin(false);
    setShowSignup(false);
    setShowPickupModal(false);
  };

  const handleProfileClick = () => {
    localStorage.getItem('currentUser') 
      ? setSidebarOpen(true)
      : alert('Please log in to access your profile.');
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    setSidebarOpen(false);
    setIsLoggedIn(false);
  };

  const currentPhone = localStorage.getItem('currentUser');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const avatarUrl = storedUser?.avatar || 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          ECO SAATHI
        </div>
        <nav className="nav">
          <button onClick={handleHomeClick}>Home</button>
          <button onClick={() => handleNavButtonClick('about-section')}>About</button>
          <button onClick={() => handleNavButtonClick('price-chart-section')}>Price Chart</button>
    <button onClick={() => navigate('/tracking')}>Real-time Tracking</button>


          {isLoggedIn ? (
            <button className="profile-btn" onClick={handleProfileClick}>Profile</button>
          ) : (
            <>
              <button className="auth-btn" onClick={() => setShowLogin(true)}>Login</button>
              <button className="auth-btn" onClick={() => setShowSignup(true)}>Signup</button>
            </>
          )}
        </nav>
      </header>

      <section className="hero">
        <div className="hero-left">
          <h4 className="hero-subtitle">WE ARE</h4>
          <h1 className="hero-title">SOLVING <br /> GLOBAL <br /> PROBLEMS</h1>
          <p className="hero-desc">
            EcoSaathi makes a track to environmental solutions with a positive impact on climate changes. Join the community, building a balance of business and society with safe nature and better future for our planet.
          </p>
          <button className="cta-btn" onClick={() => setShowPickupModal(true)}>
            SCHEDULE A PICKUP
          </button>
          <div className="hero-stats">
            <div>
              <span className="stat-num">5.7</span>
              <span className="stat-label">CO<sub>2</sub> Tons Prevented</span>
            </div>
            <div>
              <span className="stat-num">68</span>
              <span className="stat-label">Products Footprinted</span>
            </div>
            <div>
              <span className="stat-num">13</span>
              <span className="stat-label">Active Projects</span>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <img src={HomeImage} alt="EcoSaathi Illustration" className="hero-illustration" />
        </div>
      </section>

      <section id="about-section">
        <About />
      </section>

      <section id="price-chart-section" className="price-chart-section">
        <PriceChart />
      </section>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        <div className="profile-info">
          <img src={avatarUrl} alt="User Avatar" className="avatar" />
          <h2 className="username">{storedUser?.phone === currentPhone ? storedUser.name : 'Guest'}</h2>
          <p className="user-role">{storedUser?.phone === currentPhone ? storedUser.phone : 'No phone found'}</p>
        </div>
        <nav className="nav-links">
          <button onClick={() => navigate('/schedules')}>📅 Schedules</button>
          <button onClick={() => navigate('/history')}>📜 History</button>
          <button onClick={() => navigate('/rewards')}>🎁 Rewards</button>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </nav>
      </aside>

      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowLogin(false)}>X</button>
            <Login onSuccess={() => {
              setShowLogin(false);
              setIsLoggedIn(true);
            }} />
          </div>
        </div>
      )}

      {showSignup && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowSignup(false)}>X</button>
            <Signup onSuccess={() => {
              setShowSignup(false);
              setIsLoggedIn(true);
            }} />
          </div>
        </div>
      )}

      {showPickupModal && (
        <div className="pickup-modal-overlay">
          <div className="pickup-modal-content">
            <button className="pickup-modal-close" onClick={() => setShowPickupModal(false)}>×</button>
            <PickupSchedule />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
