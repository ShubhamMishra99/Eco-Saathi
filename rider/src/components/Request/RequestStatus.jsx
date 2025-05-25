import React from 'react';

const RequestStatus = ({ status }) => {
    return (
        <div className="request-status">
            <h2>Request Status</h2>
            <p>{status}</p>
        </div>
    );
};

export default RequestStatus;