# API Documentation - Task Management System

## Overview
This document provides comprehensive API documentation for the Task Management System microservices architecture.

## Base URL
- **API Gateway**: `http://localhost:8000`
- **User Service**: `http://localhost:8001`
- **Task Service**: `http://localhost:8002`
- **Analytics Service**: `http://localhost:8003`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## User Service Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "lastLogin": "2023-12-01T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/verify
Verify JWT token validity.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

### User Profile

#### GET /user/profile
Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2023-12-01T10:00:00.000Z",
      "updatedAt": "2023-12-01T10:30:00.000Z"
    }
  }
}
```

#### PUT /user/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "role": "user"
    }
  }
}
```

---

## Task Service Endpoints

### Tasks

#### GET /tasks
Get all tasks for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `search` (optional): Search in title and description

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Complete project documentation",
        "description": "Write comprehensive documentation",
        "status": "pending",
        "priority": "high",
        "user_id": 1,
        "due_date": "2023-12-08T10:00:00.000Z",
        "created_at": "2023-12-01T10:00:00.000Z",
        "updated_at": "2023-12-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

#### POST /tasks
Create a new task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the microservices project",
  "status": "pending",
  "priority": "high",
  "due_date": "2023-12-08T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the microservices project",
      "status": "pending",
      "priority": "high",
      "user_id": 1,
      "due_date": "2023-12-08T10:00:00.000Z",
      "created_at": "2023-12-01T10:00:00.000Z",
      "updated_at": "2023-12-01T10:00:00.000Z"
    }
  }
}
```

#### GET /tasks/:id
Get a specific task.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the microservices project",
      "status": "pending",
      "priority": "high",
      "user_id": 1,
      "due_date": "2023-12-08T10:00:00.000Z",
      "created_at": "2023-12-01T10:00:00.000Z",
      "updated_at": "2023-12-01T10:00:00.000Z"
    }
  }
}
```

#### PUT /tasks/:id
Update a task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "in_progress",
  "priority": "urgent"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the microservices project",
      "status": "in_progress",
      "priority": "urgent",
      "user_id": 1,
      "due_date": "2023-12-08T10:00:00.000Z",
      "created_at": "2023-12-01T10:00:00.000Z",
      "updated_at": "2023-12-01T10:30:00.000Z"
    }
  }
}
```

#### DELETE /tasks/:id
Delete a task.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "task": {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the microservices project",
      "status": "in_progress",
      "priority": "urgent",
      "user_id": 1,
      "due_date": "2023-12-08T10:00:00.000Z",
      "created_at": "2023-12-01T10:00:00.000Z",
      "updated_at": "2023-12-01T10:30:00.000Z"
    }
  }
}
```

### Task Statistics

#### GET /tasks/stats/summary
Get task statistics for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_tasks": 5,
      "completed_tasks": 2,
      "pending_tasks": 2,
      "in_progress_tasks": 1,
      "cancelled_tasks": 0,
      "urgent_tasks": 1,
      "high_priority_tasks": 2,
      "overdue_tasks": 0
    }
  }
}
```

#### GET /tasks/status/:status
Get tasks by status.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Complete project documentation",
        "status": "pending",
        "priority": "high"
      }
    ]
  }
}
```

#### GET /tasks/overdue
Get overdue tasks.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 2,
        "title": "Review code changes",
        "status": "pending",
        "due_date": "2023-11-30T10:00:00.000Z"
      }
    ]
  }
}
```

---

## Analytics Service Endpoints

### User Analytics

#### GET /analytics/stats/:userId
Get user task statistics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "user_id": 1,
      "total_tasks": 5,
      "completed_tasks": 2,
      "pending_tasks": 2,
      "in_progress_tasks": 1,
      "cancelled_tasks": 0,
      "urgent_tasks": 1,
      "high_priority_tasks": 2,
      "overdue_tasks": 0,
      "updated_at": "2023-12-01T10:30:00.000Z"
    }
  }
}
```

#### GET /analytics/trends/:userId
Get task completion trends.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": {
      "completion_rate": 40.0,
      "total_tasks": 5,
      "completed_tasks": 2,
      "overdue_tasks": 0,
      "urgent_tasks": 1
    }
  }
}
```

#### GET /analytics/productivity/:userId
Get productivity metrics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "productivity_score": 75.0,
      "tasks_completed": 2,
      "tasks_pending": 2,
      "overdue_tasks": 0,
      "urgent_tasks": 1,
      "efficiency_rating": "Good"
    }
  }
}
```

#### GET /analytics/dashboard/:userId
Get comprehensive dashboard data.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "dashboard": {
      "stats": {
        "total_tasks": 5,
        "completed_tasks": 2,
        "pending_tasks": 2,
        "in_progress_tasks": 1
      },
      "trends": {
        "completion_rate": 40.0,
        "total_tasks": 5,
        "completed_tasks": 2
      },
      "productivity": {
        "productivity_score": 75.0,
        "efficiency_rating": "Good"
      }
    }
  }
}
```

### System Analytics

#### GET /analytics/summary
Get overall system summary (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_users": 10,
      "total_tasks": 50,
      "completed_tasks": 25,
      "active_tasks": 25,
      "created_at": "2023-12-01T10:30:00.000Z"
    }
  }
}
```

---

## API Gateway Endpoints

### Health Checks

#### GET /health
Check API Gateway health.

**Response:**
```json
{
  "status": "OK",
  "service": "API Gateway",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "uptime": 3600,
  "services": {
    "user": "http://localhost:8001",
    "task": "http://localhost:8002",
    "analytics": "http://localhost:8003"
  }
}
```

#### GET /services/health
Check health of all microservices.

**Response:**
```json
{
  "success": true,
  "data": {
    "gateway": {
      "status": "OK",
      "timestamp": "2023-12-01T10:30:00.000Z"
    },
    "services": {
      "user": {
        "status": "OK",
        "response": {
          "status": "OK",
          "service": "User Service"
        }
      },
      "task": {
        "status": "OK",
        "response": {
          "status": "OK",
          "service": "Task Service"
        }
      },
      "analytics": {
        "status": "OK",
        "response": {
          "status": "OK",
          "service": "Analytics Service"
        }
      }
    }
  }
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

### Validation Errors
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

---

## Data Models

### User Model
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "isActive": true,
  "lastLogin": "2023-12-01T10:30:00.000Z",
  "createdAt": "2023-12-01T10:00:00.000Z",
  "updatedAt": "2023-12-01T10:30:00.000Z"
}
```

### Task Model
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the microservices project",
  "status": "pending",
  "priority": "high",
  "user_id": 1,
  "due_date": "2023-12-08T10:00:00.000Z",
  "created_at": "2023-12-01T10:00:00.000Z",
  "updated_at": "2023-12-01T10:00:00.000Z"
}
```

### Task Status Values
- `pending` - Task is waiting to be started
- `in_progress` - Task is currently being worked on
- `completed` - Task has been finished
- `cancelled` - Task has been cancelled

### Task Priority Values
- `low` - Low priority task
- `medium` - Medium priority task
- `high` - High priority task
- `urgent` - Urgent priority task

---

## Rate Limiting
- **Authentication endpoints**: 100 requests per 15 minutes
- **Task endpoints**: 100 requests per 15 minutes
- **Analytics endpoints**: 100 requests per 15 minutes
- **API Gateway**: 200 requests per 15 minutes

---

## Testing
Use the provided `demo.js` script to test the complete system:

```bash
node demo.js
```

This will test all major functionality including user registration, authentication, task CRUD operations, and analytics. 