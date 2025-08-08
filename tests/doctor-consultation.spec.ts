// tests/doctor-consultation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Doctor Consultation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to doctor dashboard
    await page.goto('http://localhost:3002/dashboard/doctor');
  });

  test('should display doctor dashboard with today\'s appointments', async ({ page }) => {
    // Verify dashboard elements
    await expect(page.locator('h1')).toContainText('Doctor Dashboard');
    
    // Check for appointment queue
    await expect(page.locator('[data-testid="appointment-queue"]')).toBeVisible();
    
    // Verify patient cards in queue
    const patientCards = page.locator('[data-testid="patient-card"]');
    await expect(patientCards.first()).toBeVisible();
    
    // Check for queue statistics
    await expect(page.locator('[data-testid="total-appointments"]')).toBeVisible();
    await expect(page.locator('[data-testid="completed-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="pending-count"]')).toBeVisible();
  });

  test('should show patient details in appointment card', async ({ page }) => {
    // Wait for patient cards to load
    await page.waitForSelector('[data-testid="patient-card"]');
    
    const firstPatient = page.locator('[data-testid="patient-card"]').first();
    
    // Verify patient information
    await expect(firstPatient.locator('[data-testid="patient-name"]')).toBeVisible();
    await expect(firstPatient.locator('[data-testid="patient-age"]')).toBeVisible();
    await expect(firstPatient.locator('[data-testid="appointment-time"]')).toBeVisible();
    await expect(firstPatient.locator('[data-testid="token-number"]')).toBeVisible();
    await expect(firstPatient.locator('[data-testid="appointment-type"]')).toBeVisible();
    
    // Check for action buttons
    await expect(firstPatient.locator('[data-testid="start-consultation-btn"]')).toBeVisible();
    await expect(firstPatient.locator('[data-testid="view-history-btn"]')).toBeVisible();
  });

  test('should start consultation and show consultation interface', async ({ page }) => {
    // Click start consultation on first patient
    await page.locator('[data-testid="start-consultation-btn"]').first().click();
    
    // Wait for consultation page
    await page.waitForURL(/.*\/consultation\/.*/);
    
    // Verify consultation interface sections
    await expect(page.locator('[data-testid="patient-info-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="vitals-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="clinical-notes-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="diagnosis-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="prescription-section"]')).toBeVisible();
  });

  test('should display patient medical history', async ({ page }) => {
    // Start consultation
    await page.locator('[data-testid="start-consultation-btn"]').first().click();
    await page.waitForURL(/.*\/consultation\/.*/);
    
    // Click on medical history tab
    await page.locator('[data-testid="medical-history-tab"]').click();
    
    // Verify history sections
    await expect(page.locator('[data-testid="previous-visits"]')).toBeVisible();
    await expect(page.locator('[data-testid="chronic-conditions"]')).toBeVisible();
    await expect(page.locator('[data-testid="allergies"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-medications"]')).toBeVisible();
    await expect(page.locator('[data-testid="lab-reports"]')).toBeVisible();
  });

  test('should allow entering and saving vital signs', async ({ page }) => {
    // Start consultation
    await page.locator('[data-testid="start-consultation-btn"]').first().click();
    await page.waitForURL(/.*\/consultation\/.*/);
    
    // Enter vital signs
    await page.fill('[data-testid="blood-pressure-systolic"]', '120');
    await page.fill('[data-testid="blood-pressure-diastolic"]', '80');
    await page.fill('[data-testid="pulse-rate"]', '72');
    await page.fill('[data-testid="temperature"]', '98.6');
    await page.fill('[data-testid="weight"]', '70');
    await page.fill('[data-testid="height"]', '170');
    await page.fill('[data-testid="spo2"]', '98');
    
    // Save vitals
    await page.locator('[data-testid="save-vitals-btn"]').click();
    
    // Verify success message
    await expect(page.locator('.toast-success')).toContainText('Vitals saved');
    
    // Check BMI calculation
    await expect(page.locator('[data-testid="bmi-value"]')).toBeVisible();
  });

  test('should add diagnosis with ICD-10 codes', async ({ page }) => {
    // Start consultation
    await page.locator('[data-testid="start-consultation-btn"]').first().click();
    await page.waitForURL(/.*\/consultation\/.*/);
    
    // Add symptoms
    await page.fill('[data-testid="chief-complaint"]', 'Fever and headache for 2 days');
    await page.fill('[data-testid="symptoms"]', 'High fever, severe headache, body ache');
    
    // Search and select ICD-10 code
    await page.fill('[data-testid="icd10-search"]', 'Fever');
    await page.waitForSelector('[data-testid="icd10-suggestions"]');
    await page.locator('[data-testid="icd10-option"]').first().click();
    
    // Add diagnosis notes
    await page.fill('[data-testid="diagnosis-notes"]', 'Viral fever with dehydration');
    
    // Select diagnosis type
    await page.selectOption('[data-testid="diagnosis-type"]', 'provisional');
    
    // Save diagnosis
    await page.locator('[data-testid="save-diagnosis-btn"]').click();
    
    // Verify diagnosis added
    await expect(page.locator('[data-testid="diagnosis-list"]')).toContainText('Fever');
  });

  test('should create prescription with medications', async ({ page }) => {
    // Start consultation
    await page.locator('[data-testid="start-consultation-btn"]').first().click();
    await page.waitForURL(/.*\/consultation\/.*/);
    
    // Navigate to prescription section
    await page.locator('[data-testid="prescription-tab"]').click();
    
    // Add medication
    await page.locator('[data-testid="add-medication-btn"]').click();
    
    // Search for medication
    await page.fill('[data-testid="medication-search"]', 'Paracetamol');
    await page.waitForSelector('[data-testid="medication-suggestions"]');
    await page.locator('[data-testid="medication-option"]').first().click();
    
    // Fill prescription details
    await page.fill('[data-testid="dosage"]', '500mg');
    await page.selectOption('[data-testid="frequency"]', 'TID'); // Three times a day
    await page.selectOption('[data-testid="duration"]', '3');
    await page.selectOption('[data-testid="duration-unit"]', 'days');
    await page.selectOption('[data-testid="timing"]', 'after_food');
    
    // Add instructions
    await page.fill('[data-testid="medication-instructions"]', 'Take with warm water');
    
    // Save medication
    await page.locator('[data-testid="save-medication-btn"]').click();
    
    // Verify medication added to prescription
    await expect(page.locator('[data-testid="prescription-items"]')).toContainText('Paracetamol');
    
    // Add general advice
    await page.fill('[data-testid="general-advice"]', 'Rest, drink plenty of fluids');
    
    // Add follow-up
    await page.locator('[data-testid="follow-up-required"]').check();
    await page.selectOption('[data-testid="follow-up-days"]', '3');
  });

  test('should generate and preview prescription', async ({ page }) => {
    // Assume consultation is ongoing with prescription added
    await page.locator('[data-testid="start-consultation-btn"]').first().click();
    await page.waitForURL(/.*\/consultation\/.*/);
    
    // Preview prescription
    await page.locator('[data-testid="preview-prescription-btn"]').click();
    
    // Wait for preview modal
    await page.waitForSelector('[data-testid="prescription-preview-modal"]');
    
    // Verify prescription preview contains
    await expect(page.locator('[data-testid="preview-hospital-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="preview-doctor-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="preview-patient-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="preview-medications"]')).toBeVisible();
    await expect(page.locator('[data-testid="preview-advice"]')).toBeVisible();
    
    // Print/Download options
    await expect(page.locator('[data-testid="print-prescription-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-prescription-btn"]')).toBeVisible();
  });

  test('should order laboratory tests', async ({ page }) => {
    // Start consultation
    await page.locator('[data-testid="start-consultation-btn"]').first().click();
    await page.waitForURL(/.*\/consultation\/.*/);
    
    // Navigate to investigations tab
    await page.locator('[data-testid="investigations-tab"]').click();
    
    // Search for lab test
    await page.fill('[data-testid="lab-test-search"]', 'CBC');
    await page.waitForSelector('[data-testid="lab-test-suggestions"]');
    
    // Select tests
    await page.locator('[data-testid="test-checkbox-cbc"]').check();
    await page.locator('[data-testid="test-checkbox-blood-sugar"]').check();
    
    // Add special instructions
    await page.fill('[data-testid="lab-instructions"]', 'Fasting required for blood sugar');
    
    // Set priority
    await page.selectOption('[data-testid="lab-priority"]', 'urgent');
    
    // Order tests
    await page.locator('[data-testid="order-tests-btn"]').click();
    
    // Verify confirmation
    await expect(page.locator('.toast-success')).toContainText('Lab tests ordered');
  });

  test('should complete consultation and generate summary', async ({ page }) => {
    // Start consultation
    await page.locator('[data-testid="start-consultation-btn"]').first().click();
    await page.waitForURL(/.*\/consultation\/.*/);
    
    // Add clinical notes
    await page.fill('[data-testid="clinical-notes"]', 'Patient presents with viral fever symptoms');
    
    // Complete consultation
    await page.locator('[data-testid="complete-consultation-btn"]').click();
    
    // Confirm completion
    await page.locator('[data-testid="confirm-complete-btn"]').click();
    
    // Wait for summary
    await page.waitForSelector('[data-testid="consultation-summary"]');
    
    // Verify summary contains all sections
    await expect(page.locator('[data-testid="summary-vitals"]')).toBeVisible();
    await expect(page.locator('[data-testid="summary-diagnosis"]')).toBeVisible();
    await expect(page.locator('[data-testid="summary-prescription"]')).toBeVisible();
    await expect(page.locator('[data-testid="summary-next-steps"]')).toBeVisible();
    
    // Return to dashboard
    await page.locator('[data-testid="back-to-dashboard-btn"]').click();
    await expect(page).toHaveURL(/.*\/dashboard\/doctor/);
    
    // Verify patient marked as completed
    await expect(page.locator('[data-testid="completed-count"]')).toContainText('1');
  });

  test('should handle emergency consultation differently', async ({ page }) => {
    // Find emergency appointment
    const emergencyCard = page.locator('[data-testid="patient-card"][data-priority="emergency"]').first();
    
    // Verify emergency indicators
    await expect(emergencyCard).toHaveClass(/.*emergency.*/);
    await expect(emergencyCard.locator('[data-testid="emergency-badge"]')).toBeVisible();
    
    // Start emergency consultation
    await emergencyCard.locator('[data-testid="start-consultation-btn"]').click();
    
    // Verify emergency consultation features
    await expect(page.locator('[data-testid="emergency-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible();
    await expect(page.locator('[data-testid="admission-button"]')).toBeVisible();
  });

  test('should view patient queue and manage order', async ({ page }) => {
    // Check queue management features
    await expect(page.locator('[data-testid="queue-view-toggle"]')).toBeVisible();
    
    // Switch to queue view
    await page.locator('[data-testid="queue-view-btn"]').click();
    
    // Verify queue list
    await expect(page.locator('[data-testid="queue-list"]')).toBeVisible();
    
    // Check drag-to-reorder functionality
    const firstPatient = page.locator('[data-testid="queue-item"]').first();
    const secondPatient = page.locator('[data-testid="queue-item"]').nth(1);
    
    // Verify token numbers
    await expect(firstPatient.locator('[data-testid="token"]')).toBeVisible();
    await expect(secondPatient.locator('[data-testid="token"]')).toBeVisible();
    
    // Mark patient as no-show
    await secondPatient.locator('[data-testid="mark-no-show"]').click();
    await expect(secondPatient).toHaveClass(/.*no-show.*/);
  });
});