import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const API_BASE_URL = 'https://eco-saathi-2.onrender.com';

const Profile = () => {
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    isEmailVerified: false,
    isPhoneVerified: false,
    joinedDate: '',
    totalPickups: 0,
    rewardPoints: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({...profileData});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/user/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfileData(data);
      setEditedData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfileData(data);
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/user/login');
  };

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  return (
    <div className="profile-section">
      <div className="profile-header">
        <div className="profile-avatar">
          <i className="fas fa-user"></i>
        </div>
        <div className="profile-info">
          <h2>{profileData.name}</h2>
          <p className="member-since">Member since {new Date(profileData.joinedDate).toLocaleDateString()}</p>
        </div>
        <div className="header-buttons">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            <i className={`fas fa-${isDarkTheme ? 'sun' : 'moon'}`}></i>
          </button>
          <button
            className={`edit-button ${isEditing ? 'cancel' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className={`fas fa-${isEditing ? 'times' : 'edit'}`}></i>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button
            className="edit-button"
            onClick={() => setShowPasswordModal(true)}
          >
            <i className="fas fa-key"></i>
            Change Password
          </button>
          <button
            className="edit-button logout"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <div className="profile-content">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={editedData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="info-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Name</span>
                  <span className="value">{profileData.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email</span>
                  <span className="value">
                    {profileData.email}
                    {profileData.isEmailVerified && (
                      <i className="fas fa-check-circle verified-icon" title="Verified"></i>
                    )}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Phone</span>
                  <span className="value">
                    {profileData.phone}
                    {profileData.isPhoneVerified && (
                      <i className="fas fa-check-circle verified-icon" title="Verified"></i>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h3>Activity Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-value">{profileData.totalPickups}</span>
                  <span className="stat-label">Total Pickups</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{profileData.rewardPoints}</span>
                  <span className="stat-label">Reward Points</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">
                    {new Date(profileData.joinedDate).toLocaleDateString()}
                  </span>
                  <span className="stat-label">Joined Date</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="close-button" onClick={() => setShowPasswordModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key"></i>
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 