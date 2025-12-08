const fetchHtml = require('./fetchHtml');

async function testFetch() {
  const testUrls = [
    'https://www.investing.com/equities/top-stock-gainers',
    'https://www.investing.com/equities/top-stock-losers',
    'https://www.investing.com/equities/pre-market',
    'https://www.investing.com/equities/after-hours'
  ];

  console.log('🧪 Testing fetch with detailed error reporting...\n');

  for (const url of testUrls) {
    console.log(`\n📡 Testing: ${url}`);
    console.log('─'.repeat(80));
    
    try {
      const html = await fetchHtml(url, { retries: 0 });
      console.log(`✅ Success! Got ${html.length} characters`);
      console.log(`   First 200 chars: ${html.substring(0, 200)}...`);
    } catch (error) {
      console.log(`❌ Failed to fetch`);
      if (error.response) {
        console.log(`   Status: ${error.response.status} ${error.response.statusText}`);
        console.log(`   Headers:`, JSON.stringify(error.response.headers, null, 2));
        
        const headers = error.response.headers;
        if (headers['cf-ray']) {
          console.log(`   ⚠️  Cloudflare Protection Detected (CF-Ray: ${headers['cf-ray']})`);
        }
        if (headers['server'] && headers['server'].includes('cloudflare')) {
          console.log(`   ⚠️  Server: ${headers['server']} (Cloudflare)`);
        }
        if (headers['x-sucuri-id']) {
          console.log(`   ⚠️  Sucuri Protection Detected`);
        }
        if (headers['x-akamai-transformed']) {
          console.log(`   ⚠️  Akamai CDN Detected`);
        }
        
        if (error.response.data) {
          const body = typeof error.response.data === 'string' 
            ? error.response.data 
            : JSON.stringify(error.response.data);
          console.log(`   Response Body (first 1000 chars):`);
          console.log(`   ${body.substring(0, 1000)}`);
        }
      } else {
        console.log(`   Error: ${error.message}`);
        if (error.code) {
          console.log(`   Code: ${error.code}`);
        }
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

if (require.main === module) {
  testFetch().catch(console.error);
}

module.exports = testFetch;

