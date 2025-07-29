const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8000;

// Service URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://localhost:8002';
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:8003';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['http://localhost:3000']
    : true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      user: USER_SERVICE_URL,
      task: TASK_SERVICE_URL,
      analytics: ANALYTICS_SERVICE_URL
    }
  });
});

// Proxy factory
const createProxy = (target, pathRewrite = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onError: (err, req, res) => {
      console.error(`[PROXY ERROR] ${req.originalUrl}:`, err.message);
      res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable'
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[PROXY] ${req.method} ${req.originalUrl} -> ${target}`);
      // 🔥 Forward request body manually for POST/PUT
      if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  });
};

// Public routes
app.use('/auth', (req, res, next) => {
  console.log(`[DEBUG] Incoming request to /auth: ${req.method} ${req.originalUrl}`);
  next();
}, createProxy(USER_SERVICE_URL, { '^/auth': '/auth' }));

// Protected routes
app.use('/user', authenticateToken, createProxy(USER_SERVICE_URL, { '^/user': '/user' }));
app.use('/tasks', authenticateToken, createProxy(TASK_SERVICE_URL, { '^/tasks': '/tasks' }));
app.use('/analytics', authenticateToken, createProxy(ANALYTICS_SERVICE_URL, { '^/analytics': '/analytics' }));

// Health check for services
app.get('/services/health', async (req, res) => {
  const axios = require('axios');
  const healthChecks = {};

  try {
    const services = {
      user: USER_SERVICE_URL,
      task: TASK_SERVICE_URL,
      analytics: ANALYTICS_SERVICE_URL
    };

    for (const [name, url] of Object.entries(services)) {
      try {
        const health = await axios.get(`${url}/health`, { timeout: 5000 });
        healthChecks[name] = { status: 'OK', response: health.data };
      } catch (error) {
        healthChecks[name] = { status: 'ERROR', error: error.message };
      }
    }

    res.json({
      success: true,
      data: {
        gateway: { status: 'OK', timestamp: new Date().toISOString() },
        services: healthChecks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking service health'
    });
  }
});

// Error handler
app.use(errorHandler);

// 404 fallback
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`API Gateway running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Services health: http://localhost:${PORT}/services/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
