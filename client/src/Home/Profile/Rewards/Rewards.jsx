import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reward.css';

const Rewards = () => {
  const [points, setPoints] = useState(0);
  const [rewardHistory, setRewardHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    // Load points from localStorage
    const storedPoints = parseInt(localStorage.getItem('userPoints')) || 0;
    setPoints(storedPoints);

    // Load reward history from localStorage
    const storedHistory = JSON.parse(localStorage.getItem('rewardHistory')) || [];
    setRewardHistory(storedHistory);
  }, [navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="rewards-page">
      <div className="rewards-header">
        <h1>My Rewards</h1>
        <div className="points-display">
          <span className="points-label">Total Points:</span>
          <span className="points-value">{points}</span>
        </div>
      </div>

      <div className="rewards-info">
        <div className="info-card">
          <h3>How Points Work</h3>
          <p>• Earn 100 points for every kg of waste recycled</p>
          <p>• Points can be redeemed for rewards</p>
          <p>• Keep recycling to earn more points!</p>
        </div>
      </div>

      <div className="rewards-history">
        <h2>Points History</h2>
        {rewardHistory.length === 0 ? (
          <div className="no-history">
            <p>No reward history found.</p>
            <p className="history-tip">Complete pickups to earn points!</p>
          </div>
        ) : (
          <div className="history-list">
            {rewardHistory.map((record) => (
              <div key={record.id} className="history-card">
                <div className="history-details">
                  <div className="detail-row">
                    <i className="fa fa-calendar"></i>
                    <span>{formatDate(record.date)}</span>
                  </div>
                  <div className="detail-row">
                    <i className="fa fa-cube"></i>
                    <span>Weight: {record.weight}</span>
                  </div>
                  <div className="detail-row">
                    <i className="fa fa-star"></i>
                    <span>Points Earned: +{record.points}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
