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

export const analyticsService = {
  // Get user statistics
  async getUserStats(userId) {
    try {
      const response = await api.get(`/analytics/stats/${userId}`);
      return response.data.data.stats;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
    }
  },

  // Get system summary
  async getSystemSummary() {
    try {
      const response = await api.get('/analytics/summary');
      return response.data.data.summary;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch system summary');
    }
  },

  // Get task trends
  async getTaskTrends(userId) {
    try {
      const response = await api.get(`/analytics/trends/${userId}`);
      return response.data.data.trends;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task trends');
    }
  },

  // Get productivity metrics
  async getProductivityMetrics(userId) {
    try {
      const response = await api.get(`/analytics/productivity/${userId}`);
      return response.data.data.metrics;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch productivity metrics');
    }
  },

  // Get comprehensive dashboard data
  async getDashboardData(userId) {
    try {
      const response = await api.get(`/analytics/dashboard/${userId}`);
      return response.data.data.dashboard;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
}; 