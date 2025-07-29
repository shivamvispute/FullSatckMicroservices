const pool = require('../db/connection');

class Task {
  // Create a new task
  static async create(taskData) {
    const { title, description, status, priority, user_id, due_date } = taskData;
    
    const query = `
      INSERT INTO tasks (title, description, status, priority, user_id, due_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [title, description, status, priority, user_id, due_date];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all tasks for a user
  static async findByUserId(userId, options = {}) {
    const { page = 1, limit = 10, status, priority, search } = options;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    let values = [userId];
    let paramCount = 1;
    
    // Add filters
    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(status);
    }
    
    if (priority) {
      paramCount++;
      query += ` AND priority = $${paramCount}`;
      values.push(priority);
    }
    
    if (search) {
      paramCount++;
      query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
    }
    
    // Add pagination
    paramCount++;
    query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    values.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    values.push(offset);
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get task by ID
  static async findById(id, userId) {
    const query = 'SELECT * FROM tasks WHERE id = $1 AND user_id = $2';
    
    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update task
  static async update(id, userId, updateData) {
    const { title, description, status, priority, due_date } = updateData;
    
    const query = `
      UPDATE tasks 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          priority = COALESCE($4, priority),
          due_date = COALESCE($5, due_date)
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `;
    
    const values = [title, description, status, priority, due_date, id, userId];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Delete task
  static async delete(id, userId) {
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *';
    
    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get task statistics for a user
  static async getStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_tasks,
        COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_tasks,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_tasks,
        COUNT(CASE WHEN due_date < CURRENT_TIMESTAMP AND status != 'completed' THEN 1 END) as overdue_tasks
      FROM tasks 
      WHERE user_id = $1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get tasks by status
  static async findByStatus(userId, status) {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC';
    
    try {
      const result = await pool.query(query, [userId, status]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get overdue tasks
  static async findOverdue(userId) {
    const query = `
      SELECT * FROM tasks 
      WHERE user_id = $1 
      AND due_date < CURRENT_TIMESTAMP 
      AND status != 'completed'
      ORDER BY due_date ASC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Count total tasks for a user
  static async countByUserId(userId, filters = {}) {
    const { status, priority, search } = filters;
    
    let query = 'SELECT COUNT(*) FROM tasks WHERE user_id = $1';
    let values = [userId];
    let paramCount = 1;
    
    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(status);
    }
    
    if (priority) {
      paramCount++;
      query += ` AND priority = $${paramCount}`;
      values.push(priority);
    }
    
    if (search) {
      paramCount++;
      query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
    }
    
    try {
      const result = await pool.query(query, values);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Task; 