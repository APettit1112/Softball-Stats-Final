# Deployment Guide - Render

This guide provides step-by-step instructions for deploying the Softball Stats API to Render.

## Prerequisites

- A [Render account](https://render.com) (sign up free)
- Your repository pushed to GitHub
- Node.js 18.x or higher (Render will use this version)

---

## Step 1: Prepare Your Application

### 1.1 Environment Variables
Create a `.env` file locally for testing (already in .gitignore):

```bash
PORT=3000
NODE_ENV=production
DB_NAME=softball.db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

**Important:** Never commit `.env` to GitHub. Use the provided `.env.example` as a reference.

### 1.2 Generate a Secure JWT Secret

Run this command to generate a secure random string for production:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - you'll need this for Render environment variables.

### 1.3 Verify package.json Scripts

Ensure your `package.json` has the correct scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "setup": "node database/db.js",
    "seed": "node database/seed.js",
    "test": "jest --runInBand --detectOpenHandles --forceExit",
    "dev": "node server.js",
    "build": "echo 'No build step required for Node.js'"
  },
  "engines": {
    "node": "18.x"
  }
}
```

---

## Step 2: Prepare GitHub Repository

### 2.1 Commit and Push Changes

Ensure all code is committed and pushed:

```bash
git add .
git commit -m "chore: prepare for Render deployment"
git push origin main
```

### 2.2 Verify Repository is Public

Your repository should be public for Render to access it. You can change this in GitHub repository settings if needed.

---

## Step 3: Create Render Web Service

### 3.1 Log in to Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Sign in with your GitHub account

### 3.2 Create a New Web Service

1. Click **New +** button
2. Select **Web Service**
3. Select **Build and deploy from a Git repository**
4. Click **GitHub** to connect (or select existing GitHub account)

### 3.3 Configure the Web Service

**Step 1: Select Repository**
- Search for and select `Softball-Stats-Final`
- Click **Connect**

**Step 2: Configure Service**

Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | `softball-stats-api` |
| **Environment** | `Node` |
| **Region** | Choose closest to your users (e.g., `Ohio`) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Starter` (free tier) or `Standard` (paid) |

### 3.4 Add Environment Variables

In the **Environment** section, click **Add Environment Variable** for each:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DB_NAME` | `softball.db` |
| `JWT_SECRET` | *(paste your generated secret from Step 1.2)* |
| `JWT_EXPIRES_IN` | `24h` |

**⚠️ Important:** 
- Never share the JWT_SECRET value
- Each deployment gets a fresh SQLite database
- For persistent data across deployments, consider PostgreSQL (Render offers a free tier)

### 3.5 Deploy

1. Click **Create Web Service**
2. Render will start building your application
3. Wait for the deployment to complete (usually 2-3 minutes)
4. You'll receive a URL like: `https://softball-stats-api.onrender.com`

---

## Step 4: Test Your Deployed API

### 4.1 Test Health Endpoint

```bash
curl https://softball-stats-api.onrender.com/health
```

Expected response:
```json
{
  "status": "Server is running"
}
```

### 4.2 Test Authentication

**Register a new user:**
```bash
curl -X POST https://softball-stats-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

Expected response (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "user"
  }
}
```

**Login:**
```bash
curl -X POST https://softball-stats-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

Expected response (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "role": "user"
    }
  }
}
```

### 4.3 Test Protected Endpoint

Use the token from login response:

```bash
curl https://softball-stats-api.onrender.com/api/players \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

Expected response (200 OK):
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "pages": 0
  }
}
```

### 4.4 Use Postman Collection

Import the `Softball-Stats-API.postman_collection.json` file:

1. Open Postman
2. Click **Import**
3. Select the collection file
4. Update the `baseUrl` variable to your Render URL
5. Run requests from the collection

---

## Step 5: Important Considerations

### 5.1 Database Persistence

**Current Setup (SQLite):**
- Database file is stored locally on the Render instance
- ⚠️ **Data is reset when the service restarts** or during deployments
- Good for testing/development

**For Production (Recommended):**
- Use PostgreSQL instead of SQLite
- Render offers a free PostgreSQL database
- Steps to add PostgreSQL:
  1. In Render Dashboard, click **New +** → **PostgreSQL**
  2. Create a new database
  3. Copy the connection string
  4. Update your application to use PostgreSQL instead of SQLite
  5. Add `DATABASE_URL` environment variable in your web service

### 5.2 Auto-Deploy on Git Push

Render automatically redeploys your application when you push to the connected GitHub branch.

To prevent this, go to service settings → **Auto-Deploy** and toggle it off.

### 5.3 Monitoring and Logs

View logs in real-time:
1. Go to your service in Render Dashboard
2. Click **Logs** tab
3. Monitor for errors and performance issues

### 5.4 Environment-Specific Behavior

Your application already has environment-specific behavior:

- **Production (NODE_ENV=production):**
  - Error responses don't include request path/method details
  - Security-focused error messages
  - DATABASE_URL takes precedence if set

- **Development (NODE_ENV=development):**
  - Detailed error responses with debugging info
  - Request path and method included in error responses

---

## Step 6: Troubleshooting

### Build Fails
- Check that `npm install` can complete successfully
- Ensure all dependencies are in `package.json`
- Check Render build logs for specific errors

### Application Won't Start
- Verify environment variables are set correctly
- Check the Start Command: `npm start`
- Review Render logs for startup errors

### Database Connection Issues
- If using SQLite: database file should be created automatically
- If using PostgreSQL: ensure `DATABASE_URL` is set correctly
- Check database credentials

### Authentication Not Working
- Verify `JWT_SECRET` environment variable is set
- Ensure `Authorization` header is in correct format: `Bearer <token>`
- Check that token hasn't expired

### CORS Errors
- The application has CORS enabled
- If accessing from a specific domain, you may need to restrict CORS in `app.js`

---

## Step 7: Next Steps

### 7.1 Enable Custom Domain (Optional)
1. In Render Dashboard, go to your service
2. Click **Settings** → **Custom Domain**
3. Enter your domain name
4. Follow DNS configuration instructions

### 7.2 Set Up Error Monitoring (Optional)
Consider using services like Sentry for production error tracking:
```bash
npm install @sentry/node
```

### 7.3 Enable HTTPS (Automatic)
Render automatically provides HTTPS for all services - no additional configuration needed!

---

## Deployment Commands Summary

```bash
# Local testing before deployment
npm install
npm run setup
npm start

# Check for issues
npm test

# View environment
cat .env.example

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Support

For issues during deployment:
1. Check Render build and runtime logs
2. Review this guide for common issues
3. Verify environment variables are set
4. Check GitHub repository is public and properly connected

---

## API Endpoints Reference

After deployment, all endpoints are available at:
```
https://softball-stats-api.onrender.com/api/
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete endpoint reference.

See [README.md](./README.md) for local setup and development instructions.
