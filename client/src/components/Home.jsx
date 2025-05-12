import React, { useEffect, useState } from 'react';
import Login from '../pages/Login'; // Assuming Login is in pages
import Signup from '../pages/Signup'; // Assuming Signup is in pages
import PriceChart from './PriceChart/PriceChart'; // Import the new PriceChart component
import About from './PriceChart/About/About'; // Import the About component
import { useNavigate } from 'react-router-dom';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const status = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(status === 'true');
  }, []);

  const handleNavButtonClick = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert(`${targetId.replace('-', ' ')} section not found or page not implemented.`);
    }
  };

  const handleHomeClick = () => {
    navigate('/'); // Navigate to the root route
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
  };

  const handleProfileClick = () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    navigate('/profile'); // Navigate to the profile page
  } else {
    alert('Please log in to access your profile.');
  }
};

  return (
    <div className="home">
      <header className="header">
        <h1 className="logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          ♻️ EcoSaathi
        </h1>

        <nav className="nav-options">
          <button onClick={handleHomeClick}>Home</button>
          <button onClick={() => handleNavButtonClick('about-section')}>About</button>
          <button onClick={() => handleNavButtonClick('price-chart-section')}>Price Chart</button>
          <button onClick={() => alert('Pickup Schedule clicked')}>Pickup Schedule</button>
          <button onClick={() => alert('Real-time Tracking clicked')}>Real-time Tracking</button>
        </nav>

        {isLoggedIn ? (
          <div className="profile-actions">
            <button className="profile-btn" onClick={handleProfileClick}>Profile</button>
          </div>
        ) : (
          <div className="auth-links">
            <button className="auth-btn" onClick={() => setShowLogin(true)}>Login</button>
            <button className="auth-btn" onClick={() => setShowSignup(true)}>Signup</button>
          </div>
        )}
      </header>

      <main>
        {/* About Section */}
        <About />

        {/* Price Chart Section */}
        <section id="price-chart-section" className="price-chart-section">
          <PriceChart />
        </section>
      </main>

      {/* Modals for Login and Signup */}
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
    </div>
  );
}

export default Home;