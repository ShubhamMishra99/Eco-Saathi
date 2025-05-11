import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[phone];

    if (!user || user.password !== password) {
      alert('Invalid credentials');
      return;
    }

    localStorage.setItem('currentUser', phone);
    navigate('/profile');
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
