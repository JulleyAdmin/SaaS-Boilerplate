#!/usr/bin/env node

const { chromium } = require('playwright');

// Test credentials
const CREDENTIALS = {
  email: 'admin@stmarys.hospital.com',
  password: 'u3Me65zO&8@b'
};

// Test Report
const report = {
  loginIssues: [],
  patientPageIssues: [],
  appointmentIssues: [],
  familyPageIssues: [],
  serverErrors: [],
  performanceIssues: [],
  uiIssues: []
};

async function testPatientModule() {
  console.log('🏥 Starting Patient Module Testing');
  console.log('==================================');
  
  const browser = await chromium.launch({ 
    headless: false,
    ignoreHTTPSErrors: true 
  });
  
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      report.serverErrors.push({
        type: 'console',
        message: msg.text(),
        timestamp: new Date().toISOString()
      });
      console.log('❌ Console Error:', msg.text());
    }
  });
  
  // Capture network errors
  page.on('response', response => {
    if (response.status() >= 400) {
      report.serverErrors.push({
        type: 'network',
        url: response.url(),
        status: response.status(),
        timestamp: new Date().toISOString()
      });
      console.log(`❌ Network Error ${response.status()}: ${response.url()}`);
    }
  });
  
  try {
    // Step 1: Login
    console.log('\n📋 Step 1: Login Process');
    console.log('------------------------');
    
    const startTime = Date.now();
    
    // Go to landing page first
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    console.log('✅ Landing page loaded');
    
    // Look for and click sign-in link
    try {
      await page.click('a[href="/sign-in"]', { timeout: 5000 });
    } catch (e) {
      console.log('⚠️ Direct sign-in link not found, trying alternative selectors...');
      try {
        await page.click('text=Sign In');
      } catch (e2) {
        console.log('⚠️ Sign In button not found, navigating directly...');
        await page.goto('http://localhost:3000/en/sign-in');
      }
    }
    
    await page.waitForTimeout(2000);
    
    // Fill login form with various possible selectors
    console.log('📝 Filling login form...');
    
    const emailFilled = await fillField(page, [
      'input[name="identifier"]',
      'input[type="email"]',
      'input[name="email"]',
      'input[name="emailAddress"]',
      '.cl-formFieldInput__identifier'
    ], CREDENTIALS.email);
    
    if (!emailFilled) {
      report.loginIssues.push('Could not find email input field');
      console.log('❌ Could not find email field');
    } else {
      console.log('✅ Email filled');
    }
    
    // Check if we need to click continue
    try {
      await page.click('button[type="submit"]:has-text("Continue")', { timeout: 2000 });
      await page.waitForTimeout(1000);
    } catch (e) {
      // No continue button, that's okay
    }
    
    const passwordFilled = await fillField(page, [
      'input[type="password"]',
      'input[name="password"]',
      '.cl-formFieldInput__password'
    ], CREDENTIALS.password);
    
    if (!passwordFilled) {
      report.loginIssues.push('Could not find password input field');
      console.log('❌ Could not find password field');
    } else {
      console.log('✅ Password filled');
    }
    
    // Submit form
    await submitForm(page);
    
    // Wait for navigation
    console.log('⏳ Waiting for authentication...');
    await page.waitForTimeout(5000);
    
    const loginTime = Date.now() - startTime;
    if (loginTime > 3000) {
      report.performanceIssues.push(`Login took ${loginTime}ms (target: <3000ms)`);
    }
    
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (!currentUrl.includes('dashboard')) {
      report.loginIssues.push('Login failed - not redirected to dashboard');
      console.log('❌ Login appears to have failed');
      await page.screenshot({ path: 'login-failed.png' });
    } else {
      console.log('✅ Successfully logged in to dashboard');
      await page.screenshot({ path: 'dashboard-home.png' });
    }
    
    // Step 2: Navigate to Patient Management
    console.log('\n📋 Step 2: Patient Management Navigation');
    console.log('----------------------------------------');
    
    const patientStartTime = Date.now();
    
    // Try multiple ways to get to patient management
    const patientNavSuccess = await navigateToPatients(page);
    
    if (!patientNavSuccess) {
      report.patientPageIssues.push('Could not navigate to patient management');
      console.log('❌ Failed to navigate to patient management');
    } else {
      const patientLoadTime = Date.now() - patientStartTime;
      if (patientLoadTime > 2000) {
        report.performanceIssues.push(`Patient page load took ${patientLoadTime}ms (target: <2000ms)`);
      }
      
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'patient-list.png' });
      
      // Test patient page functionality
      await testPatientPage(page, report);
    }
    
    // Step 3: Test Appointments
    console.log('\n📋 Step 3: Appointments Testing');
    console.log('--------------------------------');
    
    const apptStartTime = Date.now();
    const apptNavSuccess = await navigateToAppointments(page);
    
    if (!apptNavSuccess) {
      report.appointmentIssues.push('Could not navigate to appointments');
      console.log('❌ Failed to navigate to appointments');
    } else {
      const apptLoadTime = Date.now() - apptStartTime;
      if (apptLoadTime > 2000) {
        report.performanceIssues.push(`Appointments page load took ${apptLoadTime}ms (target: <2000ms)`);
      }
      
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'appointments.png' });
      
      // Test appointments functionality
      await testAppointmentsPage(page, report);
    }
    
    // Step 4: Test Family/Relatives (if exists)
    console.log('\n📋 Step 4: Family/Relatives Testing');
    console.log('------------------------------------');
    
    // This might not exist, so we'll check
    const familyExists = await page.locator('text=/family|relatives/i').count() > 0;
    
    if (familyExists) {
      await testFamilyPage(page, report);
    } else {
      console.log('ℹ️ Family/Relatives feature not found in current implementation');
      report.familyPageIssues.push('Family/Relatives feature not implemented');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    report.serverErrors.push({
      type: 'fatal',
      message: error.message,
      stack: error.stack
    });
    await page.screenshot({ path: 'error-state.png' });
  } finally {
    // Generate final report
    console.log('\n📊 Final Test Report');
    console.log('====================');
    
    console.log('\n🔍 Issues Found:');
    
    if (report.loginIssues.length > 0) {
      console.log('\n🔐 Login Issues:');
      report.loginIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (report.patientPageIssues.length > 0) {
      console.log('\n👥 Patient Page Issues:');
      report.patientPageIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (report.appointmentIssues.length > 0) {
      console.log('\n📅 Appointment Issues:');
      report.appointmentIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (report.familyPageIssues.length > 0) {
      console.log('\n👨‍👩‍👧‍👦 Family Page Issues:');
      report.familyPageIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (report.performanceIssues.length > 0) {
      console.log('\n⚡ Performance Issues:');
      report.performanceIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (report.uiIssues.length > 0) {
      console.log('\n🎨 UI Issues:');
      report.uiIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (report.serverErrors.length > 0) {
      console.log(`\n🚨 Server Errors (${report.serverErrors.length} total):`);
      // Show only first 5 to avoid spam
      report.serverErrors.slice(0, 5).forEach(error => {
        console.log(`  - ${error.type}: ${error.message || error.url}`);
      });
      if (report.serverErrors.length > 5) {
        console.log(`  ... and ${report.serverErrors.length - 5} more errors`);
      }
    }
    
    // Save full report
    const fs = require('fs');
    fs.writeFileSync('patient-module-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Full report saved to: patient-module-test-report.json');
    
    await browser.close();
  }
}

// Helper Functions
async function fillField(page, selectors, value) {
  for (const selector of selectors) {
    try {
      await page.fill(selector, value, { timeout: 3000 });
      return true;
    } catch (e) {
      // Try next selector
    }
  }
  return false;
}

async function submitForm(page) {
  const submitSelectors = [
    'button[type="submit"]:not(:has-text("Continue"))',
    'button:has-text("Sign in")',
    'button:has-text("Sign In")',
    'button:has-text("Log in")',
    'button:has-text("Login")'
  ];
  
  for (const selector of submitSelectors) {
    try {
      await page.click(selector, { timeout: 3000 });
      console.log('✅ Clicked submit button');
      return true;
    } catch (e) {
      // Try next
    }
  }
  
  console.log('⚠️ Could not find submit button, trying Enter key...');
  await page.keyboard.press('Enter');
  return true;
}

async function navigateToPatients(page) {
  const selectors = [
    'a[href*="/patients"]',
    'text=Patient Management',
    'text=Patients',
    '[data-testid="patients-nav"]',
    'nav >> text=Patients'
  ];
  
  for (const selector of selectors) {
    try {
      await page.click(selector, { timeout: 5000 });
      console.log('✅ Clicked patient management link');
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      return true;
    } catch (e) {
      // Try next
    }
  }
  
  // Try direct navigation
  console.log('⚠️ Could not find patient link, navigating directly...');
  await page.goto('http://localhost:3000/en/dashboard/patients');
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  return true;
}

async function navigateToAppointments(page) {
  const selectors = [
    'a[href*="/appointments"]',
    'text=Appointments',
    'text=Schedule',
    '[data-testid="appointments-nav"]'
  ];
  
  for (const selector of selectors) {
    try {
      await page.click(selector, { timeout: 5000 });
      console.log('✅ Clicked appointments link');
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      return true;
    } catch (e) {
      // Try next
    }
  }
  
  // Try direct navigation
  console.log('⚠️ Could not find appointments link, navigating directly...');
  await page.goto('http://localhost:3000/en/dashboard/appointments');
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  return true;
}

async function testPatientPage(page, report) {
  console.log('\n🔍 Testing Patient Page Functionality...');
  
  // Check for patient list
  const hasPatientList = await page.locator('table, [role="grid"], .patient-list').count() > 0;
  if (!hasPatientList) {
    report.patientPageIssues.push('No patient list/table found on page');
    console.log('❌ No patient list found');
  } else {
    console.log('✅ Patient list found');
  }
  
  // Check for Add Patient button
  const hasAddButton = await page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add Patient")').count() > 0;
  if (!hasAddButton) {
    report.patientPageIssues.push('No Add Patient button found');
    console.log('❌ No Add Patient button found');
  } else {
    console.log('✅ Add Patient button found');
    
    // Try clicking it
    try {
      await page.click('button:has-text("Add"), button:has-text("New"), a:has-text("Add Patient")', { timeout: 3000 });
      await page.waitForTimeout(2000);
      
      // Check if form opened
      const hasForm = await page.locator('form, [role="dialog"], .modal').count() > 0;
      if (hasForm) {
        console.log('✅ Add Patient form opened');
        await page.screenshot({ path: 'add-patient-form.png' });
        
        // Close form
        try {
          await page.keyboard.press('Escape');
        } catch (e) {
          // Try close button
          await page.click('button:has-text("Cancel"), button:has-text("Close")', { timeout: 2000 }).catch(() => {});
        }
      } else {
        report.patientPageIssues.push('Add Patient form did not open');
        console.log('❌ Add Patient form did not open');
      }
    } catch (e) {
      report.patientPageIssues.push('Could not interact with Add Patient button');
      console.log('❌ Could not click Add Patient button');
    }
  }
  
  // Check for search functionality
  const hasSearch = await page.locator('input[type="search"], input[placeholder*="Search"]').count() > 0;
  if (!hasSearch) {
    report.uiIssues.push('No search functionality found on patient page');
    console.log('⚠️ No search functionality found');
  } else {
    console.log('✅ Search functionality found');
  }
  
  // Check for filters
  const hasFilters = await page.locator('button:has-text("Filter"), select, [role="combobox"]').count() > 0;
  if (!hasFilters) {
    report.uiIssues.push('No filter options found on patient page');
    console.log('⚠️ No filter options found');
  } else {
    console.log('✅ Filter options found');
  }
}

async function testAppointmentsPage(page, report) {
  console.log('\n🔍 Testing Appointments Page Functionality...');
  
  // Check for calendar or appointment list
  const hasCalendar = await page.locator('.calendar, [role="grid"], table').count() > 0;
  if (!hasCalendar) {
    report.appointmentIssues.push('No calendar or appointment list found');
    console.log('❌ No calendar/list found');
  } else {
    console.log('✅ Calendar/appointment list found');
  }
  
  // Check for schedule/book button
  const hasBookButton = await page.locator('button:has-text("Schedule"), button:has-text("Book"), button:has-text("New Appointment")').count() > 0;
  if (!hasBookButton) {
    report.appointmentIssues.push('No Schedule/Book appointment button found');
    console.log('❌ No booking button found');
  } else {
    console.log('✅ Booking functionality found');
  }
  
  // Check for date navigation
  const hasDateNav = await page.locator('button:has-text("Today"), button:has-text("Next"), button:has-text("Previous")').count() > 0;
  if (!hasDateNav) {
    report.uiIssues.push('No date navigation controls found');
    console.log('⚠️ No date navigation found');
  } else {
    console.log('✅ Date navigation found');
  }
}

async function testFamilyPage(page, report) {
  console.log('\n🔍 Testing Family/Relatives Functionality...');
  
  try {
    await page.click('text=/family|relatives/i', { timeout: 5000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    console.log('✅ Navigated to family/relatives section');
    await page.screenshot({ path: 'family-page.png' });
    
    // Check for family member list
    const hasFamilyList = await page.locator('table, .family-list, [role="list"]').count() > 0;
    if (!hasFamilyList) {
      report.familyPageIssues.push('No family member list found');
      console.log('❌ No family list found');
    } else {
      console.log('✅ Family list found');
    }
    
    // Check for add family member
    const hasAddFamily = await page.locator('button:has-text("Add"), button:has-text("Link")').count() > 0;
    if (!hasAddFamily) {
      report.familyPageIssues.push('No Add Family Member functionality found');
      console.log('❌ No add family member button found');
    } else {
      console.log('✅ Add family member functionality found');
    }
  } catch (e) {
    report.familyPageIssues.push('Could not access family/relatives feature');
    console.log('❌ Failed to access family/relatives section');
  }
}

// Run the test
testPatientModule().catch(console.error);