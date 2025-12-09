require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/env');

// Import Routes
const stockRoutes = require('./routes/stock.routes');
const adminRoutes = require('./routes/admin.routes');
const authRoutes = require('./routes/auth.routes');
const cronRoutes = require('./routes/cron.routes');

// Import Controllers
const stockController = require('./controllers/stock.controller');

// Import Middleware
const errorHandler = require('./middleware/errorHandler.middleware');

/**
 * Express Application Setup
 * Main application configuration and middleware
 */
const app = express();

// ==================== Middleware ====================

// CORS Configuration
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie Parser
app.use(cookieParser());

// Database Connection Middleware (required for Vercel serverless)
// Ensures MongoDB connection is established before handling requests
const mongoose = require('mongoose');
const connectDB = require('./config/database');

let connectionPromise = null;

async function ensureConnection() {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  // Start new connection
  connectionPromise = connectDB()
    .catch((error) => {
      // Reset promise on error so we can retry
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

app.use(async (req, res, next) => {
  try {
    await ensureConnection();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Request Logger (Development)
if (config.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ==================== Routes ====================

// PUBLIC Routes (No Authentication Required)
// Stock endpoints - accessible to all users for landing page
app.use('/api/stocks', stockRoutes);

// PROTECTED Routes (Authentication Required)
// Admin endpoints - require admin role
app.use('/api/admin', adminRoutes);

// Auth endpoints - public for login/signup
app.use('/api/auth', authRoutes);

// Cron endpoints - for Vercel Cron Jobs
app.use('/api/cron', cronRoutes);

// Backward compatibility: Map old /api/data to new /api/stocks/home
app.get('/api/data', async (req, res, next) => {
  return stockController.getHomeData(req, res, next);
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Stock Market API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      stocks: '/api/stocks',
      admin: '/api/admin',
      auth: '/api/auth'
    }
  });
});

// ==================== Error Handling ====================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global Error Handler (must be last)
app.use(errorHandler);

module.exports = app;
