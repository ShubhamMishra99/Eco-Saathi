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
        // Strip confirmPassword before sending to backend
        const { confirmPassword, ...cleanedData } = userData;

        const response = await api.post('/rider/register', cleanedData);

        if (response.data.message === 'Registration successful') {
            return response.data;
        }

        throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};


export const login = async (credentials) => {
    try {
        const response = await api.post('/rider/login', credentials);
        if (response.data.rider) {  // your backend returns rider object
            // Save rider info instead of token
            localStorage.setItem('authUser', JSON.stringify(response.data.rider));
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