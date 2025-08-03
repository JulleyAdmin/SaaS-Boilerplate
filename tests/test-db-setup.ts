import { afterAll } from 'vitest';

import { db } from '@/libs/DB';
import { apiKey, auditLogs, securityEvents } from '@/models/Schema';

// Clean up test data after all tests
export const setupTestDatabase = () => {
  afterAll(async () => {
    // Clean up test data
    try {
      await db.delete(apiKey).where(true);
      await db.delete(auditLogs).where(true);
      await db.delete(securityEvents).where(true);
    } catch (error) {
      console.error('Error cleaning up test data:', error);
    }
  });
};
