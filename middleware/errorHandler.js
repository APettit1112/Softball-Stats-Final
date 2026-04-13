module.exports = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const response = {
    error: err.message || 'Internal server error',
  };

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    response.details = err.errors.map((error) => error.message);
  }

  res.status(status).json(response);
};
