const PreMarketStock = require('../models/PreMarketStock.model');
const CurrentMarketStock = require('../models/CurrentMarketStock.model');
const AfterMarketStock = require('../models/AfterMarketStock.model');

/**
 * Market Window Stock Service
 * Handles stock data for pre-market, current market, and after-market windows
 */
class MarketWindowStockService {
  /**
   * Format stock for API response
   * @private
   * @param {Object} stock - Stock document
   * @returns {Object} Formatted stock
   */
  _formatStock(stock) {
    const stockObj = stock.toObject ? stock.toObject() : stock;
    
    return {
      id: stockObj._id ? stockObj._id.toString() : stockObj.id || '',
      name: stockObj.name || '',
      symbol: stockObj.symbol || '',
      price: stockObj.price || 0,
      change: stockObj.change || 0,
      changePercent: stockObj.changePercent || 0,
      volume: stockObj.volume !== undefined ? stockObj.volume : 0,
      source: stockObj.source || 'unknown'
    };
  }

  /**
   * Get Pre-Market Stocks
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated stocks
   */
  async getPreMarketStocks(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [stocks, total] = await Promise.all([
      PreMarketStock.find()
        .sort({ changePercent: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PreMarketStock.countDocuments()
    ]);

    return {
      stocks: stocks.map(this._formatStock),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    };
  }

  /**
   * Get Current Market Stocks
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated stocks
   */
  async getCurrentMarketStocks(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [stocks, total] = await Promise.all([
      CurrentMarketStock.find()
        .sort({ changePercent: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CurrentMarketStock.countDocuments()
    ]);

    return {
      stocks: stocks.map(this._formatStock),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    };
  }

  /**
   * Get After-Market Stocks
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated stocks
   */
  async getAfterMarketStocks(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [stocks, total] = await Promise.all([
      AfterMarketStock.find()
        .sort({ changePercent: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AfterMarketStock.countDocuments()
    ]);

    return {
      stocks: stocks.map(this._formatStock),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total: total,
      totalItems: total
    };
  }

  /**
   * Get Pre-Market Gainers
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated gainers
   */
  async getPreMarketGainers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [stocks, total] = await Promise.all([
      PreMarketStock.find({ changePercent: { $gt: 0 } })
        .sort({ changePercent: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PreMarketStock.countDocuments({ changePercent: { $gt: 0 } })
    ]);

    return {
      stocks: stocks.map(this._formatStock),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total: total,
      totalItems: total
    };
  }

  /**
   * Get Pre-Market Losers
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated losers
   */
  async getPreMarketLosers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Find stocks where changePercent < 0 OR (changePercent is 0/null and change < 0)
    const [stocks, total] = await Promise.all([
      PreMarketStock.find({
        $or: [
          { changePercent: { $lt: 0 } },
          { 
            $and: [
              { $or: [{ changePercent: 0 }, { changePercent: null }, { changePercent: { $exists: false } }] },
              { change: { $lt: 0 } }
            ]
          }
        ]
      })
        .sort({ changePercent: 1, change: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PreMarketStock.countDocuments({
        $or: [
          { changePercent: { $lt: 0 } },
          { 
            $and: [
              { $or: [{ changePercent: 0 }, { changePercent: null }, { changePercent: { $exists: false } }] },
              { change: { $lt: 0 } }
            ]
          }
        ]
      })
    ]);

    return {
      stocks: stocks.map(this._formatStock),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total: total,
      totalItems: total
    };
  }

  /**
   * Get Current Market Gainers
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated gainers
   */
  async getCurrentMarketGainers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Find stocks where category is 'gainer' OR changePercent > 0
    const [stocks, total] = await Promise.all([
      CurrentMarketStock.find({
        $or: [
          { category: 'gainer' },
          { changePercent: { $gt: 0 } }
        ]
      })
        .sort({ changePercent: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CurrentMarketStock.countDocuments({
        $or: [
          { category: 'gainer' },
          { changePercent: { $gt: 0 } }
        ]
      })
    ]);

    return {
      stocks: stocks.map(this._formatStock),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total: total,
      totalItems: total
    };
  }

  /**
   * Get Current Market Losers
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated losers
   */
  async getCurrentMarketLosers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Find stocks where category is 'loser' OR changePercent < 0 OR (changePercent is 0/null and change < 0)
    const [stocks, total] = await Promise.all([
      CurrentMarketStock.find({
        $or: [
          { category: 'loser' },
          { changePercent: { $lt: 0 } },
          { 
            $and: [
              { $or: [{ changePercent: 0 }, { changePercent: null }, { changePercent: { $exists: false } }] },
              { change: { $lt: 0 } }
            ]
          }
        ]
      })
        .sort({ changePercent: 1, change: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CurrentMarketStock.countDocuments({
        $or: [
          { category: 'loser' },
          { changePercent: { $lt: 0 } },
          { 
            $and: [
              { $or: [{ changePercent: 0 }, { changePercent: null }, { changePercent: { $exists: false } }] },
              { change: { $lt: 0 } }
            ]
          }
        ]
      })
    ]);

    return {
      stocks: stocks.map(this._formatStock),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total: total,
      totalItems: total
    };
  }

  /**
   * Get After-Market Gainers
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated gainers
   */
  async getAfterMarketGainers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [stocks, total] = await Promise.all([
      AfterMarketStock.find({ changePercent: { $gt: 0 } })
        .sort({ changePercent: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AfterMarketStock.countDocuments({ changePercent: { $gt: 0 } })
    ]);

    return {
      stocks: stocks.map(this._formatStock),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    };
  }

  /**
   * Get After-Market Losers
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated losers
   */
  async getAfterMarketLosers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Find stocks where changePercent < 0 OR (changePercent is 0/null and change < 0)
    const [stocks, total] = await Promise.all([
      AfterMarketStock.find({
        $or: [
          { changePercent: { $lt: 0 } },
          { 
            $and: [
              { $or: [{ changePercent: 0 }, { changePercent: null }, { changePercent: { $exists: false } }] },
              { change: { $lt: 0 } }
            ]
          }
        ]
      })
        .sort({ changePercent: 1, change: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AfterMarketStock.countDocuments({
        $or: [
          { changePercent: { $lt: 0 } },
          { 
            $and: [
              { $or: [{ changePercent: 0 }, { changePercent: null }, { changePercent: { $exists: false } }] },
              { change: { $lt: 0 } }
            ]
          }
        ]
      })
    ]);

    return {
      stocks: stocks.map(this._formatStock),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total: total,
      totalItems: total
    };
  }

  /**
   * Get single market stock by ID
   * @param {String} marketType - 'current', 'pre', or 'after'
   * @param {String} id - Stock ID
   * @returns {Object} Stock object
   */
  async getMarketStockById(marketType, id) {
    let StockModel;
    switch (marketType) {
      case 'current':
        StockModel = CurrentMarketStock;
        break;
      case 'pre':
        StockModel = PreMarketStock;
        break;
      case 'after':
        StockModel = AfterMarketStock;
        break;
      default:
        throw new Error('Invalid market type');
    }

    const stock = await StockModel.findById(id).lean();
    if (!stock) {
      throw new Error('Stock not found');
    }

    return this._formatStock(stock);
  }

  /**
   * Create market stock
   * @param {String} marketType - 'current', 'pre', or 'after'
   * @param {Object} stockData - Stock data
   * @returns {Object} Created stock
   */
  async createMarketStock(marketType, stockData) {
    let StockModel;
    switch (marketType) {
      case 'current':
        StockModel = CurrentMarketStock;
        break;
      case 'pre':
        StockModel = PreMarketStock;
        break;
      case 'after':
        StockModel = AfterMarketStock;
        break;
      default:
        throw new Error('Invalid market type');
    }

    // Use 'investing' as default source for manual entries (models require benzinga or investing)
    const stock = new StockModel({
      symbol: stockData.symbol?.toUpperCase() || '',
      name: stockData.name || '',
      price: stockData.price || 0,
      change: stockData.change || 0,
      changePercent: stockData.changePercent || 0,
      volume: stockData.volume || 0,
      source: 'investing', // Using 'investing' as default for manual entries
      lastUpdated: new Date()
    });

    const savedStock = await stock.save();
    return this._formatStock(savedStock);
  }

  /**
   * Update market stock
   * @param {String} marketType - 'current', 'pre', or 'after'
   * @param {String} id - Stock ID
   * @param {Object} stockData - Stock data
   * @returns {Object} Updated stock
   */
  async updateMarketStock(marketType, id, stockData) {
    let StockModel;
    switch (marketType) {
      case 'current':
        StockModel = CurrentMarketStock;
        break;
      case 'pre':
        StockModel = PreMarketStock;
        break;
      case 'after':
        StockModel = AfterMarketStock;
        break;
      default:
        throw new Error('Invalid market type');
    }

    const stock = await StockModel.findByIdAndUpdate(
      id,
      {
        $set: {
          symbol: stockData.symbol?.toUpperCase() || undefined,
          name: stockData.name || undefined,
          price: stockData.price !== undefined ? stockData.price : undefined,
          change: stockData.change !== undefined ? stockData.change : undefined,
          changePercent: stockData.changePercent !== undefined ? stockData.changePercent : undefined,
          volume: stockData.volume !== undefined ? stockData.volume : undefined,
          lastUpdated: new Date()
        }
      },
      { new: true, runValidators: true }
    ).lean();

    if (!stock) {
      throw new Error('Stock not found');
    }

    return this._formatStock(stock);
  }

  /**
   * Delete market stock
   * @param {String} marketType - 'current', 'pre', or 'after'
   * @param {String} id - Stock ID
   * @returns {Object} Deletion result
   */
  async deleteMarketStock(marketType, id) {
    let StockModel;
    switch (marketType) {
      case 'current':
        StockModel = CurrentMarketStock;
        break;
      case 'pre':
        StockModel = PreMarketStock;
        break;
      case 'after':
        StockModel = AfterMarketStock;
        break;
      default:
        throw new Error('Invalid market type');
    }

    const stock = await StockModel.findByIdAndDelete(id);
    if (!stock) {
      throw new Error('Stock not found');
    }

    return { id: stock._id.toString() };
  }
}

module.exports = new MarketWindowStockService();

