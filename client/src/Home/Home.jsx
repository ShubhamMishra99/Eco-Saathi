import React, { useEffect, useState } from 'react';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import PriceChart from './PriceChart/PriceChart';
import About from './About/About';
import PickupSchedule from './PickupSchedule/PickupSchedule'; // Adjust relative path
import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPriceChart, setShowPriceChart] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const status = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(status === 'true');
    const stored = JSON.parse(localStorage.getItem('schedules')) || [];
    setSchedules(stored);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(localStorage.getItem('schedules')) || [];
      setSchedules(stored);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNavButtonClick = (targetId) => {
    if (targetId === 'price-chart-section') {
      setShowPriceChart((prev) => {
        const next = !prev;
        setTimeout(() => {
          const el = document.getElementById('price-chart-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
        return next;
      });
    } else if (targetId === 'pickup-schedule') {
      setShowPickupModal(true); // ← updated to show modal instead of navigate
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
    setShowPriceChart(false);
  };

  const handleProfileClick = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setSidebarOpen(true);
    } else {
      alert('Please log in to access your profile.');
    }
  };

  const currentPhone = localStorage.getItem('currentUser');
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    setSidebarOpen(false);
    setIsLoggedIn(false);
  };

  const avatarUrl =
    storedUser?.avatar ||
    'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';

  return (
    <div className="carbonex-home">
      {/* Navigation */}
      <header className="carbonex-header">
        <div className="carbonex-logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          ECO SAATHI
        </div>
        <nav className="carbonex-nav">
          <button onClick={handleHomeClick}>Home</button>
          <button onClick={() => handleNavButtonClick('about-section')}>About</button>
          <button onClick={() => handleNavButtonClick('price-chart-section')}>Price Chart</button>
          <button onClick={() => handleNavButtonClick('pickup-schedule')}>Pickup Schedule</button>
          <button onClick={() => alert('Real-time Tracking clicked')}>Real-time Tracking</button>
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

      {/* Hero Section */}
      <section className="carbonex-hero">
        <div className="hero-left">
          <h4 className="hero-subtitle">WE ARE</h4>
          <h1 className="hero-title">SOLVING <br /> GLOBAL <br /> PROBLEMS</h1>
          <p className="hero-desc">
            EcoSaathi makes a track to environmental solutions with a positive impact on climate changes. Join the community, building a balance of business and society with safe nature and better future for our planet.
          </p>
          <button className="cta-btn">SCHEDULE A CONSULTATION</button>
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
          <img src="client/public/eco-illustration.svg" alt="EcoSaathi Illustration" className="hero-illustration" />
        </div>
      </section>

      {/* About Section */}
      <section id="about-section">
        <About />
      </section>

      {/* Price Chart Section */}
      {showPriceChart && (
        <section id="price-chart-section" className="price-chart-section">
          <PriceChart />
        </section>
      )}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        <div className="profile-info">
          <img src={avatarUrl} alt="User Avatar" className="avatar" />
          <h2 className="username">{storedUser?.phone === currentPhone ? storedUser.name : 'Guest'}</h2>
          <p className="user-role">{storedUser?.phone === currentPhone ? storedUser.phone : 'No phone found'}</p>
        </div>
        <nav className="nav-links">
          <button onClick={() => alert('Rewards clicked')}>🎁 Rewards</button>
          <button onClick={() => alert('History clicked')}>📜 History</button>
          <button onClick={() => navigate('/Schedules')}>📅 Schedules</button>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </nav>

        {/* Show saved schedules */}
        {schedules.length > 0 && (
          <div className="schedules-list" style={{ padding: '1rem' }}>
            <h4>My Schedules</h4>
            <ul>
              {schedules.map((s, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <strong>{s.day ? `${s.day}, ` : ''}{s.date} {s.time}</strong><br />
                  {s.address}<br />
                  <em>{s.description}</em>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Login Modal */}
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

      {/* Signup Modal */}
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

      {/* Pickup Schedule Fullscreen Modal */}
      {showPickupModal && (
        <div className="pickup-modal-overlay">
          <div className="pickup-modal-content">
            <button className="pickup-modal-close" onClick={() => setShowPickupModal(false)}>×</button>
            <PickupSchedule />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        © {new Date().getFullYear()} EcoSaathi. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
