const puppeteer = require('puppeteer');
const logger = require('./logger');

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled'
      ],
      defaultViewport: { width: 1920, height: 1080 }
    });
    
    process.on('exit', async () => {
      if (browserInstance) await browserInstance.close();
    });
  }
  return browserInstance;
}

async function fetchHtmlWithPuppeteer(url, options = {}) {
  const timeout = options.timeout || 30000;
  const waitUntil = options.waitUntil || 'networkidle2';
  let page = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'DNT': '1'
    });

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    logger.info(`🌐 Fetching with Puppeteer: ${url}`);
    await page.goto(url, { waitUntil, timeout });
    await page.waitForTimeout(2000);

    const html = await page.content();
    await page.close();
    return html;
  } catch (error) {
    if (page) {
      try {
        await page.close();
      } catch (e) {
        // Ignore
      }
    }
    logger.error(`❌ Error fetching ${url} with Puppeteer:`, error.message);
    throw error;
  }
}

async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

module.exports = { fetchHtmlWithPuppeteer, closeBrowser };

