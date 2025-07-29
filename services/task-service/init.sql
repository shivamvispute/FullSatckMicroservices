-- Task Management System Database Schema

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  user_id TEXT NOT NULL,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
-- INSERT INTO tasks (title, description, status, priority, user_id, due_date) VALUES
-- ('Complete project documentation', 'Write comprehensive documentation for the microservices project', 'pending', 'high', 1, CURRENT_TIMESTAMP + INTERVAL '7 days'),
-- ('Review code changes', 'Review pull requests and provide feedback', 'in_progress', 'medium', 1, CURRENT_TIMESTAMP + INTERVAL '2 days'),
-- ('Setup development environment', 'Install and configure all required tools and dependencies', 'completed', 'high', 1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- ('Write unit tests', 'Create comprehensive unit tests for all modules', 'pending', 'medium', 1, CURRENT_TIMESTAMP + INTERVAL '5 days'),
-- ('Deploy to staging', 'Deploy the application to staging environment for testing', 'pending', 'urgent', 1, CURRENT_TIMESTAMP + INTERVAL '1 day')
-- ON CONFLICT DO NOTHING; 