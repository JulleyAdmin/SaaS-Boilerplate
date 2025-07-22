#!/usr/bin/env node

const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const SCREENSHOTS_DIR = path.join(process.cwd(), 'test-reports', 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function captureScreenshots() {
  console.log('🚀 Opening browser for screenshot capture...');

  const browser = await chromium.launch({
    headless: false, // Show the browser
    slowMo: 100, // Slow down for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  console.log('🌐 Opening application...');
  await page.goto('http://localhost:3001');

  console.log('\n🕐 Waiting 30 seconds for you to sign in and navigate to SSO management...');
  console.log('   Please:');
  console.log('   1. Sign in to the application');
  console.log('   2. Navigate to Dashboard > SSO Management');
  console.log('   3. Wait for automatic screenshots to start...\n');

  // Wait 30 seconds for manual navigation
  await page.waitForTimeout(30000);

  console.log('📸 Starting automatic screenshot capture...\n');

  try {
    // 1. Capture current page (should be SSO management)
    console.log('📸 1/8 - Capturing current page...');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'live-01-current-page.png'),
      fullPage: true,
    });

    // 2. Check for create button and capture
    console.log('📸 2/8 - Looking for create button...');
    const createBtn = page.locator('button:has-text("Create SSO Connection")').first();
    if (await createBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('   ✅ Found create button');

      // 3. Open create dialog
      console.log('📸 3/8 - Opening create dialog...');
      await createBtn.click();
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'live-02-create-dialog.png'),
        fullPage: true,
      });

      // 4. Fill some fields
      console.log('📸 4/8 - Filling form fields...');
      const nameInput = page.locator('input[name="name"]').first();
      if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nameInput.fill('Pediatrics Department SAML');

        const descInput = page.locator('input[name="description"]').first();
        if (await descInput.isVisible().catch(() => false)) {
          await descInput.fill('Pediatric staff authentication');
        }

        const deptSelect = page.locator('select[name="department"]').first();
        if (await deptSelect.isVisible().catch(() => false)) {
          await deptSelect.selectOption('emergency');
        }

        // Check some roles
        const doctorCheck = page.locator('input[value="doctor"]').first();
        const nurseCheck = page.locator('input[value="nurse"]').first();

        if (await doctorCheck.isVisible().catch(() => false)) {
          await doctorCheck.check();
        }
        if (await nurseCheck.isVisible().catch(() => false)) {
          await nurseCheck.check();
        }

        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, 'live-03-form-filled.png'),
          fullPage: true,
        });
      }

      // 5. Close dialog
      console.log('📸 5/8 - Closing dialog...');
      const cancelBtn = page.locator('button:has-text("Cancel")').first();
      if (await cancelBtn.isVisible().catch(() => false)) {
        await cancelBtn.click();
        await page.waitForTimeout(1000);
      }
    } else {
      console.log('   ⚠️  Create button not found - you might not be on SSO management page');
    }

    // 6. Capture main page again
    console.log('📸 6/8 - Capturing main page...');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'live-04-main-page.png'),
      fullPage: true,
    });

    // 7. Mobile view
    console.log('📸 7/8 - Switching to mobile view...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'live-05-mobile-view.png'),
      fullPage: true,
    });

    // 8. Mobile create dialog
    console.log('📸 8/8 - Mobile create dialog...');
    const createBtnMobile = page.locator('button:has-text("Create SSO Connection")').first();
    if (await createBtnMobile.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createBtnMobile.click();
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'live-06-mobile-dialog.png'),
        fullPage: true,
      });
    }

    console.log('\n✅ Screenshot capture completed!');
    console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);

    // List captured files
    const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.startsWith('live-'));
    console.log('\n📋 Captured screenshots:');
    files.forEach(file => console.log(`   - ${file}`));
  } catch (error) {
    console.error('❌ Error during screenshot capture:', error.message);
  }

  console.log('\n🕐 Keeping browser open for 10 more seconds for manual inspection...');
  await page.waitForTimeout(10000);

  await browser.close();

  // Generate simple report
  generateQuickReport();
}

function generateQuickReport() {
  const screenshots = fs.readdirSync(SCREENSHOTS_DIR)
    .filter(f => f.startsWith('live-') && f.endsWith('.png'))
    .sort();

  if (screenshots.length === 0) {
    console.log('⚠️  No screenshots captured');
    return;
  }

  const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Live Screenshot Report</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; background: #3b82f6; color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
        .card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card img { width: 100%; display: block; cursor: pointer; }
        .card-title { padding: 10px; background: #f9fafb; font-weight: 600; }
        .mobile { max-width: 375px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Live Screenshot Report</h1>
        <p>Captured: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="grid">
        ${screenshots.map((file, index) => `
        <div class="card ${file.includes('mobile') ? 'mobile' : ''}">
            <img src="screenshots/${file}" onclick="window.open(this.src, '_blank')" alt="Screenshot ${index + 1}">
            <div class="card-title">${file.replace('live-', '').replace('.png', '').replace(/-/g, ' ')}</div>
        </div>
        `).join('')}
    </div>
    
    <p style="text-align: center; margin-top: 30px;">
        Click any screenshot to view full size
    </p>
</body>
</html>
  `;

  const reportPath = path.join(process.cwd(), 'test-reports', 'live-screenshot-report.html');
  fs.writeFileSync(reportPath, htmlReport);

  console.log(`\n📄 Quick report generated: ${reportPath}`);
  console.log('To view: open test-reports/live-screenshot-report.html');
}

// Run the capture
captureScreenshots().catch(console.error);
