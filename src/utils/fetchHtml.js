const axios = require('axios');
const logger = require('./logger');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchHtml(url, options = {}) {
  const maxRetries = options.retries || 2;
  const retryDelay = options.retryDelay || 3000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': attempt === 0 ? 'none' : 'same-origin',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'DNT': '1',
        'Referer': 'https://www.google.com/',
        ...options.headers
      };

      if (url.includes('investing.com')) {
        defaultHeaders['Referer'] = attempt === 0 ? 'https://www.investing.com/' : url;
        defaultHeaders['Origin'] = 'https://www.investing.com';
      } else if (url.includes('benzinga.com')) {
        defaultHeaders['Referer'] = attempt === 0 ? 'https://www.benzinga.com/' : url;
        defaultHeaders['Origin'] = 'https://www.benzinga.com';
      }

      if (attempt > 0) {
        await delay(retryDelay * Math.pow(2, attempt - 1));
      }

      const { data } = await axios.get(url, {
        headers: defaultHeaders,
        timeout: options.timeout || 30000,
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400,
        ...options
      });
      
      return data;
    } catch (error) {
      if (error.response?.status === 403 && attempt < maxRetries) {
        logger.warn(`⚠️ Got 403 for ${url}, retrying (attempt ${attempt + 1}/${maxRetries})...`);
        continue;
      }
      
      if (error.response) {
        logger.error(`❌ Error fetching ${url}: ${error.response.status} - ${error.response.statusText}`);
        if (error.response.headers['cf-ray']) {
          logger.error(`⚠️ Cloudflare detected (CF-Ray: ${error.response.headers['cf-ray']})`);
        }
      } else {
        logger.error(`❌ Error fetching ${url}:`, error.message);
      }
      
      if (attempt === maxRetries) throw error;
    }
  }
}

module.exports = fetchHtml;

