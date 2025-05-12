import React from 'react';

function PickupSchedule({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>Pickup Schedule</h2>
        <p>This is where the pickup schedule component will go.</p>
        {/* Add your pickup schedule form or display here */}
      </div>
    </div>
  );
}

export default PickupSchedule;