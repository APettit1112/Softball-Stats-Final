# Production Readiness Checklist

Use this checklist to ensure your application is fully ready for deployment to Render.

## ✅ Code Readiness

- [x] **Environment Variables Configured**
  - JWT_SECRET: Required for authentication
  - DB_NAME: Optional (defaults to softball.db)
  - NODE_ENV: Set to 'production' on Render
  - PORT: Will be set by Render (defaults to 3000)
  - JWT_EXPIRES_IN: Optional (defaults to 24h)

- [x] **Package.json Scripts**
  - `start`: Runs production server (npm start)
  - `build`: No-op for Node.js (npm run build)
  - `test`: Runs test suite (npm test)
  - Engines: Node.js 18.x specified

- [x] **Error Handling**
  - Global error handler implemented
  - Environment-aware error responses
  - Production: Hides internal details
  - Development: Shows debugging info

- [x] **Security**
  - JWT token verification implemented
  - Password hashing with bcrypt
  - CORS enabled
  - Input validation on all endpoints
  - Authorization middleware for protected routes
  - Production warning for insecure defaults

- [x] **Database**
  - SQLite configured with proper initialization
  - No hardcoded database credentials
  - Database path uses environment variable
  - Models properly defined with relationships

## ✅ Deployment Files

- [x] `.env.example` - Reference for environment variables
- [x] `render.yaml` - Render deployment configuration
- [x] `DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions
- [x] `.gitignore` - Prevents committing sensitive files

## ✅ Documentation

- [x] `README.md` - Complete setup and API reference
- [x] `API_DOCUMENTATION.md` - Detailed endpoint documentation
- [x] `AUTHENTICATION.md` - Authentication/authorization guide
- [x] `Softball-Stats-API.postman_collection.json` - Postman collection for testing

## 🔍 Pre-Deployment Verification

### 1. Code Quality Check

```bash
# Install dependencies
npm install

# Run tests (should all pass)
npm test

# Check for console errors
npm start
# Ctrl+C to stop
```

### 2. Environment Variables Check

```bash
# Verify .env.example exists
cat .env.example

# Verify sensitive files are in .gitignore
cat .gitignore | grep -E "\.env|\.db|secret"
```

### 3. Security Validation

**JWT Secret Generation:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- Save this value - you'll use it for Render environment variables
- NEVER share this value or commit it to GitHub

**Password Strength:**
- Minimum 8 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character

### 4. Endpoint Verification

Start local server:
```bash
npm start
```

Test endpoints:
```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'

# Get players (use token from login response)
curl http://localhost:3000/api/players \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📋 Render Configuration Checklist

Before clicking "Create Web Service":

- [ ] GitHub repository is public
- [ ] Code is pushed to main branch
- [ ] Service name: `softball-stats-api`
- [ ] Environment: `Node`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment Variables Set:
  - [ ] NODE_ENV = production
  - [ ] JWT_SECRET = (your generated secret)
  - [ ] JWT_EXPIRES_IN = 24h
  - [ ] DB_NAME = softball.db
  - [ ] PORT = 3000

## 🧪 Post-Deployment Testing

### Test 1: Health Check
```bash
curl https://your-app-name.onrender.com/health
# Expected: {"status":"Server is running"}
```

### Test 2: Authentication Flow
```bash
# Register
curl -X POST https://your-app-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "produser",
    "email": "prod@example.com",
    "password": "SecurePassword123!"
  }'

# Login
curl -X POST https://your-app-name.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prod@example.com",
    "password": "SecurePassword123!"
  }'
```

### Test 3: Protected Routes
```bash
# Get all players (with valid token from login)
curl https://your-app-name.onrender.com/api/players \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected: {"success":true,"data":[],"pagination":{...}}
```

### Test 4: Authorization
```bash
# Test without token (should fail)
curl https://your-app-name.onrender.com/api/players
# Expected: {"success":false,"error":{"code":"NO_TOKEN",...}}

# Test with invalid token (should fail)
curl https://your-app-name.onrender.com/api/players \
  -H "Authorization: Bearer invalid-token"
# Expected: {"success":false,"error":{"code":"INVALID_TOKEN",...}}
```

### Test 5: Error Handling
```bash
# Invalid email format on register
curl -X POST https://your-app-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "email": "not-an-email",
    "password": "SecurePassword123!"
  }'
# Expected: Error with validation message

# Duplicate email
curl -X POST https://your-app-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "prod@example.com",
    "password": "SecurePassword123!"
  }'
# Expected: {"error":{"code":"DUPLICATE_EMAIL",...}}
```

## 🚀 Production Deployment Steps

1. **Local Testing**
   - [ ] Run full test suite: `npm test`
   - [ ] Start server: `npm start`
   - [ ] Test endpoints manually
   - [ ] Verify error handling

2. **Git Preparation**
   - [ ] Commit all changes
   - [ ] Ensure .env is in .gitignore
   - [ ] Push to GitHub: `git push origin main`

3. **Render Setup**
   - [ ] Log in to Render Dashboard
   - [ ] Create Web Service
   - [ ] Connect GitHub repository
   - [ ] Configure build and start commands
   - [ ] Add environment variables
   - [ ] Click "Create Web Service"

4. **Wait for Deployment**
   - [ ] Monitor build logs
   - [ ] Wait for "Live" status
   - [ ] Note your Render URL

5. **Post-Deployment Testing**
   - [ ] Test health endpoint
   - [ ] Test authentication
   - [ ] Test protected routes
   - [ ] Test authorization
   - [ ] Test error handling

6. **Monitoring**
   - [ ] Check Render logs regularly
   - [ ] Monitor for errors
   - [ ] Test endpoints weekly
   - [ ] Check database size

## 🔐 Production Security Best Practices

- **JWT Secret**: Change the secret regularly
- **Error Messages**: Don't expose database details in production
- **Database**: Use PostgreSQL for persistent data (not SQLite)
- **HTTPS**: Render provides automatic HTTPS
- **Logs**: Monitor for suspicious activity
- **Rate Limiting**: Consider adding rate limits (not implemented yet)
- **CORS**: Restrict to specific domains if needed

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build fails | Check npm dependencies, verify Node.js 18.x |
| App won't start | Check NODE_ENV, JWT_SECRET, verify logs |
| Auth not working | Verify JWT_SECRET is set, check token format |
| No data persists | Using SQLite - data resets on redeploy. Use PostgreSQL for persistence |
| CORS errors | CORS is enabled. Verify request format |
| Slow performance | Render free tier is shared. Upgrade to Standard for better performance |

## ✨ Next Steps After Successful Deployment

1. **Share API URL** - Provide `https://your-app.onrender.com` to frontend team
2. **Create Admin Account** - Register an admin user for testing
3. **Seed Production Data** - If needed, manually add test data
4. **Set Up Monitoring** - Consider Sentry or other error tracking
5. **Document API Changes** - Keep API_DOCUMENTATION.md updated
6. **Test Regularly** - Automated weekly tests recommended

---

**Deployment Status**: Ready for production deployment ✅

For detailed deployment steps, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
