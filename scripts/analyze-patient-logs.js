const { chromium } = require('playwright');

async function analyzePatientManagementLogs() {
  console.log('🔍 Starting Patient Management Log Analysis...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect console logs
  const consoleLogs = [];
  page.on('console', msg => {
    const log = {
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
      timestamp: new Date().toISOString()
    };
    consoleLogs.push(log);
    
    // Print important logs
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  // Collect network requests
  const networkRequests = [];
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      timestamp: new Date().toISOString()
    });
  });

  // Collect network responses
  const networkResponses = [];
  page.on('response', response => {
    networkResponses.push({
      url: response.url(),
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      timestamp: new Date().toISOString()
    });
    
    // Log API responses
    if (response.url().includes('/api/')) {
      console.log(`[API] ${response.request().method()} ${response.url()} - ${response.status()}`);
    }
  });

  // Track page errors
  page.on('pageerror', error => {
    console.error('[PAGE ERROR]', error.message);
  });

  try {
    console.log('📍 Navigating to sign-in page...');
    await page.goto('http://localhost:3002/sign-in', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Check if we need to sign in
    const signInButton = await page.locator('button:has-text("Continue with email")').first();
    if (await signInButton.isVisible()) {
      console.log('🔐 Signing in...');
      
      // Look for email input
      const emailInput = await page.locator('input[type="email"], input[name="email"]').first();
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        await signInButton.click();
        
        // Wait for navigation or OTP
        await page.waitForTimeout(2000);
      }
    }

    console.log('📍 Navigating to patient management...');
    await page.goto('http://localhost:3002/dashboard/patients', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Wait for patient data to load
    console.log('⏳ Waiting for patient data to load...');
    await page.waitForTimeout(3000);

    // Try different interactions
    console.log('\n🔍 Testing search functionality...');
    const searchInput = await page.locator('input[placeholder*="Search patients"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('John');
      await page.waitForTimeout(1000);
    }

    console.log('🔍 Testing filter functionality...');
    const filterButton = await page.locator('button:has-text("Filter")').first();
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(1000);
    }

    // Analyze collected data
    console.log('\n📊 === LOG ANALYSIS SUMMARY ===\n');

    // API Endpoints
    const apiCalls = networkRequests.filter(req => req.url.includes('/api/'));
    console.log(`📡 API Calls Made: ${apiCalls.length}`);
    apiCalls.forEach(call => {
      const response = networkResponses.find(res => res.url === call.url);
      console.log(`   - ${call.method} ${call.url} ${response ? `(${response.status})` : '(pending)'}`);
    });

    // Errors and Warnings
    const errors = consoleLogs.filter(log => log.type === 'error');
    const warnings = consoleLogs.filter(log => log.type === 'warning');
    
    console.log(`\n❌ Errors Found: ${errors.length}`);
    errors.forEach(err => {
      console.log(`   - ${err.text}`);
    });

    console.log(`\n⚠️  Warnings Found: ${warnings.length}`);
    warnings.forEach(warn => {
      console.log(`   - ${warn.text}`);
    });

    // Failed requests
    const failedRequests = networkResponses.filter(res => res.status >= 400);
    console.log(`\n🚫 Failed Requests: ${failedRequests.length}`);
    failedRequests.forEach(req => {
      console.log(`   - ${req.status} ${req.statusText}: ${req.url}`);
    });

    // Extract logs from the page
    console.log('\n📝 Extracting HMS Logger data...');
    const hmsLogs = await page.evaluate(() => {
      if (window.__HMS_LOGGER__) {
        return window.__HMS_LOGGER__.getLogs({ limit: 100 });
      }
      return null;
    });

    if (hmsLogs) {
      console.log(`\n📊 HMS Logger Entries: ${hmsLogs.length}`);
      
      // Group logs by category
      const logsByCategory = {};
      hmsLogs.forEach(log => {
        if (!logsByCategory[log.category]) {
          logsByCategory[log.category] = [];
        }
        logsByCategory[log.category].push(log);
      });

      console.log('\nLogs by Category:');
      Object.entries(logsByCategory).forEach(([category, logs]) => {
        console.log(`   - ${category}: ${logs.length} entries`);
      });

      // Show recent errors
      const recentErrors = hmsLogs.filter(log => log.level === 'error').slice(-5);
      if (recentErrors.length > 0) {
        console.log('\nRecent Errors:');
        recentErrors.forEach(err => {
          console.log(`   - [${err.category}] ${err.message}`);
          if (err.data) {
            console.log(`     Data: ${JSON.stringify(err.data, null, 2)}`);
          }
        });
      }
    }

    // Take screenshot
    await page.screenshot({ path: 'patient-management-state.png', fullPage: true });
    console.log('\n📸 Screenshot saved: patient-management-state.png');

    // Export detailed logs
    const logReport = {
      timestamp: new Date().toISOString(),
      consoleLogs,
      networkRequests,
      networkResponses,
      hmsLogs,
      summary: {
        totalApiCalls: apiCalls.length,
        totalErrors: errors.length,
        totalWarnings: warnings.length,
        failedRequests: failedRequests.length
      }
    };

    require('fs').writeFileSync(
      'patient-management-logs.json', 
      JSON.stringify(logReport, null, 2)
    );
    console.log('📄 Detailed logs saved: patient-management-logs.json');

  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }

  console.log('\n🔍 Analysis complete. Press Ctrl+C to exit.');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(300000);
  await browser.close();
}

analyzePatientManagementLogs().catch(console.error);