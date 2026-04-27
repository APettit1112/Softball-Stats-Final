# Softball Stats API

##  Project Overview

The **Softball Stats API** is a comprehensive REST API built with Node.js, Express, and Sequelize (SQLite). It provides a complete backend solution for managing softball team data, including players, games, player statistics, and user authentication with role-based access control.

### Key Features
-  **User Authentication & Authorization** - JWT-based authentication with role-based access control (Admin, User)
-  **Player Management** - Create, read, update, and delete player records
-  **Game Tracking** - Manage game records with opponent, date, location, and score
-  **Player Statistics** - Track individual player performance metrics per game (hits, runs, RBIs, strikeouts)
-  **Comprehensive Error Handling** - Detailed error messages with custom error codes
-  **Pagination & Filtering** - Built-in pagination, search, and sorting capabilities
-  **Input Validation** - Robust validation for all endpoints
-  **Middleware Protection** - Request logging, authentication, and authorization middleware

---

## 🗄️ Database Structure

The API uses a relational database with the following models:

### Models & Relationships
- **Users** - User accounts with authentication credentials and roles
- **Players** - Softball team player records
- **Games** - Game records with opponent and score information
- **PlayerStats** - Individual player performance statistics for each game

### Entity Relationships
```
Players (1) ← → (many) PlayerStats
Games (1) ← → (many) PlayerStats
```

---

##  Setup Instructions

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/APettit1112/Softball-Stats-Final.git
cd Softball-Stats-Final
```

2. **Install dependencies**

```bash
npm install
```

3. **Initialize the database**
```bash
npm run setup
```

4. **Seed sample data (optional)**
```bash
npm run seed
```

5. **Start the server**
```bash
npm start
```

The API will be available at `http://localhost:3000/api`

---

##  Authentication Guide

### Overview
The API uses **JWT (JSON Web Tokens)** for authentication. All protected endpoints require a valid JWT token in the Authorization header.

### Getting Started with Authentication

#### 1. Register a New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

#### 3. Using the Token
Include the token in the Authorization header for all protected requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 4. Logout
```http
POST /api/auth/logout
Authorization: Bearer <your_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful. Remove token on client side."
}
```

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

---

## 👥 User Roles & Permissions

### Admin Role
| Permission | Description |
|-----------|-------------|
| `canViewAllUsers` | View all user profiles and admin panel |
| `canDeleteUsers` | Delete any user account |
| `canManageAllTasks` | Manage all system tasks |
| `canViewAllRecords` | Access all records in the system |
| `canDeleteAnyRecord` | Delete any record |
| `canManageRoles` | Assign and modify user roles |

### User Role
| Permission | Description |
|-----------|-------------|
| `canViewProfile` | View own user profile |
| `canEditProfile` | Edit own user profile |
| `canViewPublicData` | Access publicly shared data |
| Standard CRUD | Create, read, update, delete own records |

---

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

---

## 🔑 Authentication Endpoints (Public)

### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Cases:**
- `400 Bad Request` - Missing or invalid fields
- `409 Conflict` - Username or email already exists

---

### POST /auth/login
Authenticate a user and receive a JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Error Cases:**
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Missing required fields

---

### POST /auth/logout
Logout the current user. Token removal is handled client-side.

**Request:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful. Remove token on client side."
}
```

---

## 👤 User Management Endpoints (Protected)

### GET /users
Get all users (Admin only).

**Authorization:** Requires Admin role

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of records per page
- `search` (optional) - Search users by username or email

**Request:**
```
GET /api/users?page=1&limit=10&search=john
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-04-20T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

**Error Cases:**
- `403 Forbidden` - User is not an admin
- `401 Unauthorized` - Invalid or missing token

---

### GET /users/:id
Get a specific user by ID. Users can view their own profile; admins can view any profile.

**Authorization:** Required (any authenticated user)

**Request:**
```
GET /api/users/1
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-04-20T10:00:00Z"
  }
}
```

**Error Cases:**
- `403 Forbidden` - Cannot view another user's profile
- `404 Not Found` - User not found
- `401 Unauthorized` - Invalid or missing token

---

### PUT /users/:id
Update user profile. Users can update their own profile; admins can update any user.

**Authorization:** Required (any authenticated user)

**Request:**
```json
{
  "username": "john_doe_updated",
  "email": "john_updated@example.com",
  "password": "NewSecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "username": "john_doe_updated",
    "email": "john_updated@example.com",
    "role": "user"
  }
}
```

**Error Cases:**
- `403 Forbidden` - Cannot update another user's profile
- `404 Not Found` - User not found
- `409 Conflict` - Email or username already exists

---

### DELETE /users/:id
Delete a user account (Admin only).

**Authorization:** Requires Admin role

