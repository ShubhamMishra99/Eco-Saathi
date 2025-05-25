import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../services/auth';
import '../styles/Login.css';
import logo from '../../assets/image.png';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setError(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Invalid email or password');
            console.error('Login error:', err);
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
                    <h1 className="welcome-text">Welcome Back Rider!</h1>
                    <p className="welcome-subtext">Login to continue your eco-friendly journey</p>
                </div>
                <div className="right">
                    <h2 className="from_heading">Login to Your Account</h2>
                    {error && <div className="error">{error}</div>}
                    <form onSubmit={handleSubmit}>
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
                            type="password"
                            className="input"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p className="text">
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;