// Test patient UI with demo data
import { chromium } from 'playwright';

async function testPatientUI() {
  console.log('🧪 Testing Patient Management UI...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('📱 Opening patient dashboard...');
    await page.goto('http://localhost:3000/dashboard/patients');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'patient-dashboard-demo.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: patient-dashboard-demo.png');
    
    // Check if patients are visible
    try {
      await page.waitForSelector('[data-testid="patient-list"]', { timeout: 5000 });
      console.log('✅ Patient list component found');
      
      // Count patients
      const patientCards = await page.$$('[data-testid="patient-card"]');
      console.log(`✅ Found ${patientCards.length} patient cards`);
      
      // Check for demo patients
      const patientNames = await page.$$eval('[data-testid="patient-name"]', 
        elements => elements.map(el => el.textContent)
      );
      console.log('📋 Patients found:', patientNames);
      
    } catch (error) {
      console.log('⚠️  Patient list not found - checking for other elements...');
      
      // Check for error messages
      const errorText = await page.textContent('body');
      if (errorText.includes('Sign in')) {
        console.log('🔐 Redirected to sign-in page - no auth required in demo mode');
      } else if (errorText.includes('error')) {
        console.log('❌ Error on page:', errorText.substring(0, 200));
      }
    }
    
    // Test API directly
    console.log('\n🔌 Testing Patient API...');
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/patients');
        const data = await response.json();
        return { status: response.status, data };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('API Response:', JSON.stringify(apiResponse, null, 2));
    
    // Keep browser open for manual inspection
    console.log('\n👀 Browser will stay open for manual inspection...');
    console.log('Press Ctrl+C to close');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await browser.close();
  }
}

testPatientUI().catch(console.error);