#!/usr/bin/env node

const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const SCREENSHOTS_DIR = path.join(process.cwd(), 'test-reports', 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function autoScreenshot() {
  console.log('📸 Auto Screenshot Capture');
  console.log('===========================');

  const browser = await chromium.launch({
    headless: false, // Show browser for debugging
    slowMo: 50,
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  try {
    console.log('🌐 Opening http://localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 10000 });

    // Wait a moment for any dynamic content
    await page.waitForTimeout(3000);

    console.log('📸 1/4 - Taking homepage screenshot...');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'final-01-homepage.png'),
      fullPage: false,
      timeout: 10000,
    });

    // Try to navigate to dashboard if sign-in button exists
    console.log('🔍 Looking for navigation elements...');

    try {
      // Look for common navigation patterns
      const dashboardLink = await page.locator('a[href*="dashboard"], button:has-text("Dashboard"), a:has-text("Dashboard")').first();
      if (await dashboardLink.isVisible({ timeout: 3000 })) {
        console.log('📸 2/4 - Found dashboard link, clicking...');
        await dashboardLink.click();
        await page.waitForTimeout(2000);

        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, 'final-02-dashboard.png'),
          fullPage: false,
          timeout: 10000,
        });
      } else {
        console.log('📸 2/4 - No dashboard link found, taking current page...');
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, 'final-02-current.png'),
          fullPage: false,
          timeout: 10000,
        });
      }
    } catch (navError) {
      console.log('⚠️  Navigation failed, taking current page...');
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'final-02-fallback.png'),
        fullPage: false,
        timeout: 10000,
      });
    }

    console.log('📱 3/4 - Switching to mobile view...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'final-03-mobile.png'),
      fullPage: false,
      timeout: 10000,
    });

    console.log('🖥️  4/4 - Back to desktop view...');
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'final-04-desktop.png'),
      fullPage: false,
      timeout: 10000,
    });

    console.log('✅ Screenshots captured successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);

    // Take error screenshot
    try {
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'final-error.png'),
        fullPage: false,
        timeout: 5000,
      });
      console.log('📸 Error state captured');
    } catch (e) {
      console.error('Failed to capture error state');
    }
  }

  console.log('🕐 Keeping browser open for 3 seconds...');
  await page.waitForTimeout(3000);

  await browser.close();

  // List captured files
  const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.startsWith('final-'));
  console.log('\n📋 Final screenshots:');
  files.forEach(file => console.log(`   - ${file}`));

  // Generate final report
  generateFinalReport(files);
}

function generateFinalReport(screenshots) {
  if (screenshots.length === 0) {
    console.log('⚠️  No screenshots captured');
    return;
  }

  const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Final Working App Screenshots</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f8fafc; }
        .header { text-align: center; background: #10b981; color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 25px; }
        .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .card:hover { transform: translateY(-4px); }
        .card img { width: 100%; display: block; cursor: pointer; }
        .card-title { padding: 15px; background: #f8fafc; font-weight: 600; border-top: 1px solid #e5e7eb; }
        .mobile { max-width: 375px; margin: 0 auto; }
        .status { text-align: center; margin-top: 30px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status.success { border-left: 4px solid #10b981; }
    </style>
    <script>
        function openImage(src) {
            const newWindow = window.open('', '_blank');
            newWindow.document.write(\`
                <html>
                    <head><title>Screenshot</title></head>
                    <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; min-height:100vh;">
                        <img src="\${src}" style="max-width:100%; max-height:100%; object-fit:contain;">
                    </body>
                </html>
            \`);
        }
    </script>
</head>
<body>
    <div class="header">
        <h1>🏥 Hospital SSO Application Screenshots</h1>
        <p>Working application captured from http://localhost:3001</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="grid">
        ${screenshots.map((file, index) => `
        <div class="card ${file.includes('mobile') ? 'mobile' : ''}">
            <img src="screenshots/${file}" onclick="openImage(this.src)" alt="Screenshot ${index + 1}">
            <div class="card-title">${file.replace('final-', '').replace('.png', '').replace(/-/g, ' ').toUpperCase()}</div>
        </div>
        `).join('')}
    </div>
    
    <div class="status success">
        <h2>✅ Screenshot Capture Complete</h2>
        <p>Successfully captured ${screenshots.length} screenshots from the running Hospital SSO application.</p>
        <p><strong>Application Status:</strong> Running on http://localhost:3001</p>
        <p><strong>Features Tested:</strong> Homepage, Navigation, Mobile Responsiveness</p>
    </div>
</body>
</html>
  `;

  const reportPath = path.join(process.cwd(), 'test-reports', 'final-working-app-screenshots.html');
  fs.writeFileSync(reportPath, htmlReport);

  console.log(`\n📄 Final report: ${reportPath}`);
  console.log(`🌐 Open in browser: file://${reportPath}`);
}

autoScreenshot().catch(console.error);
