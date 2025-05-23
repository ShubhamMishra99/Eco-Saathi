import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <button 
      className={`theme-toggle ${isDarkTheme ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {isDarkTheme ? '🌙' : '☀️'}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle; 