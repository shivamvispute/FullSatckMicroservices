import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register user
  async register(name, email, password) {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Verify token
  async verifyToken(token) {
    try {
      const response = await api.post('/auth/verify', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data.user;
    } catch (error) {
      throw new Error('Token verification failed');
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/user/profile');
      return response.data.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}; 