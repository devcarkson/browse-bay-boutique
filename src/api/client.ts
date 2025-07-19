// src/api/apiClient.ts
import axios from 'axios';

const PUBLIC_ENDPOINTS = [
  '/auth/login/', 
  '/auth/register/', 
  '/auth/token/refresh/',
  '/products', 
  '/home', 
  '/categories', 
  '/contact'
];

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://makelacosmetic.uk/api',
  timeout: 10000,
  withCredentials: true, // Essential for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Skip modification for external URLs
    if (config.url?.startsWith('http') && !config.url?.includes(import.meta.env.VITE_API_BASE_URL)) {
      return config;
    }

    // Get tokens from storage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
      config.url?.startsWith(endpoint) || 
      config.url?.includes(`?next=${endpoint}`)
    );

    // Add Authorization header for non-public endpoints when token exists
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure CSRF token is included for session-based endpoints
    if (!isPublicEndpoint && !config.url?.startsWith('/auth/token/')) {
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try refreshing token if we have a refresh token
      const refreshToken = localStorage.getItem('refresh') || sessionStorage.getItem('refresh');
      if (refreshToken && !originalRequest.url.includes('/auth/token/refresh/')) {
        try {
          const response = await apiClient.post('/auth/token/refresh/', {
            refresh: refreshToken
          });
          
          const newAccessToken = response.data.access;
          const storage = localStorage.getItem('refresh') ? localStorage : sessionStorage;
          
          storage.setItem('token', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear all auth data
          clearAuthStorage();
          window.location.href = '/login?session_expired=1';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available
        clearAuthStorage();
        window.location.href = '/login?session_expired=1';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper functions
function clearAuthStorage() {
  ['token', 'refresh', 'userId', 'email'].forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export default apiClient;