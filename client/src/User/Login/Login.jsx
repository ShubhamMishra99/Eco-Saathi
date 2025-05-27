import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendDemoOTP, verifyDemoOTP } from '../../components/utils/otpUtils';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [otpStep, setOtpStep] = useState(0); // 0: initial, 1: email OTP, 2: phone OTP
  const [otpData, setOtpData] = useState({
    emailOtp: '',
    phoneOtp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOtpChange = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value
    });
  };

  const sendOtp = async (type) => {
    setLoading(true);
    setError('');
    try {
      const response = await sendDemoOTP(type, type === 'email' ? formData.email : formData.phone);
      if (response.success) {
        setOtpStep(type === 'email' ? 1 : 2);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    }
    setLoading(false);
  };

  const verifyOtp = async (type) => {
    setLoading(true);
    setError('');
    try {
      const response = await verifyDemoOTP(
        type,
        type === 'email' ? formData.email : formData.phone,
        type === 'email' ? otpData.emailOtp : otpData.phoneOtp
      );
      
      if (response.success) {
        if (type === 'email') {
          setOtpStep(2);
        } else {
          // Both OTPs verified, proceed with signup
          handleSignup();
        }
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/user/dashboard');
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login
      console.log('User Login:', formData);
      navigate('/user/dashboard');
    } else {
      // Start signup process with email OTP
      await sendOtp('email');
    }
  };

  const renderOtpForm = () => {
    if (otpStep === 1) {
      return (
        <div className="otp-form">
          <h2>Verify Email</h2>
          <p>Please enter the OTP sent to your email</p>
          <div className="form-group">
            <input
              type="text"
              name="emailOtp"
              value={otpData.emailOtp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="otp-buttons">
            <button 
              type="button" 
              className="resend-button"
              onClick={() => sendOtp('email')}
              disabled={loading}
            >
              Resend OTP
            </button>
            <button 
              type="button" 
              className="verify-button"
              onClick={() => verifyOtp('email')}
              disabled={loading}
            >
              Verify Email
            </button>
          </div>
        </div>
      );
    }

    if (otpStep === 2) {
      return (
        <div className="otp-form">
          <h2>Verify Phone</h2>
          <p>Please enter the OTP sent to your phone</p>
          <div className="form-group">
            <input
              type="text"
              name="phoneOtp"
              value={otpData.phoneOtp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="otp-buttons">
            <button 
              type="button" 
              className="resend-button"
              onClick={() => sendOtp('phone')}
              disabled={loading}
            >
              Resend OTP
            </button>
            <button 
              type="button" 
              className="verify-button"
              onClick={() => verifyOtp('phone')}
              disabled={loading}
            >
              Verify Phone
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
        <p className="subtitle">
          {isLogin 
            ? 'Please enter your details to sign in' 
            : 'Please fill in your details to create an account'}
        </p>

        {!isLogin && otpStep > 0 ? (
          renderOtpForm()
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            {isLogin && (
              <div className="forgot-password">
                <a href="#">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="submit-button" disabled={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="toggle-form">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              className="toggle-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setOtpStep(0);
                setError('');
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 