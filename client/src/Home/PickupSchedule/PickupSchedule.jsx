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
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const materialCategories = ['Iron', 'Plastic', 'Glass', 'Paper', 'Electronics'];

  useEffect(() => {
    if (isEditMode && pickupData) {
      setSelectedDate(new Date(pickupData.date));
      setTime(pickupData.time);
      setAddress(pickupData.address);
      setWeight(pickupData.weight);
      setRemarks(pickupData.remarks || '');
      setSelectedMaterials(pickupData.material || []);
    }
  }, [isEditMode, pickupData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedDate || !time || !address || !weight || selectedMaterials.length === 0) {
      alert('Please fill in all required fields including material categories');
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
      createdAt: isEditMode ? location.state.pickupData.createdAt : new Date().toISOString(),
      material: selectedMaterials
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
    setSelectedMaterials([]);
  };

  const handleTimeClick = (e) => {
    if (!selectedDate) {
      e.preventDefault();
      setShowTimeModal(true);
    }
  };

  const closeTimeModal = () => setShowTimeModal(false);

  const handleMaterialClick = (material) => {
    setSelectedMaterials(prev => 
      prev.includes(material) 
        ? prev.filter(item => item !== material)
        : [...prev, material]
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

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

      <div className="pickup-content">
        <form onSubmit={handleSubmit} className="pickup-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pickupDate">Enter Date</label>
              <DatePicker 
                id="pickupDate"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YY"
                className="custom-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="pickupTime">Enter Time</label>
              <input 
                type="text"
                id="pickupTime"
                value={time}
                onChange={handleTimeChange}
                className="custom-input"
                placeholder="--:-- --"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pickupAddress">Select an Address</label>
            <select
              id="pickupAddress"
              value={address}
              onChange={handleAddressChange}
              className="custom-input"
            >
              <option value="">Choose Address</option>
              <option value="Home">Home</option>
              <option value="Office">Office</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pickupWeight">Estimated Weight</label>
            <select
              id="pickupWeight"
              value={weight}
              onChange={handleWeightChange}
              className="custom-input"
            >
              <option value="">Select Weight</option>
              <option value="0-5kg">0-5 kg</option>
              <option value="5-10kg">5-10 kg</option>
              <option value="10+kg">10+ kg</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Material Type</label>
            <div className="material-options">
              {materialCategories.map((material) => (
                <div
                  key={material}
                  className={
                    `material-option ${selectedMaterials.includes(material) ? 'selected' : ''}`
                  }
                  onClick={() => handleMaterialClick(material)}
                >
                  {material}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pickupRemarks">Remarks <span className="optional">(Optional)</span></label>
            <textarea
              id="pickupRemarks"
              value={remarks}
              onChange={handleRemarksChange}
              className="custom-input"
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            {isEditMode ? 'UPDATE PICKUP' : 'SCHEDULE A PICKUP'}
          </button>

          <p className="note">
            To view the scheduled pickups click <span className="link" onClick={() => navigate('/schedules')}>Check My Pickups</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default PickupSchedule;