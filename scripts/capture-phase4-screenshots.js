const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const captureScreenshots = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, '..', 'phase4-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const screenshots = [];

  try {
    console.log('📸 Capturing Phase 4 Feature Screenshots...\n');

    // 1. Test Features Overview Page
    console.log('1. Capturing test features page...');
    await page.goto('http://localhost:3002/en/dashboard/test-features');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-test-features-overview.png'),
      fullPage: true 
    });
    screenshots.push({
      title: 'Phase 4 Features Overview',
      file: '01-test-features-overview.png',
      description: 'Overview of API Key Management and MFA features'
    });

    // 2. API Keys Page
    console.log('2. Capturing API Keys page...');
    await page.goto('http://localhost:3002/en/dashboard/api-keys');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '02-api-keys-page.png'),
      fullPage: true 
    });
    screenshots.push({
      title: 'API Key Management',
      file: '02-api-keys-page.png',
      description: 'API key management interface'
    });

    // 3. MFA Settings Page
    console.log('3. Capturing MFA settings page...');
    await page.goto('http://localhost:3002/en/dashboard/security/mfa');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '03-mfa-settings.png'),
      fullPage: true 
    });
    screenshots.push({
      title: 'MFA Settings',
      file: '03-mfa-settings.png',
      description: 'Multi-factor authentication settings'
    });

    // 4. User Profile Security Section
    console.log('4. Capturing user profile security section...');
    await page.goto('http://localhost:3002/en/dashboard/user-profile?section=security');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '04-user-profile-security.png'),
      fullPage: true 
    });
    screenshots.push({
      title: 'User Profile - Security',
      file: '04-user-profile-security.png',
      description: 'Clerk user profile security settings'
    });

    // Generate HTML report
    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Phase 4 - Feature Screenshots</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 40px;
        }
        .screenshot-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 30px;
        }
        .screenshot-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
        }
        .screenshot-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .screenshot-card img {
            width: 100%;
            height: auto;
            display: block;
            cursor: pointer;
        }
        .screenshot-info {
            padding: 20px;
        }
        .screenshot-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
        }
        .screenshot-description {
            color: #666;
            font-size: 14px;
        }
        .summary {
            background: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .feature-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .feature-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #4CAF50;
        }
        .feature-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .feature-card ul {
            margin: 0;
            padding-left: 20px;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>🚀 Phase 4: Core Template Capabilities</h1>
    
    <div class="summary">
        <h2>Implementation Summary</h2>
        <p>Successfully integrated core capabilities from BoxyHQ and implemented Clerk's MFA system.</p>
        
        <div class="feature-list">
            <div class="feature-card">
                <h3>✅ API Key Management</h3>
                <ul>
                    <li>Secure key generation with SHA-256</li>
                    <li>Organization-scoped access</li>
                    <li>One-time key display</li>
                    <li>Expiration and usage tracking</li>
                </ul>
            </div>
            <div class="feature-card">
                <h3>✅ Multi-Factor Authentication</h3>
                <ul>
                    <li>TOTP authenticator support</li>
                    <li>SMS backup authentication</li>
                    <li>Backup codes generation</li>
                    <li>MFA enforcement middleware</li>
                </ul>
            </div>
        </div>
    </div>
    
    <div class="screenshot-grid">
        ${screenshots.map(s => `
        <div class="screenshot-card">
            <img src="${s.file}" alt="${s.title}" onclick="window.open(this.src)">
            <div class="screenshot-info">
                <div class="screenshot-title">${s.title}</div>
                <div class="screenshot-description">${s.description}</div>
            </div>
        </div>
        `).join('')}
    </div>
    
    <script>
        // Click on images to view full size
        document.querySelectorAll('img').forEach(img => {
            img.style.cursor = 'pointer';
        });
    </script>
</body>
</html>
    `;

    fs.writeFileSync(path.join(screenshotsDir, 'index.html'), htmlReport);
    console.log('\n✅ Screenshots captured successfully!');
    console.log(`📁 View report at: ${path.join(screenshotsDir, 'index.html')}`);

  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
};

captureScreenshots();