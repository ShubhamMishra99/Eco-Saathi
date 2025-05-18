import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './profile.css';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('sidebar') === 'open') {
      setSidebarOpen(true);
    }
    // Load schedules from localStorage
    const stored = JSON.parse(localStorage.getItem('schedules')) || [];
    setSchedules(stored);
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
          <button onClick={() => navigate('/pickup-schedule')}>📅 Schedules</button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
        {/* Show schedules below nav */}
        {schedules.length > 0 && (
          <div className="schedules-list" style={{ padding: '1rem' }}>
            <h4>My Schedules</h4>
            <ul>
              {schedules.map((s, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <strong>
                    {s.day ? `${s.day}, ` : ''}
                    {s.date} {s.time}
                  </strong>
                  <br />
                  {s.address}
                  <br />
                  <em>{s.description}</em>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

export default Profile;