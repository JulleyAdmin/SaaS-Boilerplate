const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Starting patient management UI test with authentication...');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Collect all console logs
  const logs = {
    errors: [],
    warnings: [],
    info: [],
    api: [],
    patient: [],
    debug: []
  };
  
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();
    
    // Categorize logs
    if (type === 'error') {
      logs.errors.push({ text, location, timestamp: new Date().toISOString() });
      console.error(`❌ [ERROR] ${text}`);
      if (location.url) {
        console.error(`   at ${location.url}:${location.lineNumber}`);
      }
    } else if (type === 'warning') {
      logs.warnings.push({ text, timestamp: new Date().toISOString() });
      console.warn(`⚠️  [WARNING] ${text}`);
    } else if (text.includes('[HMS]') || text.includes('PATIENT')) {
      logs.patient.push({ text, timestamp: new Date().toISOString() });
      console.log(`📋 [PATIENT] ${text}`);
    } else if (text.includes('API') || text.includes('NETWORK')) {
      logs.api.push({ text, timestamp: new Date().toISOString() });
      console.log(`🌐 [API] ${text}`);
    } else if (text.includes('DEBUG') || text.includes('COMPONENT')) {
      logs.debug.push({ text, timestamp: new Date().toISOString() });
      console.log(`🐛 [DEBUG] ${text}`);
    } else {
      logs.info.push({ text, timestamp: new Date().toISOString() });
    }
  });
  
  // Monitor network requests
  const apiRequests = [];
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/')) {
      const reqInfo = {
        method: request.method(),
        url,
        headers: request.headers(),
        timestamp: new Date().toISOString()
      };
      apiRequests.push(reqInfo);
      console.log(`📤 [REQUEST] ${request.method()} ${url}`);
    }
  });
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/')) {
      console.log(`📥 [RESPONSE] ${response.status()} ${url}`);
    }
  });
  
  try {
    // Navigate to sign-in page
    console.log('\n📍 Step 1: Navigating to sign-in page...');
    await page.goto('http://localhost:3002/sign-in');
    await page.waitForSelector('[data-clerk-sign-in-loaded]', { timeout: 10000 });
    
    // Try demo credentials sign in
    console.log('\n🔐 Step 2: Attempting demo sign-in...');
    
    // Click on email sign-in if social buttons are shown
    const emailButton = await page.$('button:has-text("Continue with email")');
    if (emailButton) {
      await emailButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Try to find and fill email input
    const emailInput = await page.$('input[name="identifier"], input[type="email"], input[placeholder*="email" i]');
    if (emailInput) {
      await emailInput.fill('demo@hospitalos.com');
      console.log('   ✓ Filled email');
      
      // Click continue/next button
      const continueButton = await page.$('button:has-text("Continue"), button:has-text("Next")');
      if (continueButton) {
        await continueButton.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Check if we need password
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
      await passwordInput.fill('Demo123!');
      console.log('   ✓ Filled password');
      
      // Click sign in button
      const signInButton = await page.$('button:has-text("Sign in"), button:has-text("Continue")');
      if (signInButton) {
        await signInButton.click();
      }
    }
    
    // Wait for navigation or error
    await page.waitForTimeout(3000);
    
    // Check if we're still on sign-in page
    const currentUrl = page.url();
    if (currentUrl.includes('sign-in')) {
      console.log('\n⚠️  Demo sign-in failed. Checking for development mode sign-in...');
      
      // Look for dev mode sign-in options
      const devSignIn = await page.$('text=Sign in with development account');
      if (devSignIn) {
        await devSignIn.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Try to navigate directly to patient dashboard
    console.log('\n📍 Step 3: Attempting to access patient dashboard...');
    await page.goto('http://localhost:3002/dashboard/patients');
    await page.waitForTimeout(5000);
    
    // Check final URL
    const finalUrl = page.url();
    console.log(`\n📍 Current URL: ${finalUrl}`);
    
    // If we made it to the dashboard, collect patient data
    if (finalUrl.includes('/dashboard/patients')) {
      console.log('\n✅ Successfully accessed patient dashboard!');
      
      // Wait for patient data to load
      console.log('\n⏳ Waiting for patient data to load...');
      await page.waitForTimeout(5000);
      
      // Try to interact with the UI
      console.log('\n🔍 Looking for patient management elements...');
      
      // Check for search input
      const searchInput = await page.$('input[placeholder*="Search" i]');
      if (searchInput) {
        console.log('   ✓ Found search input');
        await searchInput.fill('John');
        await page.waitForTimeout(2000);
      }
      
      // Check for patient table
      const patientTable = await page.$('table');
      if (patientTable) {
        console.log('   ✓ Found patient table');
        const rows = await page.$$('tbody tr');
        console.log(`   ✓ Found ${rows.length} patient rows`);
      }
      
      // Check for statistics cards
      const statsCards = await page.$$('[class*="card"]');
      console.log(`   ✓ Found ${statsCards.length} statistics cards`);
    }
    
    // Generate summary report
    console.log('\n📊 === LOG SUMMARY ===');
    console.log(`Errors: ${logs.errors.length}`);
    console.log(`Warnings: ${logs.warnings.length}`);
    console.log(`API Calls: ${apiRequests.length}`);
    console.log(`Patient Logs: ${logs.patient.length}`);
    console.log(`Debug Logs: ${logs.debug.length}`);
    
    // Show API endpoints called
    if (apiRequests.length > 0) {
      console.log('\n📡 API Endpoints Called:');
      const uniqueEndpoints = [...new Set(apiRequests.map(r => `${r.method} ${r.url}`))];
      uniqueEndpoints.forEach(endpoint => console.log(`   - ${endpoint}`));
    }
    
    // Show errors if any
    if (logs.errors.length > 0) {
      console.log('\n❌ Errors Found:');
      logs.errors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error.text}`);
        if (error.location?.url) {
          console.log(`      at ${error.location.url}:${error.location.lineNumber}`);
        }
      });
    }
    
    // Save detailed logs
    const fs = require('fs');
    const logReport = {
      timestamp: new Date().toISOString(),
      url: finalUrl,
      logs,
      apiRequests,
      summary: {
        totalErrors: logs.errors.length,
        totalWarnings: logs.warnings.length,
        totalApiCalls: apiRequests.length,
        totalPatientLogs: logs.patient.length
      }
    };
    
    fs.writeFileSync('patient-ui-test-logs.json', JSON.stringify(logReport, null, 2));
    console.log('\n💾 Detailed logs saved to patient-ui-test-logs.json');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  } finally {
    // Keep browser open for manual inspection
    console.log('\n📌 Browser will remain open for manual inspection. Close it when done.');
  }
})();