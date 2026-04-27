# Authentication Implementation Guide

## Implementation Status

### b. Registration Route ✓
**Endpoint:** `POST /api/v1/auth/register`

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

**Features:**
- Username validation (required, non-empty)
-  Email validation (required, format check)
-  Password validation (required, min 6 characters)
-  Password hashing with bcrypt (10 salt rounds)
-  Duplicate username prevention
-  Duplicate email prevention
-  Saves to database

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

**Error Cases:**
- 400: Missing required fields
- 409: Username already taken
- 409: Email already registered

---

### c. Login Route ✓
**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Features:**
-  Username/password validation (required fields)
-  User lookup by username
-  Password verification with bcrypt.compare()
-  JWT token generation
-  Token expires in 24 hours (configurable)

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

**Error Cases:**
- 400: Missing username or password
- 401: Invalid username or password

---

### d. Auth Middleware ✓
**Location:** `middleware/auth.js`

**verifyToken Middleware:**
-  Checks Authorization header for Bearer token
-  Validates JWT signature
-  Decodes token and extracts user data
-  Handles token expiration
-  Attaches user to `req.user`

**Usage:**
```javascript
const { verifyToken, requireRole } = require('../middleware/auth');

// Protect a route
router.get('/admin-only', verifyToken, requireRole('admin'), handler);
```

**Token Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Error Responses:**
- 401: No token provided
- 401: Token has expired
- 401: Invalid token

---

### e. Protected Routes ✓

All resource routes are protected with JWT authentication:

#### Players Endpoints
```
GET    /api/v1/players          - Get all players (requires auth)
GET    /api/v1/players/:id      - Get player by ID (requires auth)
POST   /api/v1/players          - Create player (requires auth)
PUT    /api/v1/players/:id      - Update player (requires auth)
DELETE /api/v1/players/:id      - Delete player (requires auth)
```

#### Games Endpoints
```
GET    /api/v1/games            - Get all games (requires auth)
POST   /api/v1/games            - Create game (requires auth)
PUT    /api/v1/games/:id        - Update game (requires auth)
DELETE /api/v1/games/:id        - Delete game (requires auth)
```

#### Stats Endpoints
```
GET    /api/v1/stats            - Get all stats (requires auth)
GET    /api/v1/stats/:playerId  - Get player stats (requires auth)
POST   /api/v1/stats            - Create stat (requires auth)
PUT    /api/v1/stats/:id        - Update stat (requires auth)
DELETE /api/v1/stats/:id        - Delete stat (requires auth)
```

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ USER REGISTRATION & LOGIN FLOW                              │
└─────────────────────────────────────────────────────────────┘

1. REGISTRATION FLOW:
   User (username, email, password)
        ↓
   POST /api/v1/auth/register
        ↓
   Validate inputs (email, password strength)
        ↓
   Check for duplicates
        ↓
   Hash password (bcrypt)
        ↓
   Save to database
        ↓
   Return user data (201 Created)

2. LOGIN FLOW:
   User (username, password)
        ↓
   POST /api/v1/auth/login
        ↓
   Validate inputs
        ↓
   Find user by username
        ↓
   Verify password (bcrypt.compare)
        ↓
   Generate JWT token
        ↓
   Return token + user data (200 OK)

3. PROTECTED ROUTE FLOW:
   Client sends request with Authorization header:
   GET /api/v1/players
   Authorization: Bearer <token>
        ↓
   Middleware extracts token from header
        ↓
   Verify JWT signature
        ↓
   Decode token → req.user = { id, username, role }
        ↓
   Route handler executes with authenticated user
        ↓
   Return protected resource
```

---

## Configuration

### Environment Variables (.env)
```
NODE_ENV=development
PORT=3000

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

DB_NAME=database.db
```

### Key Dependencies
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT generation and verification
- `dotenv` - Environment variable management

---

## Testing Authentication

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### 2. Login to Get Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### 3. Access Protected Route with Token
```bash
curl -X GET http://localhost:3000/api/v1/players \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 4. Try Accessing Without Token (Should Fail)
```bash
curl -X GET http://localhost:3000/api/v1/players
# Response: 401 Unauthorized - No token provided
```

---

## Security Features Implemented

 Password hashing with bcrypt (10 salt rounds)
 JWT token-based authentication
 Token expiration (24 hours)
 Email format validation
 Password strength requirements (min 6 characters)
 Duplicate user prevention
 Secure password comparison
 Protected routes via middleware Role-based access control ready (requireRole middleware)
 Error handling without exposing sensitive data

---

## Route Protection Implementation

### Public Routes (No Auth Required)
```
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /health
```

### Protected Routes (Auth Required)
```
All other routes:
- /api/v1/players/*
- /api/v1/games/*
- /api/v1/stats/*
```

### How Protection Works

In `routes/index.js`:
```javascript
// Public routes
router.use('/auth', usersRoutes);

// Apply verifyToken middleware
router.use(verifyToken);

// Protected routes
router.use('/players', playersRoutes);
router.use('/games', gamesRoutes);
router.use('/stats', statsRoutes);
```

All requests to `/api/v1/players`, `/api/v1/games`, and `/api/v1/stats` **must** include a valid JWT token in the Authorization header.
