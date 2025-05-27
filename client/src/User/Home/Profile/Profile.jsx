import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size should be less than 5MB');
        return;
      }

      setIsImageLoading(true);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setIsImageLoading(false);
      };
      
      reader.onerror = () => {
        setImageError('Error reading the image file');
        setIsImageLoading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setShowRemoveConfirm(true);
  };

  const confirmRemoveImage = () => {
    setProfileImage(null);
    setImageError('');
    setShowRemoveConfirm(false);
  };

  const cancelRemoveImage = () => {
    setShowRemoveConfirm(false);
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
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {isImageLoading ? (
              <div className="image-loading">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-image" />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
          
          {isEditing && (
            <div className="profile-image-controls">
              <label htmlFor="profile-image-upload" className="image-control-button upload-button">
                <i className="fas fa-camera"></i>
                <span>{profileImage ? 'Change Photo' : 'Add Photo'}</span>
              </label>
              {profileImage && (
                <button 
                  className="image-control-button remove-button"
                  onClick={handleRemoveImage}
                  title="Remove profile picture"
                >
                  <i className="fas fa-trash"></i>
                  <span>Remove</span>
                </button>
              )}
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          )}
          {imageError && <div className="image-error">{imageError}</div>}
        </div>

        {showRemoveConfirm && (
          <div className="remove-confirm-dialog">
            <div className="remove-confirm-content">
              <h3>Remove Profile Picture?</h3>
              <p>Are you sure you want to remove your profile picture?</p>
              <div className="remove-confirm-actions">
                <button 
                  className="confirm-remove-button"
                  onClick={confirmRemoveImage}
                >
                  Yes, Remove
                </button>
                <button 
                  className="cancel-remove-button"
                  onClick={cancelRemoveImage}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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