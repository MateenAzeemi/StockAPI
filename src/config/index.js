require('dotenv').config();

/**
 * Application Configuration
 * Centralized configuration management
 */
module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/stockmarket',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // CSRF Configuration
  CSRF_SECRET: process.env.CSRF_SECRET || 'csrf-secret-change-in-production',

  // Scraper Configuration
  BENZINGA_URL: process.env.BENZINGA_URL || 'https://www.benzinga.com/premarket',
  CRON_SCHEDULE: process.env.CRON_SCHEDULE || '*/5 * * * *', // Every 5 minutes
};
