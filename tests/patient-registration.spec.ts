import { test, expect, Page } from '@playwright/test';

/**
 * Patient Registration E2E Test Suite
 * Based on User Story: As a receptionist, I want to register new patients 
 * and manage their records so that I can maintain accurate patient information.
 */

test.describe('Patient Registration & Management', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Navigate to the patient registration page
    await page.goto('/dashboard/patients/new');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display patient registration form with all required fields', async () => {
    // Acceptance Criteria 1: The patient registration page displays a form with all required fields
    
    // Check for form presence
    const form = page.locator('form[data-testid="patient-registration-form"]');
    await expect(form).toBeVisible();

    // Verify all required fields are present
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="dateOfBirth"]')).toBeVisible();
    await expect(page.locator('input[name="aadhaarNumber"]')).toBeVisible();
    await expect(page.locator('input[name="abhaId"]')).toBeVisible();
    await expect(page.locator('input[name="phoneNumber"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="address"]')).toBeVisible();
    await expect(page.locator('select[name="gender"]')).toBeVisible();
    await expect(page.locator('select[name="bloodGroup"]')).toBeVisible();
    
    // Check for emergency contact section
    await expect(page.locator('input[name="emergencyContactName"]')).toBeVisible();
    await expect(page.locator('input[name="emergencyContactNumber"]')).toBeVisible();
    await expect(page.locator('input[name="emergencyContactRelation"]')).toBeVisible();
  });

  test('should validate Aadhaar and phone number formats', async () => {
    // Acceptance Criteria 2: Form validates Aadhaar format (12 digits) and phone number (10 digits)
    
    // Test invalid Aadhaar (less than 12 digits)
    await page.fill('input[name="aadhaarNumber"]', '12345');
    await page.fill('input[name="phoneNumber"]', '98765');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Aadhaar number must be 12 digits')).toBeVisible();
    await expect(page.locator('text=Phone number must be 10 digits')).toBeVisible();
    
    // Test valid formats
    await page.fill('input[name="aadhaarNumber"]', '123456789012');
    await page.fill('input[name="phoneNumber"]', '9876543210');
    
    // Validation errors should disappear
    await expect(page.locator('text=Aadhaar number must be 12 digits')).not.toBeVisible();
    await expect(page.locator('text=Phone number must be 10 digits')).not.toBeVisible();
  });

  test('should successfully register a new patient', async () => {
    // Acceptance Criteria 3: Successfully registered patients appear in the patient list
    
    // Fill in the registration form with valid data
    await page.fill('input[name="firstName"]', 'Rajesh');
    await page.fill('input[name="lastName"]', 'Kumar');
    await page.fill('input[name="dateOfBirth"]', '1985-06-15');
    await page.fill('input[name="aadhaarNumber"]', '987654321012');
    await page.fill('input[name="abhaId"]', 'ABHA123456789');
    await page.fill('input[name="phoneNumber"]', '9876543210');
    await page.fill('input[name="email"]', 'rajesh.kumar@example.com');
    await page.fill('textarea[name="address"]', '123 Main Street, Mumbai, Maharashtra');
    await page.selectOption('select[name="gender"]', 'Male');
    await page.selectOption('select[name="bloodGroup"]', 'B+');
    
    // Fill emergency contact
    await page.fill('input[name="emergencyContactName"]', 'Priya Kumar');
    await page.fill('input[name="emergencyContactNumber"]', '9876543211');
    await page.fill('input[name="emergencyContactRelation"]', 'Spouse');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('text=Patient registered successfully')).toBeVisible();
    
    // Should redirect to patient list
    await page.waitForURL('/dashboard/patients');
    
    // Verify the new patient appears in the list
    await expect(page.locator('text=Rajesh Kumar')).toBeVisible();
  });

  test('should navigate to patient detail page when clicking a patient row', async () => {
    // Acceptance Criteria 4: Clicking a patient row navigates to their detail page
    
    // Navigate to patient list
    await page.goto('/dashboard/patients');
    
    // Click on a patient row
    const patientRow = page.locator('tr[data-testid="patient-row"]').first();
    await patientRow.click();
    
    // Should navigate to patient detail page
    await expect(page).toHaveURL(/\/dashboard\/patients\/[a-zA-Z0-9-]+/);
    
    // Patient details should be visible
    await expect(page.locator('[data-testid="patient-details"]')).toBeVisible();
  });

  test('should display patient demographics, medical history, and recent visits', async () => {
    // Acceptance Criteria 5: Patient details show demographics, medical history, and recent visits
    
    // Navigate to a specific patient detail page
    await page.goto('/dashboard/patients/test-patient-id');
    
    // Check for demographics section
    const demographicsSection = page.locator('[data-testid="patient-demographics"]');
    await expect(demographicsSection).toBeVisible();
    await expect(demographicsSection.locator('text=Personal Information')).toBeVisible();
    await expect(demographicsSection.locator('text=Contact Details')).toBeVisible();
    await expect(demographicsSection.locator('text=Emergency Contact')).toBeVisible();
    
    // Check for medical history section
    const medicalHistorySection = page.locator('[data-testid="medical-history"]');
    await expect(medicalHistorySection).toBeVisible();
    await expect(medicalHistorySection.locator('text=Allergies')).toBeVisible();
    await expect(medicalHistorySection.locator('text=Chronic Conditions')).toBeVisible();
    await expect(medicalHistorySection.locator('text=Current Medications')).toBeVisible();
    
    // Check for recent visits section
    const recentVisitsSection = page.locator('[data-testid="recent-visits"]');
    await expect(recentVisitsSection).toBeVisible();
    await expect(recentVisitsSection.locator('table')).toBeVisible();
    await expect(recentVisitsSection.locator('th:has-text("Date")')).toBeVisible();
    await expect(recentVisitsSection.locator('th:has-text("Doctor")')).toBeVisible();
    await expect(recentVisitsSection.locator('th:has-text("Diagnosis")')).toBeVisible();
  });

  test('should filter patients by name, ID, or phone number', async () => {
    // Acceptance Criteria 6: Search functionality filters patients by name, ID, or phone number
    
    // Navigate to patient list
    await page.goto('/dashboard/patients');
    
    // Wait for patient list to load
    await page.waitForSelector('[data-testid="patient-list"]');
    
    // Test search by name
    const searchInput = page.locator('input[placeholder="Search patients..."]');
    await searchInput.fill('Rajesh');
    await page.waitForTimeout(500); // Debounce delay
    
    // Should show filtered results
    await expect(page.locator('text=Rajesh Kumar')).toBeVisible();
    await expect(page.locator('[data-testid="patient-row"]')).toHaveCount(1);
    
    // Clear and test search by phone number
    await searchInput.clear();
    await searchInput.fill('9876543210');
    await page.waitForTimeout(500);
    
    // Should show patient with matching phone number
    await expect(page.locator('text=9876543210')).toBeVisible();
    
    // Clear and test search by patient ID
    await searchInput.clear();
    await searchInput.fill('PAT-2024-001');
    await page.waitForTimeout(500);
    
    // Should show patient with matching ID
    await expect(page.locator('text=PAT-2024-001')).toBeVisible();
    
    // Test no results case
    await searchInput.clear();
    await searchInput.fill('NonExistentPatient');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=No patients found')).toBeVisible();
  });

  test('should handle concurrent registrations gracefully', async ({ browser }) => {
    // Additional test for system robustness
    
    // Open two browser contexts to simulate concurrent users
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Both users navigate to registration
    await page1.goto('/dashboard/patients/new');
    await page2.goto('/dashboard/patients/new');
    
    // Both fill forms with different data
    await page1.fill('input[name="firstName"]', 'User1');
    await page1.fill('input[name="aadhaarNumber"]', '111111111111');
    await page1.fill('input[name="phoneNumber"]', '9111111111');
    
    await page2.fill('input[name="firstName"]', 'User2');
    await page2.fill('input[name="aadhaarNumber"]', '222222222222');
    await page2.fill('input[name="phoneNumber"]', '9222222222');
    
    // Fill remaining required fields for both
    const fillRemainingFields = async (page: Page) => {
      await page.fill('input[name="lastName"]', 'Test');
      await page.fill('input[name="dateOfBirth"]', '1990-01-01');
      await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
      await page.fill('textarea[name="address"]', 'Test Address');
      await page.selectOption('select[name="gender"]', 'Male');
      await page.selectOption('select[name="bloodGroup"]', 'O+');
      await page.fill('input[name="emergencyContactName"]', 'Emergency');
      await page.fill('input[name="emergencyContactNumber"]', '9999999999');
      await page.fill('input[name="emergencyContactRelation"]', 'Friend');
    };
    
    await fillRemainingFields(page1);
    await fillRemainingFields(page2);
    
    // Submit both forms nearly simultaneously
    await Promise.all([
      page1.click('button[type="submit"]'),
      page2.click('button[type="submit"]')
    ]);
    
    // Both should succeed
    await expect(page1.locator('text=Patient registered successfully')).toBeVisible();
    await expect(page2.locator('text=Patient registered successfully')).toBeVisible();
    
    // Clean up
    await context1.close();
    await context2.close();
  });
});

