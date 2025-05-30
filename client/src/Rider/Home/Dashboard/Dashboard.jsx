import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePickup } from '../../../components/context/PickupContext';
import './Dashboard.css';

const API_BASE_URL = 'https://eco-saathi-2.onrender.com';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    todayEarnings: 0.00,
    pendingPickups: 0,
    completedToday: 0,
    totalEarnings: 0.00,
    totalPickups: 0,
    completedPickups: 0,
    rewardPoints: 0,
    recentOrders: []
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completionData, setCompletionData] = useState({
    actualQuantity: '',
    notes: ''
  });

  const { 
    livePickups,
    setIsAvailable: setPickupAvailable,
    currentPickup,
    showNotificationModal,
    setShowNotificationModal,
    handleAcceptPickup,
    handleDeclinePickup,
    handleCompletePickup,
    isLoading: isPickupLoading,
    error: pickupError,
    showCompletionModal,
    setShowCompletionModal,
    selectedPickup,
    setSelectedPickup
  } = usePickup();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('riderToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleAuthError = () => {
    localStorage.removeItem('riderToken');
    navigate('/login');
  };

  const handleAvailabilityToggle = () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    setPickupAvailable(newAvailability);
  };

  const handleCompleteClick = (order) => {
    // Make sure we have the pickup data
    if (!order.pickup) {
      setError('Pickup data not found');
      return;
    }
    
    setSelectedPickup(order);
    setCompletionData({
      actualQuantity: '',
      notes: ''
    });
    setShowCompletionModal(true);
  };

  const handleCompletionSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if pickup is already completed
      if (selectedPickup.pickup.status === 'completed') {
        setError('This pickup has already been completed');
        return;
      }

      // Validate actual quantity is a number
      const actualQuantity = parseFloat(completionData.actualQuantity);
      if (isNaN(actualQuantity) || actualQuantity <= 0) {
        setError('Please enter a valid number for actual quantity');
        return;
      }

      await handleCompletePickup(selectedPickup, {
        ...completionData,
        actualQuantity: actualQuantity
      });
      // Refresh dashboard data after completion
      fetchDashboardData();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCompletionData(prev => ({
        ...prev,
        actualQuantity: value
      }));
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('riderToken');
      if (!token) {
        handleAuthError();
        return;
      }

      // First try to fetch orders
      const ordersResponse = await fetch(`${API_BASE_URL}/api/riders/orders`, {
        headers: getAuthHeaders()
      });

      if (ordersResponse.status === 401) {
        handleAuthError();
        return;
      }

      if (!ordersResponse.ok) {
        const errorData = await ordersResponse.json().catch(() => ({ message: 'Failed to fetch orders' }));
        throw new Error(errorData.message);
      }

      const orders = await ordersResponse.json();
      setDashboardData(prev => ({
        ...prev,
        recentOrders: orders
      }));

      // Then try to fetch statistics
      try {
        const statsResponse = await fetch(`${API_BASE_URL}/api/riders/statistics`, {
          headers: getAuthHeaders()
        });

        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setDashboardData(prev => ({
            ...prev,
            totalPickups: stats.totalPickups || 0,
            completedPickups: stats.completedPickups || 0,
            pendingPickups: stats.pendingPickups || 0,
            rewardPoints: stats.rewardPoints || 0,
            todayEarnings: stats.todayEarnings || 0,
            completedToday: stats.completedToday || 0,
            totalEarnings: stats.totalEarnings || 0
          }));
        } else {
          console.error('Failed to fetch statistics:', statsResponse.status);
        }
      } catch (statsError) {
        console.error('Error fetching statistics:', statsError);
        // Don't throw here, we still want to show orders even if stats fail
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="dashboard-content">
      {/* Notification Modal */}
      {showNotificationModal && currentPickup && (
        <div className="notification-modal-overlay">
          <div className="notification-modal">
            <div className="notification-header">
              <h3>🚨 New Pickup Request</h3>
            </div>
            <div className="notification-body">
              <div className="pickup-details">
                <p><strong>Scrap Type:</strong> {currentPickup.scrapType}</p>
                <p><strong>Quantity:</strong> {currentPickup.quantity}</p>
                <p><strong>Address:</strong> {currentPickup.address}</p>
                <p><strong>Preferred Date:</strong> {new Date(currentPickup.preferredDate).toLocaleDateString()}</p>
                <p><strong>Preferred Time:</strong> {currentPickup.preferredTime}</p>
                {currentPickup.notes && (
                  <p><strong>Notes:</strong> {currentPickup.notes}</p>
                )}
              </div>
              {(error || pickupError) && (
                <div className="error-message">
                  {error || pickupError}
                </div>
              )}
              <div className="notification-actions">
                <button 
                  className="decline-btn" 
                  onClick={handleDeclinePickup}
                  disabled={isPickupLoading}
                >
                  {isPickupLoading ? 'Declining...' : 'Decline'}
                </button>
                <button 
                  className="accept-btn" 
                  onClick={handleAcceptPickup}
                  disabled={isPickupLoading}
                >
                  {isPickupLoading ? 'Accepting...' : 'Accept'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && selectedPickup && selectedPickup.pickup && (
        <div className="notification-modal-overlay">
          <div className="notification-modal">
            <div className="notification-header">
              <h3>✅ Complete Pickup</h3>
            </div>
            <div className="notification-body">
              <form onSubmit={handleCompletionSubmit}>
                <div className="pickup-details">
                  <p><strong>Scrap Type:</strong> {selectedPickup.pickup.scrapType}</p>
                  <p><strong>Expected Quantity:</strong> {selectedPickup.pickup.quantity}</p>
                  <div className="form-group">
                    <label htmlFor="actualQuantity">Actual Quantity (kg):</label>
                    <input
                      type="text"
                      id="actualQuantity"
                      value={completionData.actualQuantity}
                      onChange={handleQuantityChange}
                      placeholder="Enter weight in kg"
                      pattern="\d*\.?\d*"
                      title="Please enter a valid number"
                      required
                    />
                    <small className="form-help">Enter the actual weight in kilograms (e.g., 5.5)</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes">Additional Notes:</label>
                    <textarea
                      id="notes"
                      value={completionData.notes}
                      onChange={(e) => setCompletionData(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                      rows={3}
                    />
                  </div>
                </div>
                {(error || pickupError) && (
                  <div className="error-message">
                    {error || pickupError}
                  </div>
                )}
                <div className="notification-actions">
                  <button 
                    type="button"
                    className="decline-btn" 
                    onClick={() => setShowCompletionModal(false)}
                    disabled={isPickupLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="accept-btn"
                    disabled={isPickupLoading || selectedPickup.pickup.status === 'completed'}
                  >
                    {isPickupLoading ? 'Completing...' : 'Complete Pickup'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 Availability */}
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

      {/* 🔴 Real-Time Pickup Requests */}
      {livePickups.length > 0 && (
        <div className="live-pickups">
          <h2>🚨 New Pickup Requests</h2>
          <ul>
            {livePickups.map((pickup) => (
              <li key={pickup._id} className="pickup-alert">
                <strong>{pickup.scrapType}</strong> - {pickup.quantity}<br />
                <em>{pickup.address}</em><br />
                {new Date(pickup.preferredDate).toLocaleDateString()} @ {pickup.preferredTime}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔢 Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Pickups</h3>
            <p className="stat-value">{dashboardData.totalPickups}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Requests</h3>
            <p className="stat-value">{dashboardData.pendingPickups}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-value">{dashboardData.completedPickups}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Reward Points</h3>
            <p className="stat-value">{dashboardData.rewardPoints}</p>
          </div>
        </div>
      </div>

      {/* 🔢 Earnings Metrics */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-rupee-sign"></i></div>
          <div className="card-content">
            <h3>Today's Earnings</h3>
            <p className="amount">₹{dashboardData.todayEarnings.toFixed(2)}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-clock"></i></div>
          <div className="card-content">
            <h3>Completed Today</h3>
            <p className="count">{dashboardData.completedToday}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-icon"><i className="fas fa-wallet"></i></div>
          <div className="card-content">
            <h3>Total Earnings</h3>
            <p className="amount">₹{dashboardData.totalEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* 📦 Recent Orders */}
      <div className="recent-orders">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button className="view-all-button">
            View All <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        <div className="orders-list">
          {dashboardData.recentOrders.length > 0 ? (
            dashboardData.recentOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-info">
                  <h3>Order #{order._id}</h3>
                  <p className="order-address">{order.address}</p>
                  <p className="order-time">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                  <p className="order-amount">₹{order.amount ? order.amount.toFixed(2) : '0.00'}</p>
                  {order.status === 'accepted' && (
                    <button 
                      className="complete-btn"
                      onClick={() => handleCompleteClick(order)}
                    >
                      Complete Pickup
                    </button>
                  )}
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
    </div>
  );
};

export default Dashboard;
