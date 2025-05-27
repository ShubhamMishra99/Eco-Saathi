import React, { useState, useEffect } from 'react';
import './Earnings.css';

const Earnings = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [earnings, setEarnings] = useState({
    daily: {
      total: 0,
      pickups: 0,
      average: 0,
      history: []
    },
    weekly: {
      total: 0,
      pickups: 0,
      average: 0,
      history: []
    },
    monthly: {
      total: 0,
      pickups: 0,
      average: 0,
      history: []
    }
  });

  // Calculate totals across all periods
  const totalEarnings = Object.values(earnings).reduce((sum, period) => sum + period.total, 0);
  const totalPickups = Object.values(earnings).reduce((sum, period) => sum + period.pickups, 0);

  // Get current period data
  const currentEarnings = earnings[activeTab];

  // Function to update earnings data
  const updateEarningsData = (period, data) => {
    setEarnings(prevEarnings => ({
      ...prevEarnings,
      [period]: {
        ...prevEarnings[period],
        ...data,
        average: data.total && data.pickups ? data.total / data.pickups : 0
      }
    }));
  };

  // Function to handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Here you can add logic to fetch data for the selected period
    // For example:
    // fetchEarningsData(tab);
  };

  // Example of how to fetch data (you'll need to implement the actual API call)
  const fetchEarningsData = async (period) => {
    try {
      // Replace this with your actual API call
      // const response = await api.getEarnings(period);
      // updateEarningsData(period, response.data);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchEarningsData(activeTab);
  }, [activeTab]);

  return (
    <div className="earnings-container">
      <div className="total-stats-container">
        <div className="total-earnings-banner">
          <div className="total-earnings-content">
            <h2>Total Earnings</h2>
            <p className="total-amount">₹{totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        <div className="total-pickups-banner">
          <div className="total-pickups-content">
            <h2>Total Pickups</h2>
            <p className="total-amount">{totalPickups.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="earnings-header">
        <h2>Earnings</h2>
        <div className="earnings-tabs">
          <button 
            className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => handleTabChange('daily')}
          >
            <i className="fas fa-calendar-day"></i>
            Daily
          </button>
          <button 
            className={`tab-button ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => handleTabChange('weekly')}
          >
            <i className="fas fa-calendar-week"></i>
            Weekly
          </button>
          <button 
            className={`tab-button ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => handleTabChange('monthly')}
          >
            <i className="fas fa-calendar-alt"></i>
            Monthly
          </button>
        </div>
      </div>

      <div className="earnings-overview">
        <div className="earnings-card">
          <div className="card-icon">
            <i className="fas fa-rupee-sign"></i>
          </div>
          <div className="card-content">
            <h3>Total Earnings</h3>
            <p className="amount">₹{currentEarnings.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="earnings-card">
          <div className="card-icon">
            <i className="fas fa-truck"></i>
          </div>
          <div className="card-content">
            <h3>Total Pickups</h3>
            <p className="amount">{currentEarnings.pickups}</p>
          </div>
        </div>

        <div className="earnings-card">
          <div className="card-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="card-content">
            <h3>Average per Pickup</h3>
            <p className="amount">₹{currentEarnings.average.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="earnings-history">
        <h3>Earnings History</h3>
        <div className="history-list">
          {currentEarnings.history.length > 0 ? (
            currentEarnings.history.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-date">
                  <i className="fas fa-calendar"></i>
                  <span>{item.date}</span>
                </div>
                <div className="history-details">
                  <div className="detail">
                    <span className="label">Amount</span>
                    <span className="value">₹{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Pickups</span>
                    <span className="value">{item.pickups}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="history-item">
              <div className="history-date">
                <i className="fas fa-info-circle"></i>
                <span>No earnings history available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings; 