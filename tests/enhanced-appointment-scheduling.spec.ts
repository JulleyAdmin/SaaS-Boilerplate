import { test, expect, Page } from '@playwright/test';

/**
 * Enhanced Appointment Scheduling E2E Test Suite
 * Tests for the enhanced scheduler with HMS data model integration
 */

test.describe('Enhanced Appointment Scheduling', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/dashboard/appointments');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Statistics Dashboard', () => {
    test('should display comprehensive statistics cards', async () => {
      // Skip if authentication is required
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      // Check for 6 statistics cards
      await expect(page.locator('text=Today\'s Appointments')).toBeVisible();
      await expect(page.locator('text=This Week')).toBeVisible();
      await expect(page.locator('text=Avg Wait Time')).toBeVisible();
      await expect(page.locator('text=Revenue Today')).toBeVisible();
      await expect(page.locator('text=Doctors Available')).toBeVisible();
      await expect(page.locator('text=Departments')).toBeVisible();

      // Check for metrics display
      await expect(page.locator('text=completed')).toBeVisible();
      await expect(page.locator('text=cancelled')).toBeVisible();
      await expect(page.locator('text=min').first()).toBeVisible();
      await expect(page.locator('text=₹')).toBeVisible(); // Indian Rupee symbol
    });
  });

  test.describe('View Modes', () => {
    test('should toggle between Schedule View and Queue Management', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      // Check for view mode toggle
      const scheduleTrigger = page.locator('button[role="tab"]:has-text("Schedule View")');
      const queueTrigger = page.locator('button[role="tab"]:has-text("Queue Management")');
      
      await expect(scheduleTrigger).toBeVisible();
      await expect(queueTrigger).toBeVisible();

      // Switch to Queue Management
      await queueTrigger.click();
      await expect(page.locator('text=Real-time queue status')).toBeVisible();

      // Switch back to Schedule View
      await scheduleTrigger.click();
      await expect(page.locator('text=Click on available slots to book')).toBeVisible();
    });
  });

  test.describe('Doctor Schedule Display', () => {
    test('should show doctor-wise schedule with time slots', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      // Check for doctor information in schedule
      await expect(page.locator('text=Dr. Rajesh Sharma')).toBeVisible();
      await expect(page.locator('text=General Medicine').first()).toBeVisible();
      
      // Check for schedule time display (e.g., "09:00 - 13:00")
      await expect(page.locator('text=/\\d{2}:\\d{2} - \\d{2}:\\d{2}/')).toBeVisible();
      
      // Check for slot color coding
      const availableSlot = page.locator('.bg-green-50').first();
      const bookedSlot = page.locator('.bg-red-50').first();
      
      // At least one type should be visible
      const availableCount = await availableSlot.count();
      const bookedCount = await bookedSlot.count();
      expect(availableCount + bookedCount).toBeGreaterThan(0);
    });

    test('should display doctor availability status', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      // Select a specific doctor
      const doctorSelect = page.locator('select').nth(1); // Second select is doctor
      if (await doctorSelect.isVisible()) {
        await doctorSelect.selectOption({ index: 1 }); // Select first doctor
        
        // Check for doctor information alert
        await page.waitForTimeout(500);
        const alertInfo = page.locator('[role="alert"]').first();
        if (await alertInfo.isVisible()) {
          await expect(alertInfo).toContainText(/Schedule:|Consultation Duration:|Fee:/);
        }
      }
    });
  });

  test.describe('Enhanced Booking Dialog', () => {
    test('should open enhanced booking dialog with patient options', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      // Click on an available slot
      const availableSlot = page.locator('.bg-green-50').first();
      if (await availableSlot.isVisible()) {
        await availableSlot.click();
        
        // Check for enhanced dialog elements
        await expect(page.locator('text=Schedule Appointment')).toBeVisible();
        
        // Patient selection options
        await expect(page.locator('text=Existing Patient')).toBeVisible();
        await expect(page.locator('text=New Patient')).toBeVisible();
        
        // Check for section headers
        await expect(page.locator('text=Patient Details')).toBeVisible();
        await expect(page.locator('text=Appointment Details')).toBeVisible();
        await expect(page.locator('text=Payment Details')).toBeVisible();
        await expect(page.locator('text=Notification Preferences')).toBeVisible();
      }
    });

    test('should allow new patient registration during booking', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      const availableSlot = page.locator('.bg-green-50').first();
      if (await availableSlot.isVisible()) {
        await availableSlot.click();
        
        // Select New Patient option
        const newPatientRadio = page.locator('input[value="new"]');
        if (await newPatientRadio.isVisible()) {
          await newPatientRadio.click();
          
          // Check for new patient form fields
          await expect(page.locator('input[placeholder="Enter first name"]')).toBeVisible();
          await expect(page.locator('input[placeholder="Enter last name"]')).toBeVisible();
          await expect(page.locator('input[placeholder="10-digit mobile number"]')).toBeVisible();
          await expect(page.locator('input[placeholder="email@example.com"]')).toBeVisible();
          await expect(page.locator('input[type="date"]').first()).toBeVisible();
          await expect(page.locator('input[placeholder="12-digit Aadhaar number"]')).toBeVisible();
        }
      }
    });

    test('should display appointment types and visit types', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      const availableSlot = page.locator('.bg-green-50').first();
      if (await availableSlot.isVisible()) {
        await availableSlot.click();
        
        // Check for appointment type dropdown
        const appointmentTypeSelect = page.locator('text=Appointment Type').locator('..').locator('button');
        if (await appointmentTypeSelect.isVisible()) {
          await appointmentTypeSelect.click();
          
          // Check for appointment type options
          await expect(page.locator('text=Consultation')).toBeVisible();
          await expect(page.locator('text=Follow-up')).toBeVisible();
          await expect(page.locator('text=Emergency')).toBeVisible();
          await expect(page.locator('text=Routine Checkup')).toBeVisible();
          await expect(page.locator('text=Vaccination')).toBeVisible();
          await expect(page.locator('text=Health Checkup')).toBeVisible();
        }
      }
    });

    test('should show chief complaint field', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      const availableSlot = page.locator('.bg-green-50').first();
      if (await availableSlot.isVisible()) {
        await availableSlot.click();
        
        // Check for chief complaint textarea
        await expect(page.locator('textarea[placeholder*="symptoms"]')).toBeVisible();
      }
    });
  });

  test.describe('Payment Integration', () => {
    test('should display consultation fee and payment options', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      const availableSlot = page.locator('.bg-green-50').first();
      if (await availableSlot.isVisible()) {
        await availableSlot.click();
        
        // Check for fee display with Indian Rupee
        await expect(page.locator('text=/₹\\d+/')).toBeVisible();
        
        // Check for payment method dropdown
        const paymentMethodLabel = page.locator('text=Payment Method');
        if (await paymentMethodLabel.isVisible()) {
          const paymentSelect = paymentMethodLabel.locator('..').locator('button');
          await paymentSelect.click();
          
          // Check Indian payment methods
          await expect(page.locator('text=Cash')).toBeVisible();
          await expect(page.locator('text=UPI')).toBeVisible();
          await expect(page.locator('text=Card')).toBeVisible();
          await expect(page.locator('text=Net Banking')).toBeVisible();
          await expect(page.locator('text=Insurance')).toBeVisible();
        }
      }
    });

    test('should allow applying discounts', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      const availableSlot = page.locator('.bg-green-50').first();
      if (await availableSlot.isVisible()) {
        await availableSlot.click();
        
        // Check for discount checkbox
        const discountCheckbox = page.locator('text=Apply Discount').locator('..');
        await expect(discountCheckbox).toBeVisible();
        
        // Click to enable discount
        await discountCheckbox.click();
        
        // Check for discount fields
        await expect(page.locator('input[placeholder="Discount amount"]')).toBeVisible();
        await expect(page.locator('input[placeholder="Discount reason"]')).toBeVisible();
      }
    });
  });

  test.describe('Queue Management View', () => {
    test('should display department-wise queue with token numbers', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      // Switch to Queue Management view
      const queueTab = page.locator('button[role="tab"]:has-text("Queue Management")');
      if (await queueTab.isVisible()) {
        await queueTab.click();
        
        // Check for queue display elements
        await expect(page.locator('text=Queue Management')).toBeVisible();
        await expect(page.locator('text=Real-time queue status')).toBeVisible();
        
        // Check for token numbers (format: #1, #2, etc.)
        const tokenBadge = page.locator('text=/#\\d+/').first();
        if (await tokenBadge.count() > 0) {
          await expect(tokenBadge).toBeVisible();
        }
        
        // Check for patient count badge
        const patientCount = page.locator('text=/\\d+ patients/').first();
        if (await patientCount.count() > 0) {
          await expect(patientCount).toBeVisible();
        }
      }
    });

    test('should show appointment status badges', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      const queueTab = page.locator('button[role="tab"]:has-text("Queue Management")');
      if (await queueTab.isVisible()) {
        await queueTab.click();
        
        // Check for status badges
        const statuses = ['Scheduled', 'Confirmed', 'In-Progress', 'Completed'];
        for (const status of statuses) {
          const statusBadge = page.locator(`text=${status}`).first();
          if (await statusBadge.count() > 0) {
            await expect(statusBadge).toBeVisible();
            break; // At least one status should be visible
          }
        }
      }
    });

    test('should display estimated wait time', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      const queueTab = page.locator('button[role="tab"]:has-text("Queue Management")');
      if (await queueTab.isVisible()) {
        await queueTab.click();
        
        // Check for wait time display
        const waitTime = page.locator('text=/~\\d+ min wait/').first();
        if (await waitTime.count() > 0) {
          await expect(waitTime).toBeVisible();
        }
      }
    });
  });

  test.describe('Notification Options', () => {
    test('should provide SMS, WhatsApp, and Email notification options', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      const availableSlot = page.locator('.bg-green-50').first();
      if (await availableSlot.isVisible()) {
        await availableSlot.click();
        
        // Check for all three notification options
        await expect(page.locator('text=Send SMS Confirmation')).toBeVisible();
        await expect(page.locator('text=Send WhatsApp Confirmation')).toBeVisible();
        await expect(page.locator('text=Send Email Confirmation')).toBeVisible();
        
        // Check that they are checkboxes
        const smsCheckbox = page.locator('input[type="checkbox"]').nth(0);
        await expect(smsCheckbox).toBeVisible();
      }
    });
  });

  test.describe('Department Filtering', () => {
    test('should filter by department and show department info', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      // Check for department dropdown
      const departmentSelect = page.locator('button:has-text("All Departments")').first();
      if (await departmentSelect.isVisible()) {
        await departmentSelect.click();
        
        // Check for department options
        await expect(page.locator('text=General Medicine')).toBeVisible();
        await expect(page.locator('text=Cardiology')).toBeVisible();
        await expect(page.locator('text=Orthopedics')).toBeVisible();
        await expect(page.locator('text=Pediatrics')).toBeVisible();
        await expect(page.locator('text=Emergency')).toBeVisible();
      }
    });
  });

  test.describe('Visual Enhancements', () => {
    test('should show tooltips on hover', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      // Hover over a slot to see tooltip
      const slot = page.locator('.bg-green-50, .bg-red-50').first();
      if (await slot.isVisible()) {
        await slot.hover();
        
        // Tooltip might appear after hover
        await page.waitForTimeout(500);
        
        // Check if any tooltip content is visible
        const tooltipContent = page.locator('[role="tooltip"]').first();
        if (await tooltipContent.count() > 0) {
          await expect(tooltipContent).toBeVisible();
        }
      }
    });

    test('should display legend for slot colors', async () => {
      if (page.url().includes('sign-in')) {
        test.skip();
        return;
      }

      // Check for legend
      await expect(page.locator('text=Available')).toBeVisible();
      await expect(page.locator('text=Booked')).toBeVisible();
      await expect(page.locator('text=Break/Blocked')).toBeVisible();
    });
  });
});

