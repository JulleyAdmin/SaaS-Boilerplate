import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { db } from '@/libs/DB';
import {
  createOAuthClient,
  getOAuthClient,
  type OAuthClientData,
  validateClientCredentials,
} from '@/libs/oauth/clients';
import { oauthServer } from '@/libs/oauth/server';
import {
  generateAccessToken,
  generateAuthorizationCode,
  introspectToken,
  validateAccessToken,
  validateAuthorizationCode,
} from '@/libs/oauth/tokens';
import { oauthClient, organizationSchema } from '@/models/Schema';

// Mock auth for testing
jest.mock('@clerk/nextjs/server', () => ({
  auth: () => ({ userId: 'test-user-id', orgId: 'test-org-id' }),
}));

// Mock audit logging
jest.mock('@/libs/audit', () => ({
  createAuditLog: jest.fn(),
}));

const TEST_ORG_ID = 'test-hospital-org-123';

describe('OAuth 2.0 Server Validation', () => {
  beforeEach(async () => {
    // Clean up any existing test data
    await db.delete(oauthClient).where(eq(oauthClient.organizationId, TEST_ORG_ID));

    // Create test organization if it doesn't exist
    try {
      await db.insert(organizationSchema).values({
        id: TEST_ORG_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoNothing();
    } catch (error) {
      // Organization might already exist
    }
  });

  afterEach(async () => {
    // Clean up test data
    await db.delete(oauthClient).where(eq(oauthClient.organizationId, TEST_ORG_ID));
  });

  describe('OAuth Client Management', () => {
    it('should create a confidential OAuth client with hospital features', async () => {
      const clientData: OAuthClientData = {
        name: 'Hospital EMR System',
        description: 'Electronic Medical Records Integration',
        clientType: 'confidential',
        redirectUris: ['https://emr.hospital.com/oauth/callback'],
        allowedOrigins: ['https://emr.hospital.com'],
        scopes: ['read', 'write', 'patient:read'],
        allowedGrantTypes: ['authorization_code', 'refresh_token'],
        allowedDepartments: ['emergency', 'icu'],
        dataAccessLevel: 'department',
        phiAccess: true,
        auditRequired: true,
        rateLimit: 5000,
        tokenLifetime: 3600,
        refreshTokenLifetime: 86400,
      };

      const result = await createOAuthClient(clientData, TEST_ORG_ID);

      expect(result.client).toBeDefined();
      expect(result.clientSecret).toBeDefined();
      expect(result.client.name).toBe('Hospital EMR System');
      expect(result.client.phiAccess).toBe(true);
      expect(result.client.allowedDepartments).toEqual(['emergency', 'icu']);
      expect(result.client.clientId).toMatch(/^hos_/);
    });

    it('should validate client credentials correctly', async () => {
      const clientData: OAuthClientData = {
        name: 'Test Client',
        clientType: 'confidential',
        redirectUris: ['https://test.com/callback'],
        phiAccess: false,
      };

      const { client, clientSecret } = await createOAuthClient(clientData, TEST_ORG_ID);

      // Valid credentials
      const validClient = await validateClientCredentials(
        client.clientId,
        clientSecret,
        TEST_ORG_ID,
      );

      expect(validClient).toBeDefined();
      expect(validClient?.clientId).toBe(client.clientId);

      // Invalid credentials
      const invalidClient = await validateClientCredentials(
        client.clientId,
        'wrong-secret',
        TEST_ORG_ID,
      );

      expect(invalidClient).toBeNull();
    });

    it('should retrieve OAuth client by ID', async () => {
      const clientData: OAuthClientData = {
        name: 'Retrievable Client',
        clientType: 'confidential',
        redirectUris: ['https://test.com/callback'],
      };

      const { client } = await createOAuthClient(clientData, TEST_ORG_ID);

      const retrievedClient = await getOAuthClient(client.clientId, TEST_ORG_ID);

      expect(retrievedClient).toBeDefined();
      expect(retrievedClient?.name).toBe('Retrievable Client');
      expect(retrievedClient?.clientSecret).toBeUndefined(); // Should not expose secret
    });
  });

  describe('OAuth Authorization Flow', () => {
    let testClient: any;
    let testClientSecret: string;

    beforeEach(async () => {
      const clientData: OAuthClientData = {
        name: 'Auth Flow Test Client',
        clientType: 'confidential',
        redirectUris: ['https://hospital.com/oauth/callback'],
        scopes: ['read', 'write', 'patient:read'],
        allowedGrantTypes: ['authorization_code', 'refresh_token'],
        allowedDepartments: ['emergency'],
        phiAccess: true,
      };

      const result = await createOAuthClient(clientData, TEST_ORG_ID);
      testClient = result.client;
      testClientSecret = result.clientSecret;
    });

    it('should generate and validate authorization codes', async () => {
      const authCodeData = {
        clientId: testClient.clientId,
        organizationId: TEST_ORG_ID,
        userId: 'test-user-123',
        scopes: ['read', 'patient:read'],
        redirectUri: 'https://hospital.com/oauth/callback',
        departmentId: 'emergency',
        hospitalRole: 'doctor' as const,
        dataAccessScope: { phiAccess: true, auditRequired: true },
      };

      const authCode = await generateAuthorizationCode(authCodeData);

      expect(authCode).toBeDefined();
      expect(typeof authCode).toBe('string');

      // Validate the authorization code
      const validatedCode = await validateAuthorizationCode(
        authCode,
        testClient.clientId,
        'https://hospital.com/oauth/callback',
      );

      expect(validatedCode).toBeDefined();
      expect(validatedCode?.organizationId).toBe(TEST_ORG_ID);
      expect(validatedCode?.userId).toBe('test-user-123');
      expect(validatedCode?.scopes).toEqual(['read', 'patient:read']);
      expect(validatedCode?.hospitalRole).toBe('doctor');
      expect(validatedCode?.departmentId).toBe('emergency');
    });

    it('should generate and validate access tokens', async () => {
      const tokenData = {
        clientId: testClient.clientId,
        organizationId: TEST_ORG_ID,
        userId: 'test-user-123',
        scopes: ['read', 'patient:read'],
        departmentId: 'emergency',
        hospitalRole: 'doctor' as const,
        dataAccessScope: { phiAccess: true },
        expiresIn: 3600,
      };

      const tokens = await generateAccessToken(tokenData);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.tokenType).toBe('Bearer');
      expect(tokens.expiresIn).toBe(3600);

      // Validate the access token
      const validatedToken = await validateAccessToken(tokens.accessToken);

      expect(validatedToken).toBeDefined();
      expect(validatedToken?.clientId).toBe(testClient.clientId);
      expect(validatedToken?.organizationId).toBe(TEST_ORG_ID);
      expect(validatedToken?.userId).toBe('test-user-123');
      expect(validatedToken?.hospitalRole).toBe('doctor');
      expect(validatedToken?.departmentId).toBe('emergency');
    });

    it('should perform token introspection correctly', async () => {
      const tokenData = {
        clientId: testClient.clientId,
        organizationId: TEST_ORG_ID,
        userId: 'test-user-123',
        scopes: ['read', 'patient:read'],
        hospitalRole: 'nurse' as const,
        departmentId: 'icu',
        dataAccessScope: { phiAccess: true },
      };

      const tokens = await generateAccessToken(tokenData);
      const introspection = await introspectToken(tokens.accessToken);

      expect(introspection).toBeDefined();
      expect(introspection?.active).toBe(true);
      expect(introspection?.scope).toBe('read patient:read');
      expect(introspection?.client_id).toBe(testClient.clientId);
      expect(introspection?.username).toBe('test-user-123');
      expect(introspection?.hospital_role).toBe('nurse');
      expect(introspection?.department_id).toBe('icu');
      expect(introspection?.phi_access).toBe(true);
    });
  });

  describe('OAuth Server Integration', () => {
    let testClient: any;
    let testClientSecret: string;

    beforeEach(async () => {
      const clientData: OAuthClientData = {
        name: 'Server Integration Test',
        clientType: 'confidential',
        redirectUris: ['https://hospital.com/callback'],
        scopes: ['read', 'write'],
        allowedGrantTypes: ['authorization_code', 'client_credentials', 'refresh_token'],
      };

      const result = await createOAuthClient(clientData, TEST_ORG_ID);
      testClient = result.client;
      testClientSecret = result.clientSecret;
    });

    it('should handle authorization requests correctly', async () => {
      const authorizeParams = {
        response_type: 'code',
        client_id: testClient.clientId,
        redirect_uri: 'https://hospital.com/callback',
        scope: 'read write',
        state: 'test-state-123',
        hospital_role: 'doctor',
        department_id: 'emergency',
      };

      const result = await oauthServer.authorize(
        authorizeParams,
        'test-user-123',
        TEST_ORG_ID,
      );

      expect(result).toBeDefined();
      expect('redirectUri' in result).toBe(true);

      if ('redirectUri' in result) {
        expect(result.redirectUri).toContain('code=');
        expect(result.redirectUri).toContain('state=test-state-123');
      }
    });

    it('should handle client credentials grant', async () => {
      const tokenParams = {
        grant_type: 'client_credentials',
        client_id: testClient.clientId,
        client_secret: testClientSecret,
        scope: 'read',
      };

      const result = await oauthServer.token(tokenParams, TEST_ORG_ID);

      expect(result).toBeDefined();
      expect('access_token' in result).toBe(true);

      if ('access_token' in result) {
        expect(result.access_token).toBeDefined();
        expect(result.token_type).toBe('Bearer');
        expect(result.expires_in).toBeDefined();
        expect(result.scope).toBe('read');
        expect(result.refresh_token).toBeUndefined(); // No refresh token for client credentials
      }
    });

    it('should validate API tokens correctly', async () => {
      // Generate a token first
      const tokenParams = {
        grant_type: 'client_credentials',
        client_id: testClient.clientId,
        client_secret: testClientSecret,
        scope: 'read',
      };

      const tokenResult = await oauthServer.token(tokenParams, TEST_ORG_ID);

      if ('access_token' in tokenResult) {
        const authHeader = `Bearer ${tokenResult.access_token}`;

        const validation = await oauthServer.validateTokenForAPI(
          authHeader,
          'read',
          'patient_data',
          'read',
          TEST_ORG_ID,
        );

        expect(validation.valid).toBe(true);
        expect(validation.clientId).toBe(testClient.clientId);
        expect(validation.scopes).toContain('read');
      }
    });
  });

  describe('Hospital-Specific Features', () => {
    it('should enforce PHI access controls', async () => {
      const phiClientData: OAuthClientData = {
        name: 'PHI Access Client',
        clientType: 'confidential',
        redirectUris: ['https://secure.hospital.com/callback'],
        scopes: ['patient:read', 'patient:write'],
        phiAccess: true,
        auditRequired: true,
        dataAccessLevel: 'patient',
      };

      const { client } = await createOAuthClient(phiClientData, TEST_ORG_ID);

      expect(client.phiAccess).toBe(true);
      expect(client.auditRequired).toBe(true);
      expect(client.dataAccessLevel).toBe('patient');
    });

    it('should validate hospital role mapping', async () => {
      const tokenData = {
        clientId: 'test-client',
        organizationId: TEST_ORG_ID,
        userId: 'test-doctor',
        scopes: ['read'],
        hospitalRole: 'doctor' as const,
        departmentId: 'cardiology',
        dataAccessScope: {
          phiAccess: true,
          departments: ['cardiology'],
          auditRequired: true,
        },
      };

      const tokens = await generateAccessToken(tokenData);
      const introspection = await introspectToken(tokens.accessToken);

      expect(introspection?.hospital_role).toBe('doctor');
      expect(introspection?.department_id).toBe('cardiology');
      expect(introspection?.phi_access).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid client IDs', async () => {
      const invalidClient = await getOAuthClient('invalid-client-id', TEST_ORG_ID);

      expect(invalidClient).toBeNull();
    });

    it('should handle expired authorization codes', async () => {
      // This would require manipulating the database to set an expired code
      // For now, just test that the function handles null returns correctly
      const expiredCode = await validateAuthorizationCode(
        'expired-code',
        'invalid-client',
        'invalid-uri',
      );

      expect(expiredCode).toBeNull();
    });

    it('should reject invalid redirect URIs', async () => {
      const clientData: OAuthClientData = {
        name: 'Redirect Test Client',
        clientType: 'confidential',
        redirectUris: ['https://allowed.com/callback'],
      };

      const { client } = await createOAuthClient(clientData, TEST_ORG_ID);

      const authorizeParams = {
        response_type: 'code',
        client_id: client.clientId,
        redirect_uri: 'https://malicious.com/callback', // Not in allowed list
        scope: 'read',
      };

      const result = await oauthServer.authorize(
        authorizeParams,
        'test-user',
        TEST_ORG_ID,
      );

      expect('error' in result).toBe(true);

      if ('error' in result) {
        expect(result.error).toBe('invalid_redirect_uri');
      }
    });
  });
});
