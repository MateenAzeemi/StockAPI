const express = require('express');
const router = express.Router();
const { runScheduledScrape } = require('../cron/schedule');
const logger = require('../utils/logger');

/**
 * Cron endpoint for Vercel Cron Jobs
 * This endpoint is called by Vercel's cron scheduler
 */
router.get('/scrape', async (req, res) => {
  try {
    logger.info('🔄 Vercel Cron Job Triggered');
    
    // Run the scheduled scrape
    await runScheduledScrape();
    
    res.json({
      success: true,
      message: 'Cron job executed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('❌ Error in cron endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Cron job failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

