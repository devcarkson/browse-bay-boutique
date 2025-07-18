
// src/api/apiClient.ts
import axios from 'axios';

const PUBLIC_ENDPOINTS = ['/auth/login/', '/auth/register/', '/products', '/home', '/categories', '/contact'];

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://makelacosmetic.uk/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Get token from either storage location
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      try {
        // Parse the URL to check if it's a public endpoint
        const baseURL = config.baseURL || '';
        const url = config.url || '';
        const fullPath = url.startsWith('http') ? new URL(url).pathname : url;
        
        // Remove /api prefix if present for comparison
        const cleanPath = fullPath.replace(/^\/api/, '');
        
        // Check if this is a public endpoint
        const isPublic = PUBLIC_ENDPOINTS.some(endpoint => 
          cleanPath === endpoint || cleanPath.startsWith(endpoint + '/') || cleanPath.startsWith(endpoint + '?')
        );

        // Add token for all non-public endpoints
        if (!isPublic) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Adding token to request:', cleanPath);
        } else {
          console.log('Public endpoint, no token needed:', cleanPath);
        }
      } catch (e) {
        console.warn("Could not parse request URL for auth check:", e);
        // If we can't parse the URL, add the token anyway for safety
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.log('No token found in storage');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Invalid or missing token.');
      // Clear invalid tokens
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('refresh');
      sessionStorage.removeItem('refresh');
      localStorage.removeItem('userId');
      sessionStorage.removeItem('userId');
      localStorage.removeItem('email');
      sessionStorage.removeItem('email');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
