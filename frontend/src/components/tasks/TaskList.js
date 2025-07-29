import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data.tasks || []);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <Link
          to="/tasks/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Create New Task
        </Link>
      </div>

      {tasks.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/tasks/${task.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No tasks found.</p>
          <Link
            to="/tasks/new"
            className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Create your first task
          </Link>
        </div>
      )}
    </div>
  );
};

export default TaskList; 