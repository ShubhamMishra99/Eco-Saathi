import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './History.css';

const API_BASE_URL = 'http://localhost:5000';
const socket = io(API_BASE_URL);

const History = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPickups();

    // Listen for pickup status updates
    socket.on('pickup-status-update', handleStatusUpdate);

    // Cleanup socket listener
    return () => {
      socket.off('pickup-status-update');
    };
  }, []);

  const handleStatusUpdate = (update) => {
    setPickups(prevPickups => {
      return prevPickups.map(pickup => {
        if (pickup._id === update.pickupId) {
          return {
            ...pickup,
            status: update.status,
            rider: update.rider
          };
        }
        return pickup;
      });
    });

    // Show notification for status change
    const statusMessages = {
      accepted: 'Your pickup request has been accepted by a rider!',
      completed: 'Your pickup has been completed.',
      declined: 'Your pickup request was declined.',
      cancelled: 'Your pickup request has been cancelled.'
    };

    if (statusMessages[update.status]) {
      // You can implement a toast notification here
      console.log(statusMessages[update.status]);
    }
  };

  const fetchPickups = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/users/pickups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pickups');
      }

      const data = await response.json();
      // Sort pickups by date, most recent first
      const sortedPickups = data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPickups(sortedPickups);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pickups:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock';
      case 'accepted':
        return 'fas fa-check-circle';
      case 'completed':
        return 'fas fa-check-double';
      case 'cancelled':
        return 'fas fa-times-circle';
      case 'declined':
        return 'fas fa-ban';
      default:
        return 'fas fa-question-circle';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  const filteredPickups = pickups.filter(pickup => {
    const matchesFilter = filter === 'all' || pickup.status === filter;
    const matchesSearch = searchQuery === '' || 
      pickup.scrapType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pickup.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pickup.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading-message">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading your pickup history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  if (pickups.length === 0) {
    return (
      <div className="no-history">
        <i className="fas fa-inbox"></i>
        <p>No pickup requests found</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Pickup History</h2>
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search pickups..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="history-tabs">
        <button 
          className={`tab-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`tab-button ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`tab-button ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </button>
        <button 
          className={`tab-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={`tab-button ${filter === 'declined' ? 'active' : ''}`}
          onClick={() => setFilter('declined')}
        >
          Declined
        </button>
      </div>

      <div className="history-list">
        {filteredPickups.map((pickup) => (
          <div key={pickup._id} className="history-item">
            <div className="history-item-header">
              <div className="pickup-type">
                <i className="fas fa-recycle"></i>
                {pickup.scrapType}
              </div>
              <div className={`status-badge ${pickup.status}`}>
                <i className={getStatusIcon(pickup.status)}></i>
                {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
              </div>
            </div>

            <div className="history-item-details">
              <div className="detail-group">
                <i className="fas fa-map-marker-alt"></i>
                <span>{pickup.address}</span>
              </div>
              <div className="detail-group">
                <i className="fas fa-calendar"></i>
                <span>{new Date(pickup.preferredDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-group">
                <i className="fas fa-clock"></i>
                <span>{pickup.preferredTime}</span>
              </div>
              <div className="detail-group">
                <i className="fas fa-weight"></i>
                <span>{pickup.quantity}</span>
              </div>
              {pickup.rider && (
                <div className="detail-group rider-info">
                  <i className="fas fa-user"></i>
                  <span>Rider: {pickup.rider.name} ({pickup.rider.phone})</span>
                </div>
              )}
              <div className="detail-group">
                <i className="fas fa-history"></i>
                <span>Created {getTimeAgo(pickup.createdAt)}</span>
              </div>
            </div>

            {pickup.notes && (
              <div className="pickup-notes">
                <i className="fas fa-sticky-note"></i>
                <p>{pickup.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History; 