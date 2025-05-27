import React from 'react';
import './Dashboard.css';

const Dashboard = ({ setActiveTab }) => {
  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, User!</h2>
        <p>Request a scrap pickup or manage your account</p>
      </div>

      <div className="quick-actions">
        <button className="action-button primary" onClick={() => setActiveTab('request')}>
          <i className="fas fa-truck"></i>
          Request Pickup
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Pickups</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Pending Requests</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Reward Points</h3>
          <p className="stat-value">0</p>
        </div>
      </div>

      <div className="about-section">
        <div className="about-header">
          <h2>About EasyScrap</h2>
          <p className="mission-statement">Making waste management easy, efficient, and environmentally friendly.</p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon">
              <i className="fas fa-leaf"></i>
            </div>
            <h3>Our Mission</h3>
            <p>To create a sustainable ecosystem where waste is properly managed, recycled, and transformed into valuable resources. We aim to make waste management accessible to everyone while contributing to a cleaner environment.</p>
          </div>

          <div className="about-card">
            <div className="about-icon">
              <i className="fas fa-handshake"></i>
            </div>
            <h3>How It Works</h3>
            <p>Simply request a pickup through our platform, and our verified riders will collect your scrap at your preferred time. We ensure proper segregation, recycling, and disposal of all collected materials.</p>
          </div>

          <div className="about-card">
            <div className="about-icon">
              <i className="fas fa-award"></i>
            </div>
            <h3>Benefits</h3>
            <ul className="benefits-list">
              <li>Convenient doorstep pickup</li>
              <li>Fair pricing for your scrap</li>
              <li>Reward points for regular pickups</li>
              <li>Environmentally responsible disposal</li>
              <li>Support local recycling initiatives</li>
            </ul>
          </div>
        </div>

        <div className="about-card impact-card">
          <div className="about-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3>Our Impact</h3>
          <div className="impact-stats">
            <div className="impact-stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Tons Recycled</span>
            </div>
            <div className="impact-stat">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Happy Users</span>
            </div>
            <div className="impact-stat">
              <span className="stat-number">100+</span>
              <span className="stat-label">Active Riders</span>
            </div>
          </div>
        </div>

        <div className="eco-commitment">
          <h3>Our Environmental Commitment</h3>
          <div className="commitment-grid">
            <div className="commitment-item">
              <i className="fas fa-recycle"></i>
              <h4>Proper Recycling</h4>
              <p>We ensure all collected materials are properly recycled through authorized recycling centers.</p>
            </div>
            <div className="commitment-item">
              <i className="fas fa-tree"></i>
              <h4>Carbon Footprint</h4>
              <p>Our efficient routing system minimizes carbon emissions during collection.</p>
            </div>
            <div className="commitment-item">
              <i className="fas fa-users"></i>
              <h4>Community Impact</h4>
              <p>Creating employment opportunities while promoting environmental awareness.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 