const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./src/config');

async function debugScrape() {
    try {
        const { data } = await axios.get(config.BENZINGA_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        const gainerHeader = $('h3:contains("Premarket Gainers")');
        if (gainerHeader.length) {
            console.log('Gainer Header found');
            console.log('Parent tag:', gainerHeader.parent().prop('tagName'));
            console.log('Parent next tag:', gainerHeader.parent().next().prop('tagName'));

            const tableInParentNext = gainerHeader.parent().next().find('table');
            console.log('Table in parent next:', tableInParentNext.length);

            // Try to find any table after the header in the whole document order
            // This is expensive but useful for debugging
            // We can use nextAll on the parent if needed
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

debugScrape();
