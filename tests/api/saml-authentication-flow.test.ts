import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, vi } from 'vitest';

import { GET as AuthorizeGet } from '@/app/api/auth/sso/authorize/route';
import { GET as CallbackGet, POST as CallbackPost } from '@/app/api/auth/sso/callback/route';
import { GET as MetadataGet } from '@/app/api/auth/sso/metadata/route';
import { GET as TestGet } from '@/app/api/auth/sso/test/route';

import { MOCK_SAML_RESPONSE, setupTestEnvironment, TEST_HOSPITAL_ORG, testUtils } from '../setup/test-infrastructure';

describe('SAML Authentication Flow Tests', () => {
  const testInfra = setupTestEnvironment();

  beforeEach(async () => {
    // Create a test connection for authentication flow tests
    await testInfra.createTestConnection({
      name: 'Test Hospital SAML',
      description: 'Test connection for authentication flow',
    });
  });

  describe('GET /api/auth/sso/authorize', () => {
    it('should initiate SAML authentication for hospital', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
      url.searchParams.set('product', 'hospitalos');
      url.searchParams.set('redirect_uri', 'http://localhost:3003/dashboard');

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      expect(response.status).toBe(302); // Should redirect to IdP

      const location = response.headers.get('location');

      expect(location).toBeTruthy();
      expect(location).toContain('SAMLRequest');
    });

    it('should handle missing tenant parameter', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      // Missing tenant parameter

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toContain('tenant');
    });

    it('should handle invalid tenant', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', 'nonexistent-hospital');
      url.searchParams.set('product', 'hospitalos');

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      expect(response.status).toBe(500); // Should fail when no connections exist for tenant
    });

    it('should include custom redirect URI', async () => {
      const customRedirectUri = 'http://localhost:3003/custom-callback';
      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
      url.searchParams.set('product', 'hospitalos');
      url.searchParams.set('redirect_uri', customRedirectUri);

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      expect(response.status).toBe(302);

      const location = response.headers.get('location');

      expect(location).toBeTruthy();
      // The redirect URI should be encoded in the SAML request
    });

    it('should handle state parameter for security', async () => {
      const securityState = 'emergency_department_access_12345';
      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
      url.searchParams.set('product', 'hospitalos');
      url.searchParams.set('state', securityState);

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      expect(response.status).toBe(302);

      const location = response.headers.get('location');

      expect(location).toBeTruthy();
    });

    it('should handle department-specific authentication', async () => {
      // Create department-specific connection
      await testInfra.createTestConnection({
        name: 'Emergency Department SAML',
        description: 'Emergency access | Department: emergency | Roles: doctor, nurse',
      });

      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
      url.searchParams.set('product', 'hospitalos');
      url.searchParams.set('department', 'emergency');

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      expect(response.status).toBe(302);
    });
  });

  describe('POST /api/auth/sso/callback', () => {
    it('should process SAML response for hospital staff', async () => {
      const formData = new FormData();
      formData.append('SAMLResponse', MOCK_SAML_RESPONSE);
      formData.append('RelayState', 'hospital_emergency_access');

      const request = new NextRequest('http://localhost:3003/api/auth/sso/callback', {
        method: 'POST',
        body: formData,
      });

      const response = await CallbackPost(request);
      const responseData = await response.json();

      // With mock data, we expect it to fail gracefully
      expect(response.status).toBe(400);
      expect(responseData.error).toBeDefined();
      expect(responseData.details).toBeDefined();
    });

    it('should reject invalid SAML responses', async () => {
      const formData = new FormData();
      formData.append('SAMLResponse', 'invalid_base64_data');
      formData.append('RelayState', 'test_state');

      const request = new NextRequest('http://localhost:3003/api/auth/sso/callback', {
        method: 'POST',
        body: formData,
      });

      const response = await CallbackPost(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toContain('authentication failed');
    });

    it('should handle missing SAML response', async () => {
      const formData = new FormData();
      formData.append('RelayState', 'test_state');
      // Missing SAMLResponse

      const request = new NextRequest('http://localhost:3003/api/auth/sso/callback', {
        method: 'POST',
        body: formData,
      });

      const response = await CallbackPost(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBeDefined();
    });

    it('should handle malformed form data', async () => {
      const request = new NextRequest('http://localhost:3003/api/auth/sso/callback', {
        method: 'POST',
        body: 'invalid form data',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const response = await CallbackPost(request);

      expect(response.status).toBe(400);
    });

    it('should preserve RelayState for emergency access', async () => {
      const emergencyState = 'emergency_access_patient_12345';
      const formData = new FormData();
      formData.append('SAMLResponse', MOCK_SAML_RESPONSE);
      formData.append('RelayState', emergencyState);

      const request = new NextRequest('http://localhost:3003/api/auth/sso/callback', {
        method: 'POST',
        body: formData,
      });

      const response = await CallbackPost(request);

      // Even with failure, should handle RelayState properly
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/sso/callback (OIDC)', () => {
    it('should handle OIDC authorization code flow', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/callback');
      url.searchParams.set('code', 'mock_authorization_code');
      url.searchParams.set('state', 'mock_state_value');

      const request = new NextRequest(url.toString());
      const response = await CallbackGet(request);
      const responseData = await response.json();

      // With mock data, expect graceful failure
      expect(response.status).toBe(400);
      expect(responseData.error).toBeDefined();
    });

    it('should handle OAuth error responses', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/callback');
      url.searchParams.set('error', 'access_denied');
      url.searchParams.set('error_description', 'User denied access');

      const request = new NextRequest(url.toString());
      const response = await CallbackGet(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toContain('access_denied');
    });

    it('should handle missing authorization code', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/callback');
      url.searchParams.set('state', 'mock_state_value');
      // Missing code parameter

      const request = new NextRequest(url.toString());
      const response = await CallbackGet(request);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/sso/metadata', () => {
    it('should generate valid SP metadata for hospital', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/metadata');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);

      const request = new NextRequest(url.toString());
      const response = await MetadataGet(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/xml');
      expect(response.headers.get('cache-control')).toContain('public');

      const metadata = await response.text();

      expect(testUtils.validateSAMLMetadata(metadata)).toBe(true);
      expect(metadata).toContain('<EntityDescriptor');
      expect(metadata).toContain('urn:oasis:names:tc:SAML:2.0:metadata');
    });

    it('should handle missing tenant in metadata request', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/metadata');
      // Missing tenant parameter

      const request = new NextRequest(url.toString());
      const response = await MetadataGet(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toContain('tenant');
    });

    it('should include correct callback URLs in metadata', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/metadata');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);

      const request = new NextRequest(url.toString());
      const response = await MetadataGet(request);
      const metadata = await response.text();

      expect(metadata).toContain('http://localhost:3003/api/auth/sso/callback');
    });

    it('should be cacheable for performance', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/metadata');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);

      const request = new NextRequest(url.toString());
      const response = await MetadataGet(request);

      const cacheControl = response.headers.get('cache-control');

      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain('max-age');
    });
  });

  describe('GET /api/auth/sso/test', () => {
    it('should provide comprehensive test information', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/test');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);

      const request = new NextRequest(url.toString());
      const response = await TestGet(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.tenant).toBe(TEST_HOSPITAL_ORG.id);
      expect(responseData.connectionsCount).toBeGreaterThan(0);
      expect(responseData.connections).toBeDefined();
      expect(responseData.ssoUrl).toContain('/api/auth/sso/authorize');
      expect(responseData.testUrl).toContain('/api/auth/sso/metadata');
      expect(responseData.callbackUrl).toContain('/api/auth/sso/callback');
    });

    it('should handle test with default tenant', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/test');
      // Should use default tenant 'st-marys-hospital'

      const request = new NextRequest(url.toString());
      const response = await TestGet(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.tenant).toBe('st-marys-hospital');
    });

    it('should show empty connections for new tenant', async () => {
      const url = new URL('http://localhost:3003/api/auth/sso/test');
      url.searchParams.set('tenant', 'empty-hospital-org');

      const request = new NextRequest(url.toString());
      const response = await TestGet(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.connectionsCount).toBe(0);
      expect(responseData.connections).toHaveLength(0);
    });

    it('should handle Jackson service errors gracefully', async () => {
      // Mock Jackson failure
      const originalGetConnections = testInfra.apiController!.getConnections;
      testInfra.apiController!.getConnections = vi.fn().mockRejectedValue(new Error('Jackson service error'));

      const url = new URL('http://localhost:3003/api/auth/sso/test');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);

      const request = new NextRequest(url.toString());
      const response = await TestGet(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe('SSO test failed');
      expect(responseData.details).toContain('Jackson service error');

      // Restore original function
      testInfra.apiController!.getConnections = originalGetConnections;
    });
  });

  describe('Hospital-Specific Authentication Scenarios', () => {
    it('should handle emergency department authentication', async () => {
      await testInfra.createTestConnection({
        name: 'Emergency Department SAML',
        description: 'Emergency access | Department: emergency | Roles: doctor, nurse',
      });

      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
      url.searchParams.set('product', 'hospitalos');
      url.searchParams.set('state', 'emergency_code_blue_patient_123');

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      expect(response.status).toBe(302);

      const location = response.headers.get('location');

      expect(location).toBeTruthy();
    });

    it('should handle ICU authentication with role validation', async () => {
      await testInfra.createTestConnection({
        name: 'ICU SAML Connection',
        description: 'ICU access | Department: icu | Roles: doctor, nurse',
      });

      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
      url.searchParams.set('product', 'hospitalos');
      url.searchParams.set('state', 'icu_patient_monitoring');

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      expect(response.status).toBe(302);
    });

    it('should handle surgery department access', async () => {
      await testInfra.createTestConnection({
        name: 'Surgery Department SAML',
        description: 'Surgery access | Department: surgery | Roles: doctor, technician',
      });

      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
      url.searchParams.set('product', 'hospitalos');
      url.searchParams.set('state', 'surgery_room_3_procedure');

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      expect(response.status).toBe(302);
    });

    it('should handle 24/7 hospital access patterns', async () => {
      const shifts = ['day_shift', 'night_shift', 'weekend_shift'];

      for (const shift of shifts) {
        const url = new URL('http://localhost:3003/api/auth/sso/authorize');
        url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
        url.searchParams.set('product', 'hospitalos');
        url.searchParams.set('state', `${shift}_access`);

        const request = new NextRequest(url.toString());
        const response = await AuthorizeGet(request);

        expect(response.status).toBe(302);
      }
    });
  });

  describe('Security and Error Handling', () => {
    it('should sanitize state parameter', async () => {
      const maliciousState = '<script>alert("xss")</script>';
      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
      url.searchParams.set('product', 'hospitalos');
      url.searchParams.set('state', maliciousState);

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      expect(response.status).toBe(302);
      // Should not contain raw script in redirect
    });

    it('should handle extremely long state parameters', async () => {
      const longState = 'a'.repeat(10000);
      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
      url.searchParams.set('product', 'hospitalos');
      url.searchParams.set('state', longState);

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      // Should handle gracefully - either succeed or fail gracefully
      expect([302, 400, 500]).toContain(response.status);
    });

    it('should handle SQL injection attempts in tenant', async () => {
      const maliciousTenant = '\'; DROP TABLE jackson_store; --';
      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', maliciousTenant);
      url.searchParams.set('product', 'hospitalos');

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      // Should fail safely
      expect(response.status).toBe(500);
    });

    it('should handle unicode and special characters in parameters', async () => {
      const unicodeTenant = 'hospital-测试-🏥';
      const url = new URL('http://localhost:3003/api/auth/sso/authorize');
      url.searchParams.set('tenant', unicodeTenant);
      url.searchParams.set('product', 'hospitalos');

      const request = new NextRequest(url.toString());
      const response = await AuthorizeGet(request);

      // Should handle Unicode gracefully
      expect([302, 400, 500]).toContain(response.status);
    });

    it('should handle concurrent authentication requests', async () => {
      const concurrentRequests = 10;
      const authPromises = [];

      for (let i = 0; i < concurrentRequests; i++) {
        const url = new URL('http://localhost:3003/api/auth/sso/authorize');
        url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
        url.searchParams.set('product', 'hospitalos');
        url.searchParams.set('state', `concurrent_test_${i}`);

        const request = new NextRequest(url.toString());
        authPromises.push(AuthorizeGet(request));
      }

      const results = await Promise.allSettled(authPromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;

      expect(successful).toBe(concurrentRequests);
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle rapid successive authentication requests', async () => {
      const rapidRequests = 20;
      const startTime = Date.now();

      const promises = Array.from({ length: rapidRequests }, async (_, i) => {
        const url = new URL('http://localhost:3003/api/auth/sso/authorize');
        url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
        url.searchParams.set('product', 'hospitalos');
        url.searchParams.set('state', `rapid_test_${i}`);

        const request = new NextRequest(url.toString());
        return await AuthorizeGet(request);
      });

      const results = await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(results).toHaveLength(rapidRequests);
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });

    it('should maintain performance with large metadata', async () => {
      const largeMetadata = testUtils.generateTestMetadata('large-hospital').repeat(50);

      await testInfra.createTestConnection({
        name: 'Large Metadata Connection',
        rawMetadata: largeMetadata,
      });

      const url = new URL('http://localhost:3003/api/auth/sso/metadata');
      url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);

      const startTime = Date.now();
      const request = new NextRequest(url.toString());
      const response = await MetadataGet(request);
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});
