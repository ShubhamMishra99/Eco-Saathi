import axios from 'axios';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth functions
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        if (response.data.success) {
            return response.data;
        }
        throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Registration failed');
        } else if (error.request) {
            throw new Error('Network error. Please check your connection.');
        }
        throw new Error('Registration failed. Please try again.');
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            return response.data;
        }
        throw new Error('Login failed');
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/profile');
        return response.data;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
};