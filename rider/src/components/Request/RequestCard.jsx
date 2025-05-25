import React from 'react';

const RequestCard = ({ request }) => {
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'status-active';
            case 'pending':
                return 'status-pending';
            case 'completed':
                return 'status-completed';
            default:
                return '';
        }
    };

    return (
        <div className="request-card">
            <h3>Pickup Location: {request.pickupLocation}</h3>
            <p>Time: {request.time}</p>
            <p>
                Status: <span className={`status-badge ${getStatusClass(request.status)}`}>{request.status}</span>
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                    className="btn btn-primary"
                    onClick={() => request.accept()}
                >
                    Accept
                </button>
                <button 
                    className="btn btn-outline"
                    onClick={() => request.decline()}
                >
                    Decline
                </button>
            </div>
        </div>
    );
};

export default RequestCard;