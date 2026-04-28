const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stock');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost',
      'http://localhost:80',
      'http://localhost:5173',
      'http://127.0.0.1',
      'http://127.0.0.1:5173',
    ];

    // Allow requests with no origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'FreshTrack API is running',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stock', stockRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;