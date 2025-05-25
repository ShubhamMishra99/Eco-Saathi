import React from 'react';
import ActiveRequests from './ActiveRequests';
import RequestHistory from './RequestHistory';

const Dashboard = () => {
    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--primary-green)', marginBottom: '2rem' }}>Rider Dashboard</h1>
            <div style={{ display: 'grid', gap: '2rem' }}>
                <div className="card">
                    <h2 style={{ color: 'var(--neutral-gray-800)', marginBottom: '1rem' }}>Active Requests</h2>
                    <ActiveRequests />
                </div>
                <div className="card">
                    <h2 style={{ color: 'var(--neutral-gray-800)', marginBottom: '1rem' }}>Request History</h2>
                    <RequestHistory />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;