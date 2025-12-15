import axios from 'axios';
import { STORAGE_KEYS } from '../../config/constants';
import { API_BASE_URL } from '../../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: envoie les cookies avec les requêtes
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 403 with pending flag, redirect to pending page
    if (error.response?.status === 403 && error.response?.data?.pending) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      window.location.href = '/pending';
      return Promise.reject(error);
    }

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Le refreshToken est envoyé automatiquement via le cookie
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`, 
          {}, // Body vide, le cookie contient le refresh token
          {
            withCredentials: true, // Important pour envoyer le cookie
          }
        );

        const { accessToken } = response.data;
        
        if (accessToken) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
