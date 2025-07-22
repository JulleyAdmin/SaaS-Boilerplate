import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/libs/DB';
import { apiKey } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import {
  createApiKey,
  fetchApiKeys,
  deleteApiKey,
  validateApiKey,
  verifyApiKeyOwnership,
} from '@/models/apiKey';

describe('API Key Management Integration Tests', () => {
  const testOrgId = 'test_org_123';
  let createdKeyIds: string[] = [];

  // Clean up after each test
  afterEach(async () => {
    // Delete all test keys
    for (const id of createdKeyIds) {
      try {
        await db.delete(apiKey).where(eq(apiKey.id, id));
      } catch (error) {
        // Ignore errors if key already deleted
      }
    }
    createdKeyIds = [];
  });

  describe('createApiKey', () => {
    it('should create a new API key with hashed storage', async () => {
      const { apiKey: newKey, plainKey } = await createApiKey({
        name: 'Test API Key',
        organizationId: testOrgId,
      });

      expect(newKey.id).toBeDefined();
      expect(newKey.name).toBe('Test API Key');
      expect(newKey.organizationId).toBe(testOrgId);
      expect(plainKey).toMatch(/^sk_[a-f0-9]{48}$/);
      
      // Store for cleanup
      createdKeyIds.push(newKey.id);

      // Verify key is stored with hash
      const [storedKey] = await db
        .select()
        .from(apiKey)
        .where(eq(apiKey.id, newKey.id));
      
      expect(storedKey.hashedKey).toBeDefined();
      expect(storedKey.hashedKey).not.toBe(plainKey); // Should be hashed
    });

    it('should create API key with expiration date', async () => {
      const expiryDate = new Date('2025-12-31');
      const { apiKey: newKey } = await createApiKey({
        name: 'Expiring Key',
        organizationId: testOrgId,
        expiresAt: expiryDate,
      });

      expect(newKey.expiresAt).toEqual(expiryDate);
      createdKeyIds.push(newKey.id);
    });
  });

  describe('fetchApiKeys', () => {
    it('should fetch all API keys for an organization', async () => {
      // Create multiple keys
      const key1 = await createApiKey({
        name: 'Key 1',
        organizationId: testOrgId,
      });
      const key2 = await createApiKey({
        name: 'Key 2',
        organizationId: testOrgId,
      });
      
      createdKeyIds.push(key1.apiKey.id, key2.apiKey.id);

      // Create a key for different org
      const otherKey = await createApiKey({
        name: 'Other Org Key',
        organizationId: 'other_org',
      });
      createdKeyIds.push(otherKey.apiKey.id);

      // Fetch keys for test org
      const keys = await fetchApiKeys(testOrgId);

      expect(keys.length).toBe(2);
      expect(keys.map(k => k.name)).toContain('Key 1');
      expect(keys.map(k => k.name)).toContain('Key 2');
      expect(keys.map(k => k.name)).not.toContain('Other Org Key');
      
      // Verify no sensitive data is exposed
      keys.forEach(key => {
        expect(key).not.toHaveProperty('hashedKey');
      });
    });

    it('should return empty array for organization with no keys', async () => {
      const keys = await fetchApiKeys('org_with_no_keys');
      expect(keys).toEqual([]);
    });
  });

  describe('validateApiKey', () => {
    it('should validate a correct API key', async () => {
      const { apiKey: newKey, plainKey } = await createApiKey({
        name: 'Valid Key',
        organizationId: testOrgId,
      });
      createdKeyIds.push(newKey.id);

      const validatedKey = await validateApiKey(plainKey);

      expect(validatedKey).toBeDefined();
      expect(validatedKey?.id).toBe(newKey.id);
      expect(validatedKey?.lastUsedAt).toBeDefined(); // Should update last used
    });

    it('should reject invalid API key', async () => {
      const validatedKey = await validateApiKey('sk_invalid_key_12345');
      expect(validatedKey).toBeNull();
    });

    it('should reject expired API key', async () => {
      const { plainKey } = await createApiKey({
        name: 'Expired Key',
        organizationId: testOrgId,
        expiresAt: new Date('2020-01-01'), // Past date
      });

      const validatedKey = await validateApiKey(plainKey);
      expect(validatedKey).toBeNull();
    });
  });

  describe('deleteApiKey', () => {
    it('should delete an API key', async () => {
      const { apiKey: newKey } = await createApiKey({
        name: 'Key to Delete',
        organizationId: testOrgId,
      });

      await deleteApiKey(newKey.id);

      const keys = await fetchApiKeys(testOrgId);
      expect(keys.find(k => k.id === newKey.id)).toBeUndefined();
    });
  });

  describe('verifyApiKeyOwnership', () => {
    it('should verify correct ownership', async () => {
      const { apiKey: newKey } = await createApiKey({
        name: 'Owned Key',
        organizationId: testOrgId,
      });
      createdKeyIds.push(newKey.id);

      const isOwner = await verifyApiKeyOwnership(newKey.id, testOrgId);
      expect(isOwner).toBe(true);
    });

    it('should reject incorrect ownership', async () => {
      const { apiKey: newKey } = await createApiKey({
        name: 'Other Org Key',
        organizationId: 'other_org',
      });
      createdKeyIds.push(newKey.id);

      const isOwner = await verifyApiKeyOwnership(newKey.id, testOrgId);
      expect(isOwner).toBe(false);
    });

    it('should return false for non-existent key', async () => {
      const isOwner = await verifyApiKeyOwnership('non_existent_id', testOrgId);
      expect(isOwner).toBe(false);
    });
  });

  describe('API Key Security', () => {
    it('should never expose plain keys after creation', async () => {
      const { apiKey: newKey, plainKey } = await createApiKey({
        name: 'Security Test Key',
        organizationId: testOrgId,
      });
      createdKeyIds.push(newKey.id);

      // Fetch the key
      const keys = await fetchApiKeys(testOrgId);
      const fetchedKey = keys.find(k => k.id === newKey.id);

      // Verify plain key is not accessible
      expect(fetchedKey).toBeDefined();
      expect(JSON.stringify(fetchedKey)).not.toContain(plainKey);
    });

    it('should handle concurrent key creation', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        createApiKey({
          name: `Concurrent Key ${i}`,
          organizationId: testOrgId,
        })
      );

      const results = await Promise.all(promises);
      
      // Store for cleanup
      results.forEach(r => createdKeyIds.push(r.apiKey.id));

      // All should succeed
      expect(results.length).toBe(5);
      
      // All should have unique IDs
      const ids = results.map(r => r.apiKey.id);
      expect(new Set(ids).size).toBe(5);
    });
  });
});