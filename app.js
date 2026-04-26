const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();

// ============================================
// GLOBAL MIDDLEWARE
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);

// ============================================
// API ROUTES (v1)
// ============================================

app.use('/api/v1', apiRoutes);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ============================================
// 404 NOT FOUND HANDLER
// ============================================

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// ============================================
// ERROR HANDLER (must be last)
// ============================================

app.use(errorHandler);

module.exports = app;
