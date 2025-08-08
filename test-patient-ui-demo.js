const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('🏥 HospitalOS Patient Management UI Test');
  console.log('=====================================\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Comprehensive log collection
  const testResults = {
    timestamp: new Date().toISOString(),
    logs: {
      errors: [],
      warnings: [],
      api: [],
      patient: [],
      components: [],
      network: []
    },
    apiCalls: [],
    missingEndpoints: [],
    uiIssues: [],
    performanceMetrics: []
  };
  
  // Console log collection
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();
    const entry = { text, location, timestamp: new Date().toISOString(), type };
    
    if (type === 'error') {
      testResults.logs.errors.push(entry);
      console.error(`❌ [ERROR] ${text}`);
    } else if (type === 'warning') {
      testResults.logs.warnings.push(entry);
      console.warn(`⚠️  [WARNING] ${text}`);
    } else if (text.includes('PATIENT') || text.includes('PatientLogger')) {
      testResults.logs.patient.push(entry);
      console.log(`👤 [PATIENT] ${text}`);
    } else if (text.includes('API') || text.includes('NETWORK')) {
      testResults.logs.api.push(entry);
      console.log(`🌐 [API] ${text}`);
    } else if (text.includes('COMPONENT') || text.includes('mounted')) {
      testResults.logs.components.push(entry);
      console.log(`🧩 [COMPONENT] ${text}`);
    }
  });
  
  // Network monitoring
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/')) {
      const apiCall = {
        method: request.method(),
        url,
        headers: request.headers(),
        timestamp: new Date().toISOString(),
        postData: request.postData()
      };
      testResults.apiCalls.push(apiCall);
      console.log(`📤 [${request.method()}] ${url}`);
    }
  });
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/')) {
      const status = response.status();
      console.log(`📥 [${status}] ${url}`);
      
      // Track failed API calls
      if (status >= 400) {
        try {
          const body = await response.json();
          testResults.logs.errors.push({
            type: 'api_error',
            url,
            status,
            body,
            timestamp: new Date().toISOString()
          });
        } catch (e) {}
      }
    }
  });
  
  try {
    // Step 1: Navigate to sign-in
    console.log('📍 Step 1: Navigating to sign-in page...');
    await page.goto('http://localhost:3002/sign-in');
    await page.waitForTimeout(2000);
    
    // Step 2: Attempt sign-in with demo credentials
    console.log('\n🔐 Step 2: Signing in with demo credentials...');
    console.log('   Email: admin@stmarys.hospital.com');
    
    // Look for email input with multiple selectors
    const emailSelectors = [
      'input[name="identifier"]',
      'input[type="email"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="Email" i]',
      '#identifier-field'
    ];
    
    let emailInput = null;
    for (const selector of emailSelectors) {
      emailInput = await page.$(selector);
      if (emailInput) break;
    }
    
    if (emailInput) {
      await emailInput.fill('admin@stmarys.hospital.com');
      console.log('   ✓ Entered email');
      
      // Press Enter or click continue
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      
      // Look for password field
      const passwordInput = await page.$('input[type="password"]');
      if (passwordInput) {
        await passwordInput.fill('u3Me65zO&8@b');
        console.log('   ✓ Entered password');
        
        // Submit form
        await page.keyboard.press('Enter');
        console.log('   ⏳ Waiting for authentication...');
        await page.waitForTimeout(5000);
      }
    } else {
      console.log('   ❌ Could not find email input field');
      testResults.uiIssues.push({
        issue: 'Sign-in form email input not found',
        selectors: emailSelectors
      });
    }
    
    // Step 3: Check if we're authenticated
    const currentUrl = page.url();
    console.log(`\n📍 Current URL: ${currentUrl}`);
    
    // Step 4: Navigate to patient dashboard
    console.log('\n📊 Step 3: Navigating to patient dashboard...');
    await page.goto('http://localhost:3002/dashboard/patients');
    await page.waitForTimeout(5000);
    
    const dashboardUrl = page.url();
    if (dashboardUrl.includes('/dashboard/patients')) {
      console.log('   ✅ Successfully accessed patient dashboard!');
      
      // Step 5: Analyze patient management UI
      console.log('\n🔍 Step 4: Analyzing patient management UI...');
      
      // Check for key UI elements
      const uiElements = {
        searchInput: await page.$('input[placeholder*="search" i]'),
        newPatientButton: await page.$('button:has-text("Register New Patient")'),
        patientTable: await page.$('table'),
        statisticsCards: await page.$$('.card, [class*="card"]'),
        filters: await page.$('select, [class*="select"]')
      };
      
      console.log('\n📋 UI Elements Found:');
      console.log(`   Search Input: ${uiElements.searchInput ? '✓' : '✗'}`);
      console.log(`   New Patient Button: ${uiElements.newPatientButton ? '✓' : '✗'}`);
      console.log(`   Patient Table: ${uiElements.patientTable ? '✓' : '✗'}`);
      console.log(`   Statistics Cards: ${uiElements.statisticsCards.length}`);
      console.log(`   Filters: ${uiElements.filters ? '✓' : '✗'}`);
      
      // Track missing UI elements
      if (!uiElements.searchInput) testResults.uiIssues.push({ element: 'searchInput', issue: 'not found' });
      if (!uiElements.newPatientButton) testResults.uiIssues.push({ element: 'newPatientButton', issue: 'not found' });
      if (!uiElements.patientTable) testResults.uiIssues.push({ element: 'patientTable', issue: 'not found' });
      
      // Step 6: Test search functionality
      if (uiElements.searchInput) {
        console.log('\n🔍 Step 5: Testing search functionality...');
        await uiElements.searchInput.fill('John');
        await page.waitForTimeout(2000);
        console.log('   ✓ Searched for "John"');
      }
      
      // Step 7: Check patient data
      if (uiElements.patientTable) {
        const rows = await page.$$('tbody tr');
        console.log(`\n📊 Patient Data: Found ${rows.length} patients in table`);
        
        if (rows.length === 0) {
          testResults.uiIssues.push({
            element: 'patientTable',
            issue: 'No patient data displayed'
          });
        }
      }
      
      // Step 8: Test new patient button
      if (uiElements.newPatientButton) {
        console.log('\n➕ Step 6: Testing new patient registration...');
        await uiElements.newPatientButton.click();
        await page.waitForTimeout(2000);
        
        // Check if modal or new page opened
        const modalOrForm = await page.$('dialog, [role="dialog"], form[class*="patient"]');
        if (modalOrForm) {
          console.log('   ✓ Patient registration form opened');
          // Close it
          const closeButton = await page.$('button[aria-label*="close" i], button:has-text("Cancel")');
          if (closeButton) await closeButton.click();
        } else {
          const newUrl = page.url();
          if (newUrl !== dashboardUrl) {
            console.log('   ✓ Navigated to patient registration page');
            await page.goBack();
          } else {
            testResults.uiIssues.push({
              element: 'newPatientButton',
              issue: 'Click did not open form or navigate'
            });
          }
        }
      }
    } else {
      console.log('   ❌ Failed to access patient dashboard');
      console.log(`   Redirected to: ${dashboardUrl}`);
      testResults.uiIssues.push({
        issue: 'Cannot access patient dashboard',
        redirectedTo: dashboardUrl
      });
    }
    
    // Step 9: Analyze API calls
    console.log('\n📡 API Analysis:');
    const uniqueEndpoints = [...new Set(testResults.apiCalls.map(call => `${call.method} ${call.url}`))];
    console.log(`   Total API calls: ${testResults.apiCalls.length}`);
    console.log('   Endpoints called:');
    uniqueEndpoints.forEach(endpoint => console.log(`     - ${endpoint}`));
    
    // Check for expected endpoints
    const expectedEndpoints = [
      '/api/patients',
      '/api/patients/statistics',
      '/api/analytics/today'
    ];
    
    expectedEndpoints.forEach(endpoint => {
      const found = testResults.apiCalls.some(call => call.url.includes(endpoint));
      if (!found) {
        testResults.missingEndpoints.push(endpoint);
        console.log(`   ⚠️  Missing expected endpoint: ${endpoint}`);
      }
    });
    
    // Step 10: Generate report
    console.log('\n📋 === FINAL REPORT ===');
    console.log(`Total Errors: ${testResults.logs.errors.length}`);
    console.log(`Total Warnings: ${testResults.logs.warnings.length}`);
    console.log(`API Calls Made: ${testResults.apiCalls.length}`);
    console.log(`Patient-specific Logs: ${testResults.logs.patient.length}`);
    console.log(`UI Issues Found: ${testResults.uiIssues.length}`);
    console.log(`Missing Endpoints: ${testResults.missingEndpoints.length}`);
    
    // Save detailed report
    fs.writeFileSync('patient-ui-test-report.json', JSON.stringify(testResults, null, 2));
    console.log('\n💾 Detailed report saved to patient-ui-test-report.json');
    
    // Show critical issues
    if (testResults.logs.errors.length > 0) {
      console.log('\n❌ Critical Errors:');
      testResults.logs.errors.slice(0, 5).forEach((error, i) => {
        console.log(`   ${i + 1}. ${error.text || error.type}`);
      });
    }
    
    if (testResults.uiIssues.length > 0) {
      console.log('\n⚠️  UI Issues:');
      testResults.uiIssues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${JSON.stringify(issue)}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    testResults.logs.errors.push({
      type: 'test_failure',
      error: error.message,
      stack: error.stack
    });
  } finally {
    console.log('\n📌 Browser remains open for manual inspection.');
    console.log('Close the browser window when done.');
  }
})();