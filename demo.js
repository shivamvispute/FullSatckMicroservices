const axios = require('axios');

const API_URL = 'http://localhost:8000';

// Demo data
const testUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
};

const testTask = {
  title: 'Complete project documentation',
  description: 'Write comprehensive documentation for the microservices project',
  status: 'pending',
  priority: 'high',
  due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
};

async function runDemo() {
  console.log('🚀 Starting Task Management System Demo\n');

  try {
    // 1. Register a new user
    console.log('1. Registering new user...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
    const { user, token } = registerResponse.data.data;
    console.log('✅ User registered successfully:', user.name);
    console.log('Token:', token.substring(0, 20) + '...\n');

    // 2. Login with the user
    console.log('2. Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful\n');

    // 3. Create a task
    console.log('3. Creating a new task...');
    const createTaskResponse = await axios.post(`${API_URL}/tasks`, testTask, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const createdTask = createTaskResponse.data.data.task;
    console.log('✅ Task created successfully:', createdTask.title);
    console.log('Task ID:', createdTask.id, '\n');

    // 4. Get all tasks
    console.log('4. Fetching all tasks...');
    const tasksResponse = await axios.get(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const tasks = tasksResponse.data.data.tasks;
    console.log('✅ Found', tasks.length, 'tasks\n');

    // 5. Update the task
    console.log('5. Updating task status...');
    const updateResponse = await axios.put(`${API_URL}/tasks/${createdTask.id}`, {
      status: 'in_progress'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Task updated successfully\n');

    // 6. Get task statistics
    console.log('6. Fetching task statistics...');
    const statsResponse = await axios.get(`${API_URL}/tasks/stats/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const stats = statsResponse.data.data.stats;
    console.log('✅ Task statistics:', {
      total: stats.total_tasks,
      completed: stats.completed_tasks,
      pending: stats.pending_tasks,
      in_progress: stats.in_progress_tasks
    }, '\n');

    // 7. Get analytics data
    console.log('7. Fetching analytics data...');
    const analyticsResponse = await axios.get(`${API_URL}/analytics/stats/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const analytics = analyticsResponse.data.data.stats;
    console.log('✅ Analytics data:', {
      total_tasks: analytics.total_tasks,
      completed_tasks: analytics.completed_tasks,
      overdue_tasks: analytics.overdue_tasks
    }, '\n');

    // 8. Get user profile
    console.log('8. Fetching user profile...');
    const profileResponse = await axios.get(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profile = profileResponse.data.data.user;
    console.log('✅ User profile:', {
      name: profile.name,
      email: profile.email,
      role: profile.role
    }, '\n');

    // 9. Delete the task
    console.log('9. Deleting the task...');
    await axios.delete(`${API_URL}/tasks/${createdTask.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Task deleted successfully\n');

    console.log('🎉 Demo completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- User registration and authentication: ✅');
    console.log('- Task CRUD operations: ✅');
    console.log('- Analytics and statistics: ✅');
    console.log('- API Gateway routing: ✅');
    console.log('- Microservices communication: ✅');

  } catch (error) {
    console.error('❌ Demo failed:', error.response?.data?.message || error.message);
    console.log('\n💡 Make sure all services are running:');
    console.log('docker-compose up -d');
  }
}

// Run the demo
runDemo(); 