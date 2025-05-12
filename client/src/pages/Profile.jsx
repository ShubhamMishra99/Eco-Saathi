import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

function Profile() {
  const navigate = useNavigate();

  const currentPhone = localStorage.getItem('currentUser');
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/');
  };

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>

      <aside className="sidebar">
        <div className="profile-info">
          <img src="/avatar.png" alt="User Avatar" className="avatar" />
          <h2 className="username">
            {storedUser && storedUser.phone === currentPhone
              ? storedUser.name
              : 'Guest'}
          </h2>
          <p className="user-role">
            {storedUser && storedUser.phone === currentPhone
              ? storedUser.phone
              : 'No phone found'}
          </p>
        </div>
        <nav className="nav-links">
          <button onClick={() => navigate('/rewards')}>🎁 Rewards</button>
          <button onClick={() => navigate('/history')}>📜 History</button>
          <button onClick={() => navigate('/schedules')}>📅 Schedules</button>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </nav>
      </aside>

      <main className="profile-content">
        <h2>Welcome to your profile</h2>
        <p>Select an option from the sidebar to get started.</p>
      </main>
    </div>
  );
}

export default Profile;
