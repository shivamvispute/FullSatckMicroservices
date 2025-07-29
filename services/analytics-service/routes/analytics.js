const express = require('express');
const Analytics = require('../models/Analytics');

const router = express.Router();

// @route   GET /analytics/stats/:userId
// @desc    Get user task statistics
// @access  Private
router.get('/stats/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if user is requesting their own stats or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const stats = await Analytics.getUserStats(userId);

    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    });
  }
});

// @route   GET /analytics/summary
// @desc    Get overall system summary
// @access  Private (Admin only)
router.get('/summary', async (req, res) => {
  try {
    // Only allow admins to view system summary
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const summary = await Analytics.getSystemSummary();

    res.json({
      success: true,
      data: {
        summary
      }
    });
  } catch (error) {
    console.error('Get system summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system summary'
    });
  }
});

// @route   GET /analytics/trends/:userId
// @desc    Get task completion trends for a user
// @access  Private
router.get('/trends/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if user is requesting their own trends or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const trends = await Analytics.getTaskTrends(userId);

    res.json({
      success: true,
      data: {
        trends
      }
    });
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trends'
    });
  }
});

// @route   GET /analytics/productivity/:userId
// @desc    Get productivity metrics for a user
// @access  Private
router.get('/productivity/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if user is requesting their own metrics or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const metrics = await Analytics.getProductivityMetrics(userId);

    res.json({
      success: true,
      data: {
        metrics
      }
    });
  } catch (error) {
    console.error('Get productivity metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching productivity metrics'
    });
  }
});

// @route   GET /analytics/dashboard/:userId
// @desc    Get comprehensive dashboard data for a user
// @access  Private
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if user is requesting their own dashboard or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get all analytics data for dashboard
    const [stats, trends, productivity] = await Promise.all([
      Analytics.getUserStats(userId),
      Analytics.getTaskTrends(userId),
      Analytics.getProductivityMetrics(userId)
    ]);

    res.json({
      success: true,
      data: {
        dashboard: {
          stats,
          trends,
          productivity
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @route   POST /analytics/cache/:userId
// @desc    Cache user statistics (for service-to-service communication)
// @access  Private
router.post('/cache/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const stats = req.body;

    // Only allow service-to-service communication or admin
    if (req.user.role !== 'admin' && !req.headers['x-service-token']) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Analytics.cacheUserStats(userId, stats);

    res.json({
      success: true,
      message: 'Statistics cached successfully'
    });
  } catch (error) {
    console.error('Cache stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error caching statistics'
    });
  }
});

module.exports = router; 