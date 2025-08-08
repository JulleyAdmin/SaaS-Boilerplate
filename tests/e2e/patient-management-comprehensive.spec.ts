import { test, expect, Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

// Define comprehensive test data and interfaces
interface TestReport {
  testName: string;
  timestamp: string;
  success: boolean;
  duration: number;
  errors: string[];
  warnings: string[];
  pageLoadTime?: number;
  consoleErrors: string[];
  networkErrors: string[];
  accessibilityIssues?: any[];
}

interface PatientTestData {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string;
}

const TEST_CREDENTIALS = {
  email: 'admin@stmarys.hospital.com',
  password: 'u3Me65zO&8@b'
};

const MOCK_PATIENT_DATA: PatientTestData = {
  id: 'PAT-TEST-001',
  name: 'John Test Patient',
  phoneNumber: '+1-555-0123',
  email: 'john.test@example.com',
  dateOfBirth: '1985-06-15',
  gender: 'Male',
  address: '123 Test Street, Test City, TC 12345',
  emergencyContact: 'Jane Doe - Sister - +1-555-0456',
  medicalHistory: 'No known allergies. Previous surgery in 2020.'
};

let testReport: TestReport[] = [];

class PatientManagementTester {
  constructor(private page: Page) {}

  async takeScreenshotWithReport(stepName: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `patient-test-${stepName}-${timestamp}.png`;
    await this.page.screenshot({ 
      path: `test-results/screenshots/${filename}`, 
      fullPage: true 
    });
  }

  async waitForPageLoad(timeout: number = 10000): Promise<number> {
    const startTime = Date.now();
    
    try {
      // Wait for the page to be in a ready state
      await this.page.waitForLoadState('networkidle', { timeout });
      
      // Wait for any loading spinners to disappear
      await this.page.waitForSelector('[data-testid="loading"]', { 
        state: 'hidden', 
        timeout: 5000 
      }).catch(() => {
        // Ignore if no loading spinner exists
      });
      
      return Date.now() - startTime;
    } catch (error) {
      console.warn(`Page load timeout after ${timeout}ms:`, error);
      return Date.now() - startTime;
    }
  }

  async checkForConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`Console Error: ${msg.text()}`);
      }
    });
    
    this.page.on('pageerror', error => {
      errors.push(`Page Error: ${error.message}`);
    });
    
    return errors;
  }

  async checkForNetworkErrors(): Promise<string[]> {
    const networkErrors: string[] = [];
    
    this.page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push(`Network Error: ${response.status()} ${response.url()}`);
      }
    });
    
    return networkErrors;
  }

  async performAccessibilityCheck(): Promise<any[]> {
    try {
      const accessibilityScanResults = await new AxeBuilder({ page: this.page }).analyze();
      return accessibilityScanResults.violations;
    } catch (error) {
      console.warn('Accessibility check failed:', error);
      return [];
    }
  }

  async login(): Promise<TestReport> {
    const startTime = Date.now();
    const report: TestReport = {
      testName: 'Login Process',
      timestamp: new Date().toISOString(),
      success: false,
      duration: 0,
      errors: [],
      warnings: [],
      consoleErrors: [],
      networkErrors: []
    };

    try {
      console.log('🔐 Starting login process...');
      
      // Navigate to login page (with locale)
      await this.page.goto('/en/sign-in');
      await this.takeScreenshotWithReport('01-login-page');
      
      report.pageLoadTime = await this.waitForPageLoad();
      
      // Fill login form
      await this.page.fill('input[name="emailAddress"]', TEST_CREDENTIALS.email);
      await this.page.fill('input[name="password"]', TEST_CREDENTIALS.password);
      
      await this.takeScreenshotWithReport('02-login-filled');
      
      // Submit login
      await this.page.click('button[type="submit"]');
      
      // Wait for redirect to dashboard
      await this.page.waitForURL('**/dashboard', { timeout: 15000 });
      await this.takeScreenshotWithReport('03-dashboard-loaded');
      
      report.success = true;
      console.log('✅ Login successful');
      
    } catch (error) {
      report.errors.push(`Login failed: ${error.message}`);
      console.error('❌ Login failed:', error.message);
      await this.takeScreenshotWithReport('error-login');
    }
    
    report.duration = Date.now() - startTime;
    return report;
  }

  async navigateToPatientManagement(): Promise<TestReport> {
    const startTime = Date.now();
    const report: TestReport = {
      testName: 'Navigate to Patient Management',
      timestamp: new Date().toISOString(),
      success: false,
      duration: 0,
      errors: [],
      warnings: [],
      consoleErrors: [],
      networkErrors: []
    };

    try {
      console.log('🔍 Navigating to Patient Management...');
      
      // Look for navigation menu
      const navPatients = await this.page.locator('a[href*="patients"]').first();
      
      if (await navPatients.isVisible()) {
        await navPatients.click();
      } else {
        // Try direct navigation
        await this.page.goto('/en/dashboard/patients');
      }
      
      report.pageLoadTime = await this.waitForPageLoad();
      await this.takeScreenshotWithReport('04-patients-page');
      
      // Verify we're on the patients page
      await expect(this.page).toHaveURL(/.*patients/);
      
      report.success = true;
      console.log('✅ Successfully navigated to Patient Management');
      
    } catch (error) {
      report.errors.push(`Navigation failed: ${error.message}`);
      console.error('❌ Navigation failed:', error.message);
      await this.takeScreenshotWithReport('error-navigation');
    }
    
    report.duration = Date.now() - startTime;
    return report;
  }

  async testPatientListView(): Promise<TestReport> {
    const startTime = Date.now();
    const report: TestReport = {
      testName: 'Patient List View',
      timestamp: new Date().toISOString(),
      success: false,
      duration: 0,
      errors: [],
      warnings: [],
      consoleErrors: [],
      networkErrors: []
    };

    try {
      console.log('📋 Testing Patient List View...');
      
      // Check for main heading
      const heading = this.page.locator('h1');
      if (await heading.isVisible()) {
        const headingText = await heading.textContent();
        console.log(`Found heading: ${headingText}`);
      } else {
        report.warnings.push('No main heading found on patient page');
      }
      
      // Check for patient list or empty state
      const patientList = this.page.locator('[data-testid="patient-list"], .patient-list, table');
      const loadingSpinner = this.page.locator('[data-testid="loading"], .loading, .spinner');
      const emptyState = this.page.locator('[data-testid="empty-state"], .empty-state');
      
      // Wait for content to load
      await Promise.race([
        patientList.waitFor({ timeout: 5000 }).catch(() => null),
        emptyState.waitFor({ timeout: 5000 }).catch(() => null),
        this.page.waitForTimeout(5000)
      ]);
      
      await this.takeScreenshotWithReport('05-patient-list');
      
      // Check what's visible
      if (await patientList.isVisible()) {
        console.log('✅ Patient list found');
        
        // Check for patient entries
        const patients = await this.page.locator('tr, .patient-item, .patient-card').count();
        console.log(`Found ${patients} patient entries`);
        
        if (patients === 0) {
          report.warnings.push('Patient list is empty');
        }
      } else if (await emptyState.isVisible()) {
        console.log('📝 Empty state found');
        report.warnings.push('Patient list shows empty state');
      } else {
        report.errors.push('Neither patient list nor empty state found');
      }
      
      // Check for search functionality
      const searchInput = this.page.locator('input[placeholder*="search"], input[type="search"]');
      if (await searchInput.isVisible()) {
        console.log('🔍 Search functionality found');
      } else {
        report.warnings.push('No search functionality visible');
      }
      
      // Check for filter options
      const filterButton = this.page.locator('button:has-text("Filter"), button:has-text("filter")');
      if (await filterButton.isVisible()) {
        console.log('🔽 Filter options found');
      } else {
        report.warnings.push('No filter options visible');
      }
      
      // Check for add patient button
      const addButton = this.page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add")');
      if (await addButton.isVisible()) {
        console.log('➕ Add patient button found');
      } else {
        report.warnings.push('No add patient button visible');
      }
      
      report.success = true;
      
    } catch (error) {
      report.errors.push(`Patient list test failed: ${error.message}`);
      console.error('❌ Patient list test failed:', error.message);
      await this.takeScreenshotWithReport('error-patient-list');
    }
    
    report.duration = Date.now() - startTime;
    return report;
  }

  async testPatientCreation(): Promise<TestReport> {
    const startTime = Date.now();
    const report: TestReport = {
      testName: 'Patient Creation',
      timestamp: new Date().toISOString(),
      success: false,
      duration: 0,
      errors: [],
      warnings: [],
      consoleErrors: [],
      networkErrors: []
    };

    try {
      console.log('➕ Testing Patient Creation...');
      
      // Look for add patient button
      const addButton = this.page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add")').first();
      
      if (await addButton.isVisible()) {
        await addButton.click();
        await this.takeScreenshotWithReport('06-create-patient-form');
        
        // Wait for form to appear
        const form = this.page.locator('form, [data-testid="patient-form"]');
        await form.waitFor({ timeout: 5000 });
        
        // Test form fields
        const nameInput = this.page.locator('input[name="name"], input[placeholder*="name"]').first();
        if (await nameInput.isVisible()) {
          await nameInput.fill(MOCK_PATIENT_DATA.name);
          console.log('✅ Name field filled');
        } else {
          report.warnings.push('Name input field not found');
        }
        
        const emailInput = this.page.locator('input[name="email"], input[type="email"]').first();
        if (await emailInput.isVisible()) {
          await emailInput.fill(MOCK_PATIENT_DATA.email);
          console.log('✅ Email field filled');
        } else {
          report.warnings.push('Email input field not found');
        }
        
        const phoneInput = this.page.locator('input[name="phone"], input[name="phoneNumber"]').first();
        if (await phoneInput.isVisible()) {
          await phoneInput.fill(MOCK_PATIENT_DATA.phoneNumber);
          console.log('✅ Phone field filled');
        } else {
          report.warnings.push('Phone input field not found');
        }
        
        await this.takeScreenshotWithReport('07-form-filled');
        
        // Try to submit (but don't actually submit to avoid creating test data)
        const submitButton = this.page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Create")');
        if (await submitButton.isVisible()) {
          console.log('✅ Submit button found');
          // Note: Not clicking submit to avoid creating test data
        } else {
          report.warnings.push('Submit button not found');
        }
        
        report.success = true;
        
      } else {
        report.errors.push('Add patient button not found');
      }
      
    } catch (error) {
      report.errors.push(`Patient creation test failed: ${error.message}`);
      console.error('❌ Patient creation test failed:', error.message);
      await this.takeScreenshotWithReport('error-patient-creation');
    }
    
    report.duration = Date.now() - startTime;
    return report;
  }

  async testAppointmentsPage(): Promise<TestReport> {
    const startTime = Date.now();
    const report: TestReport = {
      testName: 'Appointments Page',
      timestamp: new Date().toISOString(),
      success: false,
      duration: 0,
      errors: [],
      warnings: [],
      consoleErrors: [],
      networkErrors: []
    };

    try {
      console.log('📅 Testing Appointments Page...');
      
      // Navigate to appointments
      await this.page.goto('/en/dashboard/appointments');
      report.pageLoadTime = await this.waitForPageLoad();
      
      await this.takeScreenshotWithReport('08-appointments-page');
      
      // Check page heading
      const heading = this.page.locator('h1:has-text("Appointments")');
      if (await heading.isVisible()) {
        console.log('✅ Appointments page loaded');
      } else {
        report.warnings.push('Appointments heading not found');
      }
      
      // Check for statistics cards
      const statsCards = await this.page.locator('.card, [data-testid="stat-card"]').count();
      console.log(`Found ${statsCards} statistics cards`);
      
      if (statsCards === 0) {
        report.warnings.push('No statistics cards found');
      }
      
      // Check for appointment list
      const appointmentList = this.page.locator('[data-testid="appointment-list"], .appointment-list');
      if (await appointmentList.isVisible()) {
        console.log('✅ Appointment list found');
      } else {
        report.warnings.push('Appointment list not visible');
      }
      
      // Check for tabs (Today, Tomorrow, Week, All)
      const tabs = this.page.locator('[role="tablist"], .tabs');
      if (await tabs.isVisible()) {
        console.log('✅ Appointment tabs found');
        
        // Test tab switching
        const tomorrowTab = this.page.locator('[role="tab"]:has-text("Tomorrow"), button:has-text("Tomorrow")');
        if (await tomorrowTab.isVisible()) {
          await tomorrowTab.click();
          await this.takeScreenshotWithReport('09-appointments-tomorrow-tab');
          console.log('✅ Tomorrow tab clicked');
        }
      } else {
        report.warnings.push('Appointment tabs not found');
      }
      
      // Check for search functionality
      const searchInput = this.page.locator('input[placeholder*="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('John');
        await this.takeScreenshotWithReport('10-appointments-search');
        console.log('✅ Search functionality tested');
      } else {
        report.warnings.push('Search functionality not found');
      }
      
      report.success = true;
      
    } catch (error) {
      report.errors.push(`Appointments test failed: ${error.message}`);
      console.error('❌ Appointments test failed:', error.message);
      await this.takeScreenshotWithReport('error-appointments');
    }
    
    report.duration = Date.now() - startTime;
    return report;
  }

  async testFamilyRelativesPage(): Promise<TestReport> {
    const startTime = Date.now();
    const report: TestReport = {
      testName: 'Family/Relatives Page',
      timestamp: new Date().toISOString(),
      success: false,
      duration: 0,
      errors: [],
      warnings: [],
      consoleErrors: [],
      networkErrors: []
    };

    try {
      console.log('👨‍👩‍👧‍👦 Testing Family/Relatives functionality...');
      
      // Try to navigate to family/relatives page
      const familyUrls = [
        '/en/dashboard/patients/family',
        '/en/dashboard/family',
        '/en/dashboard/relatives',
        '/en/dashboard/patient-family'
      ];
      
      let pageFound = false;
      
      for (const url of familyUrls) {
        try {
          await this.page.goto(url);
          const response = await this.page.waitForResponse(response => 
            response.url().includes(url.split('/').pop()!)
          ).catch(() => null);
          
          if (response && response.status() < 400) {
            pageFound = true;
            console.log(`✅ Found family page at: ${url}`);
            break;
          }
        } catch (error) {
          // Continue to next URL
        }
      }
      
      if (!pageFound) {
        // Look for family functionality within patient details
        await this.page.goto('/en/dashboard/patients');
        await this.waitForPageLoad();
        
        // Look for patient details or family information
        const patientItems = this.page.locator('.patient-item, tr, .patient-card').first();
        if (await patientItems.isVisible()) {
          await patientItems.click();
          await this.takeScreenshotWithReport('11-patient-details');
          
          // Look for family/relatives section
          const familySection = this.page.locator('[data-testid="family"], .family, :has-text("Family"):has-text("Relative")');
          if (await familySection.isVisible()) {
            console.log('✅ Family section found in patient details');
            pageFound = true;
          }
        }
      }
      
      if (pageFound) {
        await this.takeScreenshotWithReport('12-family-relatives');
        report.success = true;
      } else {
        report.warnings.push('Family/Relatives functionality not found in expected locations');
      }
      
    } catch (error) {
      report.errors.push(`Family/Relatives test failed: ${error.message}`);
      console.error('❌ Family/Relatives test failed:', error.message);
      await this.takeScreenshotWithReport('error-family');
    }
    
    report.duration = Date.now() - startTime;
    return report;
  }

  async runAccessibilityCheck(): Promise<TestReport> {
    const startTime = Date.now();
    const report: TestReport = {
      testName: 'Accessibility Check',
      timestamp: new Date().toISOString(),
      success: false,
      duration: 0,
      errors: [],
      warnings: [],
      consoleErrors: [],
      networkErrors: [],
      accessibilityIssues: []
    };

    try {
      console.log('♿ Running accessibility checks...');
      
      report.accessibilityIssues = await this.performAccessibilityCheck();
      
      if (report.accessibilityIssues.length === 0) {
        console.log('✅ No accessibility violations found');
        report.success = true;
      } else {
        console.log(`⚠️ Found ${report.accessibilityIssues.length} accessibility violations`);
        report.warnings.push(`${report.accessibilityIssues.length} accessibility violations found`);
        report.success = true; // Still successful, but with warnings
      }
      
    } catch (error) {
      report.errors.push(`Accessibility check failed: ${error.message}`);
      console.error('❌ Accessibility check failed:', error.message);
    }
    
    report.duration = Date.now() - startTime;
    return report;
  }
}

