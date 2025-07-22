#!/usr/bin/env node

const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const SCREENSHOTS_DIR = path.join(process.cwd(), 'test-reports', 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function quickScreenshot() {
  console.log('📸 Quick Screenshot Capture');
  console.log('===========================');

  const browser = await chromium.launch({
    headless: false, // Show browser so you can navigate manually
    slowMo: 50,
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  try {
    console.log('🌐 Opening http://localhost:3001...');
    await page.goto('http://localhost:3001');

    console.log('\n⏸️  MANUAL STEP:');
    console.log('1. Sign in to the application');
    console.log('2. Navigate to the SSO Management page');
    console.log('3. Press Enter in this terminal when ready...\n');

    // Wait for user input
    await new Promise((resolve) => {
      process.stdin.once('data', () => resolve());
    });

    console.log('📸 Taking desktop screenshot...');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'working-01-desktop.png'),
      fullPage: false, // Just viewport, no full page to avoid timeout
      timeout: 10000,
    });

    console.log('📱 Switching to mobile...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'working-02-mobile.png'),
      fullPage: false,
      timeout: 10000,
    });

    console.log('✅ Screenshots captured successfully!');
    console.log('📁 Files saved:');
    console.log('   - working-01-desktop.png');
    console.log('   - working-02-mobile.png');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n🕐 Keeping browser open for 5 seconds...');
  await page.waitForTimeout(5000);

  await browser.close();

  // Generate simple HTML to view
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Working App Screenshots</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; background: #22c55e; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .screenshots { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
        .screenshot { border: 1px solid #ccc; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .screenshot img { width: 100%; max-width: 500px; display: block; cursor: pointer; }
        .screenshot h3 { margin: 0; padding: 10px; background: #f5f5f5; text-align: center; }
        .mobile-frame { max-width: 375px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Working Hospital SSO App Screenshots</h1>
        <p>Captured from actual running application</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="screenshots">
        <div class="screenshot">
            <h3>Desktop View</h3>
            <img src="screenshots/working-01-desktop.png" onclick="window.open(this.src, '_blank')" alt="Desktop view">
        </div>
        
        <div class="screenshot mobile-frame">
            <h3>Mobile View</h3>
            <img src="screenshots/working-02-mobile.png" onclick="window.open(this.src, '_blank')" alt="Mobile view">
        </div>
    </div>
    
    <p style="text-align: center; margin-top: 30px;">
        ✅ These are actual screenshots from your working Hospital SSO application!<br>
        Click images to view full size
    </p>
</body>
</html>
  `;

  fs.writeFileSync(path.join(process.cwd(), 'test-reports', 'working-app-screenshots.html'), html);
  console.log('\n📄 Report: test-reports/working-app-screenshots.html');
}

quickScreenshot().catch(console.error);
