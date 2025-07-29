const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 8002;

// Security headers
app.use(helmet());

// CORS config
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['http://localhost:3000']
    : true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/tasks', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug: Log every incoming request (optional but helpful)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Task Service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Protected routes
app.use('/tasks', authenticateToken, taskRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
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
      console.log(`Task Service running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
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
