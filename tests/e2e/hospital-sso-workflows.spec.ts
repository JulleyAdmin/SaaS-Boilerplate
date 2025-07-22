import type { BrowserContext, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe('Hospital SSO Complete Workflows', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    // Navigate to SSO management page
    await page.goto('http://localhost:3003/dashboard/sso-management');

    // Wait for authentication if needed
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await context.close();
  });

  test.describe('Complete SSO Setup Workflow', () => {
    test('should complete full SSO connection setup for emergency department', async () => {
      // 1. Verify we're on the SSO management page
      await expect(page.locator('h1')).toContainText('SSO Management');
      await expect(page.locator('p')).toContainText('Configure SAML single sign-on for your hospital staff');

      // 2. Click create new connection button
      const createButton = page.locator('button:has-text("+ Create SSO Connection")');

      await expect(createButton).toBeVisible();

      await createButton.click();

      // 3. Verify dialog opens
      await expect(page.locator('h2:has-text("Create SSO Connection")')).toBeVisible();

      // 4. Fill out hospital-specific form
      const nameInput = page.locator('input[name="name"]');
      await nameInput.clear();
      await nameInput.fill('Emergency Department SAML');

      const descriptionInput = page.locator('input[name="description"]');
      await descriptionInput.clear();
      await descriptionInput.fill('Emergency access for medical staff');

      // 5. Select emergency department
      const departmentSelect = page.locator('select[name="department"]');
      await departmentSelect.selectOption('emergency');

      // 6. Configure roles - uncheck technician, keep doctor and nurse
      const doctorCheckbox = page.locator('input[name="roles"][value="doctor"]');
      const nurseCheckbox = page.locator('input[name="roles"][value="nurse"]');
      const technicianCheckbox = page.locator('input[name="roles"][value="technician"]');

      await expect(doctorCheckbox).toBeChecked(); // Should be checked by default
      await expect(nurseCheckbox).toBeChecked(); // Should be checked by default

      if (await technicianCheckbox.isChecked()) {
        await technicianCheckbox.uncheck();
      }

      // 7. Update metadata (use default for test)
      const metadataTextarea = page.locator('textarea[name="metadata"]');

      await expect(metadataTextarea).toHaveValue('https://mocksaml.com/api/saml/metadata');

      // 8. Submit the form
      const submitButton = page.locator('button[type="submit"]:has-text("Create Connection")');
      await submitButton.click();

      // 9. Wait for creation to complete
      await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });

      // 10. Verify connection appears in list
      await expect(page.locator('text=Emergency Department SAML')).toBeVisible();
      await expect(page.locator('text=Department: emergency')).toBeVisible();
      await expect(page.locator('text=Roles: doctor, nurse')).toBeVisible();

      // 11. Verify test buttons appear
      await expect(page.locator('button:has-text("🔧 Test SSO Integration")')).toBeVisible();
      await expect(page.locator('button:has-text("🔐 Test SSO Login")')).toBeVisible();
    });

    test('should handle multiple department configurations', async () => {
      const departments = [
        { value: 'icu', name: 'ICU Critical Care', roles: ['doctor', 'nurse'] },
        { value: 'surgery', name: 'Surgery Department', roles: ['doctor', 'technician'] },
        { value: 'laboratory', name: 'Lab Services', roles: ['technician'] },
      ];

      for (const dept of departments) {
        // Open create dialog
        await page.locator('button:has-text("+ Create SSO Connection")').click();

        await expect(page.locator('h2:has-text("Create SSO Connection")')).toBeVisible();

        // Fill form for this department
        await page.locator('input[name="name"]').fill(`${dept.name} SAML`);
        await page.locator('input[name="description"]').fill(`${dept.name} access`);
        await page.locator('select[name="department"]').selectOption(dept.value);

        // Uncheck all roles first
        const allRoleCheckboxes = page.locator('input[name="roles"]');
        const roleCount = await allRoleCheckboxes.count();
        for (let i = 0; i < roleCount; i++) {
          const checkbox = allRoleCheckboxes.nth(i);
          if (await checkbox.isChecked()) {
            await checkbox.uncheck();
          }
        }

        // Check only required roles
        for (const role of dept.roles) {
          await page.locator(`input[name="roles"][value="${role}"]`).check();
        }

        // Submit
        await page.locator('button[type="submit"]:has-text("Create Connection")').click();

        await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });

        // Verify creation
        await expect(page.locator(`text=${dept.name} SAML`)).toBeVisible();
      }

      // Verify all connections are listed
      await expect(page.locator('text=Configured Connections (3)')).toBeVisible();
    });

    test('should validate form inputs and show errors', async () => {
      // Open create dialog
      await page.locator('button:has-text("+ Create SSO Connection")').click();

      // Try to submit with empty name
      await page.locator('input[name="name"]').clear();
      await page.locator('button[type="submit"]:has-text("Create Connection")').click();

      // Should see browser validation error (required field)
      const nameInput = page.locator('input[name="name"]');

      await expect(nameInput).toHaveAttribute('required');

      // Fill name but use invalid URL
      await nameInput.fill('Test Connection');
      await page.locator('input[name="redirectUrl"]').clear();
      await page.locator('input[name="redirectUrl"]').fill('not-a-valid-url');

      await page.locator('button[type="submit"]:has-text("Create Connection")').click();

      // Should see URL validation error
      const urlInput = page.locator('input[name="redirectUrl"]');

      await expect(urlInput).toHaveAttribute('type', 'url');
    });
  });

  test.describe('SSO Testing Workflows', () => {
    test('should test SSO integration endpoints', async () => {
      // First create a connection to enable test buttons
      await page.locator('button:has-text("+ Create SSO Connection")').click();
      await page.locator('input[name="name"]').fill('Test Integration Connection');
      await page.locator('button[type="submit"]:has-text("Create Connection")').click();

      await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });

      // Test SSO Integration
      const [testPage] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('button:has-text("🔧 Test SSO Integration")').click(),
      ]);

      await testPage.waitForLoadState();

      // Verify test endpoint response
      const testResponse = testPage;

      await expect(testResponse).toHaveText('pre');

      const testData = JSON.parse(testResponse!);

      expect(testData.success).toBe(true);
      expect(testData.connectionsCount).toBeGreaterThan(0);
      expect(testData.ssoUrl).toContain('/api/auth/sso/authorize');
      expect(testData.callbackUrl).toContain('/api/auth/sso/callback');

      await testPage.close();
    });

    test('should initiate SSO authorization flow', async () => {
      // Create a connection first
      await page.locator('button:has-text("+ Create SSO Connection")').click();
      await page.locator('input[name="name"]').fill('Test Authorization Connection');
      await page.locator('button[type="submit"]:has-text("Create Connection")').click();

      await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });

      // Test SSO Login
      const [authPage] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('button:has-text("🔐 Test SSO Login")').click(),
      ]);

      await authPage.waitForLoadState();

      // Should redirect to authorization endpoint or show SAML request
      const authUrl = authPage.url();

      expect(authUrl).toContain('/api/auth/sso/authorize');

      // The page might redirect to IdP or show error with mock data
      // Either way, it should handle gracefully
      const pageContent = authPage;

      await expect(pageContent).toHaveText('body');

      await authPage.close();
    });

    test('should handle metadata endpoint access', async () => {
      // Navigate directly to metadata endpoint
      const metadataPage = await context.newPage();
      await metadataPage.goto('http://localhost:3003/api/auth/sso/metadata?tenant=test-hospital');

      // Should return XML metadata or error
      const contentType = await metadataPage.evaluate(() => {
        return document.contentType;
      });

      // Should be XML or JSON (for errors)
      expect(['application/xml', 'application/json'].some(type =>
        contentType.includes(type),
      )).toBe(true);

      await metadataPage.close();
    });
  });

  test.describe('Connection Management Workflows', () => {
    test('should edit and delete connections', async () => {
      // Create a test connection
      await page.locator('button:has-text("+ Create SSO Connection")').click();
      await page.locator('input[name="name"]').fill('Connection to Delete');
      await page.locator('button[type="submit"]:has-text("Create Connection")').click();

      await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });

      // Verify connection appears
      await expect(page.locator('text=Connection to Delete')).toBeVisible();

      // Try to edit (currently shows as text, future enhancement)
      const editButton = page.locator('button:has-text("Edit")').first();

      await expect(editButton).toBeVisible();
      // Note: Edit functionality is placeholder in Phase 2

      // Delete connection
      page.on('dialog', dialog => dialog.accept()); // Accept confirmation

      const deleteButton = page.locator('button:has-text("Delete")').first();
      await deleteButton.click();

      // Verify deletion
      await expect(page.locator('button:has-text("Deleting...")')).toBeHidden({ timeout: 10000 });
      await expect(page.locator('text=Connection to Delete')).toBeHidden();
    });

    test('should handle delete cancellation', async () => {
      // Create a test connection
      await page.locator('button:has-text("+ Create SSO Connection")').click();
      await page.locator('input[name="name"]').fill('Connection to Keep');
      await page.locator('button[type="submit"]:has-text("Create Connection")').click();

      await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });

      // Cancel deletion
      page.on('dialog', dialog => dialog.dismiss()); // Cancel confirmation

      const deleteButton = page.locator('button:has-text("Delete")').first();
      await deleteButton.click();

      // Connection should still be there
      await expect(page.locator('text=Connection to Keep')).toBeVisible();
    });

    test('should show proper loading states during operations', async () => {
      // Test create loading state
      await page.locator('button:has-text("+ Create SSO Connection")').click();
      await page.locator('input[name="name"]').fill('Loading Test Connection');

      const submitButton = page.locator('button[type="submit"]:has-text("Create Connection")');
      await submitButton.click();

      // Should show loading state briefly
      await expect(page.locator('button:has-text("Creating...")')).toBeVisible();
      await expect(page.locator('button:has-text("Creating...")')).toHaveAttribute('disabled');

      // Wait for completion
      await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });
    });
  });

  test.describe('Hospital-Specific Scenarios', () => {
    test('should handle emergency department rapid setup', async () => {
      const startTime = Date.now();

      // Rapid emergency setup
      await page.locator('button:has-text("+ Create SSO Connection")').click();

      // Fill emergency-specific data quickly
      await page.locator('input[name="name"]').fill('Emergency Rapid Response SAML');
      await page.locator('input[name="description"]').fill('Emergency rapid authentication');
      await page.locator('select[name="department"]').selectOption('emergency');

      // Emergency staff roles
      await page.locator('input[name="roles"][value="doctor"]').check();
      await page.locator('input[name="roles"][value="nurse"]').check();
      await page.locator('input[name="roles"][value="technician"]').check();

      await page.locator('button[type="submit"]:has-text("Create Connection")').click();

      await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });

      const endTime = Date.now();
      const setupTime = endTime - startTime;

      // Emergency setup should be fast (under 30 seconds)
      expect(setupTime).toBeLessThan(30000);

      // Verify emergency context
      await expect(page.locator('text=Emergency Rapid Response SAML')).toBeVisible();
      await expect(page.locator('text=Department: emergency')).toBeVisible();
      await expect(page.locator('text=Roles: doctor, nurse, technician')).toBeVisible();
    });

    test('should handle ICU 24/7 access configuration', async () => {
      await page.locator('button:has-text("+ Create SSO Connection")').click();

      await page.locator('input[name="name"]').fill('ICU 24/7 Access SAML');
      await page.locator('input[name="description"]').fill('ICU continuous monitoring access');
      await page.locator('select[name="department"]').selectOption('icu');

      // ICU requires doctor and nurse access
      await page.locator('input[name="roles"][value="doctor"]').check();
      await page.locator('input[name="roles"][value="nurse"]').check();

      await page.locator('button[type="submit"]:has-text("Create Connection")').click();

      await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });

      // Verify ICU configuration
      await expect(page.locator('text=ICU 24/7 Access SAML')).toBeVisible();
      await expect(page.locator('text=Department: icu')).toBeVisible();
      await expect(page.locator('text=continuous monitoring')).toBeVisible();
    });

    test('should handle multiple simultaneous department setups', async () => {
      const departments = ['emergency', 'icu', 'surgery'];

      // Create connections for multiple departments simultaneously
      for (let i = 0; i < departments.length; i++) {
        const dept = departments[i];

        await page.locator('button:has-text("+ Create SSO Connection")').click();
        await page.locator('input[name="name"]').fill(`${dept.toUpperCase()} Dept SAML ${i + 1}`);
        await page.locator('select[name="department"]').selectOption(dept);
        await page.locator('button[type="submit"]:has-text("Create Connection")').click();

        // Don't wait for completion, start next one
        if (i < departments.length - 1) {
          await page.waitForTimeout(1000); // Brief pause
        }
      }

      // Wait for all to complete
      await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 15000 });

      // Verify all departments were created
      for (let i = 0; i < departments.length; i++) {
        const dept = departments[i];

        await expect(page.locator(`text=${dept.toUpperCase()} Dept SAML ${i + 1}`)).toBeVisible();
        await expect(page.locator(`text=Department: ${dept}`)).toBeVisible();
      }

      await expect(page.locator('text=Configured Connections (3)')).toBeVisible();
    });
  });

  test.describe('Error Handling and Recovery', () => {
    test('should handle network errors gracefully', async () => {
      // Simulate network issues by going offline
      await context.setOffline(true);

      await page.locator('button:has-text("+ Create SSO Connection")').click();
      await page.locator('input[name="name"]').fill('Network Error Test');
      await page.locator('button[type="submit"]:has-text("Create Connection")').click();

      // Should eventually show error or timeout gracefully
      await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 15000 });

      // Restore network
      await context.setOffline(false);

      // Page should recover
      await page.reload();

      await expect(page.locator('h1')).toContainText('SSO Management');
    });

    test('should handle page refresh during operations', async () => {
      await page.locator('button:has-text("+ Create SSO Connection")').click();
      await page.locator('input[name="name"]').fill('Refresh Test Connection');

      // Start creation but refresh page immediately
      const submitPromise = page.locator('button[type="submit"]:has-text("Create Connection")').click();
      await page.waitForTimeout(500);
      await page.reload();

      // Page should recover gracefully
      await expect(page.locator('h1')).toContainText('SSO Management');
      await expect(page.locator('button:has-text("+ Create SSO Connection")')).toBeVisible();
    });

    test('should handle browser back/forward during dialog', async () => {
      await page.locator('button:has-text("+ Create SSO Connection")').click();

      await expect(page.locator('h2:has-text("Create SSO Connection")')).toBeVisible();

      // Go back and forward
      await page.goBack();
      await page.goForward();

      // Should return to manageable state
      await expect(page.locator('h1')).toContainText('SSO Management');
    });
  });

  test.describe('Performance and Scalability', () => {
    test('should handle rapid successive operations', async () => {
      const operationCount = 5;
      const startTime = Date.now();

      for (let i = 0; i < operationCount; i++) {
        await page.locator('button:has-text("+ Create SSO Connection")').click();
        await page.locator('input[name="name"]').fill(`Rapid Test ${i + 1}`);
        await page.locator('button[type="submit"]:has-text("Create Connection")').click();

        await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should complete all operations within reasonable time
      expect(totalTime).toBeLessThan(60000); // 1 minute

      // Verify all connections created
      await expect(page.locator(`text=Configured Connections (${operationCount})`)).toBeVisible();
    });

    test('should maintain performance with many connections', async () => {
      // Create several connections
      const connectionCount = 10;

      for (let i = 0; i < connectionCount; i++) {
        await page.locator('button:has-text("+ Create SSO Connection")').click();
        await page.locator('input[name="name"]').fill(`Performance Test ${i + 1}`);
        await page.locator('button[type="submit"]:has-text("Create Connection")').click();

        await expect(page.locator('button:has-text("Creating...")')).toBeHidden({ timeout: 10000 });
      }

      // Page should still be responsive
      const startTime = Date.now();
      await page.locator('button:has-text("+ Create SSO Connection")').click();
      const endTime = Date.now();

      // Dialog should open quickly even with many connections
      expect(endTime - startTime).toBeLessThan(3000);

      await page.locator('button:has-text("Cancel")').click();
    });
  });
});
