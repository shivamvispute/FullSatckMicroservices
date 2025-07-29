const { runQuery, getRow } = require('../db/connection');
const axios = require('axios');

class Analytics {
  static async getUserStats(userId) {
    try {
      let stats = await getRow(
        'SELECT * FROM task_statistics WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
        [userId]
      );

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      if (!stats || new Date(stats.updated_at) < fiveMinutesAgo) {
        const taskServiceUrl = process.env.TASK_SERVICE_URL || 'http://localhost:8002';

        try {
          const response = await axios.get(`${taskServiceUrl}/tasks/stats/summary`, {
            headers: {
              'x-service-token': process.env.SERVICE_TOKEN,
              'x-user-id': userId // ✅ Pass user ID to task-service
            }
          });

          if (response.data.success) {
            const freshStats = response.data.data.stats;

            await runQuery(`
              INSERT OR REPLACE INTO task_statistics 
              (user_id, total_tasks, completed_tasks, pending_tasks, in_progress_tasks, 
               cancelled_tasks, urgent_tasks, high_priority_tasks, overdue_tasks, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [
              userId,
              freshStats.total_tasks || 0,
              freshStats.completed_tasks || 0,
              freshStats.pending_tasks || 0,
              freshStats.in_progress_tasks || 0,
              freshStats.cancelled_tasks || 0,
              freshStats.urgent_tasks || 0,
              freshStats.high_priority_tasks || 0,
              freshStats.overdue_tasks || 0
            ]);

            stats = {
              user_id: userId,
              ...freshStats,
              updated_at: new Date().toISOString()
            };
          }
        } catch (error) {
          console.error('Error fetching from task service:', error.message);
        }
      }

      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  static async getSystemSummary() {
    try {
      let summary = await getRow(
        'SELECT * FROM system_summary ORDER BY created_at DESC LIMIT 1'
      );

      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      if (!summary || new Date(summary.created_at) < tenMinutesAgo) {
        const taskServiceUrl = process.env.TASK_SERVICE_URL || 'http://localhost:8002';

        let totalTasks = 0;
        let completedTasks = 0;
        let activeTasks = 0;

        try {
          const taskResponse = await axios.get(`${taskServiceUrl}/tasks/stats/summary`, {
            headers: {
              'x-service-token': process.env.SERVICE_TOKEN
              // No user ID needed for global/system stats
            }
          });

          if (taskResponse.data.success) {
            const taskStats = taskResponse.data.data.stats;
            totalTasks = taskStats.total_tasks || 0;
            completedTasks = taskStats.completed_tasks || 0;
            activeTasks = totalTasks - completedTasks;
          }
        } catch (error) {
          console.error('Error fetching system data:', error.message);
        }

        await runQuery(`
          INSERT OR REPLACE INTO system_summary 
          (total_users, total_tasks, completed_tasks, active_tasks, created_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [0, totalTasks, completedTasks, activeTasks]);

        summary = {
          total_users: 0,
          total_tasks: totalTasks,
          completed_tasks: completedTasks,
          active_tasks: activeTasks,
          created_at: new Date().toISOString()
        };
      }

      return summary;
    } catch (error) {
      console.error('Error getting system summary:', error);
      throw error;
    }
  }

  static async getTaskTrends(userId) {
    try {
      const stats = await this.getUserStats(userId);

      const completionRate = stats.total_tasks > 0
        ? (stats.completed_tasks / stats.total_tasks) * 100
        : 0;

      return {
        completion_rate: completionRate,
        total_tasks: stats.total_tasks,
        completed_tasks: stats.completed_tasks,
        overdue_tasks: stats.overdue_tasks,
        urgent_tasks: stats.urgent_tasks
      };
    } catch (error) {
      console.error('Error getting task trends:', error);
      throw error;
    }
  }

  static async getProductivityMetrics(userId) {
    try {
      const stats = await this.getUserStats(userId);

      const productivityScore = stats.total_tasks > 0
        ? Math.min(100, (stats.completed_tasks / stats.total_tasks) * 100 +
            (stats.overdue_tasks === 0 ? 10 : -stats.overdue_tasks * 5))
        : 0;

      return {
        productivity_score: Math.max(0, productivityScore),
        tasks_completed: stats.completed_tasks,
        tasks_pending: stats.pending_tasks,
        overdue_tasks: stats.overdue_tasks,
        urgent_tasks: stats.urgent_tasks,
        efficiency_rating: productivityScore > 80 ? 'Excellent' :
                           productivityScore > 60 ? 'Good' :
                           productivityScore > 40 ? 'Average' : 'Needs Improvement'
      };
    } catch (error) {
      console.error('Error getting productivity metrics:', error);
      throw error;
    }
  }

  static async cacheUserStats(userId, stats) {
    try {
      await runQuery(`
        INSERT OR REPLACE INTO task_statistics 
        (user_id, total_tasks, completed_tasks, pending_tasks, in_progress_tasks, 
         cancelled_tasks, urgent_tasks, high_priority_tasks, overdue_tasks, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        userId,
        stats.total_tasks || 0,
        stats.completed_tasks || 0,
        stats.pending_tasks || 0,
        stats.in_progress_tasks || 0,
        stats.cancelled_tasks || 0,
        stats.urgent_tasks || 0,
        stats.high_priority_tasks || 0,
        stats.overdue_tasks || 0
      ]);

      return true;
    } catch (error) {
      console.error('Error caching user stats:', error);
      throw error;
    }
  }
}

module.exports = Analytics;
