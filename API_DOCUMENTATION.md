# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints (except /auth) require a JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints (Public)

### POST /auth/register
Register a new user account.

**Request Body:**
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

**Validation Rules:**
- username: Required, unique, non-empty
- email: Required, valid email format, unique
- password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char

**Error Cases:**
- `400 Bad Request` - Missing or invalid fields
- `409 Conflict` - Username or email already exists

---

### POST /auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
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

**Request Headers:**
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

## ⚾ Players Endpoints (Protected)

### GET /players
Get all players with pagination, search, and sorting.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Records per page
- `search` (optional) - Search by player name or position
- `sortBy` (optional, default: createdAt) - Sort field
- `sortOrder` (optional, default: DESC) - ASC or DESC

**Request:**
```
GET /api/players?page=1&limit=10&search=john
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
- `400 Bad Request` - Invalid ID format

---

### POST /players
Create a new player.

**Request Body:**
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
- name: Required, non-empty string
- position: Required, non-empty string
- number: Required, integer 1-999

---

### PUT /players/:id
Update a player record.

**Request Body:**
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

---

### DELETE /players/:id
Delete a player record.

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

---

## 🏀 Games Endpoints (Protected)

### GET /games
Get all games with pagination, search, and sorting.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Records per page
- `search` (optional) - Search by opponent or location
- `sortBy` (optional, default: date) - Sort field
- `sortOrder` (optional, default: DESC) - ASC or DESC

**Request:**
```
GET /api/games?page=1&limit=10&sortBy=date
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

---

### POST /games
Create a new game record.

**Request Body:**
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
- opponent: Required, non-empty string
- date: Required, valid date format (YYYY-MM-DD)
- location: Required, non-empty string
- score: Optional

---

### PUT /games/:id
Update a game record.

**Request Body:**
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

---

### DELETE /games/:id
Delete a game record.

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

---

## 📊 Player Statistics Endpoints (Protected)

### GET /stats
Get all player statistics with pagination and sorting.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Records per page
- `sortBy` (optional, default: createdAt) - Sort field
- `sortOrder` (optional, default: DESC) - ASC or DESC

**Request:**
```
GET /api/stats?page=1&limit=10
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
Get statistics for a specific player.

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

---

### GET /stats/record/:id
Get a specific stat record by ID.

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

---

### POST /stats
Create a new player statistics record.

**Request Body:**
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
- playerId: Required, valid player ID
- gameId: Required, valid game ID
- hits: Optional, non-negative integer (default: 0)
- runs: Optional, non-negative integer (default: 0)
- rbis: Optional, non-negative integer (default: 0)
- strikeouts: Optional, non-negative integer (default: 0)

---

### PUT /stats/:id
Update a player statistics record.

**Request Body:**
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

---

### DELETE /stats/:id
Delete a player statistics record.

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

---

## 👤 User Management Endpoints (Protected)

### GET /users
Get all users (Admin only).

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Records per page
- `search` (optional) - Search by username or email

**Request:**
```
GET /api/users?page=1&limit=10
Authorization: Bearer <admin_token>
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

**Authorization:** Admin role required

---

### GET /users/:id
Get a specific user by ID.

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

**Authorization:** User (own profile) or Admin (any profile)

---

### PUT /users/:id
Update user profile.

**Request Body:**
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

**Authorization:** User (own profile) or Admin (any profile)

---

### DELETE /users/:id
Delete a user account (Admin only).

**Request:**
```
DELETE /api/users/1
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Authorization:** Admin role required

---

## ⚠️ Error Handling

The API returns standardized error responses:

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

## 📝 Notes

- All timestamps are in ISO 8601 format
- Pagination defaults: page=1, limit=10
- Authentication token expires in 24 hours
- All request bodies must have Content-Type: application/json

DELETE /api/v1/players/:id
Authorization: Bearer <token>
```
**Response:** `200 OK` - Confirmation message

---

## Games Routes (Protected)

### Get All Games
```http
GET /api/v1/games
Authorization: Bearer <token>
```
**Response:** `200 OK` - Array of games

### Create Game
```http
POST /api/v1/games
Authorization: Bearer <token>
Content-Type: application/json

{
  "opponent": "Team A",
  "date": "2024-05-15",
  "location": "Stadium 1",
  "score": "5-3"
}
```
**Response:** `201 Created`

### Update Game
```http
PUT /api/v1/games/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "score": "6-3"
}
```
**Response:** `200 OK`

### Delete Game
```http
DELETE /api/v1/games/:id
Authorization: Bearer <token>
```
**Response:** `200 OK` - Confirmation message

---

## Stats Routes (Protected)

### Get All Stats
```http
GET /api/v1/stats
Authorization: Bearer <token>
```
**Response:** `200 OK` - Array of stats with player and game details

### Get Stats for Specific Player
```http
GET /api/v1/stats/:playerId
Authorization: Bearer <token>
```
**Response:** `200 OK` - Array of stats for the player

### Create Stat Record
```http
POST /api/v1/stats
Authorization: Bearer <token>
Content-Type: application/json

{
  "playerId": 1,
  "gameId": 1,
  "hits": 3,
  "runs": 2,
  "rbis": 1,
  "strikeouts": 0
}
```
**Response:** `201 Created`

### Update Stat Record
```http
PUT /api/v1/stats/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "hits": 4,
  "rbis": 2
}
```
**Response:** `200 OK`

### Delete Stat Record
```http
DELETE /api/v1/stats/:id
Authorization: Bearer <token>
```
**Response:** `200 OK` - Confirmation message

---

## Error Responses

### 400 Bad Request
Missing or invalid required fields

### 401 Unauthorized
Missing or invalid JWT token

### 403 Forbidden
Insufficient permissions for the requested action

### 404 Not Found
Resource not found

### 409 Conflict
Resource already exists (e.g., username taken)

### 500 Internal Server Error
Server error

---

## Health Check

### Check Server Status
```http
GET /health
```
**Response:** `200 OK`
```json
{
  "status": "Server is running"
}
```
