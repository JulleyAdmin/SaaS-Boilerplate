import { test, expect, Page, BrowserContext } from '@playwright/test';
import { createLogger } from '../src/libs/Logger';

// Create test logger for comprehensive monitoring
const testLogger = createLogger('comprehensive-ui-review');

interface TestResults {
  pageLoads: Record<string, { success: boolean; error?: string; loadTime?: number }>;
  interactions: Record<string, { success: boolean; error?: string }>;
  crudOperations: Record<string, { success: boolean; error?: string }>;
  serverErrors: string[];
}

test.describe('Comprehensive UI Review - HospitalOS', () => {
  let context: BrowserContext;
  let page: Page;
  let testResults: TestResults;
  let serverLogs: string[] = [];

  test.beforeAll(async ({ browser }) => {
    testLogger.info('🚀 Starting comprehensive UI review');
    context = await browser.newContext();
    
    // Listen to console logs to capture server-side issues
    context.on('console', (msg) => {
      const logEntry = `[${msg.type().toUpperCase()}] ${msg.text()}`;
      serverLogs.push(logEntry);
      if (msg.type() === 'error') {
        testLogger.error({ message: msg.text() }, 'Browser console error detected');
      }
    });

    // Initialize test results structure
    testResults = {
      pageLoads: {},
      interactions: {},
      crudOperations: {},
      serverErrors: []
    };
  });

  test.beforeEach(async () => {
    page = await context.newPage();
    testLogger.info('📄 Creating new page for test');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.afterAll(async () => {
    await context.close();
    testLogger.info('📊 Test results summary:', testResults);
    testLogger.info('🔍 Server logs captured:', { logCount: serverLogs.length });
  });

  // Helper function to test page loading
  async function testPageLoad(url: string, expectedTitle?: string): Promise<boolean> {
    const startTime = Date.now();
    try {
      testLogger.info(`🌐 Testing page load: ${url}`);
      
      const response = await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      const loadTime = Date.now() - startTime;
      testLogger.info(`⏱️ Page load time: ${loadTime}ms`);

      if (!response || response.status() >= 400) {
        throw new Error(`HTTP ${response?.status()}: ${response?.statusText()}`);
      }

      if (expectedTitle) {
        await expect(page).toHaveTitle(new RegExp(expectedTitle, 'i'));
      }

      testResults.pageLoads[url] = { success: true, loadTime };
      testLogger.info(`✅ Page loaded successfully: ${url}`);
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      testResults.pageLoads[url] = { success: false, error: errorMsg };
      testLogger.error(`❌ Page load failed: ${url} - ${errorMsg}`);
      return false;
    }
  }

  // Helper function to test authentication
  async function authenticateUser(email: string, password: string): Promise<boolean> {
    try {
      testLogger.info(`🔐 Attempting authentication for: ${email}`);
      
      await page.goto('http://localhost:3000/sign-in');
      await page.waitForLoadState('networkidle');

      // Fill email
      const emailInput = page.locator('input[name="identifier"], input[type="email"], input[name="email"]').first();
      await emailInput.fill(email);
      testLogger.info('📧 Email field filled');

      // Fill password
      const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
      await passwordInput.fill(password);
      testLogger.info('🔑 Password field filled');

      // Submit form
      const submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")').first();
      await submitButton.click();
      testLogger.info('🔄 Login form submitted');

      // Wait for navigation or error
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      const isAuthenticated = currentUrl.includes('/dashboard') || currentUrl.includes('/app');
      
      if (isAuthenticated) {
        testLogger.info('✅ Authentication successful');
        return true;
      } else {
        testLogger.error('❌ Authentication failed - not redirected to dashboard');
        return false;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      testLogger.error(`❌ Authentication error: ${errorMsg}`);
      return false;
    }
  }

  // Test 1: Authentication Flow
  test('Authentication and Login Flow', async () => {
    testLogger.info('🧪 Testing authentication flow');

    // Test login page load
    const loginPageLoaded = await testPageLoad('http://localhost:3000/sign-in', 'Sign');
    expect(loginPageLoaded).toBe(true);

    // Test authentication
    const authSuccess = await authenticateUser('admin@stmarys.hospital.com', 'u3Me65zO&8@b');
    
    testResults.interactions['authentication'] = { success: authSuccess };
    
    if (authSuccess) {
      // Verify dashboard access
      const dashboardLoaded = await testPageLoad('http://localhost:3000/dashboard', 'Dashboard');
      expect(dashboardLoaded).toBe(true);
    }
  });

  // Test 2: Main Navigation and Page Loading
  test('Main Navigation and Page Accessibility', async () => {
    testLogger.info('🧪 Testing main navigation and pages');

    // Authenticate first
    await authenticateUser('admin@stmarys.hospital.com', 'u3Me65zO&8@b');

    const pagesToTest = [
      { url: 'http://localhost:3000/dashboard', title: 'Dashboard' },
      { url: 'http://localhost:3000/dashboard/patients', title: 'Patients' },
      { url: 'http://localhost:3000/dashboard/appointments', title: 'Appointments' },
      { url: 'http://localhost:3000/dashboard/departments', title: 'Departments' },
      { url: 'http://localhost:3000/dashboard/staff', title: 'Staff' },
      { url: 'http://localhost:3000/dashboard/pharmacy', title: 'Pharmacy' },
      { url: 'http://localhost:3000/dashboard/lab', title: 'Lab' },
      { url: 'http://localhost:3000/dashboard/billing', title: 'Billing' },
      { url: 'http://localhost:3000/dashboard/emergency', title: 'Emergency' },
      { url: 'http://localhost:3000/dashboard/sso-management', title: 'SSO' },
      { url: 'http://localhost:3000/dashboard/audit-logs', title: 'Audit' },
      { url: 'http://localhost:3000/dashboard/admin', title: 'Admin' },
    ];

    for (const pageTest of pagesToTest) {
      await testPageLoad(pageTest.url, pageTest.title);
      await page.waitForTimeout(1000); // Brief pause between tests
    }
  });

  // Test 3: Interactive Elements Testing
  test('Interactive Elements and UI Components', async () => {
    testLogger.info('🧪 Testing interactive elements');

    await authenticateUser('admin@stmarys.hospital.com', 'u3Me65zO&8@b');

    // Test dashboard interactions
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');

    try {
      // Test navigation menu
      const menuItems = page.locator('nav a, [role="menuitem"]');
      const menuCount = await menuItems.count();
      testLogger.info(`🔍 Found ${menuCount} navigation items`);

      // Test clicking on various navigation items
      if (menuCount > 0) {
        for (let i = 0; i < Math.min(menuCount, 5); i++) {
          try {
            const item = menuItems.nth(i);
            const text = await item.textContent();
            if (text && text.trim()) {
              await item.click();
              await page.waitForTimeout(1000);
              testLogger.info(`✅ Successfully clicked menu item: ${text.trim()}`);
            }
          } catch (error) {
            testLogger.warn(`⚠️ Could not click menu item ${i}: ${error}`);
          }
        }
      }

      testResults.interactions['navigation'] = { success: true };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      testResults.interactions['navigation'] = { success: false, error: errorMsg };
      testLogger.error(`❌ Navigation test failed: ${errorMsg}`);
    }
  });

  // Test 4: CRUD Operations Testing
  test('CRUD Operations Testing', async () => {
    testLogger.info('🧪 Testing CRUD operations');

    await authenticateUser('admin@stmarys.hospital.com', 'u3Me65zO&8@b');

    // Test Patient CRUD operations
    try {
      await page.goto('http://localhost:3000/dashboard/patients');
      await page.waitForLoadState('networkidle');

      // Look for Create buttons
      const createButtons = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New"), a:has-text("Create"), a:has-text("Add")');
      const createButtonCount = await createButtons.count();
      
      if (createButtonCount > 0) {
        testLogger.info(`🔍 Found ${createButtonCount} create buttons`);
        const firstCreateButton = createButtons.first();
        const buttonText = await firstCreateButton.textContent();
        await firstCreateButton.click();
        await page.waitForTimeout(2000);
        testLogger.info(`✅ Successfully clicked create button: ${buttonText}`);
        
        testResults.crudOperations['patient_create'] = { success: true };
      } else {
        testLogger.warn('⚠️ No create buttons found on patients page');
        testResults.crudOperations['patient_create'] = { success: false, error: 'No create buttons found' };
      }

      // Look for data tables or lists
      const dataElements = page.locator('table, [role="grid"], .table, .list-item, .data-row');
      const dataCount = await dataElements.count();
      testLogger.info(`🔍 Found ${dataCount} data display elements`);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      testResults.crudOperations['patient_operations'] = { success: false, error: errorMsg };
      testLogger.error(`❌ Patient CRUD test failed: ${errorMsg}`);
    }

    // Test SSO Management CRUD
    try {
      await page.goto('http://localhost:3000/dashboard/sso-management');
      await page.waitForLoadState('networkidle');

      // Look for SSO connection creation
      const ssoCreateButton = page.locator('button:has-text("Create"), button:has-text("Add")').first();
      if (await ssoCreateButton.isVisible()) {
        await ssoCreateButton.click();
        await page.waitForTimeout(2000);
        testLogger.info('✅ SSO create button clicked successfully');
        testResults.crudOperations['sso_create'] = { success: true };
      } else {
        testLogger.warn('⚠️ SSO create button not found');
        testResults.crudOperations['sso_create'] = { success: false, error: 'Create button not visible' };
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      testResults.crudOperations['sso_operations'] = { success: false, error: errorMsg };
      testLogger.error(`❌ SSO CRUD test failed: ${errorMsg}`);
    }
  });

  // Test 5: API Response Testing
  test('API Endpoints and Network Requests', async () => {
    testLogger.info('🧪 Testing API endpoints and network requests');

    await authenticateUser('admin@stmarys.hospital.com', 'u3Me65zO&8@b');

    // Monitor network requests
    const apiCalls: string[] = [];
    const failedCalls: string[] = [];

    page.on('response', (response) => {
      const url = response.url();
      const status = response.status();
      
      if (url.includes('/api/')) {
        apiCalls.push(`${response.request().method()} ${url} - ${status}`);
        testLogger.info(`📡 API call: ${response.request().method()} ${url} - ${status}`);
        
        if (status >= 400) {
          failedCalls.push(`${response.request().method()} ${url} - ${status}`);
          testLogger.error(`❌ API call failed: ${response.request().method()} ${url} - ${status}`);
        }
      }
    });

    // Navigate through pages to trigger API calls
    const apiTestPages = [
      'http://localhost:3000/dashboard/patients',
      'http://localhost:3000/dashboard/appointments',
      'http://localhost:3000/dashboard/billing',
    ];

    for (const pageUrl of apiTestPages) {
      await page.goto(pageUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    testLogger.info(`📊 API calls monitored: ${apiCalls.length}`);
    testLogger.info(`❌ Failed API calls: ${failedCalls.length}`);

    testResults.interactions['api_monitoring'] = { 
      success: failedCalls.length === 0,
      error: failedCalls.length > 0 ? `${failedCalls.length} failed API calls` : undefined
    };
  });

  // Test 6: Error Handling and Edge Cases
  test('Error Handling and Edge Cases', async () => {
    testLogger.info('🧪 Testing error handling and edge cases');

    // Test invalid login
    try {
      await page.goto('http://localhost:3000/sign-in');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator('input[type="email"], input[name="identifier"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.locator('button[type="submit"]').first();

      await emailInput.fill('invalid@email.com');
      await passwordInput.fill('wrongpassword');
      await submitButton.click();
      await page.waitForTimeout(3000);

      // Check if error message is displayed
      const errorElements = page.locator('.error, [role="alert"], .alert-error, .text-red');
      const hasError = (await errorElements.count()) > 0;
      
      testResults.interactions['error_handling'] = { 
        success: hasError,
        error: hasError ? undefined : 'No error message displayed for invalid login'
      };
      
      testLogger.info(`🔍 Error handling test: ${hasError ? 'PASS' : 'FAIL'}`);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      testResults.interactions['error_handling'] = { success: false, error: errorMsg };
      testLogger.error(`❌ Error handling test failed: ${errorMsg}`);
    }

    // Test accessing protected routes without authentication
    try {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      const redirectedToLogin = currentUrl.includes('/sign-in') || currentUrl.includes('/login');
      
      testResults.interactions['auth_protection'] = { 
        success: redirectedToLogin,
        error: redirectedToLogin ? undefined : 'Protected route accessible without authentication'
      };
      
      testLogger.info(`🔒 Auth protection test: ${redirectedToLogin ? 'PASS' : 'FAIL'}`);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      testResults.interactions['auth_protection'] = { success: false, error: errorMsg };
      testLogger.error(`❌ Auth protection test failed: ${errorMsg}`);
    }
  });
});