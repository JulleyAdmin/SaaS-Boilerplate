#!/usr/bin/env node

const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const SCREENSHOTS_DIR = path.join(process.cwd(), 'test-reports', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function quickHospitalScreenshots() {
  console.log('🏥 Quick Hospital SSO Screenshots');
  console.log('=================================');

  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  try {
    // 1. Homepage
    console.log('📸 1/5 - Homepage...');
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(3000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'new-01-homepage.png'),
      fullPage: true,
    });

    // 2. Mobile homepage
    console.log('📸 2/5 - Mobile homepage...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'new-02-mobile.png'),
      fullPage: true,
    });

    // 3. Try sign up
    console.log('📸 3/5 - Sign up page...');
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);

    const signUpLink = page.locator('a[href="/sign-up"]').first();
    if (await signUpLink.isVisible({ timeout: 3000 })) {
      await signUpLink.click();
      await page.waitForTimeout(3000);
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'new-03-signup.png'),
        fullPage: true,
      });
    }

    // 4. Try sign in
    console.log('📸 4/5 - Sign in page...');
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(2000);

    const signInLink = page.locator('a[href="/sign-in"]').first();
    if (await signInLink.isVisible({ timeout: 3000 })) {
      await signInLink.click();
      await page.waitForTimeout(3000);
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'new-04-signin.png'),
        fullPage: true,
      });
    }

    // 5. Dashboard attempt
    console.log('📸 5/5 - Dashboard attempt...');
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForTimeout(3000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'new-05-dashboard.png'),
      fullPage: true,
    });

    console.log('✅ All screenshots captured!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await page.waitForTimeout(2000);
  await browser.close();

  // List files
  const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.startsWith('new-'));
  console.log('\n📋 New screenshots:');
  files.forEach(file => console.log(`   - ${file}`));

  // Simple report
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Hospital SSO - Latest Screenshots</title>
    <style>
        body { font-family: Arial; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; background: #3b82f6; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
        .card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .card img { width: 100%; cursor: pointer; }
        .card-title { padding: 10px; background: #f5f5f5; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Hospital SSO - Latest Screenshots</h1>
        <p>Captured: ${new Date().toLocaleString()}</p>
    </div>
    <div class="grid">
        ${files.map(file => `
        <div class="card">
            <img src="screenshots/${file}" onclick="window.open(this.src)" alt="${file}">
            <div class="card-title">${file.replace('new-', '').replace('.png', '').replace(/-/g, ' ').toUpperCase()}</div>
        </div>
        `).join('')}
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join(process.cwd(), 'test-reports', 'hospital-latest-screenshots.html'), html);
  console.log('\n📄 Report: test-reports/hospital-latest-screenshots.html');
}

quickHospitalScreenshots().catch(console.error);
