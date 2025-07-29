# Full-Stack Microservices Task Management System

## Overview
A comprehensive task management application built with microservices architecture, featuring user authentication, task CRUD operations, and analytics.

## Architecture

### Services
1. **User Service** - Authentication & Authorization
   - User registration and login
   - JWT token generation and validation
   - User profile management

2. **Task Service** - Core Business Logic
   - CRUD operations for tasks
   - Task ownership validation
   - Task status management

3. **Analytics Service** - Reporting & Statistics
   - Generate task statistics
   - Performance metrics
   - Data aggregation

4. **API Gateway** - Service Communication
   - Route requests to appropriate services
   - Handle authentication middleware
   - Load balancing

5. **Frontend** - React Application
   - Responsive design
   - Token-based authentication
   - Form validation

## Technology Stack
- **Backend**: Node.js/Express
- **Frontend**: React
- **Databases**: MongoDB (User Service), PostgreSQL (Task Service), SQLite (Analytics Service)
- **Communication**: REST APIs
- **Containerization**: Docker

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- npm or yarn

### Running the Application

1. **Clone and setup:**
```bash
git clone <repository-url>
cd FullStackProject
```

2. **Start all services:**
```bash
docker-compose up -d
```

3. **Access the application:**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- User Service: http://localhost:8001
- Task Service: http://localhost:8002
- Analytics Service: http://localhost:8003

### Manual Setup (Alternative)

1. **Install dependencies:**
```bash
# User Service
cd services/user-service && npm install

# Task Service
cd ../task-service && npm install

# Analytics Service
cd ../analytics-service && npm install

# API Gateway
cd ../api-gateway && npm install

# Frontend
cd ../../frontend && npm install
```

2. **Set up databases:**
- MongoDB for User Service
- PostgreSQL for Task Service
- SQLite for Analytics Service

3. **Start services:**
```bash
# Start each service in separate terminals
cd services/user-service && npm start
cd services/task-service && npm start
cd services/analytics-service && npm start
cd services/api-gateway && npm start
cd frontend && npm start
```

## API Documentation

### User Service Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Task Service Endpoints
- `GET /tasks` - List user's tasks
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get specific task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Analytics Service Endpoints
- `GET /analytics/stats/:userId` - User task statistics
- `GET /analytics/summary` - Overall system summary

## Database Schemas

### User Service (MongoDB)
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Service (PostgreSQL)
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Analytics Service (SQLite)
```sql
CREATE TABLE task_statistics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  total_tasks INTEGER,
  completed_tasks INTEGER,
  pending_tasks INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Service Communication

### Authentication Flow
1. User logs in through User Service
2. User Service generates JWT token
3. Frontend stores token in localStorage
4. API Gateway validates token for protected routes
5. Services communicate with user context

### Task Operations
1. Frontend sends requests to API Gateway
2. API Gateway validates JWT and forwards to Task Service
3. Task Service validates user ownership
4. Task Service returns response through API Gateway

### Analytics
1. Analytics Service queries Task Service for data
2. Aggregates statistics and stores in local database
3. Provides summary endpoints for dashboard

## Error Handling & Resilience

### Service Failures
- API Gateway implements circuit breaker pattern
- Frontend shows appropriate error messages
- Services have health check endpoints

### Data Consistency
- Each service maintains its own database
- Eventual consistency through periodic data sync
- Transaction boundaries within each service

## Scaling Considerations

### Horizontal Scaling
- Each service can be scaled independently
- Load balancers can be added for each service
- Database read replicas for high-traffic services

### Monitoring
- Health check endpoints for each service
- Logging and error tracking
- Performance metrics collection

## Development

### Adding New Features
1. Define API contracts between services
2. Implement service-specific logic
3. Update API Gateway routes
4. Add frontend components
5. Update documentation

### Testing
- Unit tests for each service
- Integration tests for service communication
- End-to-end tests for complete workflows

## Assumptions & Design Decisions

1. **Database per Service**: Each service has its own database for data isolation
2. **JWT Authentication**: Stateless authentication across services
3. **REST APIs**: Simple and widely supported communication protocol
4. **Docker**: Containerization for easy deployment and scaling
5. **Eventual Consistency**: Analytics data is updated periodically rather than real-time

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 3000, 8000-8003 are available
2. **Database connections**: Check database credentials and connections
3. **CORS issues**: Verify API Gateway CORS configuration
4. **JWT issues**: Check token expiration and secret configuration

### Logs
```bash
# View service logs
docker-compose logs -f [service-name]

# View all logs
docker-compose logs -f
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License
MIT License 