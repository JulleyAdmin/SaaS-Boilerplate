import { test, expect } from '@playwright/test';

test('Quick Patient Management Navigation Test', async ({ page }) => {
  console.log('🏥 Starting Quick Patient Management Test');
  
  // Test 1: Check if app loads on correct port
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  
  console.log('📍 Current URL:', page.url());
  await page.screenshot({ path: 'test-results/screenshots/01-app-home.png', fullPage: true });
  
  // Test 2: Try to navigate to sign-in
  try {
    await page.goto('http://localhost:3002/en/sign-in');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    console.log('✅ Sign-in page loaded');
    await page.screenshot({ path: 'test-results/screenshots/02-sign-in.png', fullPage: true });
    
    // Check if sign-in form exists
    const emailInput = page.locator('input[name="emailAddress"], input[type="email"]');
    const passwordInput = page.locator('input[name="password"], input[type="password"]');
    
    if (await emailInput.isVisible()) {
      console.log('✅ Email input found');
    } else {
      console.log('❌ Email input not found');
    }
    
    if (await passwordInput.isVisible()) {
      console.log('✅ Password input found');
    } else {
      console.log('❌ Password input not found');
    }
    
  } catch (error) {
    console.log('❌ Sign-in page error:', error.message);
  }
  
  // Test 3: Try to access dashboard directly (should redirect to login)
  try {
    await page.goto('http://localhost:3002/en/dashboard');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    console.log('📍 Dashboard URL result:', page.url());
    await page.screenshot({ path: 'test-results/screenshots/03-dashboard-attempt.png', fullPage: true });
  } catch (error) {
    console.log('❌ Dashboard access error:', error.message);
  }
  
  // Test 4: Try to access patients page directly  
  try {
    await page.goto('http://localhost:3002/en/dashboard/patients');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    console.log('📍 Patients URL result:', page.url());
    await page.screenshot({ path: 'test-results/screenshots/04-patients-attempt.png', fullPage: true });
  } catch (error) {
    console.log('❌ Patients page access error:', error.message);
  }
  
  console.log('🏁 Quick test completed');
});