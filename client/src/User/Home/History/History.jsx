import React, { useState } from 'react';
import './History.css';

const History = () => {
  const [filter, setFilter] = useState('all');
  const [pickups, setPickups] = useState({
    active: [],
    completed: []
  });

  const renderPickupItem = (pickup) => (
    <div className="history-item" key={pickup.id}>
      <div className="history-item-header">
        <div className="pickup-type">
          <i className="fas fa-truck"></i>
          {pickup.type}
        </div>
        <div className={`status-badge ${pickup.status}`}>
          {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
        </div>
      </div>
      <div className="history-item-details">
        <div className="detail-group">
          <i className="fas fa-calendar"></i>
          <span>{pickup.date}</span>
        </div>
        <div className="detail-group">
          <i className="fas fa-clock"></i>
          <span>{pickup.time}</span>
        </div>
        <div className="detail-group">
          <i className="fas fa-map-marker-alt"></i>
          <span>{pickup.address}</span>
        </div>
        <div className="detail-group">
          <i className="fas fa-weight-hanging"></i>
          <span>{pickup.weight}</span>
        </div>
        <div className="detail-group">
          <i className="fas fa-user"></i>
          <span>{pickup.rider}</span>
        </div>
        {pickup.status === 'pending' ? (
          <div className="detail-group">
            <i className="fas fa-hourglass-half"></i>
            <span>ETA: {pickup.eta}</span>
          </div>
        ) : (
          <div className="detail-group">
            <i className="fas fa-check-circle"></i>
            <span>Completed at: {pickup.completedAt}</span>
          </div>
        )}
      </div>
      <div className="points-earned">
        <i className="fas fa-star"></i>
        <span>Earned {pickup.points} points</span>
      </div>
    </div>
  );

  const getFilteredPickups = () => {
    switch (filter) {
      case 'active':
        return pickups.active;
      case 'completed':
        return pickups.completed;
      default:
        return [...pickups.active, ...pickups.completed];
    }
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Pickup History</h2>
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search pickups..." />
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
          className={`tab-button ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`tab-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="history-list">
        {getFilteredPickups().length > 0 ? (
          getFilteredPickups().map(renderPickupItem)
        ) : (
          <p className="no-history">No pickups available</p>
        )}
      </div>
    </div>
  );
};

export default History; 