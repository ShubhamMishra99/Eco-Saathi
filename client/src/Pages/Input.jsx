import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Input.css';

const Input = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();

  useEffect(() => {
    // Redirect to appropriate dashboard if already authenticated
    if (isAuthenticated) {
      navigate(`/${userType}/dashboard`, { replace: true });
    }
  }, [isAuthenticated, userType, navigate]);

  const handleRoleSelect = (role) => {
    if (role === 'user') {
      navigate('/user/login');
    } else {
      navigate('/rider/login');
    }
  };

  return (
    <div className="home-container">
      <div className="role-selection">
        <h1>Welcome to Eco-Saathi</h1>
        <p>Please select your role to continue</p>
        
        <div className="role-buttons">
          <button 
            className="role-button user"
            onClick={() => handleRoleSelect('user')}
          >
            <i className="fas fa-user"></i>
            <span>I am a User</span>
            <p>I want to request scrap pickup</p>
          </button>

          <button 
            className="role-button rider"
            onClick={() => handleRoleSelect('rider')}
          >
            <i className="fas fa-motorcycle"></i>
            <span>I am a Rider</span>
            <p>I want to collect scrap</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
