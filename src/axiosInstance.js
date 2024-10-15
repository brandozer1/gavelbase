// axiosInstance.js
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import
import useLib from './Hooks/useLib'; // Import your utility hook

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: useLib.createServerUrl('/'), // Format the URL from envs
  withCredentials: true, // Ensure cookies are sent with every request
});

// Helper function to decode JWT and check expiry
function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  return decoded.exp * 1000 < Date.now();
}

// Refresh the token using cookies (HTTP-only refresh token)
async function refreshToken() {
  try {
    const response = await axios.post(
      useLib.createServerUrl('/v1/public/crew/refresh'), 
      {}, 
      { withCredentials: true } // Send cookies with the request
    );
    return response.data.accessToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    throw error;
  }
}

// Add request interceptor to handle access tokens
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = config.headers.Authorization?.split(' ')[1];

      // Refresh token if expired
      if (token && isTokenExpired(token)) {
        const newToken = await refreshToken();
        config.headers.Authorization = `Bearer ${newToken}`;
      }

      return config;
    } catch (error) {
      console.error('Error in request interceptor', error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to retry 401 responses with refreshed token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token after 401', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
