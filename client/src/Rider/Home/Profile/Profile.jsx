import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const API_BASE_URL = 'https://eco-saathi-2.onrender.com';

const Profile = () => {
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Apply theme on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    totalPickups: 0,
    rating: 0,
    joinedDate: '',
    isAvailable: false,
    ratingDetails: {
      totalRatings: 0,
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
      recentReviews: []
    },
    pickupHistory: {
      total: 0,
      completed: 0,
      cancelled: 0,
      inProgress: 0,
      recentPickups: []
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({...profileData});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);

  useEffect(() => {
    if (showRatingModal || showPickupModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showRatingModal, showPickupModal]);

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('riderToken');
      if (!token) {
        navigate('/rider/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/riders/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfileData({
        ...profileData,
        name: data.name,
        email: data.email,
        phone: data.phone,
        vehicleType: data.vehicleType,
        vehicleNumber: data.vehicleNumber,
        totalPickups: data.totalPickups,
        completedPickups: data.completedPickups,
        rating: data.rating,
        isAvailable: data.isAvailable,
        joinedDate: new Date(data.joinedDate).toLocaleDateString(),
        rewardPoints: data.rewardPoints
      });
      setEditedData({
        ...profileData,
        name: data.name,
        email: data.email,
        phone: data.phone,
        vehicleType: data.vehicleType,
        vehicleNumber: data.vehicleNumber
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('riderToken');
      const response = await fetch(`${API_BASE_URL}/api/riders/profile`, {
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
      setProfileData(prevState => ({
        ...prevState,
        ...data
      }));
      setIsEditing(false);
      setError('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('riderToken');
    localStorage.removeItem('rider');
    navigate('/rider/login');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i 
        key={index} 
        className={`fas fa-star ${index < rating ? 'filled' : ''}`}
      ></i>
    ));
  };

  const renderRatingBar = (stars, count, total) => {
    const percentage = (count / total) * 100;
    return (
      <div className="rating-bar-container">
        <span className="star-label">{stars} Stars</span>
        <div className="rating-bar">
          <div className="rating-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="rating-count">{count}</span>
      </div>
    );
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'in progress':
        return 'in-progress';
      case 'cancelled':
        return 'cancelled';
      default:
        return '';
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  return (
    <div className="profile-section">
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          Loading...
        </div>
      ) : (
        <>
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="profile-info">
              <h2>{profileData.name}</h2>
              <p className="member-since">Member since {profileData.joinedDate}</p>
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
                className="edit-button logout"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>

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

                <div className="form-section">
                  <h3>Vehicle Information</h3>
                  <div className="form-group">
                    <label htmlFor="vehicleNumber">Vehicle Number</label>
                    <input
                      type="text"
                      id="vehicleNumber"
                      name="vehicleNumber"
                      value={editedData.vehicleNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vehicleType">Vehicle Type</label>
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      value={editedData.vehicleType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select vehicle type</option>
                      <option value="mini_truck">Mini Truck</option>
                      <option value="pickup_van">Pickup Van</option>
                      <option value="e_rickshaw">E-Rickshaw</option>
                      <option value="cargo_bike">Cargo Bike</option>
                    </select>
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
                      <span className="value">{profileData.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Phone</span>
                      <span className="value">{profileData.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Vehicle Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Vehicle Number</span>
                      <span className="value">{profileData.vehicleNumber}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Vehicle Type</span>
                      <span className="value">{profileData.vehicleType}</span>
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
                      <span className="stat-value">{profileData.completedPickups}</span>
                      <span className="stat-label">Completed Pickups</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-value">{profileData.rating.toFixed(1)}</span>
                      <span className="stat-label">Rating</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-value">{profileData.rewardPoints}</span>
                      <span className="stat-label">Reward Points</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rating Details</h3>
              <button className="close-button" onClick={() => setShowRatingModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="rating-summary">
                <div className="overall-rating">
                  <h4>Overall Rating</h4>
                  <div className="rating-stars">
                    {renderStars(Math.round(profileData.rating))}
                  </div>
                  <span className="rating-value">{profileData.rating}</span>
                  <span className="rating-count">({profileData.ratingDetails.totalRatings} ratings)</span>
                </div>
                <div className="rating-breakdown">
                  {renderRatingBar(5, profileData.ratingDetails.fiveStar, profileData.ratingDetails.totalRatings)}
                  {renderRatingBar(4, profileData.ratingDetails.fourStar, profileData.ratingDetails.totalRatings)}
                  {renderRatingBar(3, profileData.ratingDetails.threeStar, profileData.ratingDetails.totalRatings)}
                  {renderRatingBar(2, profileData.ratingDetails.twoStar, profileData.ratingDetails.totalRatings)}
                  {renderRatingBar(1, profileData.ratingDetails.oneStar, profileData.ratingDetails.totalRatings)}
                </div>
              </div>
              <div className="recent-reviews">
                <h4>Recent Reviews</h4>
                {profileData.ratingDetails.recentReviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <span className="review-customer">- {review.customer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pickup History Modal */}
      {showPickupModal && (
        <div className="modal-overlay" onClick={() => setShowPickupModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Pickup History</h3>
              <button className="close-button" onClick={() => setShowPickupModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="pickup-summary">
                <div className="summary-grid">
                  <div className="summary-card">
                    <span className="summary-value">{profileData.pickupHistory.completed}</span>
                    <span className="summary-label">Completed</span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-value">{profileData.pickupHistory.inProgress}</span>
                    <span className="summary-label">In Progress</span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-value">{profileData.pickupHistory.cancelled}</span>
                    <span className="summary-label">Cancelled</span>
                  </div>
                </div>
              </div>
              <div className="recent-pickups">
                <h4>Recent Pickups</h4>
                <div className="pickup-list">
                  {profileData.pickupHistory.recentPickups.map(pickup => (
                    <div key={pickup.id} className="pickup-card">
                      <div className="pickup-header">
                        <span className="pickup-id">#{pickup.id}</span>
                        <span className={`pickup-status ${getStatusClass(pickup.status)}`}>
                          {pickup.status}
                        </span>
                      </div>
                      <div className="pickup-details">
                        <div className="pickup-info">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{pickup.address}</span>
                        </div>
                        <div className="pickup-info">
                          <i className="fas fa-calendar"></i>
                          <span>{pickup.date}</span>
                        </div>
                        <div className="pickup-info">
                          <i className="fas fa-clock"></i>
                          <span>{pickup.time}</span>
                        </div>
                      </div>
                      {pickup.amount && (
                        <div className="pickup-amount">
                          <span>Amount: ₹{pickup.amount}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;