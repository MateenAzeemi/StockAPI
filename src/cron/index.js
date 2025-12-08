const cron = require('node-cron');
const config = require('../config/env');
const { runScheduledScrape } = require('./schedule');
const logger = require('../utils/logger');
const timeService = require('../services/timeService');

function initializeCron() {
  const cronSchedule = config.CRON_SCHEDULE || '*/5 * * * *';
  
  logger.info(`📅 Initializing cron job with schedule: ${cronSchedule}`);
  logger.info('⏰ Market Windows (PKT):');
  logger.info('   Pre-Market: 2:30 PM → 7:30 PM');
  logger.info('   Current Market: 7:30 PM → 2:00 AM');
  logger.info('   After-Market: 2:00 AM → 6:00 AM');

  cron.schedule(cronSchedule, async () => {
    await runScheduledScrape();
  });

  logger.info('✅ Cron job scheduled successfully');
  
  const currentWindow = timeService.getCurrentWindow();
  if (currentWindow) {
    logger.info(`🚀 Running initial scrape (current window: ${currentWindow})`);
    runScheduledScrape().catch(error => {
      logger.error('❌ Error in initial scrape:', error.message);
    });
  } else {
    logger.info('⏸️ Outside market windows, skipping initial scrape');
  }
}

module.exports = {
  initializeCron
};

