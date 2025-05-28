import React from 'react';
import { usePickup } from '../context/PickupContext';
import './PickupNotification.css';

const PickupNotification = () => {
  const {
    showNotificationModal,
    setShowNotificationModal,
    currentPickup,
    handleAcceptPickup,
    handleDeclinePickup,
    isLoading,
    error
  } = usePickup();

  if (!showNotificationModal || !currentPickup) return null;

  return (
    <div className="notification-modal">
      <div className="notification-content">
        <h3>New Pickup Request!</h3>
        <div className="pickup-details">
          <div className="detail-item">
            <i className="fas fa-user"></i>
            <span>Customer: {currentPickup.user.name}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>Location: {currentPickup.address}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-recycle"></i>
            <span>Type: {currentPickup.scrapType}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-weight"></i>
            <span>Quantity: {currentPickup.quantity}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-calendar"></i>
            <span>Date: {new Date(currentPickup.preferredDate).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-clock"></i>
            <span>Time: {currentPickup.preferredTime}</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="notification-actions">
          <button
            className="accept-btn"
            onClick={handleAcceptPickup}
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-check"></i>
            )}
            Accept
          </button>
          <button
            className="decline-btn"
            onClick={handleDeclinePickup}
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
            Decline
          </button>
          <button
            className="later-btn"
            onClick={() => setShowNotificationModal(false)}
            disabled={isLoading}
          >
            <i className="fas fa-clock"></i>
            Decide Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupNotification; 