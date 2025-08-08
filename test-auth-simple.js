#!/usr/bin/env node

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Testing authentication with clean browser session...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🧹 Clearing cookies...');
    await context.clearCookies();
    
    console.log('📄 Navigating to sign-in page...');
    const response = await page.goto('http://localhost:3000/sign-in', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    console.log('✅ Response status:', response.status());
    
    if (response.status() === 200) {
      console.log('✅ Sign-in page loaded successfully!');
      
      // Wait for page to fully load
      await page.waitForTimeout(2000);
      
      // Check if Clerk is loaded
      const hasClerkElements = await page.evaluate(() => {
        return document.querySelector('[data-clerk-element]') !== null ||
               document.querySelector('.cl-') !== null ||
               document.textContent.includes('Sign in') ||
               document.textContent.includes('Email');
      });
      
      console.log('🎯 Clerk elements found:', hasClerkElements);
      
      // Take a screenshot
      await page.screenshot({ path: 'auth-test-success.png' });
      console.log('📸 Screenshot saved as auth-test-success.png');
      
    } else {
      console.log('❌ Sign-in page failed with status:', response.status());
      await page.screenshot({ path: 'auth-test-failed.png' });
    }
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🚨 Browser console error:', msg.text());
      }
    });
    
    // Wait a bit to see the page
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'auth-test-error.png' });
  } finally {
    await browser.close();
  }
})();