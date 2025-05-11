import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>

      <aside className="sidebar">
        <div className="profile-info">
          <img src="/avatar.png" alt="User Avatar" className="avatar" />
          <h2 className="username">John Doe</h2>
          <p className="user-role">Student</p>
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
