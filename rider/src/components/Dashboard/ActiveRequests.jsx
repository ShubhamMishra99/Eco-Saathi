import React, { useEffect, useState } from 'react';
import { fetchActiveRequests } from '../../services/requests';
import RequestCard from '../Request/RequestCard';

const ActiveRequests = () => {
    const [activeRequests, setActiveRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getActiveRequests = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const requests = await fetchActiveRequests();
                setActiveRequests(requests);
            } catch (err) {
                setError('Failed to load active requests. Please try again later.');
                console.error('Error fetching active requests:', err);
            } finally {
                setIsLoading(false);
            }
        };

        getActiveRequests();
    }, []);

    if (isLoading) {
        return (
            <div className="loading">
                <p>Loading active requests...</p>
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

    if (activeRequests.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--neutral-gray-500)' }}>
                <p>No active requests at the moment.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Active Requests</h2>
            {activeRequests.map(request => (
                <RequestCard key={request.id} request={request} />
            ))}
        </div>
    );
};

export default ActiveRequests;