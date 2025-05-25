import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error Response:', error.response.data);
            throw new Error(error.response.data.message || 'Server error occurred');
        } else if (error.request) {
            // The request was made but no response was received
            console.error('API No Response:', error.request);
            throw new Error('No response from server. Please check your internet connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('API Request Error:', error.message);
            throw new Error('Failed to make request. Please try again.');
        }
    }
);

// Fetch active requests for the rider
export const fetchActiveRequests = async () => {
    try {
        const response = await api.get('/requests/active');
        return response.data;
    } catch (error) {
        console.error('Error in fetchActiveRequests:', error);
        throw error;
    }
};

// Fetch request history
export const fetchRequestHistory = async () => {
    try {
        const response = await api.get('/requests/history');
        return response.data;
    } catch (error) {
        console.error('Error in fetchRequestHistory:', error);
        throw error;
    }
};

// Accept a request
export const acceptRequest = async (requestId) => {
    try {
        const response = await api.post(`/requests/${requestId}/accept`);
        return response.data;
    } catch (error) {
        console.error('Error in acceptRequest:', error);
        throw error;
    }
};

// Decline a request
export const declineRequest = async (requestId) => {
    try {
        const response = await api.post(`/requests/${requestId}/decline`);
        return response.data;
    } catch (error) {
        console.error('Error in declineRequest:', error);
        throw error;
    }
};

// Fetch request details
export const fetchRequestDetails = async (requestId) => {
    try {
        const response = await api.get(`/requests/${requestId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching request details: ' + error.message);
    }
};