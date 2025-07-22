import fs from 'node:fs';
import path from 'node:path';

import { test } from '@playwright/test';

// Configure screenshot directory
const SCREENSHOTS_DIR = path.join(process.cwd(), 'test-reports', 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

test.describe('Direct Screenshot Capture', () => {
  test('capture actual app screenshots', async ({ page, context }) => {
    test.setTimeout(90000); // 90 seconds timeout

    console.log('🚀 Starting direct screenshot capture...');

    // Go directly to the SSO management page
    // If redirected to sign-in, we'll handle it
    await page.goto('http://localhost:3002/dashboard/sso-management', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Wait a bit for any redirects
    await page.waitForTimeout(3000);

    // Check current URL
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);

    // Capture whatever page we're on
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '00-initial-page.png'),
      fullPage: true,
    });

    // If we're on a Clerk sign-in page
    if (currentUrl.includes('clerk') || currentUrl.includes('sign-in')) {
      console.log('🔐 On sign-in page, capturing...');

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '01-sign-in-page.png'),
        fullPage: true,
      });

      // Try to find dev instance bypass or sign in
      const devBypass = page.locator('text=/Continue with (dev|development)/i').first();
      const emailField = page.locator('input[type="email"], input[name="identifier"], input[name="email"]').first();

      if (await devBypass.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('🔓 Using dev instance bypass...');
        await devBypass.click();
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      } else if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('📧 Filling in credentials...');
        // Try to sign in
        await emailField.fill('test@example.com');
        await page.keyboard.press('Enter');

        // Wait for password field or next step
        await page.waitForTimeout(2000);

        const passwordField = page.locator('input[type="password"]').first();
        if (await passwordField.isVisible({ timeout: 5000 }).catch(() => false)) {
          await passwordField.fill('testpassword');
          await page.keyboard.press('Enter');
        }
      }

      // Wait for navigation
      await page.waitForTimeout(5000);
    }

    // Try to navigate to SSO management again
    const finalUrl = page.url();
    if (!finalUrl.includes('sso-management')) {
      console.log('📍 Navigating to SSO management...');
      await page.goto('http://localhost:3002/dashboard/sso-management', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      }).catch(() => {});
      await page.waitForTimeout(3000);
    }

    // Capture the current state regardless
    console.log('📸 Capturing current page state...');
    const currentPageUrl = page.url();
    console.log('📍 Current page URL:', currentPageUrl);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-current-page.png'),
      fullPage: true,
    });

    // If we made it to SSO management, capture detailed screenshots
    if (currentPageUrl.includes('sso-management')) {
      console.log('✅ On SSO management page!');

      // Main page
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '03-sso-management-main.png'),
        fullPage: true,
      });

      // Try to click create button
      const createButton = page.locator('button:has-text("Create SSO Connection")').first();
      if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('📸 Capturing create dialog...');
        await createButton.click();
        await page.waitForTimeout(1000); // Wait for animation

        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, '04-create-dialog.png'),
          fullPage: true,
        });

        // Fill some fields
        const nameInput = page.locator('input[name="name"]').first();
        if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await nameInput.fill('Emergency Department SAML');

          const deptSelect = page.locator('select[name="department"]').first();
          if (await deptSelect.isVisible().catch(() => false)) {
            await deptSelect.selectOption('emergency');
          }

          await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '05-create-dialog-filled.png'),
            fullPage: true,
          });
        }
      }

      // Mobile view
      console.log('📱 Capturing mobile view...');
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '06-mobile-view.png'),
        fullPage: true,
      });
    }

    console.log('✅ Screenshot capture completed!');
    console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
  });

  test('capture with manual navigation instructions', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes

    console.log('\n🔍 Alternative approach with manual navigation...\n');
    console.log('This test will pause at key points for manual intervention.\n');

    // Start at the home page
    await page.goto('http://localhost:3002');

    console.log('⏸️  PAUSED: Please sign in manually if needed.');
    console.log('   Then navigate to the SSO Management page.');
    console.log('   Press Enter in the terminal when ready...\n');

    // Pause for manual intervention
    await page.pause();

    // Now capture whatever page we're on
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Take screenshots
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'manual-01-current-page.png'),
      fullPage: true,
    });

    // If on SSO management, capture more
    if (currentUrl.includes('sso-management')) {
      console.log('✅ Great! You\'re on the SSO management page.');

      // Create dialog
      const createBtn = page.locator('button:has-text("Create SSO Connection")').first();
      if (await createBtn.isVisible().catch(() => false)) {
        await createBtn.click();
        await page.waitForTimeout(1000);

        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, 'manual-02-create-dialog.png'),
          fullPage: true,
        });
      }
    }

    console.log('✅ Manual screenshot capture completed!');
  });
});
