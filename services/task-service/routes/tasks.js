const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');

const router = express.Router();

// Validation middleware
const validateTask = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in_progress, completed, cancelled'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
];

// Check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /tasks/stats/summary
router.get('/stats/summary', async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const stats = await Task.getStats(userId);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

// @route   GET /tasks
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { page, limit, status, priority, search } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      priority,
      search
    };

    const tasks = await Task.findByUserId(userId, options);
    const total = await Task.countByUserId(userId, { status, priority, search });

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks'
    });
  }
});

// @route   POST /tasks
router.post('/', validateTask, checkValidation, async (req, res) => {
  console.log('🔐 Authenticated user:', req.user);
  try {
    const userId = req.user.userId || req.user.id;
    const { title, description, status, priority, due_date } = req.body;

    const taskData = {
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      user_id: userId,
      due_date: due_date ? new Date(due_date) : null
    };

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task'
    });
  }
});

// @route   GET /tasks/status/:status
router.get('/status/:status', async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const status = req.params.status;

    const tasks = await Task.findByStatus(userId, status);

    res.json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    console.error('Get tasks by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks by status'
    });
  }
});

// @route   GET /tasks/overdue
router.get('/overdue', async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const tasks = await Task.findOverdue(userId);

    res.json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    console.error('Get overdue tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue tasks'
    });
  }
});

// @route   GET /tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const taskId = req.params.id;

    const task = await Task.findById(taskId, userId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task'
    });
  }
});

// @route   PUT /tasks/:id
router.put('/:id', validateTask, checkValidation, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const taskId = req.params.id;
    const { title, description, status, priority, due_date } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (due_date !== undefined) updateData.due_date = due_date ? new Date(due_date) : null;

    const task = await Task.update(taskId, userId, updateData);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task'
    });
  }
});

// @route   DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const taskId = req.params.id;

    const task = await Task.delete(taskId, userId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task'
    });
  }
});

module.exports = router;
