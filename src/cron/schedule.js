const PreMarketStock = require('../models/PreMarketStock.model');
const CurrentMarketStock = require('../models/CurrentMarketStock.model');
const AfterMarketStock = require('../models/AfterMarketStock.model');
const timeService = require('../services/timeService');
const mergeService = require('../services/mergeService');
const logger = require('../utils/logger');
const delay = require('../utils/delay');

const scrapePreMarketBenzinga = require('../services/scraper/preMarketBenzinga');
const scrapePreMarketInvesting = require('../services/scraper/preMarketInvesting');
const scrapeCurrentMarketBenzinga = require('../services/scraper/currentMarketBenzinga');
const scrapeCurrentMarketInvestingGainers = require('../services/scraper/currentMarketInvestingGainers');
const scrapeCurrentMarketInvestingLosers = require('../services/scraper/currentMarketInvestingLosers');
const scrapeAfterMarketInvesting = require('../services/scraper/afterMarketInvesting');

async function saveStocksToDatabase(stocks, Model) {
  if (!stocks?.length) {
    logger.warn('No stocks to save');
    return;
  }

  const operations = stocks.map(stock => ({
    updateOne: {
      filter: { symbol: stock.symbol.toUpperCase(), source: stock.source },
      update: {
        $set: {
          symbol: stock.symbol.toUpperCase(),
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
          volume: stock.volume,
          source: stock.source,
          category: stock.category || 'neutral',
          lastUpdated: new Date()
        }
      },
      upsert: true
    }
  }));

  try {
    await Model.bulkWrite(operations);
    logger.info(`Saved ${stocks.length} stocks to ${Model.modelName}`);
  } catch (error) {
    logger.error(`Error saving stocks to ${Model.modelName}:`, error.message);
    throw error;
  }
}

async function runPreMarket() {
  if (timeService.getCurrentWindow() !== 'premarket') return;

  logger.info('🟩 Starting Pre-Market Scraping...');
  logger.info(`Current PKT Time: ${timeService.getFormattedPKTTime()}`);

  try {
    const benzingaStocks = await scrapePreMarketBenzinga();
    await delay(2000);
    const investingStocks = await scrapePreMarketInvesting();

    const mergedStocks = mergeService.mergeAndDeduplicateStocks(benzingaStocks, investingStocks);
    const normalizedStocks = mergeService.filterAndNormalizeStocks(mergedStocks);

    if (normalizedStocks.length > 0) {
      await saveStocksToDatabase(normalizedStocks, PreMarketStock);
      logger.info(`✅ Pre-Market: Saved ${normalizedStocks.length} stocks`);
    } else {
      logger.warn('⚠️ Pre-Market: No stocks found');
    }
  } catch (error) {
    logger.error('❌ Error in Pre-Market scraping:', error.message);
  }
}

async function runCurrentMarket() {
  if (timeService.getCurrentWindow() !== 'current') return;

  logger.info('🟦 Starting Current Market Scraping...');
  logger.info(`Current PKT Time: ${timeService.getFormattedPKTTime()}`);

  try {
    const benzingaStocks = await scrapeCurrentMarketBenzinga();
    await delay(2000);
    const investingGainers = await scrapeCurrentMarketInvestingGainers();
    await delay(2000);
    const investingLosers = await scrapeCurrentMarketInvestingLosers();

    const mergedStocks = mergeService.mergeAndDeduplicateStocks(benzingaStocks, investingGainers, investingLosers);
    const normalizedStocks = mergeService.filterAndNormalizeStocks(mergedStocks);

    if (normalizedStocks.length > 0) {
      await saveStocksToDatabase(normalizedStocks, CurrentMarketStock);
      logger.info(`✅ Current Market: Saved ${normalizedStocks.length} stocks`);
    } else {
      logger.warn('⚠️ Current Market: No stocks found');
    }
  } catch (error) {
    logger.error('❌ Error in Current Market scraping:', error.message);
  }
}

async function runAfterMarket() {
  if (timeService.getCurrentWindow() !== 'aftermarket') return;

  logger.info('🟨 Starting After-Market Scraping...');
  logger.info(`Current PKT Time: ${timeService.getFormattedPKTTime()}`);

  try {
    const investingStocks = await scrapeAfterMarketInvesting();
    const normalizedStocks = mergeService.filterAndNormalizeStocks(investingStocks);

    if (normalizedStocks.length > 0) {
      await saveStocksToDatabase(normalizedStocks, AfterMarketStock);
      logger.info(`✅ After-Market: Saved ${normalizedStocks.length} stocks`);
    } else {
      logger.warn('⚠️ After-Market: No stocks found');
    }
  } catch (error) {
    logger.error('❌ Error in After-Market scraping:', error.message);
  }
}

async function runScheduledScrape() {
  const window = timeService.getCurrentWindow();
  const pktTime = timeService.getFormattedPKTTime();
  
  logger.info(`\n🔄 Cron Job Triggered - PKT Time: ${pktTime}`);
  logger.info(`Current Window: ${window || 'Outside market windows'}`);

  if (!window) {
    logger.info('⏸️ Outside market windows, skipping scrape');
    return;
  }

  try {
    switch (window) {
      case 'premarket':
        await runPreMarket();
        break;
      case 'current':
        await runCurrentMarket();
        break;
      case 'aftermarket':
        await runAfterMarket();
        break;
    }
  } catch (error) {
    logger.error('❌ Error in scheduled scrape:', error.message);
  }
}

module.exports = {
  runPreMarket,
  runCurrentMarket,
  runAfterMarket,
  runScheduledScrape
};

