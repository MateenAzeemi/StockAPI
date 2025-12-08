const logger = require('../utils/logger');

function mergeAndDeduplicateStocks(...stockArrays) {
  const stockMap = new Map();
  const allStocks = stockArrays.flat();
  
  logger.info(`Merging ${allStocks.length} stocks from ${stockArrays.length} sources`);
  
  allStocks.forEach(stock => {
    if (!stock?.symbol) return;
    
    const symbol = stock.symbol.toUpperCase();
    const existingStock = stockMap.get(symbol);
    
    if (!existingStock) {
      stockMap.set(symbol, {
        ...stock,
        symbol,
        lastUpdated: stock.lastUpdated || new Date()
      });
    } else {
      const existingTime = existingStock.lastUpdated ? new Date(existingStock.lastUpdated).getTime() : 0;
      const newTime = stock.lastUpdated ? new Date(stock.lastUpdated).getTime() : Date.now();
      
      const shouldUpdate = stock.price > existingStock.price || 
                          newTime > existingTime || 
                          (!existingStock.lastUpdated && stock.lastUpdated);
      
      if (shouldUpdate) {
        stockMap.set(symbol, {
          ...existingStock,
          ...stock,
          symbol,
          lastUpdated: stock.lastUpdated || new Date(),
          sources: existingStock.sources || [existingStock.source],
          source: stock.source
        });
      } else {
        if (!existingStock.price && stock.price) existingStock.price = stock.price;
        if (!existingStock.change && stock.change) existingStock.change = stock.change;
        if (!existingStock.changePercent && stock.changePercent) existingStock.changePercent = stock.changePercent;
        if (!existingStock.volume && stock.volume) existingStock.volume = stock.volume;
      }
    }
  });
  
  const mergedStocks = Array.from(stockMap.values());
  logger.info(`Merged to ${mergedStocks.length} unique stocks`);
  return mergedStocks;
}

function normalizeStock(stock) {
  return {
    symbol: (stock.symbol || '').toUpperCase().trim(),
    name: (stock.name || '').trim(),
    price: typeof stock.price === 'number' ? stock.price : parseFloat(stock.price) || 0,
    change: typeof stock.change === 'number' ? stock.change : parseFloat(stock.change) || 0,
    changePercent: typeof stock.changePercent === 'number' ? stock.changePercent : parseFloat(stock.changePercent) || 0,
    volume: stock.volume || 0,
    source: stock.source || 'unknown',
    category: stock.category || 'neutral',
    lastUpdated: stock.lastUpdated ? new Date(stock.lastUpdated) : new Date()
  };
}

function validateStock(stock) {
  if (!stock?.symbol?.trim()) return false;
  if (!stock?.name?.trim()) return false;
  if (!stock?.price || stock.price <= 0) return false;
  if (!stock?.source) return false;
  return true;
}

function filterAndNormalizeStocks(stocks) {
  return stocks.filter(validateStock).map(normalizeStock);
}

module.exports = {
  mergeAndDeduplicateStocks,
  normalizeStock,
  validateStock,
  filterAndNormalizeStocks
};

