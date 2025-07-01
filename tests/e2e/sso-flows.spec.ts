/**
 * SSO End-to-End Flow Tests
 * Tests complete SSO authentication workflows using Playwright
 */

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const MOCK_IDP_URL = 'https://mock-idp.hospitalos.test';

// Mock user data
const testHospitalAdmin = {
  email: 'admin@testhospital.com',
  name: 'Dr. Admin Smith',
  role: 'ADMIN',
  department: 'Administration',
};

const testMedicalStaff = {
  email: 'doctor@testhospital.com',
  name: 'Dr. Jane Doe',
  role: 'MEMBER',
  department: 'Emergency',
};

test.describe('SSO Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto(BASE_URL);
  });

  test.describe('SAML SSO Flow', () => {
    test('should complete full SAML authentication flow for hospital admin', async ({ page }) => {
      // 1. Navigate to login page
      await page.goto(`${BASE_URL}/login`);

      // 2. Click on "Login with SSO" button
      await page.click('[data-testid="sso-login-button"]');

      // 3. Enter organization domain
      await page.fill('[data-testid="org-domain-input"]', 'testhospital');
      await page.click('[data-testid="continue-sso-button"]');

      // 4. Should redirect to SSO authorization endpoint
      await page.waitForURL(/\/api\/auth\/sso\/authorize/);

      // 5. Mock IdP should receive the SAML request
      await expect(page).toHaveURL(new RegExp(MOCK_IDP_URL));

      // 6. Simulate IdP authentication and SAML response
      await mockIdPAuthentication(page, testHospitalAdmin);

      // 7. Should redirect back to callback with SAML response
      await page.waitForURL(/\/api\/auth\/sso\/callback/);

      // 8. Should process SAML response and create Clerk session
      await page.waitForURL(/\/dashboard/);

      // 9. Verify user is logged in and has correct role
      await expect(page.locator('[data-testid="user-name"]')).toContainText('Dr. Admin Smith');
      await expect(page.locator('[data-testid="user-role"]')).toContainText('Administrator');

      // 10. Verify organization context is set
      await expect(page.locator('[data-testid="org-name"]')).toContainText('Test Hospital');

      // 11. Verify access to admin features
      await expect(page.locator('[data-testid="admin-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="sso-settings"]')).toBeVisible();
    });

    test('should complete SAML authentication for medical staff with limited access', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.click('[data-testid="sso-login-button"]');
      await page.fill('[data-testid="org-domain-input"]', 'testhospital');
      await page.click('[data-testid="continue-sso-button"]');

      await page.waitForURL(new RegExp(MOCK_IDP_URL));
      await mockIdPAuthentication(page, testMedicalStaff);

      await page.waitForURL(/\/dashboard/);

      // Verify user info
      await expect(page.locator('[data-testid="user-name"]')).toContainText('Dr. Jane Doe');
      await expect(page.locator('[data-testid="user-role"]')).toContainText('Medical Staff');
      await expect(page.locator('[data-testid="department"]')).toContainText('Emergency');

      // Verify limited access (no admin features)
      await expect(page.locator('[data-testid="admin-menu"]')).toBeHidden();
      await expect(page.locator('[data-testid="sso-settings"]')).toBeHidden();

      // Should have access to patient records and basic features
      await expect(page.locator('[data-testid="patient-records"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
    });

    test('should handle SAML authentication errors gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.click('[data-testid="sso-login-button"]');
      await page.fill('[data-testid="org-domain-input"]', 'testhospital');
      await page.click('[data-testid="continue-sso-button"]');

      await page.waitForURL(new RegExp(MOCK_IDP_URL));

      // Simulate IdP authentication failure
      await mockIdPError(page, 'authentication_failed');

      // Should redirect back to login with error
      await page.waitForURL(/\/login/);

      await expect(page.locator('[data-testid="error-message"]')).toContainText('SSO authentication failed');

      // Should provide option to try again or use different method
      await expect(page.locator('[data-testid="try-again-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="alternative-login"]')).toBeVisible();
    });

    test('should prevent unauthorized organization access', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Try to access different organization
      await page.click('[data-testid="sso-login-button"]');
      await page.fill('[data-testid="org-domain-input"]', 'unauthorizedhospital');
      await page.click('[data-testid="continue-sso-button"]');

      // Should get error for non-existent or unauthorized org
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Organization not found or access denied');

      // Should stay on login page
      expect(page.url()).toContain('/login');
    });
  });

  test.describe('OIDC SSO Flow', () => {
    test('should complete full OIDC authentication flow', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Select OIDC provider (e.g., Azure AD)
      await page.click('[data-testid="sso-login-button"]');
      await page.fill('[data-testid="org-domain-input"]', 'azurehospital');
      await page.click('[data-testid="continue-sso-button"]');

      // Should redirect to OIDC authorization
      await page.waitForURL(/\/api\/auth\/sso\/authorize.*code_challenge/);

      // Mock OIDC provider
      await expect(page).toHaveURL(new RegExp('login.microsoftonline.com'));

      // Simulate OIDC authentication
      await mockOIDCAuthentication(page, testHospitalAdmin);

      // Should handle authorization code exchange
      await page.waitForURL(/\/api\/auth\/sso\/callback.*code=/);

      // Should create session and redirect to dashboard
      await page.waitForURL(/\/dashboard/);

      await expect(page.locator('[data-testid="user-name"]')).toContainText('Dr. Admin Smith');
    });

    test('should handle OIDC errors appropriately', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.click('[data-testid="sso-login-button"]');
      await page.fill('[data-testid="org-domain-input"]', 'azurehospital');
      await page.click('[data-testid="continue-sso-button"]');

      await page.waitForURL(new RegExp('login.microsoftonline.com'));

      // Simulate user denying access
      await mockOIDCError(page, 'access_denied');

      await page.waitForURL(/\/login/);

      await expect(page.locator('[data-testid="error-message"]')).toContainText('Access denied by user');
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      // Complete SSO login
      await performSuccessfulSSOLogin(page, testHospitalAdmin);

      // Refresh the page
      await page.reload();

      // Should still be logged in
      await expect(page.locator('[data-testid="user-name"]')).toContainText('Dr. Admin Smith');
      expect(page.url()).toContain('/dashboard');
    });

    test('should handle session timeout appropriately', async ({ page }) => {
      await performSuccessfulSSOLogin(page, testMedicalStaff);

      // Mock session expiration
      await page.evaluate(() => {
        // Clear Clerk session
        localStorage.removeItem('clerk-db');
        sessionStorage.clear();
      });

      // Try to access protected page
      await page.goto(`${BASE_URL}/admin/sso`);

      // Should redirect to login
      await page.waitForURL(/\/login/);

      await expect(page.locator('[data-testid="session-expired-message"]')).toContainText('Your session has expired');
    });

    test('should support single logout (SLO)', async ({ page }) => {
      await performSuccessfulSSOLogin(page, testHospitalAdmin);

      // Click logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');

      // Should initiate SLO with IdP
      await page.waitForURL(new RegExp(`${MOCK_IDP_URL}.*logout`));

      // Mock IdP logout completion
      await mockIdPLogout(page);

      // Should redirect back to logged out state
      await page.waitForURL(/\/login/);

      await expect(page.locator('[data-testid="logout-success"]')).toContainText('Successfully logged out');

      // Verify no session remains
      const sessionData = await page.evaluate(() => localStorage.getItem('clerk-db'));

      expect(sessionData).toBeNull();
    });
  });

  test.describe('Multi-Hospital Tenant Isolation', () => {
    test('should isolate data between different hospital organizations', async ({ page, context }) => {
      // Login as admin from Hospital A
      await performSuccessfulSSOLogin(page, {
        ...testHospitalAdmin,
        organization: 'hospital-a',
      });

      // Access SSO settings and create connection
      await page.goto(`${BASE_URL}/admin/sso`);
      await page.click('[data-testid="add-connection"]');
      await page.fill('[data-testid="connection-name"]', 'Hospital A SSO');
      await page.click('[data-testid="save-connection"]');

      // Verify connection appears in list
      await expect(page.locator('[data-testid="connection-list"]')).toContainText('Hospital A SSO');

      // Open new tab/context for different hospital
      const newPage = await context.newPage();

      // Login as admin from Hospital B
      await performSuccessfulSSOLogin(newPage, {
        ...testHospitalAdmin,
        organization: 'hospital-b',
      });

      // Check that Hospital A's connection is not visible
      await newPage.goto(`${BASE_URL}/admin/sso`);

      await expect(newPage.locator('[data-testid="connection-list"]')).not.toContainText('Hospital A SSO');

      // Verify Hospital B can create their own connections
      await newPage.click('[data-testid="add-connection"]');
      await newPage.fill('[data-testid="connection-name"]', 'Hospital B SSO');
      await newPage.click('[data-testid="save-connection"]');

      await expect(newPage.locator('[data-testid="connection-list"]')).toContainText('Hospital B SSO');
    });
  });

  test.describe('Error Recovery and Edge Cases', () => {
    test('should handle network failures during SSO process', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Start SSO process
      await page.click('[data-testid="sso-login-button"]');
      await page.fill('[data-testid="org-domain-input"]', 'testhospital');

      // Simulate network failure
      await page.route('**/api/auth/sso/**', route => route.abort());

      await page.click('[data-testid="continue-sso-button"]');

      // Should show network error and retry option
      await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();

      // Clear network failure and retry
      await page.unroute('**/api/auth/sso/**');
      await page.click('[data-testid="retry-button"]');

      // Should continue with SSO process
      await page.waitForURL(new RegExp(MOCK_IDP_URL));
    });

    test('should handle malformed SAML responses', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.click('[data-testid="sso-login-button"]');
      await page.fill('[data-testid="org-domain-input"]', 'testhospital');
      await page.click('[data-testid="continue-sso-button"]');

      await page.waitForURL(new RegExp(MOCK_IDP_URL));

      // Mock malformed SAML response
      await mockMalformedSAMLResponse(page);

      await page.waitForURL(/\/login/);

      await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid authentication response');
    });

    test('should prevent SAML replay attacks', async ({ page }) => {
      // This test would verify that the same SAML response cannot be used multiple times
      // Implementation depends on your replay protection mechanism
      await page.goto(`${BASE_URL}/login`);

      // Complete first SSO flow
      await performSuccessfulSSOLogin(page, testMedicalStaff);
      await page.click('[data-testid="logout-button"]');

      // Try to replay the same SAML response
      // (This would require capturing and replaying the exact SAML response)

      // Should be rejected
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Authentication response has already been used');
    });
  });

  test.describe('Mobile SSO Experience', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto(`${BASE_URL}/login`);

      // Mobile SSO flow should work
      await page.click('[data-testid="sso-login-button"]');
      await page.fill('[data-testid="org-domain-input"]', 'testhospital');
      await page.click('[data-testid="continue-sso-button"]');

      await page.waitForURL(new RegExp(MOCK_IDP_URL));
      await mockIdPAuthentication(page, testMedicalStaff);

      await page.waitForURL(/\/dashboard/);

      // Verify mobile layout works
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-name"]')).toContainText('Dr. Jane Doe');
    });
  });
});

