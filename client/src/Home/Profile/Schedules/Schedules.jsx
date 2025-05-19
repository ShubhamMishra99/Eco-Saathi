import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Schedules.css';

const Schedules = () => {
  const [pickups, setPickups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    // Load pickups from localStorage
    const storedPickups = JSON.parse(localStorage.getItem('pickups')) || [];
    setPickups(storedPickups);
  }, [navigate]);

  const getStatusColor = (status) => ({
    pending: '#ffa500',
    completed: '#4CAF50',
    cancelled: '#f44336'
  }[status.toLowerCase()] || '#666');

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = (pickupId) => {
    // Find the pickup to edit
    const pickupToEdit = pickups.find(pickup => pickup.id === pickupId);
    if (!pickupToEdit) return;

    // Navigate to pickup schedule page with edit mode
    navigate('/pickup-schedule', { 
      state: { 
        mode: 'edit',
        pickupData: pickupToEdit
      }
    });
  };

  const handleCancel = (pickupId) => {
    if (window.confirm('Are you sure you want to cancel this pickup?')) {
      // Get existing pickups
      const existingPickups = JSON.parse(localStorage.getItem('pickups') || '[]');
      
      // Find the pickup to cancel
      const pickupToCancel = existingPickups.find(pickup => pickup.id === pickupId);
      if (!pickupToCancel) return;

      // Remove the cancelled pickup from the active pickups list
      const updatedPickups = existingPickups.filter(pickup => pickup.id !== pickupId);
      
      // Save to localStorage
      localStorage.setItem('pickups', JSON.stringify(updatedPickups));
      
      // Update state
      setPickups(updatedPickups);

      // Save to history
      const historyRecord = {
        id: Date.now(),
        pickupId: pickupToCancel.id,
        ...pickupToCancel,
        status: 'Cancelled',
        timestamp: new Date().toISOString(),
        changedBy: 'User'
      };

      const existingHistory = JSON.parse(localStorage.getItem('pickupHistory') || '[]');
      localStorage.setItem('pickupHistory', JSON.stringify([...existingHistory, historyRecord]));
      
      alert('Pickup cancelled successfully');
    }
  };

  const handleComplete = (pickupId) => {
    if (window.confirm('Are you sure you want to mark this pickup as completed?')) {
      // Get existing pickups
      const existingPickups = JSON.parse(localStorage.getItem('pickups') || '[]');
      
      // Find the pickup to complete
      const pickupToComplete = existingPickups.find(pickup => pickup.id === pickupId);
      if (!pickupToComplete) return;

      // Calculate points based on weight (100 points per kg)
      const weightRange = pickupToComplete.weight;
      let pointsEarned = 0;
      
      // Extract the maximum weight from the range
      if (weightRange === '0-5kg') {
        pointsEarned = 5 * 100; // 500 points for 0-5kg
      } else if (weightRange === '5-10kg') {
        pointsEarned = 10 * 100; // 1000 points for 5-10kg
      } else if (weightRange === '10+kg') {
        pointsEarned = 15 * 100; // 1500 points for 10+kg
      }

      // Update user points
      const currentPoints = parseInt(localStorage.getItem('userPoints')) || 0;
      const newPoints = currentPoints + pointsEarned;
      localStorage.setItem('userPoints', newPoints.toString());

      // Add to reward history
      const rewardRecord = {
        id: Date.now(),
        date: pickupToComplete.date,
        weight: pickupToComplete.weight,
        points: pointsEarned,
        timestamp: new Date().toISOString()
      };

      const existingRewardHistory = JSON.parse(localStorage.getItem('rewardHistory') || '[]');
      localStorage.setItem('rewardHistory', JSON.stringify([...existingRewardHistory, rewardRecord]));

      // Remove the completed pickup from the active pickups list
      const updatedPickups = existingPickups.filter(pickup => pickup.id !== pickupId);
      
      // Save to localStorage
      localStorage.setItem('pickups', JSON.stringify(updatedPickups));
      
      // Update state
      setPickups(updatedPickups);

      // Save to history
      const historyRecord = {
        id: Date.now(),
        pickupId: pickupToComplete.id,
        ...pickupToComplete,
        status: 'Completed',
        timestamp: new Date().toISOString(),
        changedBy: 'User'
      };

      const existingHistory = JSON.parse(localStorage.getItem('pickupHistory') || '[]');
      localStorage.setItem('pickupHistory', JSON.stringify([...existingHistory, historyRecord]));
      
      alert(`Pickup marked as completed! You earned ${pointsEarned} points!`);
    }
  };

  const handleViewReceipt = (pickupId) => {
    // TODO: Implement view receipt functionality
    console.log('View receipt for pickup:', pickupId);
  };

  return (
    <div className="schedules-page">
      <div className="schedules-header">
        <h1>My Pickup Schedules</h1>
        <p className="total-schedules">Total Schedules: {pickups.length}</p>
      </div>

      {pickups.length === 0 ? (
        <div className="no-schedules">
          <p>No pickup schedules found.</p>
          <p className="schedule-tip">Schedule your first pickup to see it here!</p>
        </div>
      ) : (
        <div className="schedules-grid">
          {pickups.map((pickup) => (
            <div key={pickup.id} className="schedule-card">
              <div className="schedule-header">
                <h3>Pickup #{pickup.id}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(pickup.status) }}
                >
                  {pickup.status}
                </span>
              </div>
              
              <div className="schedule-details">
                <div className="detail-row">
                  <i className="fa fa-calendar"></i>
                  <span>{formatDate(pickup.date)}</span>
                </div>
                <div className="detail-row">
                  <i className="fa fa-clock"></i>
                  <span>{pickup.time}</span>
                </div>
                <div className="detail-row">
                  <i className="fa fa-map-marker"></i>
                  <span>{pickup.address}</span>
                </div>
                <div className="detail-row">
                  <i className="fa fa-cube"></i>
                  <span>{pickup.weight} kg</span>
                </div>
                <div className="detail-row">
                  <i className="fa fa-tag"></i>
                  <span>{pickup.type || 'General Waste'}</span>
                </div>
                {pickup.remarks && (
                  <div className="detail-row">
                    <i className="fa fa-comment"></i>
                    <span>{pickup.remarks}</span>
                  </div>
                )}
                {pickup.pickupPerson && (
                  <div className="detail-row">
                    <i className="fa fa-user"></i>
                    <span>Assigned to: {pickup.pickupPerson}</span>
                  </div>
                )}
                {pickup.contactNumber && (
                  <div className="detail-row">
                    <i className="fa fa-phone"></i>
                    <span>Contact: {pickup.contactNumber}</span>
                  </div>
                )}
                {pickup.estimatedValue && (
                  <div className="detail-row">
                    <i className="fa fa-money"></i>
                    <span>Estimated Value: ₹{pickup.estimatedValue}</span>
                  </div>
                )}
              </div>

              <div className="schedule-actions">
                {pickup.status.toLowerCase() === 'completed' ? (
                  <button 
                    className="action-btn view-receipt"
                    onClick={() => handleViewReceipt(pickup.id)}
                  >
                    View Receipt
                  </button>
                ) : (
                  <>
                    {pickup.status.toLowerCase() !== 'cancelled' && (
                      <>
                        <button 
                          className="action-btn edit"
                          onClick={() => handleEdit(pickup.id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="action-btn complete"
                          onClick={() => handleComplete(pickup.id)}
                        >
                          Complete
                        </button>
                        <button 
                          className="action-btn cancel"
                          onClick={() => handleCancel(pickup.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedules;
