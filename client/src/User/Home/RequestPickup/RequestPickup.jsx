import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './RequestPickup.css';

const API_BASE_URL = 'https://eco-saathi-2.onrender.com';
const socket = io(API_BASE_URL);

const RequestPickup = () => {
  const [formData, setFormData] = useState({
    address: '',
    scrapType: '',
    quantity: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Listen for pickup status updates
    socket.on('pickup-status-update', (update) => {
      if (update.status === 'accepted') {
        setNotification({
          type: 'success',
          message: 'A rider has accepted your pickup request! They will contact you shortly.'
        });
      } else if (update.status === 'declined') {
        setNotification({
          type: 'info',
          message: 'The rider was unable to accept your request. Another rider will be notified.'
        });
      }
    });

    return () => {
      socket.off('pickup-status-update');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const res = await fetch(`${API_BASE_URL}/api/users/schedule-pickup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({
          address: '',
          scrapType: '',
          quantity: '',
          preferredDate: '',
          preferredTime: '',
          notes: ''
        });
        setNotification({
          type: 'success',
          message: 'Pickup request submitted successfully! Notifying nearby riders...'
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to schedule pickup');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setNotification({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="request-pickup-container">
      <div className="request-pickup-header">
        <h2>Request Scrap Pickup</h2>
        <p>Fill out the form below to schedule a pickup of your recyclable materials.</p>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${
            notification.type === 'success' ? 'fa-check-circle' : 
            notification.type === 'error' ? 'fa-exclamation-circle' : 
            'fa-info-circle'
          }`}></i>
          <p>{notification.message}</p>
          <button 
            className="close-notification"
            onClick={() => setNotification(null)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {submitSuccess ? (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <h3>Request Submitted Successfully!</h3>
          <p>We'll contact you shortly to confirm your pickup details.</p>
          <button 
            className="new-request-button"
            onClick={() => {
              setSubmitSuccess(false);
              setNotification(null);
            }}
          >
            Make Another Request
          </button>
        </div>
      ) : (
        <form className="request-pickup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="address">Pickup Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="scrapType">Type of Scrap</label>
            <select
              id="scrapType"
              name="scrapType"
              value={formData.scrapType}
              onChange={handleChange}
              required
            >
              <option value="">Select type of scrap</option>
              <option value="paper">Paper & Cardboard</option>
              <option value="plastic">Plastic</option>
              <option value="metal">Metal</option>
              <option value="electronics">Electronics</option>
              <option value="glass">Glass</option>
              <option value="textiles">Textiles</option>
              <option value="rubber">Rubber</option>
              <option value="wood">Wood</option>
              <option value="mixed">Mixed Materials</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Estimated Weight</label>
            <select
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            >
              <option value="">Select weight</option>
              <option value="small">Small (1-5 kg)</option>
              <option value="medium">Medium (6-15 kg)</option>
              <option value="large">Large (16-30 kg)</option>
              <option value="bulk">Bulk (30+ kg)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="preferredDate">Preferred Date</label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferredTime">Preferred Time</label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                required
              >
                <option value="">Select time slot</option>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                <option value="evening">Evening (3 PM - 6 PM)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special instructions or additional information"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-truck"></i>
                Request Pickup
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default RequestPickup; 