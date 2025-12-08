const cheerio = require('cheerio');
const { fetchHtmlWithPuppeteer } = require('../../utils/fetchHtmlWithPuppeteer');
const logger = require('../../utils/logger');

async function scrapePreMarketInvesting() {
  try {
    const url = 'https://www.investing.com/equities/pre-market';
    logger.info(`Scraping Investing Pre-Market: ${url}`);
    
    const html = await fetchHtmlWithPuppeteer(url);
    const $ = cheerio.load(html);
    const stocks = [];

    $('table').each((i, table) => {
      const $table = $(table);
      
      $table.find('tbody tr, tr').each((j, row) => {
        const $row = $(row);
        const cells = $row.find('td');
        
        if (cells.length < 4) return;

        const name = $(cells[0]).text().trim();
        const symbol = $(cells[1]).text().trim().toUpperCase();
        const last = $(cells[2]).text().trim();
        const chg = $(cells[3]).text().trim();
        const chgPercent = cells[4] ? $(cells[4]).text().trim() : '';
        const vol = cells[5] ? $(cells[5]).text().trim() : '';

        if (!symbol || !name) return;

        const price = parseFloat(last.replace(/[^0-9.-]/g, '')) || 0;
        const change = parseFloat(chg.replace(/[^0-9.-]/g, '')) || 0;
        const changePercent = parseFloat(chgPercent.replace(/[^0-9.-]/g, '')) || 0;
        
        let volume = vol;
        if (vol && !vol.includes('K') && !vol.includes('M')) {
          volume = parseFloat(vol.replace(/[^0-9]/g, '')) || 0;
        }

        if (symbol && name && price > 0) {
          stocks.push({
            symbol: symbol.toUpperCase(),
            name,
            price,
            change,
            changePercent,
            volume: volume || 0,
            source: 'investing'
          });
        }
      });
    });

    if (stocks.length === 0) {
      $('[data-test="pre-market-table"] tbody tr, .pre-market-table tbody tr').each((j, row) => {
        const $row = $(row);
        const cells = $row.find('td');
        
        if (cells.length >= 4) {
          const name = $(cells[0]).text().trim();
          const symbol = $(cells[1]).text().trim().toUpperCase();
          const last = $(cells[2]).text().trim();
          const chg = $(cells[3]).text().trim();
          const chgPercent = cells[4] ? $(cells[4]).text().trim() : '';
          const vol = cells[5] ? $(cells[5]).text().trim() : '';

          if (symbol && name) {
            const price = parseFloat(last.replace(/[^0-9.-]/g, '')) || 0;
            const change = parseFloat(chg.replace(/[^0-9.-]/g, '')) || 0;
            const changePercent = parseFloat(chgPercent.replace(/[^0-9.-]/g, '')) || 0;
            
            let volume = vol;
            if (vol && !vol.includes('K') && !vol.includes('M')) {
              volume = parseFloat(vol.replace(/[^0-9]/g, '')) || 0;
            }

            if (price > 0) {
              stocks.push({
                symbol: symbol.toUpperCase(),
                name,
                price,
                change,
                changePercent,
                volume: volume || 0,
                source: 'investing'
              });
            }
          }
        }
      });
    }

    logger.info(`Investing Pre-Market: Found ${stocks.length} stocks`);
    return stocks;
  } catch (error) {
    logger.error('Error scraping Investing Pre-Market:', error.message);
    return [];
  }
}

module.exports = scrapePreMarketInvesting;

