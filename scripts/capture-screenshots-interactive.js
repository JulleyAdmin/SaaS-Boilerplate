#!/usr/bin/env node

const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
const readline = require('node:readline');

const SCREENSHOTS_DIR = path.join(process.cwd(), 'test-reports', 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = prompt => new Promise(resolve => rl.question(prompt, resolve));

async function captureScreenshots() {
  const browser = await chromium.launch({
    headless: false, // Show the browser
    slowMo: 50, // Slow down actions for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  console.log('🌐 Opening application...');
  await page.goto('http://localhost:3002');

  console.log('\n📋 INSTRUCTIONS:');
  console.log('1. Sign in to the application');
  console.log('2. Navigate to the SSO Management page');
  console.log('3. Come back here and press Enter when ready\n');

  await question('Press Enter when you\'re on the SSO Management page... ');

  console.log('\n📸 Starting screenshot capture...\n');

  // 1. Main SSO Management Page
  console.log('📸 Capturing main SSO management page...');
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '01-sso-management-main.png'),
    fullPage: true,
  });

  // 2. Check for existing connections or empty state
  const emptyState = page.locator('text=No SSO connections configured yet');
  const isEmptyState = await emptyState.isVisible().catch(() => false);

  if (isEmptyState) {
    console.log('📸 Capturing empty state...');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-empty-state.png'),
      fullPage: true,
    });
  } else {
    console.log('📸 Found existing connections...');

    // Hover on delete button
    const deleteBtn = page.locator('button:has-text("Delete")').first();
    if (await deleteBtn.isVisible().catch(() => false)) {
      await deleteBtn.hover();
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '02-delete-hover.png'),
        fullPage: true,
      });
    }
  }

  // 3. Create Dialog
  console.log('📸 Opening create dialog...');
  const createBtn = page.locator('button:has-text("Create SSO Connection")');
  await createBtn.click();
  await page.waitForTimeout(1000); // Wait for animation

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '03-create-dialog-empty.png'),
    fullPage: true,
  });

  // 4. Fill the form
  console.log('📸 Filling form with sample data...');

  await page.fill('input[name="name"]', 'Cardiology Department SAML');
  await page.fill('input[name="description"]', 'Cardiology staff authentication system');

  const deptSelect = page.locator('select[name="department"]');
  if (await deptSelect.isVisible().catch(() => false)) {
    // Open dropdown for screenshot
    await deptSelect.click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '04-department-dropdown.png'),
      clip: { x: 350, y: 150, width: 580, height: 500 },
    });

    await deptSelect.selectOption('surgery');
  }

  // Select roles
  await page.check('input[value="doctor"]');
  await page.check('input[value="nurse"]');
  await page.check('input[value="technician"]');

  await page.fill('textarea[name="metadata"]', `<?xml version="1.0"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" 
                  entityID="https://surgery.hospital.com/saml">
  <IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIDEzCCAfugAwIBAgIJAKoK/heBjcOYMA0...</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </KeyDescriptor>
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" 
                         Location="https://idp.hospital.com/saml/sso/surgery"/>
  </IDPSSODescriptor>
</EntityDescriptor>`);

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '05-create-dialog-filled.png'),
    fullPage: true,
  });

  // 5. Close dialog
  console.log('📸 Closing dialog...');
  await page.click('button:has-text("Cancel")');
  await page.waitForTimeout(500);

  // 6. Phase 2 Banner
  const phase2Banner = page.locator('text=Phase 2 - Backend Integration Active');
  if (await phase2Banner.isVisible().catch(() => false)) {
    console.log('📸 Capturing Phase 2 status banner...');
    await phase2Banner.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-phase2-banner.png'),
      fullPage: true,
    });
  }

  // 7. Mobile View
  console.log('📸 Switching to mobile view...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '07-mobile-view.png'),
    fullPage: true,
  });

  // 8. Mobile dialog
  await createBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '08-mobile-create-dialog.png'),
    fullPage: true,
  });

  console.log('\n✅ Screenshot capture completed!');
  console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);

  await question('\nPress Enter to close the browser... ');

  await browser.close();
  rl.close();

  // Generate report
  console.log('\n📊 Generating visual report...');
  generateReport();
}

function generateReport() {
  const screenshots = fs.readdirSync(SCREENSHOTS_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();

  const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hospital SSO - Screenshot Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f7fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 40px;
        }
        .screenshot-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .screenshot-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .screenshot-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .screenshot-card img {
            width: 100%;
            display: block;
            cursor: pointer;
        }
        .screenshot-title {
            padding: 15px;
            font-weight: 600;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
        }
        .mobile-section {
            text-align: center;
            margin-top: 40px;
        }
        .mobile-devices {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }
        .iphone-frame {
            position: relative;
            width: 375px;
            padding: 20px;
            background: #000;
            border-radius: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .iphone-screen {
            border-radius: 20px;
            overflow: hidden;
        }
        .iphone-screen img {
            width: 100%;
            display: block;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Hospital SSO Management - Screenshot Report</h1>
        <p>Captured on ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="screenshot-grid">
        ${screenshots.filter(s => !s.includes('mobile')).map(screenshot => `
        <div class="screenshot-card">
            <img src="screenshots/${screenshot}" alt="${screenshot}" onclick="window.open(this.src, '_blank')">
            <div class="screenshot-title">${screenshot.replace('.png', '').replace(/-/g, ' ').replace(/\d+/g, '').trim()}</div>
        </div>
        `).join('')}
    </div>
    
    <div class="mobile-section">
        <h2>📱 Mobile Views</h2>
        <div class="mobile-devices">
            ${screenshots.filter(s => s.includes('mobile')).map(screenshot => `
            <div class="iphone-frame">
                <div class="iphone-screen">
                    <img src="screenshots/${screenshot}" alt="${screenshot}" onclick="window.open(this.src, '_blank')">
                </div>
            </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
  `;

  const reportPath = path.join(process.cwd(), 'test-reports', 'screenshot-report.html');
  fs.writeFileSync(reportPath, htmlReport);

  console.log(`📄 Report generated: ${reportPath}`);
  console.log('\nTo view: open test-reports/screenshot-report.html');
}

// Run the capture
captureScreenshots().catch(console.error);
