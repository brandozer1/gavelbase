// axiosInstance.js
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // No need for destructuring
import useLib from './useLib';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: useLib.createServerUrl('/'), // Replace with your actual API URL
});

// Helper function to decode JWT and check expiry
function isTokenExpired(token) {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
}

// Function to refresh the token
async function refreshToken() {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(useLib.createServerUrl('/v1/public/member/refresh'), { refreshToken: refreshToken });
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data.accessToken;
    } catch (error) {
        console.error('Failed to refresh token', error);
        throw error;
    }
}

// ADD THE X-NO-AUTH HEADER TO BYPASS AUTHENTICATION FOR PUBLIC ENDPOINTS

// Add a request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        // Check if the request should bypass authentication
        if (config.headers && config.headers['x-no-auth']) {
            delete config.headers['x-no-auth']; // Remove the custom header before the request is sent
            return config;
        }

        let token = localStorage.getItem('accessToken');
        if (token && isTokenExpired(token)) {
            token = await refreshToken();
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh failures
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await refreshToken();
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
            originalRequest.headers.Authorization = 'Bearer ' + newToken;
            return axiosInstance(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