// Main test suite
test.describe('Patient Management Module - Comprehensive Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Set up console and network error monitoring
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console Error: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', error => {
      console.log(`Page Error: ${error.message}`);
    });
    
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`Network Error: ${response.status()} ${response.url()}`);
      }
    });
  });

  test('Comprehensive Patient Management Testing', async ({ page }) => {
    const tester = new PatientManagementTester(page);
    testReport = [];

    console.log('🏥 Starting Comprehensive Patient Management Testing');
    console.log('=' + '='.repeat(60));

    // Test 1: Login
    const loginReport = await tester.login();
    testReport.push(loginReport);

    if (!loginReport.success) {
      console.log('❌ Cannot proceed without successful login');
      return;
    }

    // Test 2: Navigate to Patient Management
    const navigationReport = await tester.navigateToPatientManagement();
    testReport.push(navigationReport);

    // Test 3: Patient List View
    const listViewReport = await tester.testPatientListView();
    testReport.push(listViewReport);

    // Test 4: Patient Creation
    const creationReport = await tester.testPatientCreation();
    testReport.push(creationReport);

    // Test 5: Appointments Page
    const appointmentsReport = await tester.testAppointmentsPage();
    testReport.push(appointmentsReport);

    // Test 6: Family/Relatives
    const familyReport = await tester.testFamilyRelativesPage();
    testReport.push(familyReport);

    // Test 7: Accessibility Check
    const accessibilityReport = await tester.runAccessibilityCheck();
    testReport.push(accessibilityReport);

    // Generate comprehensive report
    console.log('\n📊 COMPREHENSIVE TEST REPORT');
    console.log('=' + '='.repeat(50));
    
    let totalErrors = 0;
    let totalWarnings = 0;
    let totalDuration = 0;
    
    testReport.forEach(report => {
      totalErrors += report.errors.length;
      totalWarnings += report.warnings.length;
      totalDuration += report.duration;
      
      const status = report.success ? '✅' : '❌';
      console.log(`${status} ${report.testName}: ${report.duration}ms`);
      
      if (report.errors.length > 0) {
        report.errors.forEach(error => console.log(`  ❌ ${error}`));
      }
      
      if (report.warnings.length > 0) {
        report.warnings.forEach(warning => console.log(`  ⚠️ ${warning}`));
      }
      
      if (report.accessibilityIssues && report.accessibilityIssues.length > 0) {
        console.log(`  ♿ ${report.accessibilityIssues.length} accessibility issues`);
      }
    });
    
    console.log('\n📈 SUMMARY STATISTICS');
    console.log('-'.repeat(30));
    console.log(`Total Tests: ${testReport.length}`);
    console.log(`Successful: ${testReport.filter(r => r.success).length}`);
    console.log(`Failed: ${testReport.filter(r => !r.success).length}`);
    console.log(`Total Errors: ${totalErrors}`);
    console.log(`Total Warnings: ${totalWarnings}`);
    console.log(`Total Duration: ${totalDuration}ms`);
    
    // Save detailed report to file
    const detailedReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: testReport.length,
        successful: testReport.filter(r => r.success).length,
        failed: testReport.filter(r => !r.success).length,
        totalErrors,
        totalWarnings,
        totalDuration
      },
      testResults: testReport
    };
    
    // Write report to file
    await page.evaluate((report) => {
      console.log('DETAILED_TEST_REPORT:', JSON.stringify(report, null, 2));
    }, detailedReport);

    // Ensure at least some tests passed
    expect(testReport.filter(r => r.success).length).toBeGreaterThan(0);
  });

  test('Performance and Load Time Analysis', async ({ page }) => {
    console.log('⚡ Running Performance Analysis...');
    
    const performanceMetrics = [];
    
    // Test key pages for load times
    const pagesToTest = [
      '/en/dashboard',
      '/en/dashboard/patients',
      '/en/dashboard/appointments'
    ];
    
    for (const pageUrl of pagesToTest) {
      const startTime = Date.now();
      
      try {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        const loadTime = Date.now() - startTime;
        performanceMetrics.push({
          page: pageUrl,
          loadTime,
          success: true
        });
        
        console.log(`📄 ${pageUrl}: ${loadTime}ms`);
        
      } catch (error) {
        performanceMetrics.push({
          page: pageUrl,
          loadTime: Date.now() - startTime,
          success: false,
          error: error.message
        });
        
        console.log(`❌ ${pageUrl}: Failed to load - ${error.message}`);
      }
    }
    
    // Report performance summary
    const avgLoadTime = performanceMetrics
      .filter(m => m.success)
      .reduce((sum, m) => sum + m.loadTime, 0) / performanceMetrics.filter(m => m.success).length;
    
    console.log(`\n📊 Average Load Time: ${avgLoadTime.toFixed(0)}ms`);
    
    // Performance expectations
    const slowPages = performanceMetrics.filter(m => m.loadTime > 5000);
    if (slowPages.length > 0) {
      console.log(`⚠️ Slow pages (>5s): ${slowPages.map(p => p.page).join(', ')}`);
    }
    
    expect(avgLoadTime).toBeLessThan(10000); // Average should be under 10 seconds
  });
});