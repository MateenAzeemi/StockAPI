const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

/**
 * Stock Routes
 * User-facing stock endpoints (public, no authentication required)
 */

// GET /api/stocks/premarket/gainers?page=1 - Get pre-market gainers (new market window endpoint)
router.get('/premarket/gainers', stockController.getPreMarketGainersNew);

// GET /api/stocks/premarket/losers?page=1 - Get pre-market losers (new market window endpoint)
router.get('/premarket/losers', stockController.getPreMarketLosersNew);

// GET /api/stocks/premarket - Get pre-market stocks
router.get('/premarket', stockController.getPreMarketStocks);

// GET /api/stocks/current/gainers?page=1 - Get current market gainers
router.get('/current/gainers', stockController.getCurrentMarketGainers);

// GET /api/stocks/current/losers?page=1 - Get current market losers
router.get('/current/losers', stockController.getCurrentMarketLosers);

// GET /api/stocks/current - Get current market stocks
router.get('/current', stockController.getCurrentMarketStocks);

// GET /api/stocks/aftermarket/gainers?page=1 - Get after-market gainers
router.get('/aftermarket/gainers', stockController.getAfterMarketGainers);

// GET /api/stocks/aftermarket/losers?page=1 - Get after-market losers
router.get('/aftermarket/losers', stockController.getAfterMarketLosers);

// GET /api/stocks/aftermarket - Get after-market stocks
router.get('/aftermarket', stockController.getAfterMarketStocks);

module.exports = router;
