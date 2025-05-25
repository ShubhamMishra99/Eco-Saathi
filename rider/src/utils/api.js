// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
    },
    REQUESTS: {
        ACTIVE: '/requests/active',
        HISTORY: '/requests/history',
        DETAILS: (id) => `/requests/${id}`,
        ACCEPT: (id) => `/requests/${id}/accept`,
        DECLINE: (id) => `/requests/${id}/decline`,
    },
    PROFILE: {
        GET: '/profile',
        UPDATE: '/profile',
    },
};

// API error messages
export const API_ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'Please log in to continue.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
};

// Get auth token from localStorage
export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Set auth token in localStorage
export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getAuthToken();
};

export const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const postData = async (url, data) => {
  return fetchData(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};