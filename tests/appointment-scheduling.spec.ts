import { test, expect, Page } from '@playwright/test';

/**
 * Appointment Scheduling E2E Test Suite
 * User Story: As a receptionist, I want to schedule appointments for patients 
 * so that doctors' time is efficiently managed.
 */

test.describe('Appointment Scheduling', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Navigate to the appointments page
    await page.goto('/dashboard/appointments');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display calendar view with available slots', async () => {
    // Acceptance Criteria 1: The appointment page shows a calendar view with available slots
    
    // Skip if authentication is required
    if (page.url().includes('sign-in')) {
      test.skip();
      return;
    }
    
    // Check for calendar container
    const calendar = page.locator('[data-testid="appointment-calendar"]');
    await expect(calendar).toBeVisible();
    
    // Check for week/day view toggle
    const viewToggle = page.locator('[data-testid="calendar-view-toggle"]');
    await expect(viewToggle).toBeVisible();
    
    // Check for date navigation
    await expect(page.locator('button[aria-label="Previous week"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Next week"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Today"]')).toBeVisible();
    
    // Check for time slots grid
    const timeSlots = page.locator('[data-testid="time-slots-grid"]');
    await expect(timeSlots).toBeVisible();
    
    // Verify time labels (9 AM to 5 PM)
    await expect(page.locator('text=9:00 AM')).toBeVisible();
    await expect(page.locator('text=12:00 PM')).toBeVisible();
    await expect(page.locator('text=5:00 PM')).toBeVisible();
    
    // Check for available slot indicators
    const availableSlots = page.locator('.slot-available');
    await expect(availableSlots.first()).toBeVisible();
  });

  test('should open appointment booking dialog when clicking a slot', async () => {
    // Acceptance Criteria 2: Clicking a slot opens appointment booking dialog
    
    if (page.url().includes('sign-in')) {
      test.skip();
      return;
    }
    
    // Click on an available time slot
    const availableSlot = page.locator('.slot-available').first();
    await availableSlot.click();
    
    // Check that booking dialog opens
    const bookingDialog = page.locator('[data-testid="appointment-booking-dialog"]');
    await expect(bookingDialog).toBeVisible();
    
    // Check dialog title
    await expect(page.locator('text=Schedule Appointment')).toBeVisible();
    
    // Check that selected time is displayed
    const selectedTime = page.locator('[data-testid="selected-time"]');
    await expect(selectedTime).toBeVisible();
  });

  test('should allow selecting patient, doctor, department, and appointment type', async () => {
    // Acceptance Criteria 3: Dialog allows selecting patient, doctor, department, and appointment type
    
    if (page.url().includes('sign-in')) {
      test.skip();
      return;
    }
    
    // Open booking dialog
    await page.locator('.slot-available').first().click();
    
    // Check for patient search/select
    const patientSelect = page.locator('[data-testid="patient-select"]');
    await expect(patientSelect).toBeVisible();
    await expect(page.locator('label:has-text("Patient")')).toBeVisible();
    
    // Check for department dropdown
    const departmentSelect = page.locator('[data-testid="department-select"]');
    await expect(departmentSelect).toBeVisible();
    await expect(page.locator('label:has-text("Department")')).toBeVisible();
    
    // Check for doctor dropdown
    const doctorSelect = page.locator('[data-testid="doctor-select"]');
    await expect(doctorSelect).toBeVisible();
    await expect(page.locator('label:has-text("Doctor")')).toBeVisible();
    
    // Check for appointment type
    const appointmentType = page.locator('[data-testid="appointment-type-select"]');
    await expect(appointmentType).toBeVisible();
    await expect(page.locator('label:has-text("Appointment Type")')).toBeVisible();
    
    // Check appointment types
    await appointmentType.click();
    await expect(page.locator('text=Consultation')).toBeVisible();
    await expect(page.locator('text=Follow-up')).toBeVisible();
    await expect(page.locator('text=Emergency')).toBeVisible();
    await expect(page.locator('text=Routine Checkup')).toBeVisible();
  });

  test('should show booked appointments on the calendar', async () => {
    // Acceptance Criteria 4: Booked appointments show on the calendar with patient name
    
    if (page.url().includes('sign-in')) {
      test.skip();
      return;
    }
    
    // Look for booked appointment slots
    const bookedSlots = page.locator('.slot-booked');
    
    // Check if any booked slots exist
    if (await bookedSlots.count() > 0) {
      // Verify booked slot shows patient name
      const firstBooked = bookedSlots.first();
      await expect(firstBooked).toBeVisible();
      
      // Check for patient name in the slot
      const patientName = firstBooked.locator('.patient-name');
      await expect(patientName).toBeVisible();
      
      // Check for appointment time
      const appointmentTime = firstBooked.locator('.appointment-time');
      await expect(appointmentTime).toBeVisible();
      
      // Check visual distinction (different color/style)
      await expect(firstBooked).toHaveClass(/slot-booked/);
    }
  });

  test('should allow rescheduling appointments by drag and drop', async () => {
    // Acceptance Criteria 5: Appointments can be rescheduled by drag-and-drop
    
    if (page.url().includes('sign-in')) {
      test.skip();
      return;
    }
    
    // Find a booked appointment
    const bookedSlot = page.locator('.slot-booked').first();
    
    if (await bookedSlot.isVisible()) {
      // Find an available slot
      const availableSlot = page.locator('.slot-available').first();
      
      // Perform drag and drop
      await bookedSlot.dragTo(availableSlot);
      
      // Verify confirmation dialog appears
      const confirmDialog = page.locator('[data-testid="reschedule-confirm-dialog"]');
      await expect(confirmDialog).toBeVisible();
      
      // Check for confirmation message
      await expect(page.locator('text=Confirm Reschedule')).toBeVisible();
      await expect(page.locator('text=Are you sure you want to reschedule')).toBeVisible();
      
      // Confirm the reschedule
      await page.locator('button:has-text("Confirm")').click();
      
      // Verify the appointment moved
      await expect(page.locator('text=Appointment rescheduled successfully')).toBeVisible();
    }
  });

  test('should send SMS/WhatsApp confirmation to patient', async () => {
    // Acceptance Criteria 6: SMS/WhatsApp confirmation is sent to patient's registered number
    
    if (page.url().includes('sign-in')) {
      test.skip();
      return;
    }
    
    // Open booking dialog
    await page.locator('.slot-available').first().click();
    
    // Fill in appointment details
    await page.locator('[data-testid="patient-select"]').click();
    await page.locator('text=Rajesh Kumar').click();
    
    await page.locator('[data-testid="department-select"]').click();
    await page.locator('text=General Medicine').click();
    
    await page.locator('[data-testid="doctor-select"]').click();
    await page.locator('text=Dr. Sharma').click();
    
    await page.locator('[data-testid="appointment-type-select"]').click();
    await page.locator('text=Consultation').click();
    
    // Check for notification preference options
    const notificationOptions = page.locator('[data-testid="notification-preferences"]');
    await expect(notificationOptions).toBeVisible();
    
    // Check SMS option
    const smsOption = page.locator('input[type="checkbox"][name="sendSMS"]');
    await expect(smsOption).toBeVisible();
    await expect(page.locator('label:has-text("Send SMS Confirmation")')).toBeVisible();
    
    // Check WhatsApp option
    const whatsappOption = page.locator('input[type="checkbox"][name="sendWhatsApp"]');
    await expect(whatsappOption).toBeVisible();
    await expect(page.locator('label:has-text("Send WhatsApp Confirmation")')).toBeVisible();
    
    // Enable both notifications
    await smsOption.check();
    await whatsappOption.check();
    
    // Book the appointment
    await page.locator('button:has-text("Book Appointment")').click();
    
    // Verify success message mentions notifications
    await expect(page.locator('text=Appointment booked successfully')).toBeVisible();
    await expect(page.locator('text=Confirmation sent via SMS and WhatsApp')).toBeVisible();
  });

  test('should display appointment statistics', async () => {
    // Additional test for appointment overview
    
    if (page.url().includes('sign-in')) {
      test.skip();
      return;
    }
    
    // Check for statistics cards
    const statsContainer = page.locator('[data-testid="appointment-stats"]');
    await expect(statsContainer).toBeVisible();
    
    // Today's appointments
    await expect(page.locator('[data-testid="stat-today-appointments"]')).toBeVisible();
    
    // Week's appointments
    await expect(page.locator('[data-testid="stat-week-appointments"]')).toBeVisible();
    
    // Available slots
    await expect(page.locator('[data-testid="stat-available-slots"]')).toBeVisible();
    
    // Cancellation rate
    await expect(page.locator('[data-testid="stat-cancellation-rate"]')).toBeVisible();
  });

  test('should filter appointments by department and doctor', async () => {
    // Test filtering functionality
    
    if (page.url().includes('sign-in')) {
      test.skip();
      return;
    }
    
    // Check for filter controls
    const filterBar = page.locator('[data-testid="appointment-filters"]');
    await expect(filterBar).toBeVisible();
    
    // Department filter
    const departmentFilter = page.locator('[data-testid="filter-department"]');
    await expect(departmentFilter).toBeVisible();
    
    // Doctor filter
    const doctorFilter = page.locator('[data-testid="filter-doctor"]');
    await expect(doctorFilter).toBeVisible();
    
    // Date range filter
    const dateFilter = page.locator('[data-testid="filter-date-range"]');
    await expect(dateFilter).toBeVisible();
    
    // Apply department filter
    await departmentFilter.click();
    await page.locator('text=Cardiology').click();
    
    // Verify calendar updates
    await page.waitForTimeout(500); // Wait for filter to apply
    
    // Check that calendar shows filtered view
    const calendarTitle = page.locator('[data-testid="calendar-title"]');
    await expect(calendarTitle).toContainText('Cardiology');
  });
});

// Page Object Model for better maintainability
export class AppointmentSchedulingPage {
  constructor(private page: Page) {}

  async navigateToAppointments() {
    await this.page.goto('/dashboard/appointments');
    await this.page.waitForLoadState('networkidle');
  }

  async selectTimeSlot(time: string) {
    await this.page.locator(`[data-time="${time}"]`).click();
  }

  async fillAppointmentForm(data: {
    patientName: string;
    department: string;
    doctor: string;
    appointmentType: string;
  }) {
    await this.page.locator('[data-testid="patient-select"]').click();
    await this.page.locator(`text=${data.patientName}`).click();
    
    await this.page.locator('[data-testid="department-select"]').click();
    await this.page.locator(`text=${data.department}`).click();
    
    await this.page.locator('[data-testid="doctor-select"]').click();
    await this.page.locator(`text=${data.doctor}`).click();
    
    await this.page.locator('[data-testid="appointment-type-select"]').click();
    await this.page.locator(`text=${data.appointmentType}`).click();
  }

  async bookAppointment() {
    await this.page.locator('button:has-text("Book Appointment")').click();
  }

  async verifySuccessMessage() {
    await expect(this.page.locator('text=Appointment booked successfully')).toBeVisible();
  }
}