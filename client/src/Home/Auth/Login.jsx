import React, { useState } from 'react';

const Login = ({ onSuccess }) => {
  const [mode, setMode] = useState('password');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', phone);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful');
        onSuccess();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.phone !== phone) {
      alert('No user found for this phone number');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    alert(`Your OTP (demo): ${otp}`);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', phone);
      onSuccess();
    } else {
      alert('Invalid OTP');
    }
  };

  const switchToOtp = () => setMode('otp');
  const switchToPassword = () => {
    setMode('password');
    setOtpSent(false);
    setOtpInput('');
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      {mode === 'password' ? (
        <form onSubmit={handlePasswordLogin}>
          <input 
            type="tel" 
            placeholder="Phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Login</button>
          <p>
            Use OTP? 
            <span 
              onClick={switchToOtp} 
              style={{ cursor: 'pointer', color: '#007f5f' }}
            >
              Login with OTP
            </span>
          </p>
        </form>
      ) : (
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <input 
            type="tel" 
            placeholder="Phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            disabled={otpSent} 
            required 
          />
          {otpSent && (
            <input 
              type="text" 
              placeholder="Enter OTP" 
              value={otpInput} 
              onChange={(e) => setOtpInput(e.target.value)} 
              required 
            />
          )}
          <button type="submit">
            {otpSent ? 'Verify OTP' : 'Send OTP'}
          </button>
          <p>
            Use Password? 
            <span 
              onClick={switchToPassword} 
              style={{ cursor: 'pointer', color: '#007f5f' }}
            >
              Login with Password
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
