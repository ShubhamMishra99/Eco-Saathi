import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'User Name',
    email: 'user.name@example.com',
    phone: '+91XXXXXXXXXX',
    address: 'Phase 2,Electronic City,Bengaluru,Karnataka, India',
    preferences: {
      notifications: true,
      newsletter: false,
      smsUpdates: true
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        preferences: {
          ...prevState.preferences,
          [name]: checked
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <i className="fas fa-user"></i>
        </div>
        <div className="profile-info">
          <h2>{formData.name}</h2>
          <p className="member-since">Member since March 2025</p>
        </div>
        <div className="profile-header-actions">
          <button
            className={`edit-button ${isEditing ? 'cancel' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className={`fas fa-${isEditing ? 'times' : 'edit'}`}></i>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button className="logout-button" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Preferences</h3>
            <div className="preferences-group">
              <div className="preference-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.preferences.notifications}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span>Email Notifications</span>
                </label>
                <p className="preference-description">
                  Receive updates about your pickup requests and account activity
                </p>
              </div>
              <div className="preference-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.preferences.newsletter}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span>Newsletter</span>
                </label>
                <p className="preference-description">
                  Get monthly updates about recycling tips and environmental news
                </p>
              </div>
              <div className="preference-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="smsUpdates"
                    checked={formData.preferences.smsUpdates}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span>SMS Updates</span>
                </label>
                <p className="preference-description">
                  Receive text messages about pickup status and important updates
                </p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="save-button">
                <i className="fas fa-save"></i>
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile; 