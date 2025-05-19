import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './History.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const History = () => {
  const [history, setHistory] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    // Load history from localStorage
    const storedHistory = JSON.parse(localStorage.getItem('pickupHistory')) || [];
    // Sort history by timestamp in descending order (newest first)
    const sortedHistory = storedHistory.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    setHistory(sortedHistory);
  }, [navigate]);

  const getStatusColor = (status) => ({
    pending: '#ffa500',
    completed: '#4CAF50',
    cancelled: '#f44336'
  }[status.toLowerCase()] || '#666');

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getChartData = () => {
    const now = new Date();
    let filteredHistory = [...history];

    // Filter based on selected time range
    switch (selectedTimeRange) {
      case 'week':
        filteredHistory = history.filter(record => 
          new Date(record.timestamp) >= new Date(now - 7 * 24 * 60 * 60 * 1000)
        );
        break;
      case 'month':
        filteredHistory = history.filter(record => 
          new Date(record.timestamp) >= new Date(now - 30 * 24 * 60 * 60 * 1000)
        );
        break;
      case 'year':
        filteredHistory = history.filter(record => 
          new Date(record.timestamp) >= new Date(now - 365 * 24 * 60 * 60 * 1000)
        );
        break;
      default:
        break;
    }

    // Group by status
    const statusCounts = filteredHistory.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: 'Number of Pickups',
          data: Object.values(statusCounts),
          backgroundColor: Object.keys(statusCounts).map(status => getStatusColor(status)),
          borderColor: Object.keys(statusCounts).map(status => getStatusColor(status)),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pickup History by Status',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Pickup History</h1>
        <p className="total-history">Total Records: {history.length}</p>
      </div>

      <div className="history-controls">
        <select 
          value={selectedTimeRange} 
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="time-range-select"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="chart-container">
        <Bar data={getChartData()} options={chartOptions} />
      </div>

      {history.length === 0 ? (
        <div className="no-history">
          <p>No history records found.</p>
          <p className="history-tip">Your pickup history will appear here!</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((record) => (
            <div key={record.id} className="history-card">
              <div className="history-header">
                <h3>Pickup #{record.pickupId}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(record.status) }}
                >
                  {record.status}
                </span>
              </div>
              
              <div className="history-details">
                <div className="detail-row">
                  <i className="fa fa-calendar"></i>
                  <span>{formatDate(record.date)}</span>
                </div>
                <div className="detail-row">
                  <i className="fa fa-clock"></i>
                  <span>{record.time}</span>
                </div>
                <div className="detail-row">
                  <i className="fa fa-map-marker"></i>
                  <span>{record.address}</span>
                </div>
                <div className="detail-row">
                  <i className="fa fa-cube"></i>
                  <span>{record.weight}</span>
                </div>
                {record.remarks && (
                  <div className="detail-row">
                    <i className="fa fa-comment"></i>
                    <span>{record.remarks}</span>
                  </div>
                )}
                <div className="detail-row">
                  <i className="fa fa-history"></i>
                  <span>Status changed to: {record.status}</span>
                </div>
                <div className="detail-row">
                  <i className="fa fa-clock-o"></i>
                  <span>Changed on: {formatTimestamp(record.timestamp)}</span>
                </div>
                {record.changedBy && (
                  <div className="detail-row">
                    <i className="fa fa-user"></i>
                    <span>Changed by: {record.changedBy}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
