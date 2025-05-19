import React, { useState } from 'react';

const Signup = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    alert(`Your OTP: ${otp}`);
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      setStep(3);
    } else {
      alert('Incorrect OTP');
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert('Passwords do not match');
    }

    if (password.length < 6) {
      return alert('Password must be at least 6 characters long');
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', phone);
        localStorage.setItem('user', JSON.stringify({ phone, name, email }));
        alert('Signup successful');
        onSuccess();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Signup failed');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendOtp}>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button type="submit">Send OTP</button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              required
            />
            <button type="submit">Verify OTP</button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleFinalSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      {renderStep()}
    </div>
  );
};

export default Signup;
