import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './profile.css';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('sidebar') === 'open') {
      setSidebarOpen(true);
    }
    // Load pickups from localStorage
    const storedPickups = JSON.parse(localStorage.getItem('pickups')) || [];
    setPickups(storedPickups);
  }, [location.search]);

  const currentPhone = localStorage.getItem('currentUser');
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    navigate('/');
  };

  const avatarUrl =
    storedUser?.avatar ||
    'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';

  return (
    <div className="profile-page">
      {/* Profile button to open sidebar */}
      <button className="profile-btn" onClick={() => setSidebarOpen(true)}>
        Profile
      </button>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ×
        </button>
        <div className="profile-info">
          <img src={avatarUrl} alt="User Avatar" className="avatar" />
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
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </aside>
    </div>
  );
}

export default Profile;