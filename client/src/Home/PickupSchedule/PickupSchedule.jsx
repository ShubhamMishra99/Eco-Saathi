import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PickupSchedule.css';
import { useLocation, useNavigate } from 'react-router-dom';

const PickupSchedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = location.state?.mode === 'edit';
  const pickupData = location.state?.pickupData;

  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [weight, setWeight] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);

  useEffect(() => {
    if (isEditMode && pickupData) {
      setSelectedDate(new Date(pickupData.date));
      setTime(pickupData.time);
      setAddress(pickupData.address);
      setWeight(pickupData.weight);
      setRemarks(pickupData.remarks || '');
    }
  }, [isEditMode, pickupData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedDate || !time || !address || !weight) {
      alert('Please fill in all required fields');
      return;
    }

    // Create pickup data object
    const pickupData = {
      id: isEditMode ? location.state.pickupData.id : Date.now(),
      date: selectedDate.toLocaleDateString(),
      time,
      address,
      weight,
      remarks,
      status: isEditMode ? location.state.pickupData.status : 'Pending',
      createdAt: isEditMode ? location.state.pickupData.createdAt : new Date().toISOString()
    };

    // Get existing pickups from localStorage
    const existingPickups = JSON.parse(localStorage.getItem('pickups') || '[]');
    
    let updatedPickups;
    if (isEditMode) {
      // Update existing pickup
      updatedPickups = existingPickups.map(pickup => 
        pickup.id === pickupData.id ? pickupData : pickup
      );
    } else {
      // Add new pickup
      updatedPickups = [...existingPickups, pickupData];
    }
    
    // Save to localStorage
    localStorage.setItem('pickups', JSON.stringify(updatedPickups));

    // Show success message
    alert(isEditMode ? 'Pickup updated successfully!' : 'Pickup scheduled successfully!');
    
    // Reset form
    setSelectedDate(null);
    setTime('');
    setAddress('');
    setWeight('');
    setRemarks('');
  };

  const handleTimeClick = (e) => {
    if (!selectedDate) {
      e.preventDefault();
      setShowTimeModal(true);
    }
  };

  const closeTimeModal = () => setShowTimeModal(false);

  return (
    <div className="pickup-container">
      {/* Modal for time selection */}
      {showTimeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Enter Time</h3>
            <div className="modal-box">
              <div className="input-icon-wrapper modal-icon-row">
                <i className="fa fa-clock icon" />
                <span className="modal-select-time">Select Time</span>
              </div>
              <p className="modal-message">Please choose a different date.</p>
              <button className="modal-ok-button" onClick={closeTimeModal}>OK</button>
            </div>
          </div>
        </div>
      )}

      <form className="pickup-form" onSubmit={handleSubmit}>
        <h2>{isEditMode ? 'Edit Pickup' : 'Schedule a Pickup'}</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>Enter Date</label>
            <div className="input-icon-wrapper">
              <i className="fa fa-calendar icon" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="DD/MM/YY"
                className="custom-input"
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Enter Time</label>
            <div className="input-icon-wrapper">
              <i className="fa fa-clock icon" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="custom-input"
                disabled={!selectedDate}
                onClick={handleTimeClick}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Select an Address</label>
          <div className="input-icon-wrapper">
            <i className="fa fa-map-marker icon" />
            <select
              className="custom-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            >
              <option value="">Choose Address</option>
              <option value="Home">Home</option>
              <option value="Office">Office</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Estimated Weight</label>
          <div className="input-icon-wrapper">
            <i className="fa fa-cube icon" />
            <select
              className="custom-input"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            >
              <option value="">Select Weight</option>
              <option value="0-5kg">0-5 kg</option>
              <option value="5-10kg">5-10 kg</option>
              <option value="10+kg">10+ kg</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Remarks <span className="optional">(Optional)</span></label>
          <textarea
            className="custom-input"
            rows="2"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-button">
          {isEditMode ? 'UPDATE PICKUP' : 'SCHEDULE A PICKUP'}
        </button>

        <p className="note">
          To view the scheduled pickups click <span className="link" onClick={() => navigate('/schedules')}>Check My Pickups</span>
        </p>
      </form>
    </div>
  );
};

export default PickupSchedule;