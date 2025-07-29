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

export const taskService = {
  // Get all tasks
  async getTasks(params = {}) {
    try {
      const response = await api.get('/tasks', { params });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  // Get task by ID
  async getTask(id) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data.data.task;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task');
    }
  },

  // Create new task
  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data.data.task;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  // Update task
  async updateTask(id, taskData) {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data.data.task;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  // Delete task
  async deleteTask(id) {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data.data.task;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },

  // Get task statistics
  async getTaskStats() {
    try {
      const response = await api.get('/tasks/stats/summary');
      return response.data.data.stats;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task statistics');
    }
  },

  // Get tasks by status
  async getTasksByStatus(status) {
    try {
      const response = await api.get(`/tasks/status/${status}`);
      return response.data.data.tasks;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks by status');
    }
  },

  // Get overdue tasks
  async getOverdueTasks() {
    try {
      const response = await api.get('/tasks/overdue');
      return response.data.data.tasks;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch overdue tasks');
    }
  }
}; 