// Helper functions for mocking IdP responses
async function mockIdPAuthentication(page: Page, user: any) {
  // Mock the IdP authentication process
  await page.route(`${MOCK_IDP_URL}/**`, async (route) => {
    const url = route.request().url();

    if (url.includes('saml/sso')) {
      // Return SAML response
      const samlResponse = generateMockSAMLResponse(user);
      await route.fulfill({
        status: 302,
        headers: {
          'Location': `${BASE_URL}/api/auth/sso/callback`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `SAMLResponse=${encodeURIComponent(samlResponse)}&RelayState=/dashboard`,
      });
    }
  });
}

async function mockOIDCAuthentication(page: Page, user: any) {
  await page.route('**/login.microsoftonline.com/**', async (route) => {
    // Return authorization code
    await route.fulfill({
      status: 302,
      headers: {
        Location: `${BASE_URL}/api/auth/sso/callback?code=mock_auth_code&state=mock_state`,
      },
    });
  });
}

async function mockIdPError(page: Page, error: string) {
  await page.route(`${MOCK_IDP_URL}/**`, async (route) => {
    await route.fulfill({
      status: 302,
      headers: {
        Location: `${BASE_URL}/api/auth/sso/callback?error=${error}&error_description=Authentication failed`,
      },
    });
  });
}

async function mockOIDCError(page: Page, error: string) {
  await page.route('**/login.microsoftonline.com/**', async (route) => {
    await route.fulfill({
      status: 302,
      headers: {
        Location: `${BASE_URL}/api/auth/sso/callback?error=${error}&error_description=The user denied the request`,
      },
    });
  });
}

async function mockIdPLogout(page: Page) {
  await page.route(`${MOCK_IDP_URL}/**logout**`, async (route) => {
    await route.fulfill({
      status: 302,
      headers: {
        Location: `${BASE_URL}/login?logged_out=true`,
      },
    });
  });
}

async function mockMalformedSAMLResponse(page: Page) {
  await page.route(`${MOCK_IDP_URL}/**`, async (route) => {
    await route.fulfill({
      status: 302,
      headers: {
        'Location': `${BASE_URL}/api/auth/sso/callback`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'SAMLResponse=invalid_base64_data&RelayState=/dashboard',
    });
  });
}

async function performSuccessfulSSOLogin(page: Page, user: any) {
  await page.goto(`${BASE_URL}/login`);
  await page.click('[data-testid="sso-login-button"]');
  await page.fill('[data-testid="org-domain-input"]', user.organization || 'testhospital');
  await page.click('[data-testid="continue-sso-button"]');
  await page.waitForURL(new RegExp(MOCK_IDP_URL));
  await mockIdPAuthentication(page, user);
  await page.waitForURL(/\/dashboard/);
}

function generateMockSAMLResponse(user: any): string {
  // Generate a mock SAML response with user data
  const samlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" 
                ID="mock_response_id" 
                Version="2.0" 
                IssueInstant="${new Date().toISOString()}">
  <saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress">
        ${user.email}
      </saml:NameID>
    </saml:Subject>
    <saml:AttributeStatement>
      <saml:Attribute Name="name">
        <saml:AttributeValue>${user.name}</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute Name="role">
        <saml:AttributeValue>${user.role}</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute Name="department">
        <saml:AttributeValue>${user.department}</saml:AttributeValue>
      </saml:Attribute>
    </saml:AttributeStatement>
  </saml:Assertion>
</samlp:Response>`;

  return Buffer.from(samlResponse).toString('base64');
}
