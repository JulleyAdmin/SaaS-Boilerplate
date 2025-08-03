import { createHash, randomBytes } from 'node:crypto';

import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { apiKey } from '@/models/Schema';

export type ApiKey = typeof apiKey.$inferSelect;
export type CreateApiKeyParams = typeof apiKey.$inferInsert;

export type ApiKeyWithoutSensitive = Omit<ApiKey, 'hashedKey'>;

// Generate a secure API key and return both hashed and plaintext versions
export const generateApiKey = (): [string, string] => {
  const plainKey = `sk_${randomBytes(24).toString('hex')}`;
  const hashedKey = createHash('sha256').update(plainKey).digest('hex');
  return [hashedKey, plainKey];
};

// Hash an API key for storage/comparison
export const hashApiKey = (apiKey: string): string => {
  return createHash('sha256').update(apiKey).digest('hex');
};

// Create a new API key
export const createApiKey = async (params: {
  name: string;
  organizationId: string;
  expiresAt?: Date;
}): Promise<{ apiKey: ApiKeyWithoutSensitive; plainKey: string }> => {
  const [hashedKey, plainKey] = generateApiKey();

  const [newApiKey] = await db
    .insert(apiKey)
    .values({
      name: params.name,
      organizationId: params.organizationId,
      hashedKey,
      expiresAt: params.expiresAt,
    })
    .returning();

  // Return API key without sensitive data
  const { hashedKey: _, ...apiKeyWithoutSensitive } = newApiKey;

  return {
    apiKey: apiKeyWithoutSensitive,
    plainKey,
  };
};

// Fetch all API keys for an organization (without sensitive data)
export const fetchApiKeys = async (
  organizationId: string,
): Promise<ApiKeyWithoutSensitive[]> => {
  const keys = await db
    .select({
      id: apiKey.id,
      name: apiKey.name,
      organizationId: apiKey.organizationId,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt,
      expiresAt: apiKey.expiresAt,
      lastUsedAt: apiKey.lastUsedAt,
    })
    .from(apiKey)
    .where(eq(apiKey.organizationId, organizationId))
    .orderBy(desc(apiKey.createdAt));

  return keys;
};

// Delete an API key by ID
export const deleteApiKey = async (organizationId: string, id: string): Promise<boolean> => {
  const result = await db
    .delete(apiKey)
    .where(and(eq(apiKey.organizationId, organizationId), eq(apiKey.id, id)));

  return true;
};

// Get API key by hashed key (for authentication)
export const getApiKeyByHash = async (
  hashedKey: string,
): Promise<ApiKey | null> => {
  const [key] = await db
    .select()
    .from(apiKey)
    .where(eq(apiKey.hashedKey, hashedKey))
    .limit(1);

  return key || null;
};

// Get API key by ID (for access control)
export const getApiKeyById = async (id: string): Promise<ApiKey | null> => {
  const [key] = await db.select().from(apiKey).where(eq(apiKey.id, id)).limit(1);

  return key || null;
};

// Get API key by organization and ID
export const getApiKey = async (organizationId: string, id: string): Promise<ApiKey | null> => {
  const [key] = await db
    .select()
    .from(apiKey)
    .where(and(eq(apiKey.organizationId, organizationId), eq(apiKey.id, id)))
    .limit(1);

  return key || null;
};

// Validate API key and update last used timestamp
export const validateApiKey = async (
  plainKey: string,
): Promise<ApiKey | null> => {
  const hashedKey = hashApiKey(plainKey);
  const key = await getApiKeyByHash(hashedKey);

  if (!key) {
    return null;
  }

  // Check if key is expired
  if (key.expiresAt && key.expiresAt < new Date()) {
    return null;
  }

  // Update last used timestamp
  await db
    .update(apiKey)
    .set({
      lastUsedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(apiKey.id, key.id));

  return key;
};

// Update API key last used timestamp
export const updateApiKeyLastUsed = async (id: string): Promise<void> => {
  await db
    .update(apiKey)
    .set({
      lastUsedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(apiKey.id, id));
};

// Check if API key belongs to organization
export const verifyApiKeyOwnership = async (
  apiKeyId: string,
  organizationId: string,
): Promise<boolean> => {
  const [key] = await db
    .select()
    .from(apiKey)
    .where(and(eq(apiKey.id, apiKeyId), eq(apiKey.organizationId, organizationId)))
    .limit(1);

  return !!key;
};
