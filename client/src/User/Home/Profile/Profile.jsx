import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';

const Profile = ({ onLogout }) => {
  const fileInputRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState(() => {
    // Initialize from localStorage if available
    const savedPhoto = localStorage.getItem('userProfilePhoto');
    return savedPhoto || null;
  });
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);
  const [originalPhoto, setOriginalPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferences: {
      notifications: false,
      newsletter: false,
      smsUpdates: false
    }
  });

  useEffect(() => {
    if (isEditing) {
      setOriginalPhoto(profilePhoto);
    }
  }, [isEditing]);

  // Save photo to localStorage whenever it changes
  useEffect(() => {
    if (profilePhoto) {
      localStorage.setItem('userProfilePhoto', profilePhoto);
    } else {
      localStorage.removeItem('userProfilePhoto');
    }
  }, [profilePhoto]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTempPhoto(e.target.result);
          // TODO: Add API call to upload photo to server
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload an image file');
      }
    }
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setTempPhoto(null);
    // TODO: Add API call to remove photo from server
  };

  const handleSavePhoto = () => {
    setProfilePhoto(tempPhoto);
    setShowPhotoModal(false);
  };

  const handleCancelPhoto = () => {
    setTempPhoto(profilePhoto);
    setShowPhotoModal(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({...formData});
    setProfilePhoto(originalPhoto);
    setTempPhoto(originalPhoto);
  };

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
        <div 
          className={`profile-avatar ${isEditing ? 'editable' : ''}`} 
          onClick={isEditing ? () => setShowPhotoModal(true) : undefined}
        >
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="profile-photo" />
          ) : (
            <i className="fas fa-user"></i>
          )}
          {isEditing && (
            <div className="photo-upload-overlay">
              <i className="fas fa-camera"></i>
              <span>{profilePhoto ? 'Change Photo' : 'Add Photo'}</span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        <div className="profile-info">
          <h2>{formData.name}</h2>
          <p className="member-since">Member since March 2024</p>
        </div>
        <div className="profile-header-actions">
          <button
            className={`edit-button ${isEditing ? 'cancel' : ''}`}
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
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

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="modal-overlay" onClick={handleCancelPhoto}>
          <div className="modal-content photo-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Profile Photo</h3>
              <button className="close-button" onClick={handleCancelPhoto}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="photo-preview">
                {tempPhoto ? (
                  <img src={tempPhoto} alt="Profile" className="preview-photo" />
                ) : (
                  <div className="no-photo">
                    <i className="fas fa-user"></i>
                    <span>No Photo</span>
                  </div>
                )}
              </div>
              <div className="photo-actions">
                <button className="photo-action-btn change-photo" onClick={triggerFileInput}>
                  <i className="fas fa-camera"></i>
                  <span>{tempPhoto ? 'Change Photo' : 'Add Photo'}</span>
                </button>
                {tempPhoto && (
                  <button className="photo-action-btn remove-photo" onClick={handleRemovePhoto}>
                    <i className="fas fa-trash"></i>
                    <span>Remove Photo</span>
                  </button>
                )}
                <button className="photo-action-btn save-photo" onClick={handleSavePhoto}>
                  <i className="fas fa-save"></i>
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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