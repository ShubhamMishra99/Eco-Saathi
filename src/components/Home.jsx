import React, { useEffect, useState } from 'react';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
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

  return (
    <div className="home">
      <header className="header">
        <h1 className="logo">♻️ EcoSathi</h1>
        <input type="text" placeholder="Search item" className="search-box" />
        <button className="search-btn">Search</button>

        {isLoggedIn ? (
          <div className="profile-actions">
            <button className="profile-btn" onClick={() => navigate('/profile')}>Profile</button>
          </div>
        ) : (
          <div className="auth-links">
            <button className="auth-btn" onClick={() => setShowLogin(true)}>Login</button>
            <button className="auth-btn" onClick={() => setShowSignup(true)}>Signup</button>
          </div>
        )}
      </header>

      {/* rest of the component stays same */}

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
