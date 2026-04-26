# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Most endpoints (except auth) require a JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Routes (Public)

### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "role": "user"
}
```
**Response:** `201 Created`

### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```
**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## Players Routes (Protected)

### Get All Players
```http
GET /api/v1/players
Authorization: Bearer <token>
```
**Response:** `200 OK` - Array of players

### Get Player by ID
```http
GET /api/v1/players/:id
Authorization: Bearer <token>
```
**Response:** `200 OK` - Player object

### Create Player
```http
POST /api/v1/players
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "position": "Outfield",
  "number": 12
}
```
**Response:** `201 Created`

### Update Player
```http
PUT /api/v1/players/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "position": "Infield"
}
```
**Response:** `200 OK`

### Delete Player
```http
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
