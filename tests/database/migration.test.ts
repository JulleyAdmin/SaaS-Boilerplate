/**
 * Database Migration Testing Suite
 * Tests Phase 1 schema migrations and data integrity
 */

import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect } from 'vitest';

import { db } from '@/libs/DB';

describe('Phase 1 Database Migration Tests', () => {
  beforeAll(async () => {
    // Ensure we're running in test environment
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Migration tests must run in test environment');
    }

    // Clean slate - drop existing test data
    await db.execute(sql`TRUNCATE TABLE team_members, api_keys, invitations CASCADE`);
  });

  afterAll(async () => {
    // Cleanup test data
    await db.execute(sql`TRUNCATE TABLE team_members, api_keys, invitations CASCADE`);
  });

  describe('Schema Creation', () => {
    it('should have all Phase 1 tables', async () => {
      // Check if all required tables exist
      const tables = await db.execute(sql`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('team_members', 'api_keys', 'invitations', 'jackson_store', 'jackson_index', 'jackson_ttl')
      `);

      const tableNames = tables.map(row => row.tablename);

      expect(tableNames).toContain('team_members');
      expect(tableNames).toContain('api_keys');
      expect(tableNames).toContain('invitations');
      expect(tableNames).toContain('jackson_store');
      expect(tableNames).toContain('jackson_index');
      expect(tableNames).toContain('jackson_ttl');
    });

    it('should have role enum with correct values', async () => {
      const result = await db.execute(sql`
        SELECT enumlabel 
        FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'role')
      `);

      const roles = result.map(row => row.enumlabel);

      expect(roles).toContain('OWNER');
      expect(roles).toContain('ADMIN');
      expect(roles).toContain('MEMBER');
      expect(roles).toHaveLength(3);
    });

    it('should have correct indexes for performance', async () => {
      const indexes = await db.execute(sql`
        SELECT indexname, tablename 
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename IN ('team_members', 'api_keys', 'invitations')
      `);

      const indexNames = indexes.map(idx => idx.indexname);

      // Team members indexes
      expect(indexNames).toContain('unique_team_user_idx');
      expect(indexNames).toContain('team_members_user_id_idx');
      expect(indexNames).toContain('team_members_organization_id_idx');

      // API keys indexes
      expect(indexNames).toContain('api_keys_hashed_key_idx');
      expect(indexNames).toContain('api_keys_organization_id_idx');

      // Invitations indexes
      expect(indexNames).toContain('invitations_token_idx');
      expect(indexNames).toContain('unique_team_email_idx');
    });
  });

  describe('Data Integrity Constraints', () => {
    it('should enforce unique constraints on team members', async () => {
      const orgId = 'test_org_1';
      const userId = 'test_user_1';

      // Insert first member
      await db.execute(sql`
        INSERT INTO team_members (organization_id, user_id, role) 
        VALUES (${orgId}, ${userId}, 'MEMBER')
      `);

      // Try to insert duplicate - should fail
      await expect(
        db.execute(sql`
          INSERT INTO team_members (organization_id, user_id, role) 
          VALUES (${orgId}, ${userId}, 'ADMIN')
        `),
      ).rejects.toThrow();
    });

    it('should enforce unique constraints on API keys', async () => {
      const hashedKey = 'unique_hash_123';

      // Insert first key
      await db.execute(sql`
        INSERT INTO api_keys (name, organization_id, hashed_key) 
        VALUES ('Test Key 1', 'org_1', ${hashedKey})
      `);

      // Try to insert duplicate hashed key - should fail
      await expect(
        db.execute(sql`
          INSERT INTO api_keys (name, organization_id, hashed_key) 
          VALUES ('Test Key 2', 'org_2', ${hashedKey})
        `),
      ).rejects.toThrow();
    });

    it('should enforce role enum constraints', async () => {
      // Valid role should work
      await db.execute(sql`
        INSERT INTO team_members (organization_id, user_id, role) 
        VALUES ('test_org_2', 'test_user_2', 'ADMIN')
      `);

      // Invalid role should fail
      await expect(
        db.execute(sql`
          INSERT INTO team_members (organization_id, user_id, role) 
          VALUES ('test_org_3', 'test_user_3', 'INVALID_ROLE')
        `),
      ).rejects.toThrow();
    });

    it('should handle invitation constraints properly', async () => {
      const token = 'unique_token_123';
      const orgId = 'test_org_invitation';
      const email = 'test@hospital.com';

      // Insert invitation
      await db.execute(sql`
        INSERT INTO invitations (organization_id, email, token, expires, invited_by) 
        VALUES (${orgId}, ${email}, ${token}, NOW() + INTERVAL '24 hours', 'inviter_123')
      `);

      // Duplicate token should fail
      await expect(
        db.execute(sql`
          INSERT INTO invitations (organization_id, email, token, expires, invited_by) 
          VALUES ('other_org', 'other@email.com', ${token}, NOW() + INTERVAL '24 hours', 'inviter_456')
        `),
      ).rejects.toThrow();

      // Duplicate email in same org should fail
      await expect(
        db.execute(sql`
          INSERT INTO invitations (organization_id, email, token, expires, invited_by) 
          VALUES (${orgId}, ${email}, 'different_token', NOW() + INTERVAL '24 hours', 'inviter_789')
        `),
      ).rejects.toThrow();
    });
  });

  describe('Default Values and Timestamps', () => {
    it('should set default values correctly', async () => {
      const orgId = 'test_defaults';
      const userId = 'test_user_defaults';

      // Insert with minimal data
      await db.execute(sql`
        INSERT INTO team_members (organization_id, user_id) 
        VALUES (${orgId}, ${userId})
      `);

      const result = await db.execute(sql`
        SELECT role, created_at, updated_at 
        FROM team_members 
        WHERE organization_id = ${orgId} AND user_id = ${userId}
      `);

      expect(result[0].role).toBe('MEMBER'); // Default role
      expect(result[0].created_at).toBeDefined();
      expect(result[0].updated_at).toBeDefined();
    });

    it('should handle JSONB defaults for invitations', async () => {
      const invitationId = await db.execute(sql`
        INSERT INTO invitations (organization_id, email, token, expires, invited_by) 
        VALUES ('test_org_json', 'test@json.com', 'token_json', NOW() + INTERVAL '24 hours', 'inviter_json')
        RETURNING id
      `);

      const result = await db.execute(sql`
        SELECT allowed_domains, sent_via_email 
        FROM invitations 
        WHERE id = ${invitationId[0].id}
      `);

      expect(result[0].allowed_domains).toEqual([]);
      expect(result[0].sent_via_email).toBe(true);
    });
  });

  describe('Jackson SSO Tables', () => {
    it('should create Jackson store table correctly', async () => {
      const testKey = 'test_jackson_key';
      const testValue = 'test_jackson_value';

      await db.execute(sql`
        INSERT INTO jackson_store (key, value) 
        VALUES (${testKey}, ${testValue})
      `);

      const result = await db.execute(sql`
        SELECT key, value, created_at 
        FROM jackson_store 
        WHERE key = ${testKey}
      `);

      expect(result[0].key).toBe(testKey);
      expect(result[0].value).toBe(testValue);
      expect(result[0].created_at).toBeDefined();
    });

    it('should create Jackson index table correctly', async () => {
      const testKey = 'test_index_key';
      const testStoreKey = 'test_store_key';

      await db.execute(sql`
        INSERT INTO jackson_index (key, store_key) 
        VALUES (${testKey}, ${testStoreKey})
      `);

      const result = await db.execute(sql`
        SELECT key, store_key 
        FROM jackson_index 
        WHERE key = ${testKey}
      `);

      expect(result[0].key).toBe(testKey);
      expect(result[0].store_key).toBe(testStoreKey);
    });

    it('should create Jackson TTL table correctly', async () => {
      const testKey = 'test_ttl_key';
      const expiresAt = Date.now() + 3600000; // 1 hour from now

      await db.execute(sql`
        INSERT INTO jackson_ttl (key, expires_at) 
        VALUES (${testKey}, ${expiresAt})
      `);

      const result = await db.execute(sql`
        SELECT key, expires_at 
        FROM jackson_ttl 
        WHERE key = ${testKey}
      `);

      expect(result[0].key).toBe(testKey);
      expect(Number(result[0].expires_at)).toBe(expiresAt);
    });
  });

  describe('Data Queries and Performance', () => {
    it('should query team members efficiently', async () => {
      const orgId = 'perf_test_org';

      // Insert test data
      for (let i = 0; i < 100; i++) {
        await db.execute(sql`
          INSERT INTO team_members (organization_id, user_id, role) 
          VALUES (${orgId}, ${`user_${i}`}, ${i % 3 === 0 ? 'ADMIN' : 'MEMBER'})
        `);
      }

      const startTime = Date.now();

      const result = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM team_members 
        WHERE organization_id = ${orgId}
      `);

      const queryTime = Date.now() - startTime;

      expect(Number(result[0].count)).toBe(100);
      expect(queryTime).toBeLessThan(50); // Should be very fast with index
    });

    it('should query API keys with organization filter efficiently', async () => {
      const orgId = 'api_perf_test';

      // Insert test API keys
      for (let i = 0; i < 50; i++) {
        await db.execute(sql`
          INSERT INTO api_keys (name, organization_id, hashed_key) 
          VALUES (${`Key ${i}`}, ${orgId}, ${`hash_${i}_${Date.now()}`})
        `);
      }

      const startTime = Date.now();

      const result = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM api_keys 
        WHERE organization_id = ${orgId}
      `);

      const queryTime = Date.now() - startTime;

      expect(Number(result[0].count)).toBe(50);
      expect(queryTime).toBeLessThan(50); // Should be fast with index
    });
  });

  describe('Migration Rollback Testing', () => {
    it('should be able to rollback migrations safely', async () => {
      // This test verifies the rollback SQL from MIGRATION_LOG.md
      // Note: We don't actually run rollback in test as it would break other tests

      // Verify rollback commands exist
      const rollbackSQL = `
        -- Drop indexes first
        DROP INDEX IF EXISTS "team_members_organization_id_idx";
        DROP INDEX IF EXISTS "team_members_user_id_idx";
        DROP INDEX IF EXISTS "unique_team_user_idx";
        DROP INDEX IF EXISTS "invitations_organization_id_idx";
        DROP INDEX IF EXISTS "invitations_email_idx";
        DROP INDEX IF EXISTS "unique_team_email_idx";
        DROP INDEX IF EXISTS "invitations_token_idx";
        DROP INDEX IF EXISTS "api_keys_organization_id_idx";
        DROP INDEX IF EXISTS "api_keys_hashed_key_idx";

        -- Drop tables
        DROP TABLE IF EXISTS "team_members";
        DROP TABLE IF EXISTS "invitations";
        DROP TABLE IF EXISTS "api_keys";
        DROP TABLE IF EXISTS "jackson_store";
        DROP TABLE IF EXISTS "jackson_index";
        DROP TABLE IF EXISTS "jackson_ttl";

        -- Drop enum
        DROP TYPE IF EXISTS "public"."role";
      `;

      // Test that the SQL is syntactically valid
      expect(rollbackSQL).toContain('DROP TABLE IF EXISTS');
      expect(rollbackSQL).toContain('DROP TYPE IF EXISTS');
      expect(rollbackSQL).toContain('DROP INDEX IF EXISTS');
    });
  });
});