**Request:**
```
DELETE /api/users/1
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Cases:**
- `403 Forbidden` - User is not an admin
- `404 Not Found` - User not found

---

## ⚾ Players Endpoints (Protected)

### GET /players
Get all players with pagination, search, and sorting.

**Authorization:** Required

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Records per page
- `search` (optional) - Search by player name or position
- `sortBy` (optional, default: createdAt) - Sort field (name, position, createdAt)
- `sortOrder` (optional, default: DESC) - ASC or DESC

**Request:**
```
GET /api/players?page=1&limit=10&search=john&sortBy=name&sortOrder=ASC
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Smith",
      "position": "Pitcher",
      "number": 12,
      "createdAt": "2026-04-20T10:00:00Z",
      "updatedAt": "2026-04-20T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### GET /players/:id
Get a specific player by ID.

**Authorization:** Required

**Request:**
```
GET /api/players/1
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Smith",
    "position": "Pitcher",
    "number": 12,
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  }
}
```

**Error Cases:**
- `404 Not Found` - Player not found
- `400 Bad Request` - Invalid player ID format

---

### POST /players
Create a new player.

**Authorization:** Required

**Request:**
```json
{
  "name": "John Smith",
  "position": "Pitcher",
  "number": 12
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Player created successfully",
  "data": {
    "id": 1,
    "name": "John Smith",
    "position": "Pitcher",
    "number": 12,
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  }
}
```

**Validation Rules:**
- `name` - Required, non-empty string
- `position` - Required, non-empty string
- `number` - Required, integer between 1-999

**Error Cases:**
- `400 Bad Request` - Missing or invalid fields
- `400 Bad Request` - Jersey number out of valid range

---

### PUT /players/:id
Update a player record.

**Authorization:** Required

**Request:**
```json
{
  "name": "John Smith Updated",
  "position": "Outfield",
  "number": 13
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Player updated successfully",
  "data": {
    "id": 1,
    "name": "John Smith Updated",
    "position": "Outfield",
    "number": 13,
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:01Z"
  }
}
```

**Error Cases:**
- `404 Not Found` - Player not found
- `400 Bad Request` - Invalid fields

---

### DELETE /players/:id
Delete a player record.

**Authorization:** Required

**Request:**
```
DELETE /api/players/1
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Player deleted successfully"
}
```

**Error Cases:**
- `404 Not Found` - Player not found
- `400 Bad Request` - Invalid player ID format

---

## 🏀 Games Endpoints (Protected)

### GET /games
Get all games with pagination, search, and sorting.

**Authorization:** Required

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Records per page
- `search` (optional) - Search by opponent, location, or score
- `sortBy` (optional, default: date) - Sort field (date, opponent, location)
- `sortOrder` (optional, default: DESC) - ASC or DESC

**Request:**
```
GET /api/games?page=1&limit=10&search=tigers&sortBy=date&sortOrder=DESC
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "opponent": "Tigers",
      "date": "2026-04-20",
      "location": "Home Stadium",
      "score": "5-3",
      "createdAt": "2026-04-20T10:00:00Z",
      "updatedAt": "2026-04-20T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### GET /games/:id
Get a specific game by ID.

**Authorization:** Required

**Request:**
```
GET /api/games/1
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "opponent": "Tigers",
    "date": "2026-04-20",
    "location": "Home Stadium",
    "score": "5-3",
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  }
}
```

**Error Cases:**
- `404 Not Found` - Game not found
- `400 Bad Request` - Invalid game ID format

---

### POST /games
Create a new game record.

**Authorization:** Required

**Request:**
```json
{
  "opponent": "Tigers",
  "date": "2026-04-20",
  "location": "Home Stadium",
  "score": "5-3"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Game created successfully",
  "data": {
    "id": 1,
    "opponent": "Tigers",
    "date": "2026-04-20",
    "location": "Home Stadium",
    "score": "5-3",
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  }
}
```

**Validation Rules:**
- `opponent` - Required, non-empty string
- `date` - Required, valid date format (YYYY-MM-DD)
- `location` - Required, non-empty string
- `score` - Optional, string format

**Error Cases:**
- `400 Bad Request` - Missing required fields
- `400 Bad Request` - Invalid date format

---

### PUT /games/:id
Update a game record.

**Authorization:** Required

**Request:**
```json
{
  "opponent": "Lions",
  "date": "2026-04-21",
  "location": "Away Stadium",
  "score": "4-2"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Game updated successfully",
  "data": {
    "id": 1,
    "opponent": "Lions",
    "date": "2026-04-21",
    "location": "Away Stadium",
    "score": "4-2",
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:01:00Z"
  }
}
```

**Error Cases:**
- `404 Not Found` - Game not found
- `400 Bad Request` - Invalid fields

---

### DELETE /games/:id
Delete a game record.

**Authorization:** Required

**Request:**
```
DELETE /api/games/1
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Game deleted successfully"
}
```

**Error Cases:**
- `404 Not Found` - Game not found
- `400 Bad Request` - Invalid game ID format

---

## 📊 Player Statistics Endpoints (Protected)

### GET /stats
Get all player statistics with pagination and sorting.

**Authorization:** Required

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Records per page
- `sortBy` (optional, default: createdAt) - Sort field
- `sortOrder` (optional, default: DESC) - ASC or DESC

**Request:**
```
GET /api/stats?page=1&limit=10&sortBy=hits&sortOrder=DESC
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "playerId": 1,
      "gameId": 1,
      "hits": 2,
      "runs": 1,
      "rbis": 3,
      "strikeouts": 0,
      "player": {
        "id": 1,
        "name": "John Smith",
        "position": "Pitcher",
        "number": 12
      },
      "game": {
        "id": 1,
        "opponent": "Tigers",
        "date": "2026-04-20",
        "location": "Home Stadium",
        "score": "5-3"
      },
      "createdAt": "2026-04-20T10:00:00Z",
      "updatedAt": "2026-04-20T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### GET /stats/:playerId
