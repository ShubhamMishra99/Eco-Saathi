import React, { useState } from 'react';
import './RequestPickup.css';

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

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        address: '',
        scrapType: '',
        quantity: '',
        preferredDate: '',
        preferredTime: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting request:', error);
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

      {submitSuccess ? (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <h3>Request Submitted Successfully!</h3>
          <p>We'll contact you shortly to confirm your pickup details.</p>
          <button 
            className="new-request-button"
            onClick={() => setSubmitSuccess(false)}
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