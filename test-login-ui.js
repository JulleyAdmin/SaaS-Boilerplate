#!/usr/bin/env node

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Testing login with demo credentials...');
  
  const browser = await chromium.launch({ 
    headless: false,
    ignoreHTTPSErrors: true 
  });
  
  // Create a completely new context with no stored data
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    // Clear all storage
    storageState: undefined
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📄 Opening fresh browser to landing page...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    console.log('✅ Landing page loaded');
    
    // Take screenshot of landing page
    await page.screenshot({ path: 'landing-page.png' });
    
    // Click on Sign In button - try multiple selectors
    console.log('🔍 Looking for Sign In link...');
    const signInSelectors = [
      'a[href="/sign-in"]',
      'text=Sign In',
      'text=Sign in',
      'text=Login',
      'button:has-text("Sign In")',
      'a:has-text("Sign In")'
    ];
    
    let clicked = false;
    for (const selector of signInSelectors) {
      try {
        await page.click(selector, { timeout: 5000 });
        console.log(`✅ Clicked sign in using selector: ${selector}`);
        clicked = true;
        break;
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!clicked) {
      console.log('⚠️ Could not find Sign In link, navigating directly...');
      await page.goto('http://localhost:3000/sign-in', { waitUntil: 'domcontentloaded' });
    }
    
    // Wait for sign in page to load
    await page.waitForTimeout(3000);
    console.log('📸 Taking screenshot of sign-in page...');
    await page.screenshot({ path: 'sign-in-page.png' });
    
    // Look for email/username field
    console.log('🔍 Looking for email field...');
    const emailSelectors = [
      'input[name="identifier"]',
      'input[type="email"]',
      'input[name="email"]',
      'input[id="identifier-field"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="Email" i]',
      '.cl-formFieldInput__identifier'
    ];
    
    let emailFilled = false;
    for (const selector of emailSelectors) {
      try {
        await page.fill(selector, 'admin@stmarys.hospital.com', { timeout: 5000 });
        console.log(`✅ Filled email using selector: ${selector}`);
        emailFilled = true;
        break;
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!emailFilled) {
      console.log('❌ Could not find email field');
      const pageContent = await page.content();
      console.log('Page HTML snippet:', pageContent.substring(0, 500));
    }
    
    // Click continue/next button if it exists
    try {
      await page.click('button[type="submit"]', { timeout: 3000 });
      console.log('✅ Clicked continue button');
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('ℹ️ No continue button found, looking for password field...');
    }
    
    // Look for password field
    console.log('🔍 Looking for password field...');
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[id="password-field"]',
      '.cl-formFieldInput__password'
    ];
    
    let passwordFilled = false;
    for (const selector of passwordSelectors) {
      try {
        await page.fill(selector, 'u3Me65zO&8@b', { timeout: 5000 });
        console.log(`✅ Filled password using selector: ${selector}`);
        passwordFilled = true;
        break;
      } catch (e) {
        // Try next selector
      }
    }
    
    if (emailFilled || passwordFilled) {
      // Submit the form
      console.log('🚀 Submitting login form...');
      
      const submitSelectors = [
        'button[type="submit"]',
        'button:has-text("Sign in")',
        'button:has-text("Continue")',
        'button:has-text("Log in")',
        'button:has-text("Login")'
      ];
      
      for (const selector of submitSelectors) {
        try {
          await page.click(selector, { timeout: 3000 });
          console.log(`✅ Clicked submit using selector: ${selector}`);
          break;
        } catch (e) {
          // Try next selector
        }
      }
      
      // Wait for navigation
      console.log('⏳ Waiting for authentication...');
      await page.waitForTimeout(5000);
      
      // Check if we're on dashboard
      const currentUrl = page.url();
      console.log('📍 Current URL:', currentUrl);
      
      if (currentUrl.includes('dashboard')) {
        console.log('✅ Successfully logged in! Redirected to dashboard');
        await page.screenshot({ path: 'dashboard.png' });
      } else {
        console.log('⚠️ Login may have failed, still on:', currentUrl);
        await page.screenshot({ path: 'after-login-attempt.png' });
      }
    }
    
    // Keep browser open for manual inspection
    console.log('🔍 Keeping browser open for inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
  } finally {
    await browser.close();
  }
})();