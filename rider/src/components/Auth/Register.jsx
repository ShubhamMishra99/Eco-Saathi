import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/auth';
import logo from '../../assets/images/eco-saathi-logo.png';
import '../styles/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        vehicleType: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password || 
            !formData.confirmPassword || !formData.phone || !formData.vehicleType) {
            setError('Please fill in all fields');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
            setError('Please enter a valid phone number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            await register(formData);
            navigate('/login', { 
                state: { message: 'Registration successful! Please login.' } 
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="logo-container">
                <img 
                    src={logo}
                    alt="Eco-Saathi" 
                    className="logo" 
                />
            </div>
            <div className="form_container">
                <div className="left">
                    <img 
                        src={logo}
                        alt="Eco Rider" 
                        className="illustration" 
                    />
                    <h1 className="welcome-text">Join Our Eco-Warriors!</h1>
                    <p className="welcome-subtext">Start your journey as an Eco-Saathi rider</p>
                </div>
                <div className="right">
                    <h2 className="from_heading">Create Your Account</h2>
                    {error && <div className="error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="input"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <input
                            type="email"
                            className="input"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <input
                            type="tel"
                            className="input"
                            placeholder="Phone Number (+91XXXXXXXXXX)"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <select
                            className="select"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <option value="">Select Vehicle Type</option>
                            <option value="Bicycle">Truck</option>
                            <option value="Electric Scooter">Mini Truck</option>
                            <option value="Electric Bike">Trolley</option>
                        </select>
                        <input
                            type="password"
                            className="input"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <input
                            type="password"
                            className="input"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            className="btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                        <p className="text">
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;