const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = '/tmp/analytics.db'; 


// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
const initDatabase = () => {
  const createTables = `
    CREATE TABLE IF NOT EXISTS task_statistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_tasks INTEGER DEFAULT 0,
      completed_tasks INTEGER DEFAULT 0,
      pending_tasks INTEGER DEFAULT 0,
      in_progress_tasks INTEGER DEFAULT 0,
      cancelled_tasks INTEGER DEFAULT 0,
      urgent_tasks INTEGER DEFAULT 0,
      high_priority_tasks INTEGER DEFAULT 0,
      overdue_tasks INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS system_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_users INTEGER DEFAULT 0,
      total_tasks INTEGER DEFAULT 0,
      completed_tasks INTEGER DEFAULT 0,
      active_tasks INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_task_statistics_user_id ON task_statistics(user_id);
    CREATE INDEX IF NOT EXISTS idx_task_statistics_created_at ON task_statistics(created_at);
  `;

  db.exec(createTables, (err) => {
    if (err) {
      console.error('Error creating tables:', err.message);
    } else {
      console.log('Database tables initialized');
    }
  });
};

// Helper function to run queries with promises
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Helper function to get single row
const getRow = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Helper function to get multiple rows
const getAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Database connection closed');
        resolve();
      }
    });
  });
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

module.exports = {
  db,
  runQuery,
  getRow,
  getAll,
  closeDatabase
}; 