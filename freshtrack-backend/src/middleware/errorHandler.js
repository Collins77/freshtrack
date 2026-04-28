const errorHandler = (err, req, res, next) => {
  console.error('ERROR:', err);

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(400).json({
      status: 'error',
      message: 'A record with that value already exists.',
    });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      status: 'error',
      message: 'Referenced record does not exist.',
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;