Get all statistics for a specific player.

**Authorization:** Required

**Request:**
```
GET /api/stats/1
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "playerId": 1,
      "gameId": 1,
      "hits": 2,
      "runs": 1,
      "rbis": 3,
      "strikeouts": 0,
      "player": {...},
      "game": {...},
      "createdAt": "2026-04-20T10:00:00Z",
      "updatedAt": "2026-04-20T10:00:00Z"
    }
  ],
  "count": 1
}
```

**Error Cases:**
- `404 Not Found` - Player not found or no statistics found

---

### GET /stats/record/:id
Get a specific stat record by ID.

**Authorization:** Required

**Request:**
```
GET /api/stats/record/1
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "playerId": 1,
    "gameId": 1,
    "hits": 2,
    "runs": 1,
    "rbis": 3,
    "strikeouts": 0,
    "player": {...},
    "game": {...},
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  }
}
```

**Error Cases:**
- `404 Not Found` - Stat record not found

---

### POST /stats
Create a new player statistics record.

**Authorization:** Required

**Request:**
```json
{
  "playerId": 1,
  "gameId": 1,
  "hits": 2,
  "runs": 1,
  "rbis": 3,
  "strikeouts": 0
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Stat record created successfully",
  "data": {
    "id": 1,
    "playerId": 1,
    "gameId": 1,
    "hits": 2,
    "runs": 1,
    "rbis": 3,
    "strikeouts": 0,
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  }
}
```

**Validation Rules:**
- `playerId` - Required, valid player ID
- `gameId` - Required, valid game ID
- `hits` - Optional, non-negative integer (default: 0)
- `runs` - Optional, non-negative integer (default: 0)
- `rbis` - Optional, non-negative integer (default: 0)
- `strikeouts` - Optional, non-negative integer (default: 0)

**Error Cases:**
- `400 Bad Request` - Missing required fields
- `404 Not Found` - Player or game not found

---

### PUT /stats/:id
Update a player statistics record.

**Authorization:** Required

**Request:**
```json
{
  "hits": 3,
  "runs": 2,
  "rbis": 4,
  "strikeouts": 1
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Stat record updated successfully",
  "data": {
    "id": 1,
    "playerId": 1,
    "gameId": 1,
    "hits": 3,
    "runs": 2,
    "rbis": 4,
    "strikeouts": 1,
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:01Z"
  }
}
```

**Error Cases:**
- `404 Not Found` - Stat record not found
- `400 Bad Request` - Invalid fields

---

### DELETE /stats/:id
Delete a player statistics record.

**Authorization:** Required

**Request:**
```
DELETE /api/stats/1
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Stat record deleted successfully"
}
```

**Error Cases:**
- `404 Not Found` - Stat record not found

---

## ⚠️ Error Handling

The API uses standardized error responses with the following format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `DUPLICATE_USERNAME` | 409 | Username already exists |
| `DUPLICATE_EMAIL` | 409 | Email already exists |
| `INVALID_CREDENTIALS` | 401 | Wrong username or password |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `INVALID_TOKEN` | 401 | Invalid or malformed JWT token |

---

## 📖 Technology Stack

- **Runtime:** Node.js 18.x
- **Framework:** Express.js 5.2.1
- **Database:** SQLite with Sequelize ORM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Testing:** Jest & Supertest
- **CORS:** Enabled for cross-origin requests

---

## 🧪 Testing

Run the test suite:

```bash
npm test
```

The test suite includes:
- Authentication endpoint tests (register, login, logout)
- Authorization middleware tests
- Protected endpoint tests
- Error scenario and edge case tests
- Player, Game, and Stats CRUD tests

---

## 📝 Environment Variables

Create a `.env` file in the root directory (optional - defaults are provided):

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_NAME=softball_stats.db

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**APettit1112**

GitHub: [https://github.com/APettit1112](https://github.com/APettit1112)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues or questions, please open an issue on the GitHub repository.