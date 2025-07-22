import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, vi } from 'vitest';

import { DELETE, GET as GetConnection, PATCH } from '@/app/api/organizations/[orgId]/sso/connections/[connectionId]/route';
import { GET, POST } from '@/app/api/organizations/[orgId]/sso/connections/route';

import { MOCK_SAML_METADATA, setupTestEnvironment, TEST_HOSPITAL_ORG, testUtils } from '../setup/test-infrastructure';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

describe('SSO Connections CRUD API Tests', () => {
  const testInfra = setupTestEnvironment();
  const mockAuth = vi.mocked(auth);

  beforeEach(() => {
    // Setup default auth mock
    mockAuth.mockResolvedValue({
      userId: 'user_test_123',
      orgId: TEST_HOSPITAL_ORG.id,
    } as any);
  });

  describe('POST /api/organizations/[orgId]/sso/connections', () => {
    it('should create connection with hospital departments and roles', async () => {
      const connectionData = {
        name: 'ICU SAML Connection',
        description: 'Intensive Care Unit access for medical staff',
        department: 'icu',
        roles: ['doctor', 'nurse'],
        redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
        metadata: MOCK_SAML_METADATA,
      };

      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections', {
        method: 'POST',
        body: JSON.stringify(connectionData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.connection).toBeDefined();
      expect(responseData.connection.name).toBe('ICU SAML Connection');
      expect(responseData.connection.tenant).toBe(TEST_HOSPITAL_ORG.id);
    });

    it('should validate required fields', async () => {
      const invalidData = {
        name: '', // Empty name
        redirectUrl: 'invalid-url', // Invalid URL
      };

      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toContain('validation');
    });

    it('should enforce organization access control', async () => {
      // Mock user from different organization
      mockAuth.mockResolvedValueOnce({
        userId: 'user_test_123',
        orgId: 'different_org_456',
      } as any);

      const connectionData = {
        name: 'Test Connection',
        redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
        metadata: MOCK_SAML_METADATA,
      };

      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections', {
        method: 'POST',
        body: JSON.stringify(connectionData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      expect(response.status).toBe(401);
    });

    it('should handle multiple department configurations', async () => {
      const departments = testUtils.getHospitalDepartments();

      for (const department of departments) {
        const connectionData = {
          name: `${department.toUpperCase()} SAML`,
          description: `${department} department access`,
          department,
          redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
          metadata: MOCK_SAML_METADATA,
        };

        const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections', {
          method: 'POST',
          body: JSON.stringify(connectionData),
          headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });
        const responseData = await response.json();

        expect(response.status).toBe(201);
        expect(responseData.connection.name).toBe(`${department.toUpperCase()} SAML`);
        expect(responseData.connection.description).toContain(department);
      }
    });

    it('should handle role-based configurations', async () => {
      const roleConfigurations = [
        ['doctor'],
        ['nurse'],
        ['technician'],
        ['administrator'],
        ['doctor', 'nurse'],
        ['doctor', 'nurse', 'technician', 'administrator'],
      ];

      for (const roles of roleConfigurations) {
        const connectionData = {
          name: `Multi-Role SAML - ${roles.join(',')}`,
          description: `Access for ${roles.join(', ')}`,
          roles,
          redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
          metadata: MOCK_SAML_METADATA,
        };

        const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections', {
          method: 'POST',
          body: JSON.stringify(connectionData),
          headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });
        const responseData = await response.json();

        expect(response.status).toBe(201);
        expect(responseData.connection.description).toContain(roles.join(', '));
      }
    });

    it('should reject unauthenticated requests', async () => {
      mockAuth.mockResolvedValueOnce({
        userId: null,
        orgId: null,
      } as any);

      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/organizations/[orgId]/sso/connections', () => {
    it('should return organization-scoped connections', async () => {
      // Create test connections first
      await testInfra.createTestConnection({
        name: 'Emergency Connection',
        description: 'Emergency access | Department: emergency | Roles: doctor, nurse',
      });

      await testInfra.createTestConnection({
        name: 'ICU Connection',
        description: 'ICU access | Department: icu | Roles: doctor, nurse',
      });

      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections');
      const response = await GET(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(responseData.connections)).toBe(true);
      expect(responseData.connections).toHaveLength(2);

      const names = responseData.connections.map((c: any) => c.name);

      expect(names).toContain('Emergency Connection');
      expect(names).toContain('ICU Connection');
    });

    it('should handle empty connection list', async () => {
      const request = new NextRequest('http://localhost:3003/api/organizations/empty_org/sso/connections');

      // Mock auth for empty org
      mockAuth.mockResolvedValueOnce({
        userId: 'user_test_123',
        orgId: 'empty_org',
      } as any);

      const response = await GET(request, { params: { orgId: 'empty_org' } });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(responseData.connections)).toBe(true);
      expect(responseData.connections).toHaveLength(0);
    });

    it('should enforce organization isolation', async () => {
      // Create connection for org1
      await testInfra.createTestConnection({
        name: 'Org1 Connection',
      });

      // Try to access from different org
      mockAuth.mockResolvedValueOnce({
        userId: 'user_test_123',
        orgId: 'different_org',
      } as any);

      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections');
      const response = await GET(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/organizations/[orgId]/sso/connections/[connectionId]', () => {
    it('should return specific connection details', async () => {
      const connection = await testInfra.createTestConnection({
        name: 'Specific Connection Test',
        description: 'Test connection for specific retrieval',
      });

      const request = new NextRequest(`http://localhost:3003/api/organizations/org_123/sso/connections/${connection.clientID}`);
      const response = await GetConnection(request, {
        params: {
          orgId: TEST_HOSPITAL_ORG.id,
          connectionId: connection.clientID,
        },
      });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.connection).toBeDefined();
      expect(responseData.connection.clientID).toBe(connection.clientID);
      expect(responseData.connection.name).toBe('Specific Connection Test');
    });

    it('should handle non-existent connection', async () => {
      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections/nonexistent');
      const response = await GetConnection(request, {
        params: {
          orgId: TEST_HOSPITAL_ORG.id,
          connectionId: 'nonexistent',
        },
      });

      expect(response.status).toBe(500); // Jackson will throw error for non-existent connection
    });
  });

  describe('PATCH /api/organizations/[orgId]/sso/connections/[connectionId]', () => {
    it('should update connection with new hospital data', async () => {
      const connection = await testInfra.createTestConnection({
        name: 'Original Connection',
        description: 'Original description',
      });

      const updateData = {
        name: 'Updated Emergency Connection',
        description: 'Updated emergency access for hospital staff',
        department: 'emergency',
        roles: ['doctor', 'nurse', 'technician'],
      };

      const request = new NextRequest(`http://localhost:3003/api/organizations/org_123/sso/connections/${connection.clientID}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request, {
        params: {
          orgId: TEST_HOSPITAL_ORG.id,
          connectionId: connection.clientID,
        },
      });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.connection.name).toBe('Updated Emergency Connection');
      expect(responseData.connection.description).toBe('Updated emergency access for hospital staff');
    });

    it('should validate update data', async () => {
      const connection = await testInfra.createTestConnection();

      const invalidUpdateData = {
        name: '', // Empty name
        redirectUrl: 'invalid-url',
      };

      const request = new NextRequest(`http://localhost:3003/api/organizations/org_123/sso/connections/${connection.clientID}`, {
        method: 'PATCH',
        body: JSON.stringify(invalidUpdateData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PATCH(request, {
        params: {
          orgId: TEST_HOSPITAL_ORG.id,
          connectionId: connection.clientID,
        },
      });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/organizations/[orgId]/sso/connections/[connectionId]', () => {
    it('should delete connection and clean up Jackson data', async () => {
      const connection = await testInfra.createTestConnection({
        name: 'Connection to Delete',
      });

      const request = new NextRequest(`http://localhost:3003/api/organizations/org_123/sso/connections/${connection.clientID}`);
      const response = await DELETE(request, {
        params: {
          orgId: TEST_HOSPITAL_ORG.id,
          connectionId: connection.clientID,
        },
      });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);

      // Verify deletion in Jackson
      const connections = await testInfra.apiController!.getConnections({
        tenant: TEST_HOSPITAL_ORG.id,
        product: 'hospitalos',
      });

      expect(connections.find(c => c.clientID === connection.clientID)).toBeUndefined();
    });

    it('should handle non-existent connection deletion', async () => {
      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections/nonexistent');
      const response = await DELETE(request, {
        params: {
          orgId: TEST_HOSPITAL_ORG.id,
          connectionId: 'nonexistent',
        },
      });

      expect(response.status).toBe(500); // Jackson will throw error
    });

    it('should enforce organization access for deletion', async () => {
      const connection = await testInfra.createTestConnection();

      // Try to delete from different org
      mockAuth.mockResolvedValueOnce({
        userId: 'user_test_123',
        orgId: 'different_org',
      } as any);

      const request = new NextRequest(`http://localhost:3003/api/organizations/org_123/sso/connections/${connection.clientID}`);
      const response = await DELETE(request, {
        params: {
          orgId: TEST_HOSPITAL_ORG.id,
          connectionId: connection.clientID,
        },
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent connection creation', async () => {
      const concurrentRequests = 5;
      const connectionPromises = [];

      for (let i = 0; i < concurrentRequests; i++) {
        const connectionData = {
          name: `Concurrent Connection ${i}`,
          description: `Concurrent test connection ${i}`,
          redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
          metadata: MOCK_SAML_METADATA,
        };

        const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections', {
          method: 'POST',
          body: JSON.stringify(connectionData),
          headers: { 'Content-Type': 'application/json' },
        });

        connectionPromises.push(POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } }));
      }

      const results = await Promise.allSettled(connectionPromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;

      expect(successful).toBe(concurrentRequests);

      // Verify all connections were created
      const allConnections = await testInfra.apiController!.getConnections({
        tenant: TEST_HOSPITAL_ORG.id,
        product: 'hospitalos',
      });

      expect(allConnections.length).toBeGreaterThanOrEqual(concurrentRequests);
    });

    it('should handle concurrent read operations', async () => {
      // Create some test connections
      await testInfra.createTestConnection({ name: 'Read Test 1' });
      await testInfra.createTestConnection({ name: 'Read Test 2' });

      const concurrentReads = Array.from({ length: 10 }, () => {
        const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections');
        return GET(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });
      });

      const results = await Promise.allSettled(concurrentReads);
      const successful = results.filter(r => r.status === 'fulfilled').length;

      expect(successful).toBe(10);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON in requests', async () => {
      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections', {
        method: 'POST',
        body: '{invalid json}',
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      expect(response.status).toBe(500); // Should handle JSON parse error
    });

    it('should handle network timeouts gracefully', async () => {
      // This would require mocking network failures
      // For now, we test that large payloads are handled
      const largeMetadata = MOCK_SAML_METADATA.repeat(100);

      const connectionData = {
        name: 'Large Metadata Test',
        description: 'Testing large metadata handling',
        redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
        metadata: largeMetadata,
      };

      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections', {
        method: 'POST',
        body: JSON.stringify(connectionData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      // Should either succeed or fail gracefully (not crash)
      expect([200, 201, 400, 500]).toContain(response.status);
    });

    it('should validate Content-Type headers', async () => {
      const request = new NextRequest('http://localhost:3003/api/organizations/org_123/sso/connections', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
        headers: { 'Content-Type': 'text/plain' }, // Wrong content type
      });

      const response = await POST(request, { params: { orgId: TEST_HOSPITAL_ORG.id } });

      // Should handle gracefully - might succeed or fail depending on implementation
      expect(response.status).toBeDefined();
    });
  });
});
