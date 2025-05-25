import React, { useState, useEffect } from 'react';

const RequestHistory = () => {
    const [requestHistory, setRequestHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequestHistory = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('/api/request-history');
                if (!response.ok) {
                    throw new Error('Failed to fetch request history');
                }
                const data = await response.json();
                setRequestHistory(data);
            } catch (error) {
                setError('Failed to load request history. Please try again later.');
                console.error('Error fetching request history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequestHistory();
    }, []);

    if (isLoading) {
        return (
            <div className="loading">
                <p>Loading request history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                {error}
            </div>
        );
    }

    if (requestHistory.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--neutral-gray-500)' }}>
                <p>No request history available.</p>
            </div>
        );
    }

    return (
        <div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {requestHistory.map((request) => (
                    <li 
                        key={request.id}
                        className="request-card"
                        style={{ marginBottom: '1rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: '0.5rem 0' }}>
                                    <strong>Pickup:</strong> {request.pickupLocation}
                                </p>
                                <p style={{ margin: '0.5rem 0' }}>
                                    <strong>Drop-off:</strong> {request.dropoffLocation}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '0.5rem 0' }}>
                                    <strong>Status:</strong>{' '}
                                    <span className={`status-badge ${request.status.toLowerCase()}`}>
                                        {request.status}
                                    </span>
                                </p>
                                <p style={{ margin: '0.5rem 0', color: 'var(--neutral-gray-500)' }}>
                                    {new Date(request.date).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RequestHistory;