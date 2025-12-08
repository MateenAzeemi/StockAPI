const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config');

/**
 * Scraper Service
 * Handles all web scraping logic for stock data
 */
class ScraperService {
  /**
   * Scrape Benzinga premarket data
   * @returns {Promise<Object|null>} Stock data with gainers and losers
   */
  async scrapeBenzinga() {
    try {
      const { data } = await axios.get(config.BENZINGA_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(data);
      const gainers = [];
      const losers = [];

      // Helper function to extract data from table
      const extractTableData = (headerText, targetArray) => {
        const header = $(`h3:contains("${headerText}")`);
        if (header.length) {
          let $table = header.parent().next().find('table');
          
          if ($table.length === 0) {
            $table = header.next('div').find('table');
          }

          if ($table.length) {
            $table.find('tbody tr').each((i, row) => {
              const cols = $(row).find('td');
              if (cols.length >= 2) {
                const symbol = $(cols[0]).text().trim();
                const name = $(cols[1]).text().trim();
                const price = $(cols[2]).text().trim();
                const change = $(cols[3]).text().trim();
                const col4 = $(cols[4]).text().trim();
                const col5 = cols[5] ? $(cols[5]).text().trim() : '';

                // Check if col4 (percentChange position) contains volume data (has K/M)
                const isVolumeInCol4 = col4.includes('K') || col4.includes('M');
                
                let percentChange, volume;
                
                if (isVolumeInCol4) {
                  // col4 contains volume data (like "281.79K") - store as volume, keep format
                  volume = col4; // Keep as-is (281.79K)
                  // Try to extract percentage from change column if it contains %
                  if (change.includes('%')) {
                    percentChange = this.parsePercentChange(change);
                  } else {
                    // Calculate percentage from change and price
                    const priceNum = this.parsePrice(price);
                    const changeNum = this.parseChange(change);
                    percentChange = priceNum > 0 ? (changeNum / priceNum) * 100 : 0;
                  }
                } else {
                  // Normal case: col4 is percentage, col5 might be volume
                  percentChange = this.parsePercentChange(col4);
                  // Keep volume format if it has K/M, otherwise parse as number
                  if (col5 && (col5.includes('K') || col5.includes('M'))) {
                    volume = col5; // Keep format like "281.79K"
                  } else {
                    volume = this.parseVolume(col5);
                  }
                }

                if (symbol && name) {
                  targetArray.push({
                    symbol,
                    name,
                    price: this.parsePrice(price),
                    change: this.parseChange(change),
                    percentChange: percentChange,
                    volume: volume
                  });
                }
              }
            });
          }
        }
      };

      extractTableData('Premarket Gainers', gainers);
      extractTableData('Premarket Losers', losers);

      return {
        timestamp: new Date().toISOString(),
        gainers,
        losers
      };

    } catch (error) {
      console.error('❌ Error scraping Benzinga:', error.message);
      return null;
    }
  }

  /**
   * Parse price string to number
   */
  parsePrice(priceStr) {
    const cleaned = priceStr.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  }

  /**
   * Parse change string to number
   */
  parseChange(changeStr) {
    const cleaned = changeStr.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  }

  /**
   * Parse percent change string to number
   */
  parsePercentChange(percentStr) {
    if (!percentStr) return 0;
    // Remove % sign and parse
    const cleaned = percentStr.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  }

  /**
   * Parse volume string - keeps K/M format if present
   */
  parseVolume(volumeStr) {
    if (!volumeStr) return 0;
    // If it contains K or M, return as-is
    if (volumeStr.includes('K') || volumeStr.includes('M')) {
      return volumeStr.trim();
    }
    // Otherwise parse as number
    const cleaned = volumeStr.replace(/[^0-9]/g, '');
    return parseInt(cleaned) || 0;
  }
}

module.exports = new ScraperService();

