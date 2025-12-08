const cheerio = require('cheerio');
const fetchHtml = require('../../utils/fetchHtml');
const logger = require('../../utils/logger');

async function scrapeCurrentMarketBenzinga() {
  try {
    const url = 'https://www.benzinga.com/movers';
    logger.info(`Scraping Benzinga Movers: ${url}`);
    
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const stocks = [];

    $('table').each((i, table) => {
      const $table = $(table);
      const headers = [];
      
      $table.find('thead tr th, thead tr td').each((j, th) => {
        headers.push($(th).text().trim().toLowerCase());
      });

      if (headers.length === 0) {
        $table.find('tr').first().find('th, td').each((j, th) => {
          headers.push($(th).text().trim().toLowerCase());
        });
      }

      $table.find('tbody tr, tr').each((j, row) => {
        const $row = $(row);
        const cells = $row.find('td');
        
        if (cells.length < 3) return;

        let symbol = '';
        let name = '';
        let price = 0;
        let change = 0;
        let changePercent = 0;
        let volume = 0;
        let category = 'gainer';

        cells.each((k, cell) => {
          const text = $(cell).text().trim();
          const header = headers[k] || '';
          
          if (header.includes('ticker') || header.includes('symbol') || 
              (k === 0 && text.length <= 5 && text.match(/^[A-Z]+$/))) {
            symbol = text.toUpperCase();
          }
          
          if (header.includes('company') || header.includes('name') || 
              (k === 1 && text.length > 5)) {
            name = text;
          }
          
          if (header.includes('close') || header.includes('price') || header.includes('last')) {
            price = parseFloat(text.replace(/[^0-9.-]/g, '')) || 0;
          }
          
          if (header.includes('change') && !header.includes('%')) {
            change = parseFloat(text.replace(/[^0-9.-]/g, '')) || 0;
          }
          
          if (header.includes('%') || header.includes('percent')) {
            changePercent = parseFloat(text.replace(/[^0-9.-]/g, '')) || 0;
          }
          
          if (header.includes('vol') || header.includes('volume')) {
            volume = text;
          }
        });

        if (!symbol && cells.length >= 2) {
          symbol = $(cells[0]).text().trim().toUpperCase();
          name = $(cells[1]).text().trim();
          if (cells.length >= 3) {
            price = parseFloat($(cells[2]).text().replace(/[^0-9.-]/g, '')) || 0;
          }
          if (cells.length >= 4) {
            const changeText = $(cells[3]).text().trim();
            if (changeText.includes('%')) {
              changePercent = parseFloat(changeText.replace(/[^0-9.-]/g, '')) || 0;
            } else {
              change = parseFloat(changeText.replace(/[^0-9.-]/g, '')) || 0;
            }
          }
          if (cells.length >= 5) {
            const col5 = $(cells[4]).text().trim();
            if (col5.includes('%')) {
              changePercent = parseFloat(col5.replace(/[^0-9.-]/g, '')) || 0;
            } else if (col5.includes('K') || col5.includes('M')) {
              volume = col5;
            }
          }
        }

        if (changePercent > 0) {
          category = 'gainer';
        } else if (changePercent < 0) {
          category = 'loser';
        }

        if (symbol && name && price > 0) {
          stocks.push({
            symbol: symbol.toUpperCase(),
            name,
            price,
            change,
            changePercent,
            volume: volume || 0,
            source: 'benzinga',
            category
          });
        }
      });
    });

    logger.info(`Benzinga Movers: Found ${stocks.length} stocks`);
    return stocks;
  } catch (error) {
    logger.error('Error scraping Benzinga Movers:', error.message);
    return [];
  }
}

module.exports = scrapeCurrentMarketBenzinga;

