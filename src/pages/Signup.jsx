import React, { useState } from 'react';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(phone)) {
      alert('Enter a valid 10-digit phone number');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[phone]) {
      alert('User already exists. Try logging in.');
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    alert(`Your OTP is: ${newOtp}`);
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (otp !== generatedOtp) {
      alert('Incorrect OTP');
      return;
    }
    setStep(3);
  };

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert('Fill all fields');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[phone] = { name, email, password };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', phone);
    window.location.href = '/profile';
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>

      {step === 1 && (
        <>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button onClick={handleSignup}>Signup</button>
        </>
      )}
    </div>
  );
};

export default Signup;
