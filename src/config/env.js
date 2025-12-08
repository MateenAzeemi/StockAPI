require('dotenv').config();

/**
 * Environment Configuration
 * Validates and exports environment variables
 */
module.exports = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/stockmarket',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production');
    }
    return 'fallback-secret-change-in-production-min-32-chars';
  })(),
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // Scraper
  BENZINGA_URL: process.env.BENZINGA_URL || 'https://www.benzinga.com/premarket',
  CRON_SCHEDULE: process.env.CRON_SCHEDULE || '*/5 * * * *',
};

