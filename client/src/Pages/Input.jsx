import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Input.css';

const Input = () => {
  const navigate = useNavigate();

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
        <h1>Welcome to EasyScrap</h1>
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
