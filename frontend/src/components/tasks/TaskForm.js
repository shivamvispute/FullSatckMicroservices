import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: ''
  });

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const taskData = await taskService.getTask(id);
      setTask({
        ...taskData,
        due_date: taskData.due_date ? new Date(taskData.due_date).toISOString().split('T')[0] : ''
      });
    } catch (error) {
      toast.error('Failed to fetch task');
      navigate('/tasks');
    }
  };

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await taskService.updateTask(id, task);
        toast.success('Task updated successfully!');
      } else {
        await taskService.createTask(task);
        toast.success('Task created successfully!');
      }
      navigate('/tasks');
    } catch (error) {
      toast.error(error.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Task' : 'Create New Task'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={task.title}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={task.description}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={task.status}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              id="priority"
              value={task.priority}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            name="due_date"
            id="due_date"
            value={task.due_date}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : (id ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 