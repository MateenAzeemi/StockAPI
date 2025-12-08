/**
 * Test script to verify routes are working
 * Run: node test-routes.js
 */

const app = require('./src/app');
const http = require('http');

const server = http.createServer(app);

server.listen(3001, () => {
  console.log('🧪 Test server running on port 3001');
  console.log('Testing routes...\n');

  // Test /api/stocks/home
  const req1 = http.get('http://localhost:3001/api/stocks/home', (res) => {
    console.log(`✅ /api/stocks/home - Status: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('   Response:', json.success ? 'SUCCESS' : 'FAILED');
        server.close();
      } catch (e) {
        console.log('   Response: Invalid JSON');
        server.close();
      }
    });
  });

  req1.on('error', (err) => {
    console.log(`❌ /api/stocks/home - Error: ${err.message}`);
    server.close();
  });
});

