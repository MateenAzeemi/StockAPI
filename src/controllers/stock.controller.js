const asyncHandler = require('../utils/asyncHandler');
const marketWindowStockService = require('../services/marketWindowStock.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Stock Controller
 * Handles user-facing stock requests
 */
class StockController {
  /**
   * Get Pre-Market Stocks
   * GET /api/stocks/premarket
   */
  getPreMarketStocks = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getPreMarketStocks(page, 50);
    
    return successResponse(res, result, 'Pre-market stocks retrieved successfully');
  });

  /**
   * Get Current Market Stocks
   * GET /api/stocks/current
   */
  getCurrentMarketStocks = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getCurrentMarketStocks(page, 50);
    
    return successResponse(res, result, 'Current market stocks retrieved successfully');
  });

  /**
   * Get After-Market Stocks
   * GET /api/stocks/aftermarket
   */
  getAfterMarketStocks = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getAfterMarketStocks(page, 50);
    
    return successResponse(res, result, 'After-market stocks retrieved successfully');
  });

  /**
   * Get Pre-Market Gainers (New Market Window Endpoint)
   * GET /api/stocks/premarket/gainers
   */
  getPreMarketGainersNew = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getPreMarketGainers(page, 20);
    
    return successResponse(res, result, 'Pre-market gainers retrieved successfully');
  });

  /**
   * Get Pre-Market Losers (New Market Window Endpoint)
   * GET /api/stocks/premarket/losers
   */
  getPreMarketLosersNew = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getPreMarketLosers(page, 20);
    
    return successResponse(res, result, 'Pre-market losers retrieved successfully');
  });

  /**
   * Get Current Market Gainers
   * GET /api/stocks/current/gainers
   */
  getCurrentMarketGainers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getCurrentMarketGainers(page, 20);
    
    return successResponse(res, result, 'Current market gainers retrieved successfully');
  });

  /**
   * Get Current Market Losers
   * GET /api/stocks/current/losers
   */
  getCurrentMarketLosers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getCurrentMarketLosers(page, 20);
    
    return successResponse(res, result, 'Current market losers retrieved successfully');
  });

  /**
   * Get After-Market Gainers
   * GET /api/stocks/aftermarket/gainers
   */
  getAfterMarketGainers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getAfterMarketGainers(page, 20);
    
    return successResponse(res, result, 'After-market gainers retrieved successfully');
  });

  /**
   * Get After-Market Losers
   * GET /api/stocks/aftermarket/losers
   */
  getAfterMarketLosers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    
    if (page < 1) {
      return errorResponse(res, 'Page must be greater than 0', 400);
    }

    const result = await marketWindowStockService.getAfterMarketLosers(page, 20);
    
    return successResponse(res, result, 'After-market losers retrieved successfully');
  });

}

module.exports = new StockController();
