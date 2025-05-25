import React from 'react';

const RequestDetails = ({ request }) => {
    return (
        <div className="request-details">
            <h2>Request Details</h2>
            <p><strong>Pickup Location:</strong> {request.pickupLocation}</p>
            <p><strong>Drop-off Location:</strong> {request.dropoffLocation}</p>
            <p><strong>Scheduled Time:</strong> {request.scheduledTime}</p>
            <p><strong>Status:</strong> {request.status}</p>
            <button onClick={() => {/* Logic to accept the request */}}>Accept</button>
            <button onClick={() => {/* Logic to decline the request */}}>Decline</button>
        </div>
    );
};

export default RequestDetails;