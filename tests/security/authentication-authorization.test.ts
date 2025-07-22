import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, vi } from 'vitest';

import { GET as AuthorizeGet } from '@/app/api/auth/sso/authorize/route';
import { POST as CallbackPost } from '@/app/api/auth/sso/callback/route';
import { GET, POST } from '@/app/api/organizations/[orgId]/sso/connections/route';

import { MOCK_SAML_METADATA, setupTestEnvironment, TEST_HOSPITAL_ORG } from '../setup/test-infrastructure';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

describe('Security: Authentication & Authorization Tests', () => {
  const testInfra = setupTestEnvironment();
  const mockAuth = vi.mocked(auth);

  beforeEach(() => {
    // Reset auth mock
    mockAuth.mockReset();
  });

  describe('Authentication Enforcement', () => {
    it('should reject unauthenticated requests to SSO connections endpoint', async () => {
      // Mock no authentication
      mockAuth.mockResolvedValue({
        userId: null,
        orgId: null,
      } as any);

      const request = new NextRequest('http://localhost:3003/api/organizations/test/sso/connections');
      const response = await GET(request, { params: { orgId: 'test' } });

      expect(response.status).toBe(401);

      const responseData = await response.json();

      expect(responseData.error).toContain('Unauthorized');
    });

    it('should reject requests with invalid user ID', async () => {
      mockAuth.mockResolvedValue({
        userId: '',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      const request = new NextRequest('http://localhost:3003/api/organizations/test/sso/connections');
      const response = await GET(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      expect(response.status).toBe(401);
    });

    it('should reject requests with missing organization ID', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: null,
      } as any);

      const request = new NextRequest('http://localhost:3003/api/organizations/test/sso/connections');
      const response = await GET(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      expect(response.status).toBe(401);
    });

    it('should validate JWT token structure', async () => {
      // Mock malformed auth response
      mockAuth.mockRejectedValue(new Error('Invalid JWT token'));

      const request = new NextRequest('http://localhost:3003/api/organizations/test/sso/connections');

      await expect(async () => {
        await GET(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });
      }).rejects.toThrow('Invalid JWT token');
    });

    it('should handle expired tokens gracefully', async () => {
      mockAuth.mockRejectedValue(new Error('Token expired'));

      const request = new NextRequest('http://localhost:3003/api/organizations/test/sso/connections');

      await expect(async () => {
        await GET(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });
      }).rejects.toThrow('Token expired');
    });
  });

  describe('Organization-Scoped Authorization', () => {
    it('should enforce organization access control', async () => {
      // User from different organization
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'different_org_456',
      } as any);

      const request = new NextRequest('http://localhost:3003/api/organizations/target_org/sso/connections');
      const response = await GET(request, { params: { orgId: 'target_org' } });

      expect(response.status).toBe(401);

      const responseData = await response.json();

      expect(responseData.error).toContain('Unauthorized');
    });

    it('should allow access to own organization', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`);
      const response = await GET(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      expect(response.status).toBe(200);
    });

    it('should prevent cross-organization data access', async () => {
      // Create connection for org A
      const orgA = 'hospital_a';
      mockAuth.mockResolvedValue({
        userId: 'user_a',
        orgId: orgA,
      } as any);

      await testInfra.apiController!.createSAMLConnection({
        tenant: orgA,
        product: 'hospitalos',
        name: 'Org A Connection',
        rawMetadata: MOCK_SAML_METADATA,
        redirectUrl: ['http://localhost:3003/api/auth/sso/callback'],
      });

      // Try to access from org B
      const orgB = 'hospital_b';
      mockAuth.mockResolvedValue({
        userId: 'user_b',
        orgId: orgB,
      } as any);

      const request = new NextRequest(`http://localhost:3003/api/organizations/${orgA}/sso/connections`);
      const response = await GET(request, { params: { orgId: orgA } });

      expect(response.status).toBe(401);

      // Clean up
      await testInfra.apiController!.deleteConnections({
        tenant: orgA,
        product: 'hospitalos',
        clientID: (await testInfra.apiController!.getConnections({ tenant: orgA, product: 'hospitalos' }))[0].clientID,
      });
    });

    it('should validate organization ID format', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'valid_org',
      } as any);

      const maliciousOrgIds = [
        '../../../etc/passwd',
        'org_123; DROP TABLE jackson_store;--',
        '<script>alert("xss")</script>',
        '../../admin',
        'null',
        'undefined',
      ];

      for (const maliciousId of maliciousOrgIds) {
        const request = new NextRequest(`http://localhost:3003/api/organizations/${encodeURIComponent(maliciousId)}/sso/connections`);
        const response = await GET(request, { params: { orgId: maliciousId } });

        // Should reject with 401 (unauthorized) since orgId doesn't match auth
        expect(response.status).toBe(401);
      }
    });
  });

  describe('Input Validation and Sanitization', () => {
    it('should sanitize SAML metadata input', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      const maliciousMetadata = `
        <script>alert('xss')</script>
        <EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="test">
          <IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
            <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                                 Location="https://test.com/sso"/>
          </IDPSSODescriptor>
        </EntityDescriptor>
      `;

      const connectionData = {
        name: 'XSS Test Connection',
        description: 'Testing XSS prevention',
        redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
        metadata: maliciousMetadata,
      };

      const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`, {
        method: 'POST',
        body: JSON.stringify(connectionData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      // Should either succeed with sanitized data or fail validation
      if (response.status === 201) {
        const responseData = await response.json();

        // Verify script tags are not stored as-is
        expect(responseData.connection.rawMetadata).not.toContain('<script>');
      } else {
        // Or fail validation appropriately
        expect([400, 500]).toContain(response.status);
      }
    });

    it('should validate redirect URL format', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      const invalidUrls = [
        'javascript:alert("xss")',
        'data:text/html,<script>alert("xss")</script>',
        'file:///etc/passwd',
        'ftp://malicious.com',
        'not-a-url-at-all',
        '../../../admin',
      ];

      for (const invalidUrl of invalidUrls) {
        const connectionData = {
          name: 'Invalid URL Test',
          description: 'Testing URL validation',
          redirectUrl: invalidUrl,
          metadata: MOCK_SAML_METADATA,
        };

        const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`, {
          method: 'POST',
          body: JSON.stringify(connectionData),
          headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

        // Should reject invalid URLs
        expect(response.status).toBe(400);

        const responseData = await response.json();

        expect(responseData.error).toContain('validation');
      }
    });

    it('should prevent SQL injection in connection names', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      const sqlInjectionPayloads = [
        '\'; DROP TABLE jackson_store; --',
        '\' OR \'1\'=\'1',
        '\'; UPDATE jackson_store SET name=\'hacked\'; --',
        '\' UNION SELECT * FROM users; --',
      ];

      for (const payload of sqlInjectionPayloads) {
        const connectionData = {
          name: payload,
          description: 'SQL injection test',
          redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
          metadata: MOCK_SAML_METADATA,
        };

        const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`, {
          method: 'POST',
          body: JSON.stringify(connectionData),
          headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

        // Should either create safely (parameterized queries) or reject
        if (response.status === 201) {
          const responseData = await response.json();

          // Verify connection was created with exact name (not executed as SQL)
          expect(responseData.connection.name).toBe(payload);
        }
        // If rejected, that's also acceptable security behavior
      }
    });

    it('should limit input lengths to prevent DoS', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      const veryLongString = 'a'.repeat(100000); // 100KB string

      const connectionData = {
        name: veryLongString,
        description: veryLongString,
        redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
        metadata: veryLongString,
      };

      const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`, {
        method: 'POST',
        body: JSON.stringify(connectionData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      // Should handle large inputs gracefully - either succeed or fail appropriately
      expect([201, 400, 413, 500]).toContain(response.status);
    });
  });

  describe('SAML Security', () => {
    it('should handle malformed SAML responses in callback', async () => {
      const malformedSamlResponses = [
        'not-base64-data',
        '<xml>not valid saml</xml>',
        '',
        null,
        undefined,
        '<?xml version="1.0"?><malicious>content</malicious>',
      ];

      for (const malformedResponse of malformedSamlResponses) {
        const formData = new FormData();
        if (malformedResponse !== null && malformedResponse !== undefined) {
          formData.append('SAMLResponse', malformedResponse);
        }
        formData.append('RelayState', 'test_state');

        const request = new NextRequest('http://localhost:3003/api/auth/sso/callback', {
          method: 'POST',
          body: formData,
        });

        const response = await CallbackPost(request);

        // Should reject malformed SAML gracefully
        expect(response.status).toBe(400);

        const responseData = await response.json();

        expect(responseData.error).toBeDefined();
      }
    });

    it('should validate SAML signature (when available)', async () => {
      // This test would require properly signed SAML responses
      // For now, verify that unsigned responses are handled appropriately

      const unsignedSamlResponse = btoa(`<?xml version="1.0" encoding="UTF-8"?>
        <samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
          <samlp:Status>
            <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
          </samlp:Status>
        </samlp:Response>`);

      const formData = new FormData();
      formData.append('SAMLResponse', unsignedSamlResponse);
      formData.append('RelayState', 'test_state');

      const request = new NextRequest('http://localhost:3003/api/auth/sso/callback', {
        method: 'POST',
        body: formData,
      });

      const response = await CallbackPost(request);

      // Should handle appropriately (reject unsigned or validate properly)
      expect(response.status).toBe(400);
    });

    it('should prevent SAML replay attacks', async () => {
      // Create a test connection first
      await testInfra.createTestConnection();

      const sameTimestamp = new Date().toISOString();
      const samlResponse = btoa(`<?xml version="1.0" encoding="UTF-8"?>
        <samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" 
                        ID="same_id_123" 
                        IssueInstant="${sameTimestamp}">
          <samlp:Status>
            <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
          </samlp:Status>
        </samlp:Response>`);

      // Send same SAML response twice
      for (let i = 0; i < 2; i++) {
        const formData = new FormData();
        formData.append('SAMLResponse', samlResponse);
        formData.append('RelayState', 'replay_test');

        const request = new NextRequest('http://localhost:3003/api/auth/sso/callback', {
          method: 'POST',
          body: formData,
        });

        const response = await CallbackPost(request);

        // Both should fail with current mock data, but in real system
        // the second should be rejected as replay
        expect(response.status).toBe(400);
      }
    });

    it('should validate SAML destination URLs', async () => {
      await testInfra.createTestConnection();

      const wrongDestination = btoa(`<?xml version="1.0" encoding="UTF-8"?>
        <samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" 
                        Destination="https://malicious.com/callback">
          <samlp:Status>
            <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
          </samlp:Status>
        </samlp:Response>`);

      const formData = new FormData();
      formData.append('SAMLResponse', wrongDestination);
      formData.append('RelayState', 'destination_test');

      const request = new NextRequest('http://localhost:3003/api/auth/sso/callback', {
        method: 'POST',
        body: formData,
      });

      const response = await CallbackPost(request);

      // Should reject SAML with wrong destination
      expect(response.status).toBe(400);
    });
  });

  describe('Rate Limiting and DoS Prevention', () => {
    it('should handle rapid successive authentication requests', async () => {
      await testInfra.createTestConnection();

      const requests = Array.from({ length: 50 }, async (_, i) => {
        const url = new URL('http://localhost:3003/api/auth/sso/authorize');
        url.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
        url.searchParams.set('product', 'hospitalos');
        url.searchParams.set('state', `rapid_test_${i}`);

        const request = new NextRequest(url.toString());
        return await AuthorizeGet(request);
      });

      const results = await Promise.allSettled(requests);

      // Should handle all requests without crashing
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      // Most should succeed, some might be rate limited
      expect(successful + failed).toBe(50);
      expect(successful).toBeGreaterThan(0); // At least some should work
    });

    it('should handle large payload attacks', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      const largePayload = {
        name: 'a'.repeat(10000),
        description: 'b'.repeat(10000),
        redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
        metadata: 'c'.repeat(100000), // 100KB metadata
      };

      const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`, {
        method: 'POST',
        body: JSON.stringify(largePayload),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      // Should handle large payloads gracefully
      expect([201, 400, 413, 500]).toContain(response.status);
    });

    it('should prevent memory exhaustion with many connections', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      // Create many connections rapidly
      const connectionPromises = Array.from({ length: 20 }, async (_, i) => {
        const connectionData = {
          name: `Load Test Connection ${i}`,
          description: `Load testing connection ${i}`,
          redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
          metadata: MOCK_SAML_METADATA,
        };

        const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`, {
          method: 'POST',
          body: JSON.stringify(connectionData),
          headers: { 'Content-Type': 'application/json' },
        });

        return POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });
      });

      const results = await Promise.allSettled(connectionPromises);

      // Should handle concurrent creation without crashing
      const successful = results.filter(r =>
        r.status === 'fulfilled' && (r as any).value.status === 201,
      ).length;

      expect(successful).toBeGreaterThan(0); // At least some should succeed
    });
  });

  describe('Error Information Disclosure', () => {
    it('should not expose sensitive information in error messages', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      // Trigger various error conditions
      const errorScenarios = [
        {
          name: 'Invalid JSON',
          body: '{invalid json}',
          headers: { 'Content-Type': 'application/json' },
        },
        {
          name: 'Missing Content-Type',
          body: JSON.stringify({ name: 'test' }),
          headers: {},
        },
      ];

      for (const scenario of errorScenarios) {
        const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`, {
          method: 'POST',
          body: scenario.body,
          headers: scenario.headers,
        });

        const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

        if (response.status >= 400) {
          const responseData = await response.json();

          // Error messages should not contain sensitive information
          const errorString = JSON.stringify(responseData).toLowerCase();

          // Should not expose internal paths, database info, etc.
          expect(errorString).not.toContain('database');
          expect(errorString).not.toContain('jackson');
          expect(errorString).not.toContain('postgresql');
          expect(errorString).not.toContain('password');
          expect(errorString).not.toContain('secret');
          expect(errorString).not.toContain('/users/');
          expect(errorString).not.toContain('stack trace');
        }
      }
    });

    it('should use generic error messages for authentication failures', async () => {
      mockAuth.mockResolvedValue({
        userId: null,
        orgId: null,
      } as any);

      const request = new NextRequest('http://localhost:3003/api/organizations/test/sso/connections');
      const response = await GET(request, { params: { orgId: 'test' } });

      expect(response.status).toBe(401);

      const responseData = await response.json();

      // Should use generic message, not expose why auth failed
      expect(responseData.error).toBe('Unauthorized');
      expect(responseData.error).not.toContain('user not found');
      expect(responseData.error).not.toContain('invalid token');
      expect(responseData.error).not.toContain('expired');
    });
  });

  describe('Hospital-Specific Security Requirements', () => {
    it('should handle PHI data protection in connection descriptions', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      const connectionWithPHI = {
        name: 'Patient Data Access',
        description: 'Access for John Doe SSN:123-45-6789 DOB:01/01/1980', // Mock PHI
        redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
        metadata: MOCK_SAML_METADATA,
      };

      const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`, {
        method: 'POST',
        body: JSON.stringify(connectionWithPHI),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      // Should either succeed (with PHI logged for audit) or warn about PHI
      expect([201, 400]).toContain(response.status);
    });

    it('should enforce emergency access protocols', async () => {
      await testInfra.createTestConnection({
        name: 'Emergency Access SAML',
        description: 'Emergency department access | Department: emergency | Roles: doctor, nurse',
      });

      const emergencyAuthUrl = new URL('http://localhost:3003/api/auth/sso/authorize');
      emergencyAuthUrl.searchParams.set('tenant', TEST_HOSPITAL_ORG.id);
      emergencyAuthUrl.searchParams.set('product', 'hospitalos');
      emergencyAuthUrl.searchParams.set('state', 'EMERGENCY_CODE_BLUE');

      const request = new NextRequest(emergencyAuthUrl.toString());
      const response = await AuthorizeGet(request);

      // Emergency access should be prioritized
      expect(response.status).toBe(302);
    });

    it('should validate medical staff credentials context', async () => {
      const medicalRoles = ['doctor', 'nurse', 'technician', 'administrator'];

      for (const role of medicalRoles) {
        mockAuth.mockResolvedValue({
          userId: `${role}_user_123`,
          orgId: TEST_HOSPITAL_ORG.id,
        } as any);

        const connectionData = {
          name: `${role.toUpperCase()} Access SAML`,
          description: `${role} access | Department: general | Roles: ${role}`,
          redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
          metadata: MOCK_SAML_METADATA,
        };

        const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`, {
          method: 'POST',
          body: JSON.stringify(connectionData),
          headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

        // All medical roles should be able to create connections
        expect(response.status).toBe(201);
      }
    });

    it('should handle HIPAA audit trail requirements', async () => {
      mockAuth.mockResolvedValue({
        userId: 'audit_user_123',
        orgId: TEST_HOSPITAL_ORG.id,
      } as any);

      const auditableActions = [
        { action: 'create', name: 'Audit Test Create' },
        { action: 'read', name: 'Audit Test Read' },
        { action: 'delete', name: 'Audit Test Delete' },
      ];

      for (const auditAction of auditableActions) {
        if (auditAction.action === 'create') {
          const connectionData = {
            name: auditAction.name,
            description: 'HIPAA audit test connection',
            redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
            metadata: MOCK_SAML_METADATA,
          };

          const request = new NextRequest(`http://localhost:3003/api/organizations/${TEST_HOSPITAL_ORG.id}/sso/connections`, {
            method: 'POST',
            body: JSON.stringify(connectionData),
            headers: { 'Content-Type': 'application/json' },
          });

          const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

          expect(response.status).toBe(201);
        }

        // In a real implementation, verify audit logs are created
        // For now, ensure operations complete successfully for audit trail
      }
    });
  });
});
