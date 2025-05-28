import React, { useState, useEffect, useCallback } from 'react';
import { usePickup } from '../../components/context/PickupContext';
import './RiderOrders.css';

const API_BASE_URL = 'http://localhost:5000';

const RiderOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('assigned');
  const [updateModal, setUpdateModal] = useState({ isOpen: false, pickup: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, pickup: null });
  
  const { 
    livePickups, 
    setCurrentPickup, 
    setShowNotificationModal,
    setOnOrderAcceptedCallback 
  } = usePickup();

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('riderToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/riders/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      const sortedOrders = data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setLoading(false);

      // If we just loaded orders and there are accepted ones, switch to assigned tab
      if (sortedOrders.some(order => order.status === 'accepted') && activeTab === 'live') {
        setActiveTab('assigned');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchOrders();
    
    // Set up the callback to refresh orders when a pickup is accepted
    setOnOrderAcceptedCallback(() => {
      fetchOrders();
      setActiveTab('assigned');
    });

    return () => {
      // Clean up the callback when component unmounts
      setOnOrderAcceptedCallback(null);
    };
  }, [fetchOrders, setOnOrderAcceptedCallback]);

  const handleUpdatePickup = async (pickupId, updates) => {
    try {
      const token = localStorage.getItem('riderToken');
      const response = await fetch(`${API_BASE_URL}/api/riders/update-pickup/${pickupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update pickup');
      }

      const updatedPickup = await response.json();
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          if (order._id === pickupId) {
            return { ...order, ...updatedPickup };
          }
          return order;
        });
      });

      setUpdateModal({ isOpen: false, pickup: null });
      
      // Show confirmation modal after update
      setConfirmModal({ 
        isOpen: true, 
        type: 'status', 
        pickup: { ...updatedPickup, _id: pickupId }
      });
    } catch (err) {
      console.error('Error updating pickup:', err);
      alert('Failed to update pickup: ' + err.message);
    }
  };

  const handleComplete = async (pickupId) => {
    try {
      const token = localStorage.getItem('riderToken');
      const response = await fetch(`${API_BASE_URL}/api/riders/complete-pickup/${pickupId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to complete pickup');
      }

      fetchOrders();
    } catch (err) {
      console.error('Error completing pickup:', err);
      alert('Failed to complete pickup: ' + err.message);
    }
  };

  const handleCancel = async (pickupId) => {
    try {
      const token = localStorage.getItem('riderToken');
      const response = await fetch(`${API_BASE_URL}/api/riders/cancel-pickup/${pickupId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel pickup');
      }

      fetchOrders();
    } catch (err) {
      console.error('Error cancelling pickup:', err);
      alert('Failed to cancel pickup: ' + err.message);
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

  if (loading) {
    return (
      <div className="loading-message">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading orders...</p>
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

  return (
    <div className="rider-orders">
      <div className="orders-header">
        <h2>My Orders</h2>
        <div className="order-tabs">
          <button
            className={`tab-button ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            Live Requests ({livePickups.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'assigned' ? 'active' : ''}`}
            onClick={() => setActiveTab('assigned')}
          >
            Assigned ({orders.filter(o => o.status === 'accepted').length})
          </button>
          <button
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({orders.filter(o => o.status === 'completed').length})
          </button>
          <button
            className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({orders.filter(o => o.status === 'cancelled').length})
          </button>
        </div>
      </div>

      <div className="orders-list">
        {activeTab === 'live' ? (
          livePickups.length > 0 ? (
            livePickups.map((pickup) => (
              <div key={pickup._id} className="order-card">
                <div className="order-header">
                  <div className="order-type">
                    <i className="fas fa-recycle"></i>
                    <span>{pickup.scrapType}</span>
                  </div>
                  <div className="order-status pending">
                    <i className="fas fa-clock"></i>
                    Pending
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <i className="fas fa-user"></i>
                    <span>Customer: {pickup.user.name}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{pickup.address}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>{new Date(pickup.preferredDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{pickup.preferredTime}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-weight"></i>
                    <span>Expected: {pickup.quantity}</span>
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    className="accept-btn"
                    onClick={() => {
                      setCurrentPickup(pickup);
                      setShowNotificationModal(true);
                    }}
                  >
                    <i className="fas fa-check"></i>
                    Accept Request
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders-message">
              <i className="fas fa-inbox"></i>
              <p>No live pickup requests available</p>
            </div>
          )
        ) : (
          orders
            .filter(order => {
              switch (activeTab) {
                case 'assigned':
                  return order.status === 'accepted';
                case 'completed':
                  return order.status === 'completed';
                case 'cancelled':
                  return order.status === 'cancelled';
                default:
                  return true;
              }
            })
            .map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-type">
                    <i className="fas fa-recycle"></i>
                    <span>{order.scrapType}</span>
                  </div>
                  <div className={`order-status ${order.status}`}>
                    <i className={order.status === 'accepted' ? 'fas fa-clock' : 
                               order.status === 'completed' ? 'fas fa-check-circle' : 
                               'fas fa-times-circle'}></i>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <i className="fas fa-user"></i>
                    <span>Customer: {order.user.name}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-phone"></i>
                    <span>{order.user.phone}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{order.address}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>{new Date(order.preferredDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{order.preferredTime}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-weight"></i>
                    <span>Expected: {order.quantity}</span>
                  </div>
                  {order.actualQuantity && (
                    <div className="detail-item actual-quantity">
                      <i className="fas fa-balance-scale"></i>
                      <span>Actual: {order.actualQuantity}</span>
                    </div>
                  )}
                </div>

                {order.notes && (
                  <div className="order-notes">
                    <i className="fas fa-sticky-note"></i>
                    <p>{order.notes}</p>
                  </div>
                )}

                {order.status === 'accepted' && (
                  <div className="order-actions">
                    <button
                      className="update-btn"
                      onClick={() => setUpdateModal({ isOpen: true, pickup: order })}
                    >
                      <i className="fas fa-edit"></i>
                      Update Details
                    </button>
                    <button
                      className="complete-btn"
                      onClick={() => setConfirmModal({ isOpen: true, type: 'complete', pickup: order })}
                    >
                      <i className="fas fa-check-circle"></i>
                      Complete Pickup
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setConfirmModal({ isOpen: true, type: 'cancel', pickup: order })}
                    >
                      <i className="fas fa-times-circle"></i>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
        )}
      </div>

      {updateModal.isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Pickup Details</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpdatePickup(updateModal.pickup._id, {
                actualQuantity: formData.get('actualQuantity'),
                notes: formData.get('notes')
              });
            }}>
              <div className="form-group">
                <label>Actual Quantity</label>
                <input
                  type="text"
                  name="actualQuantity"
                  defaultValue={updateModal.pickup.actualQuantity || ''}
                  placeholder="Enter actual quantity"
                  required
                />
              </div>
              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  defaultValue={updateModal.pickup.notes || ''}
                  placeholder="Add any additional notes"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setUpdateModal({ isOpen: false, pickup: null })}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {confirmModal.type === 'complete' ? 'Complete Pickup' : 'Cancel Pickup'}
            </h3>
            <p>
              {confirmModal.type === 'complete' 
                ? "Are you sure you want to mark this pickup as completed?"
                : "Are you sure you want to cancel this pickup?"}
            </p>
            <div className="modal-actions">
              <button 
                className={confirmModal.type === 'complete' ? 'complete-btn' : 'cancel-btn'}
                onClick={() => confirmModal.type === 'complete' 
                  ? handleComplete(confirmModal.pickup._id)
                  : handleCancel(confirmModal.pickup._id)}
              >
                <i className={`fas fa-${confirmModal.type === 'complete' ? 'check' : 'times'}-circle`}></i>
                {confirmModal.type === 'complete' ? 'Yes, Complete' : 'Yes, Cancel'}
              </button>
              <button 
                className="update-btn"
                onClick={() => setConfirmModal({ isOpen: false, type: null, pickup: null })}
              >
                No, Keep as Assigned
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderOrders; 