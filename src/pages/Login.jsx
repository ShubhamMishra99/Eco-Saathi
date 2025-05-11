import React, { useState } from 'react';

function Login({ onSuccess }) {
  const [mode, setMode] = useState('password');  // 'password' or 'otp'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (
      storedUser &&
      storedUser.phone === phone &&
      storedUser.password === password
    ) {
      localStorage.setItem('isLoggedIn', 'true');
      onSuccess();
    } else {
      alert('Invalid phone number or password');
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.phone !== phone) {
      alert('No user found with this phone number');
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
      onSuccess();
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      {mode === 'password' && (
        <form onSubmit={handlePasswordLogin}>
          <input
            type="tel"
            placeholder="Phone Number"
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
          <p style={{ marginTop: 8 }}>
            Prefer OTP?{' '}
            <span
              onClick={() => setMode('otp')}
              style={{ color: '#007f5f', cursor: 'pointer' }}
            >
              Use OTP instead
            </span>
          </p>
        </form>
      )}

      {mode === 'otp' && (
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={otpSent}
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

          <button type="submit">{otpSent ? 'Verify OTP' : 'Send OTP'}</button>
          <p style={{ marginTop: 8 }}>
            Use password?{' '}
            <span
              onClick={() => {
                setMode('password');
                setOtpSent(false);
                setOtpInput('');
              }}
              style={{ color: '#007f5f', cursor: 'pointer' }}
            >
              Login with password
            </span>
          </p>
        </form>
      )}
    </div>
  );
}

export default Login;
