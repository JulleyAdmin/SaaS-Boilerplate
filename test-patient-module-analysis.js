const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Starting patient module analysis with fixed network interceptor...');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();
    
    // Format and display console messages
    if (type === 'error') {
      console.error(`❌ [${type.toUpperCase()}] ${text}`);
      if (location.url) {
        console.error(`   at ${location.url}:${location.lineNumber}:${location.columnNumber}`);
      }
    } else if (type === 'warning') {
      console.warn(`⚠️  [${type.toUpperCase()}] ${text}`);
    } else if (text.includes('[HMS]') || text.includes('PATIENT') || text.includes('API')) {
      console.log(`📋 [${type.toUpperCase()}] ${text}`);
    }
  });
  
  // Monitor network requests
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/') || url.includes('clerk')) {
      console.log(`🌐 [REQUEST] ${request.method()} ${url}`);
    }
  });
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/') || url.includes('clerk')) {
      console.log(`📡 [RESPONSE] ${response.status()} ${url}`);
    }
  });
  
  try {
    // Navigate to sign-in page
    console.log('\n📍 Navigating to sign-in page...');
    await page.goto('http://localhost:3002/sign-in');
    await page.waitForTimeout(3000);
    
    // Check if we can access the page without errors
    console.log('\n🔐 Checking authentication status...');
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Try to navigate to patient dashboard
    console.log('\n📍 Attempting to navigate to patient dashboard...');
    await page.goto('http://localhost:3002/dashboard/patients');
    await page.waitForTimeout(3000);
    
    // Check current URL
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    // Wait a bit more to see if any errors appear
    await page.waitForTimeout(5000);
    
    console.log('\n✅ Test completed. Check the console output above for any errors.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  } finally {
    // Keep browser open for manual inspection
    console.log('\n📌 Browser will remain open for manual inspection. Close it when done.');
  }
})();