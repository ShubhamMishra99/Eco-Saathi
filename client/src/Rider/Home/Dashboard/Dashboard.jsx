import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    todayEarnings: 0.00,
    pendingPickups: 0,
    completedToday: 0,
    totalEarnings: 0.00,
    recentOrders: []
  });

  const handleAvailabilityToggle = () => {
    setIsAvailable(!isAvailable);
    // TODO: Add API call to update rider availability
  };

  return (
    <div className="dashboard-content">
      <div className="status-card">
        <h2>Current Status</h2>
        <div className="status-content">
          <div className="status-item">
            <span className="status-label">Available for Pickup</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isAvailable}
                onChange={handleAvailabilityToggle}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">
            <i className="fas fa-rupee-sign"></i>
          </div>
          <div className="card-content">
            <h3>Today's Earnings</h3>
            <p className="amount">₹{dashboardData.todayEarnings.toFixed(2)}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="card-content">
            <h3>Pending Pickups</h3>
            <p className="count">{dashboardData.pendingPickups}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="card-content">
            <h3>Completed Today</h3>
            <p className="count">{dashboardData.completedToday}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="card-content">
            <h3>Total Earnings</h3>
            <p className="amount">₹{dashboardData.totalEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button className="view-all-button">
            View All
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        <div className="orders-list">
          {dashboardData.recentOrders.length > 0 ? (
            dashboardData.recentOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-address">{order.address}</p>
                  <p className="order-time">{order.time}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <p className="order-amount">₹{order.amount.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">
              <i className="fas fa-box-open"></i>
              <p>No recent orders</p>
            </div>
          )}
        </div>
      </div>

      <div className="about-section" id="about-section">
        <div className="about-header">
          <h2>About EasyScrap</h2>
          <p>Your trusted partner in sustainable waste management</p>
        </div>

        <div className="about-content">
          <div className="about-card">
            <div className="section-icon">
              <i className="fas fa-recycle"></i>
            </div>
            <h3>Our Mission</h3>
            <p>
              At EasyScrap, we're committed to making waste management simple, efficient, and environmentally friendly. 
              We connect scrap collectors with customers, ensuring proper recycling and disposal of materials.
            </p>
          </div>

          <div className="about-card">
            <div className="section-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h3>For Riders</h3>
            <p>
              As a rider, you play a crucial role in our mission. You help collect and transport recyclable materials, 
              ensuring they reach the right processing facilities. We provide you with the tools and support needed 
              to manage your pickups efficiently.
            </p>
          </div>

          <div className="about-card">
            <div className="section-icon">
              <i className="fas fa-handshake"></i>
            </div>
            <h3>Our Commitment</h3>
            <p>
              We're dedicated to providing a reliable and transparent service. Our platform ensures fair compensation 
              for riders and convenient service for customers, all while promoting environmental sustainability.
            </p>
          </div>

          <div className="about-card">
            <div className="section-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Safety & Quality</h3>
            <p>
              Your safety is our priority. We maintain strict quality standards and provide necessary training to ensure 
              safe handling of materials. Our platform includes features for tracking and managing pickups securely.
            </p>
          </div>
        </div>

        <div className="about-stats">
          <div className="stat-item">
            <i className="fas fa-users"></i>
            <div className="stat-info">
              <h4>Active Riders</h4>
              <p>500+</p>
            </div>
          </div>
          <div className="stat-item">
            <i className="fas fa-map-marker-alt"></i>
            <div className="stat-info">
              <h4>Cities Covered</h4>
              <p>25+</p>
            </div>
          </div>
          <div className="stat-item">
            <i className="fas fa-truck-loading"></i>
            <div className="stat-info">
              <h4>Daily Pickups</h4>
              <p>1000+</p>
            </div>
          </div>
          <div className="stat-item">
            <i className="fas fa-leaf"></i>
            <div className="stat-info">
              <h4>Tons Recycled</h4>
              <p>5000+</p>
            </div>
          </div>
        </div>

        <div className="about-contact">
          <h3>Need Help?</h3>
          <p>Our support team is available 24/7 to assist you with any questions or concerns.</p>
          <button className="contact-button">
            <i className="fas fa-headset"></i>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 