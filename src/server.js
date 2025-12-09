require('dotenv').config();
const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/database');
const { initializeCron } = require('./cron');
const logger = require('./utils/logger');

/**
 * Server Startup
 * Connects to database and starts Express server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    logger.info('🔄 Connecting to database...');
    await connectDB();
    
    // Start Server
    const server = app.listen(config.PORT, () => {
      logger.info(`🚀 Server running on port ${config.PORT}`);
      logger.info(`📊 Environment: ${config.NODE_ENV}`);
      logger.info(`🌐 Health check: http://localhost:${config.PORT}/health`);
      logger.info(`📡 API Base: http://localhost:${config.PORT}/api`);
    });
    
    // Initialize Cron Jobs (only if not on Vercel)
    // Vercel handles cron jobs via vercel.json crons configuration
    if (!process.env.VERCEL) {
      initializeCron();
    }
    
    return server;
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
let serverInstance = null;

startServer().then(server => {
  serverInstance = server;
});

/**
 * Graceful Shutdown
 */
const gracefulShutdown = (signal) => {
  process.on(signal, async () => {
    logger.info(`${signal} signal received: closing HTTP server`);
    
    // Close Puppeteer browser
    try {
      const { closeBrowser } = require('./utils/fetchHtmlWithPuppeteer');
      await closeBrowser();
      logger.info('Puppeteer browser closed');
    } catch (error) {
      logger.error('Error closing browser:', error.message);
    }
    
    if (serverInstance) {
      serverInstance.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    } else {
      // Wait a bit for server to start if it hasn't yet
      setTimeout(() => {
        if (serverInstance) {
          serverInstance.close(() => {
            logger.info('HTTP server closed');
            process.exit(0);
          });
        } else {
          process.exit(0);
        }
      }, 1000);
    }
  });
};

gracefulShutdown('SIGTERM');
gracefulShutdown('SIGINT');

module.exports = startServer;
