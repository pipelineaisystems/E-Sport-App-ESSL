import axios from 'axios';

const API_BASE_URL = __DEV__
  ? 'http://localhost:8000/api'
  : 'https://api.essl.games/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = config.headers.Authorization?.split(' ')[1];
    if (!token) {
      // Try to get from AsyncStorage if not in headers
      // This would require AsyncStorage import, but for now we rely on AuthContext
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear auth and redirect to login
      // This would be handled by AuthContext
    }
    return Promise.reject(error);
  }
);

export default api;


