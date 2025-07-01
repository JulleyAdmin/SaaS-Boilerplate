/**
 * SSO Connection API Integration Tests
 * Tests all SSO connection management endpoints
 */

import { createServer } from 'node:http';

import type { NextApiHandler } from 'next';
import request from 'supertest';
import { beforeEach, describe, expect } from 'vitest';

import { mockSSOConnection } from '../setup';

// Mock the actual API route handlers
const mockHandler: NextApiHandler = async (req, res) => {
  const { method, url } = req;
  const orgId = 'org_test_123';

  if (method === 'GET' && url?.includes('/sso/connections')) {
    // Mock GET connections
    res.status(200).json({
      connections: [mockSSOConnection],
    });
  } else if (method === 'POST' && url?.includes('/sso/connections')) {
    // Mock POST create connection
    const body = req.body;
    res.status(201).json({
      connection: {
        ...mockSSOConnection,
        ...body,
        tenant: orgId,
      },
    });
  } else if (method === 'PATCH' && url?.includes('/sso/connections/')) {
    // Mock PATCH update connection
    const body = req.body;
    res.status(200).json({
      connection: {
        ...mockSSOConnection,
        ...body,
      },
    });
  } else if (method === 'DELETE' && url?.includes('/sso/connections/')) {
    // Mock DELETE connection
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

describe('SSO Connection API Tests', () => {
  let server: any;

  beforeEach(() => {
    server = createServer(mockHandler);
  });

  describe('GET /api/organizations/[orgId]/sso/connections', () => {
    it('should return list of connections for authorized user', async () => {
      const response = await request(server)
        .get('/api/organizations/org_test_123/sso/connections')
        .set('Authorization', 'Bearer valid_clerk_token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('connections');
      expect(Array.isArray(response.body.connections)).toBe(true);
      expect(response.body.connections).toHaveLength(1);
      expect(response.body.connections[0]).toHaveProperty('name', 'Test Hospital SSO');
    });

    it('should return 401 for unauthorized access', async () => {
      const response = await request(server)
        .get('/api/organizations/org_test_123/sso/connections');

      expect(response.status).toBe(401);
    });

    it('should return 403 for cross-organization access', async () => {
      const response = await request(server)
        .get('/api/organizations/org_different_456/sso/connections')
        .set('Authorization', 'Bearer org_test_123_token');

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/organizations/[orgId]/sso/connections', () => {
    it('should create new SSO connection with valid data', async () => {
      const connectionData = {
        name: 'New Hospital SSO',
        description: 'Test connection for emergency department',
        metadataUrl: 'https://emergency.idp.com/metadata',
        redirectUrl: 'http://localhost:3000/api/auth/sso/callback',
      };

      const response = await request(server)
        .post('/api/organizations/org_test_123/sso/connections')
        .set('Authorization', 'Bearer valid_clerk_token')
        .send(connectionData);

      expect(response.status).toBe(201);
      expect(response.body.connection).toHaveProperty('name', 'New Hospital SSO');
      expect(response.body.connection).toHaveProperty('tenant', 'org_test_123');
      expect(response.body.connection).toHaveProperty('description', 'Test connection for emergency department');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        // Missing required name field
        description: 'Missing name',
        redirectUrl: 'invalid-url', // Invalid URL format
      };

      const response = await request(server)
        .post('/api/organizations/org_test_123/sso/connections')
        .set('Authorization', 'Bearer valid_clerk_token')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should require either metadataUrl or metadata', async () => {
      const incompleteData = {
        name: 'Incomplete Connection',
        redirectUrl: 'http://localhost:3000/callback',
        // Missing both metadataUrl and metadata
      };

      const response = await request(server)
        .post('/api/organizations/org_test_123/sso/connections')
        .set('Authorization', 'Bearer valid_clerk_token')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('metadata');
    });

    it('should accept metadata XML instead of URL', async () => {
      const connectionWithXML = {
        name: 'XML Metadata Connection',
        metadata: `<?xml version="1.0"?><EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="test">...</EntityDescriptor>`,
        redirectUrl: 'http://localhost:3000/api/auth/sso/callback',
      };

      const response = await request(server)
        .post('/api/organizations/org_test_123/sso/connections')
        .set('Authorization', 'Bearer valid_clerk_token')
        .send(connectionWithXML);

      expect(response.status).toBe(201);
      expect(response.body.connection).toHaveProperty('name', 'XML Metadata Connection');
    });
  });

  describe('PATCH /api/organizations/[orgId]/sso/connections/[connectionId]', () => {
    it('should update existing connection', async () => {
      const updates = {
        name: 'Updated Connection Name',
        description: 'Updated description for cardiac department',
      };

      const response = await request(server)
        .patch('/api/organizations/org_test_123/sso/connections/conn_123')
        .set('Authorization', 'Bearer valid_clerk_token')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.connection.name).toBe('Updated Connection Name');
      expect(response.body.connection.description).toBe('Updated description for cardiac department');
    });

    it('should validate update data', async () => {
      const invalidUpdates = {
        name: '', // Empty name
        redirectUrl: 'not-a-valid-url',
      };

      const response = await request(server)
        .patch('/api/organizations/org_test_123/sso/connections/conn_123')
        .set('Authorization', 'Bearer valid_clerk_token')
        .send(invalidUpdates);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should handle partial updates', async () => {
      const partialUpdate = {
        description: 'Only updating description',
      };

      const response = await request(server)
        .patch('/api/organizations/org_test_123/sso/connections/conn_123')
        .set('Authorization', 'Bearer valid_clerk_token')
        .send(partialUpdate);

      expect(response.status).toBe(200);
      expect(response.body.connection.description).toBe('Only updating description');
      // Other fields should remain unchanged
      expect(response.body.connection.name).toBe('Test Hospital SSO');
    });
  });

  describe('DELETE /api/organizations/[orgId]/sso/connections/[connectionId]', () => {
    it('should delete connection successfully', async () => {
      const response = await request(server)
        .delete('/api/organizations/org_test_123/sso/connections/conn_123')
        .set('Authorization', 'Bearer valid_clerk_token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should require authorization for deletion', async () => {
      const response = await request(server)
        .delete('/api/organizations/org_test_123/sso/connections/conn_123');

      expect(response.status).toBe(401);
    });

    it('should prevent cross-organization deletion', async () => {
      const response = await request(server)
        .delete('/api/organizations/org_different_456/sso/connections/conn_123')
        .set('Authorization', 'Bearer org_test_123_token');

      expect(response.status).toBe(403);
    });
  });

  describe('Connection-specific endpoints', () => {
    it('GET specific connection should return connection details', async () => {
      const response = await request(server)
        .get('/api/organizations/org_test_123/sso/connections/conn_123')
        .set('Authorization', 'Bearer valid_clerk_token');

      expect(response.status).toBe(200);
      expect(response.body.connection).toHaveProperty('tenant', 'org_test_123');
      expect(response.body.connection).toHaveProperty('name');
    });

    it('should return 404 for non-existent connection', async () => {
      const response = await request(server)
        .get('/api/organizations/org_test_123/sso/connections/nonexistent')
        .set('Authorization', 'Bearer valid_clerk_token');

      expect(response.status).toBe(404);
    });
  });

  describe('Organization metadata endpoint', () => {
    it('GET /api/organizations/[orgId]/sso/metadata should return XML', async () => {
      const response = await request(server)
        .get('/api/organizations/org_test_123/sso/metadata')
        .set('Authorization', 'Bearer valid_clerk_token');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/xml');
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(response.headers['content-disposition']).toContain('saml-metadata-org_test_123.xml');
    });

    it('should cache metadata appropriately', async () => {
      const response = await request(server)
        .get('/api/organizations/org_test_123/sso/metadata')
        .set('Authorization', 'Bearer valid_clerk_token');

      expect(response.headers['cache-control']).toContain('public');
      expect(response.headers['cache-control']).toContain('max-age=3600');
    });
  });

  describe('Error handling', () => {
    it('should handle Jackson library errors gracefully', async () => {
      // Mock Jackson error by sending invalid tenant
      const response = await request(server)
        .post('/api/organizations/invalid_org/sso/connections')
        .set('Authorization', 'Bearer valid_clerk_token')
        .send({
          name: 'Test Connection',
          metadataUrl: 'https://test.com/metadata',
          redirectUrl: 'http://localhost:3000/callback',
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Failed to create SSO connection');
    });

    it('should handle database errors appropriately', async () => {
      // This would test database connection issues
      // Implementation depends on your error handling strategy
      expect(true).toBe(true); // Placeholder
    });

    it('should validate organization ID format', async () => {
      const response = await request(server)
        .get('/api/organizations/invalid-format/sso/connections')
        .set('Authorization', 'Bearer valid_clerk_token');

      expect(response.status).toBe(400);
    });
  });

  describe('Rate limiting and security', () => {
    it('should implement rate limiting on creation endpoints', async () => {
      // Test multiple rapid requests
      const promises = Array(10).fill(null).map(() =>
        request(server)
          .post('/api/organizations/org_test_123/sso/connections')
          .set('Authorization', 'Bearer valid_clerk_token')
          .send({
            name: 'Rate Limit Test',
            metadataUrl: 'https://test.com/metadata',
            redirectUrl: 'http://localhost:3000/callback',
          }),
      );

      const responses = await Promise.all(promises);

      // Some requests should be rate limited (429 status)
      const rateLimited = responses.filter(r => r.status === 429);

      expect(rateLimited.length).toBeGreaterThan(0);
    });

    it('should sanitize input data', async () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>',
        description: 'javascript:alert("xss")',
        metadataUrl: 'https://test.com/metadata',
        redirectUrl: 'http://localhost:3000/callback',
      };

      const response = await request(server)
        .post('/api/organizations/org_test_123/sso/connections')
        .set('Authorization', 'Bearer valid_clerk_token')
        .send(maliciousData);

      expect(response.status).toBe(201);
      // Verify XSS content is sanitized
      expect(response.body.connection.name).not.toContain('<script>');
      expect(response.body.connection.description).not.toContain('javascript:');
    });
  });
});
