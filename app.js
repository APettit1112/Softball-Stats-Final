const express = require('express');
require('dotenv').config();

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const usersRoutes = require('./routes/users');
const playersRoutes = require('./routes/players');
const gamesRoutes = require('./routes/games');
const statsRoutes = require('./routes/stats');

const app = express();

app.use(express.json());
app.use(logger);

app.use('/api', usersRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/stats', statsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

module.exports = app;
