const app = require('./src/app');
const pool = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Test DB connection before starting server
pool.connect()
  .then(client => {
    console.log('PostgreSQL connected successfully');
    client.release();

    // Only start server if DB connects
    app.listen(PORT, () => {
      console.log(`FreshTrack server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  });