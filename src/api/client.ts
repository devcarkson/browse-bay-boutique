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

    try {
      const fullUrl = new URL(config.url || '', config.baseURL);
      const path = fullUrl.pathname.replace(/^\/api/, '');

      const isPublic = PUBLIC_ENDPOINTS.some(endpoint => 
        path === endpoint || path.startsWith(endpoint)
      );

      if (token && !isPublic) {
        // Use 'Bearer' for JWT authentication
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Could not parse request URL for auth check:", e);
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
      // Add logout logic if needed
    }
    return Promise.reject(error);
  }
);

export default apiClient;