// Page Object Model for better maintainability
export class PatientRegistrationPage {
  constructor(private page: Page) {}

  async navigateToRegistration() {
    await this.page.goto('/dashboard/patients/new');
    await this.page.waitForLoadState('networkidle');
  }

  async fillPatientForm(data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    aadhaarNumber: string;
    phoneNumber: string;
    email: string;
    address: string;
    gender: string;
    bloodGroup: string;
  }) {
    await this.page.fill('input[name="firstName"]', data.firstName);
    await this.page.fill('input[name="lastName"]', data.lastName);
    await this.page.fill('input[name="dateOfBirth"]', data.dateOfBirth);
    await this.page.fill('input[name="aadhaarNumber"]', data.aadhaarNumber);
    await this.page.fill('input[name="phoneNumber"]', data.phoneNumber);
    await this.page.fill('input[name="email"]', data.email);
    await this.page.fill('textarea[name="address"]', data.address);
    await this.page.selectOption('select[name="gender"]', data.gender);
    await this.page.selectOption('select[name="bloodGroup"]', data.bloodGroup);
  }

  async submitForm() {
    await this.page.click('button[type="submit"]');
  }

  async verifySuccessMessage() {
    await expect(this.page.locator('text=Patient registered successfully')).toBeVisible();
  }
}