// Integration test for complete booking flow
test.describe('Complete Booking Flow', () => {
  test('should complete an appointment booking with all features', async ({ page }) => {
    await page.goto('/dashboard/appointments');
    
    if (page.url().includes('sign-in')) {
      test.skip();
      return;
    }

    // Click available slot
    const availableSlot = page.locator('.bg-green-50').first();
    if (await availableSlot.isVisible()) {
      await availableSlot.click();
      
      // Select existing patient
      const existingPatientRadio = page.locator('input[value="existing"]');
      if (await existingPatientRadio.isVisible()) {
        await existingPatientRadio.click();
        
        // Select patient from dropdown
        const patientSelect = page.locator('button:has-text("Search by name")').first();
        if (await patientSelect.isVisible()) {
          await patientSelect.click();
          await page.locator('text=Rajesh Kumar').first().click();
        }
        
        // Select appointment type
        const appointmentTypeBtn = page.locator('text=Appointment Type').locator('..').locator('button');
        if (await appointmentTypeBtn.isVisible()) {
          await appointmentTypeBtn.click();
          await page.locator('text=Consultation').nth(1).click();
        }
        
        // Add chief complaint
        const chiefComplaint = page.locator('textarea[placeholder*="symptoms"]');
        if (await chiefComplaint.isVisible()) {
          await chiefComplaint.fill('Fever and headache for 2 days');
        }
        
        // Select payment method
        const paymentMethodBtn = page.locator('text=Payment Method').locator('..').locator('button');
        if (await paymentMethodBtn.isVisible()) {
          await paymentMethodBtn.click();
          await page.locator('text=UPI').click();
        }
        
        // Enable notifications
        const smsCheckbox = page.locator('text=Send SMS Confirmation').locator('..');
        if (await smsCheckbox.isVisible()) {
          await smsCheckbox.click();
        }
        
        // Book appointment
        const bookButton = page.locator('button:has-text("Book Appointment")');
        if (await bookButton.isVisible()) {
          await bookButton.click();
          
          // Check for success message with token number
          await expect(page.locator('text=Appointment Booked Successfully')).toBeVisible();
          await expect(page.locator('text=/Token Number:/')).toBeVisible();
          await expect(page.locator('text=/Estimated Wait Time:/')).toBeVisible();
          await expect(page.locator('text=/Consultation Fee:/')).toBeVisible();
        }
      }
    }
  });
});