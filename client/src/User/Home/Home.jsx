import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/context/ThemeContext';
import './Home.css';

// Import components
import Dashboard from './Dashboard/Dashboard';
import RequestPickup from './RequestPickup/RequestPickup';
import History from './History/History';
import Rewards from './Rewards/Rewards';
import Profile from './Profile/Profile';
import PriceChart from './PriceChart/PriceChart';
import Footer from '../Footer/Footer';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isDarkTheme, toggleTheme } = useTheme();

  const handleLogout = () => {
    // TODO: Add logout logic
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'request':
        return <RequestPickup />;
      case 'prices':
        return <PriceChart />;
      case 'history':
        return <History />;
      case 'rewards':
        return <Rewards />;
      case 'profile':
        return <Profile onLogout={handleLogout} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`user-home ${isDarkTheme ? 'dark-theme' : ''}`}>
      <nav className="user-nav">
        <div className="nav-brand">
          <h1>EasyScrap</h1>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-button ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            Request Pickup
          </button>
          <button 
            className={`nav-button ${activeTab === 'prices' ? 'active' : ''}`}
            onClick={() => setActiveTab('prices')}
          >
            Price Chart
          </button>
          <button 
            className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button 
            className={`nav-button ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            Rewards
          </button>
          <button 
            className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className="nav-button theme"
            onClick={toggleTheme}
            title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <i className={`fas fa-${isDarkTheme ? 'sun' : 'moon'}`}></i>
          </button>
        </div>
      </nav>

      <main className="user-main">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

export default Home; 