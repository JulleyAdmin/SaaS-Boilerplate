import crypto from 'node:crypto';

import { auth } from '@clerk/nextjs/server';
import bcrypt from 'bcryptjs';
import { and, eq, isNull } from 'drizzle-orm';

import { createAuditLog } from '@/libs/audit';
import { db } from '@/libs/DB';
import { oauthClient, oauthClientPermission } from '@/models/Schema';

export type OAuthClientData = {
  name: string;
  description?: string;
  clientType: 'confidential' | 'public';
  redirectUris: string[];
  allowedOrigins?: string[];
  scopes?: string[];
  allowedGrantTypes?: string[];
  allowedDepartments?: string[];
  dataAccessLevel?: string;
  phiAccess?: boolean;
  auditRequired?: boolean;
  rateLimit?: number;
  tokenLifetime?: number;
  refreshTokenLifetime?: number;
  logoUrl?: string;
  homepageUrl?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
};

export type OAuthClientPermission = {
  scope: string;
  resource: string;
  action: string;
  departmentRestrictions?: string[];
  dataClassification?: string;
  phiAccessLevel?: string;
  description?: string;
  riskLevel?: string;
  complianceRequired?: boolean;
  expiresAt?: Date;
};

export type OAuthClient = {
  id: string;
  organizationId: string;
  clientId: string;
  clientSecret?: string;
  name: string;
  description?: string;
  clientType: string;
  redirectUris: string[];
  allowedOrigins: string[];
  scopes: string[];
  allowedGrantTypes: string[];
  allowedDepartments: string[];
  dataAccessLevel: string;
  phiAccess: boolean;
  auditRequired: boolean;
  rateLimit: number;
  tokenLifetime: number;
  refreshTokenLifetime: number;
  logoUrl?: string;
  homepageUrl?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  isActive: boolean;
  lastUsedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Generate secure client credentials
 */
function generateClientCredentials(): { clientId: string; clientSecret: string } {
  const clientId = `hos_${crypto.randomBytes(16).toString('hex')}`;
  const clientSecret = crypto.randomBytes(32).toString('base64url');

  return { clientId, clientSecret };
}

/**
 * Hash client secret
 */
async function hashClientSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, 12);
}

/**
 * Verify client secret
 */
async function verifyClientSecret(secret: string, hashedSecret: string): Promise<boolean> {
  return bcrypt.compare(secret, hashedSecret);
}

/**
 * Create OAuth client
 */
export async function createOAuthClient(
  clientData: OAuthClientData,
  organizationId: string,
): Promise<{ client: OAuthClient; clientSecret: string }> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User authentication required');
  }

  // Generate client credentials
  const { clientId, clientSecret } = generateClientCredentials();
  const hashedSecret = await hashClientSecret(clientSecret);

  // Default scopes for hospital context
  const defaultScopes = ['read', 'write'];
  const defaultGrantTypes = ['authorization_code', 'refresh_token'];

  // Validate redirect URIs
  if (!clientData.redirectUris.length) {
    throw new Error('At least one redirect URI is required');
  }

  // Validate PHI access requirements
  if (clientData.phiAccess && !clientData.auditRequired) {
    throw new Error('Audit logging is required for PHI access');
  }

  const now = new Date();

  const newClientResult = await db.insert(oauthClient).values({
    id: crypto.randomUUID(),
    organizationId,
    clientId,
    clientSecret: hashedSecret,
    name: clientData.name,
    description: clientData.description,
    clientType: clientData.clientType,
    redirectUris: clientData.redirectUris,
    allowedOrigins: clientData.allowedOrigins || [],
    scopes: clientData.scopes || defaultScopes,
    allowedGrantTypes: clientData.allowedGrantTypes || defaultGrantTypes,
    allowedDepartments: clientData.allowedDepartments || [],
    dataAccessLevel: clientData.dataAccessLevel || 'basic',
    phiAccess: clientData.phiAccess || false,
    auditRequired: clientData.auditRequired ?? true,
    rateLimit: clientData.rateLimit || 1000,
    tokenLifetime: clientData.tokenLifetime || 3600,
    refreshTokenLifetime: clientData.refreshTokenLifetime || 86400,
    logoUrl: clientData.logoUrl,
    homepageUrl: clientData.homepageUrl,
    privacyPolicyUrl: clientData.privacyPolicyUrl,
    termsOfServiceUrl: clientData.termsOfServiceUrl,
    isActive: true,
    createdBy: userId,
    createdAt: now,
    updatedAt: now,
  }).returning();

  if (!newClientResult[0]) {
    throw new Error('Failed to create OAuth client');
  }

  const newClient = newClientResult[0];

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: userId,
    actorName: 'OAuth Client Manager',
    action: 'oauth.client.created',
    crud: 'create',
    resource: 'oauth_client',
    resourceId: newClient.id,
    resourceName: newClient.name,
    metadata: {
      clientId: newClient.clientId,
      clientType: newClient.clientType,
      scopes: newClient.scopes,
      phiAccess: newClient.phiAccess,
      dataAccessLevel: newClient.dataAccessLevel,
      redirectUris: newClient.redirectUris,
    },
  });

  return {
    client: formatOAuthClient(newClient),
    clientSecret, // Return plain secret only once
  };
}

/**
 * Get OAuth client by client ID
 */
export async function getOAuthClient(
  clientId: string,
  organizationId: string,
): Promise<OAuthClient | null> {
  const client = await db
    .select()
    .from(oauthClient)
    .where(and(
      eq(oauthClient.clientId, clientId),
      eq(oauthClient.organizationId, organizationId),
      eq(oauthClient.isActive, true),
    ))
    .limit(1);

  if (!client[0]) {
    return null;
  }

  return formatOAuthClient(client[0]);
}

/**
 * Validate client credentials
 */
export async function validateClientCredentials(
  clientId: string,
  clientSecret: string,
  organizationId: string,
): Promise<OAuthClient | null> {
  const client = await db
    .select()
    .from(oauthClient)
    .where(and(
      eq(oauthClient.clientId, clientId),
      eq(oauthClient.organizationId, organizationId),
      eq(oauthClient.isActive, true),
    ))
    .limit(1);

  if (!client[0]) {
    return null;
  }

  const isValidSecret = await verifyClientSecret(clientSecret, client[0].clientSecret);
  if (!isValidSecret) {
    return null;
  }

  // Update last used timestamp
  await db
    .update(oauthClient)
    .set({ lastUsedAt: new Date() })
    .where(eq(oauthClient.clientId, clientId));

  return formatOAuthClient(client[0]);
}

/**
 * List OAuth clients for organization
 */
export async function listOAuthClients(
  organizationId: string,
  options: {
    includeInactive?: boolean;
    limit?: number;
    offset?: number;
  } = {},
): Promise<OAuthClient[]> {
  const { includeInactive = false, limit = 50, offset = 0 } = options;

  const whereConditions = [eq(oauthClient.organizationId, organizationId)];

  if (!includeInactive) {
    whereConditions.push(eq(oauthClient.isActive, true));
  }

  const clients = await db
    .select()
    .from(oauthClient)
    .where(and(...whereConditions))
    .limit(limit)
    .offset(offset);

  return clients.map(formatOAuthClient);
}

/**
 * Update OAuth client
 */
export async function updateOAuthClient(
  clientId: string,
  updates: Partial<OAuthClientData>,
  organizationId: string,
): Promise<OAuthClient> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User authentication required');
  }

  const existingClient = await getOAuthClient(clientId, organizationId);
  if (!existingClient) {
    throw new Error('OAuth client not found');
  }

  // Validate PHI access requirements if being updated
  if (updates.phiAccess && updates.auditRequired === false) {
    throw new Error('Audit logging is required for PHI access');
  }

  const now = new Date();

  const updatedClientResult = await db
    .update(oauthClient)
    .set({
      name: updates.name,
      description: updates.description,
      redirectUris: updates.redirectUris,
      allowedOrigins: updates.allowedOrigins,
      scopes: updates.scopes,
      allowedGrantTypes: updates.allowedGrantTypes,
      allowedDepartments: updates.allowedDepartments,
      dataAccessLevel: updates.dataAccessLevel,
      phiAccess: updates.phiAccess,
      auditRequired: updates.auditRequired,
      rateLimit: updates.rateLimit,
      tokenLifetime: updates.tokenLifetime,
      refreshTokenLifetime: updates.refreshTokenLifetime,
      logoUrl: updates.logoUrl,
      homepageUrl: updates.homepageUrl,
      privacyPolicyUrl: updates.privacyPolicyUrl,
      termsOfServiceUrl: updates.termsOfServiceUrl,
      updatedAt: now,
    })
    .where(and(
      eq(oauthClient.clientId, clientId),
      eq(oauthClient.organizationId, organizationId),
    ))
    .returning();

  if (!updatedClientResult[0]) {
    throw new Error('Failed to update OAuth client');
  }

  const updatedClient = updatedClientResult[0];

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: userId,
    actorName: 'OAuth Client Manager',
    action: 'oauth.client.updated',
    crud: 'update',
    resource: 'oauth_client',
    resourceId: updatedClient.id,
    resourceName: updatedClient.name,
    metadata: {
      clientId: updatedClient.clientId,
      changes: updates,
    },
  });

  return formatOAuthClient(updatedClient);
}

/**
 * Revoke OAuth client (soft delete)
 */
export async function revokeOAuthClient(
  clientId: string,
  organizationId: string,
): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User authentication required');
  }

  const existingClient = await getOAuthClient(clientId, organizationId);
  if (!existingClient) {
    throw new Error('OAuth client not found');
  }

  const now = new Date();

  await db
    .update(oauthClient)
    .set({
      isActive: false,
      updatedAt: now,
    })
    .where(and(
      eq(oauthClient.clientId, clientId),
      eq(oauthClient.organizationId, organizationId),
    ));

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: userId,
    actorName: 'OAuth Client Manager',
    action: 'oauth.client.revoked',
    crud: 'delete',
    resource: 'oauth_client',
    resourceId: existingClient.id,
    resourceName: existingClient.name,
    metadata: {
      clientId: existingClient.clientId,
      revocationReason: 'manual_revocation',
    },
  });
}

/**
 * Add permission to OAuth client
 */
export async function addClientPermission(
  clientId: string,
  permission: OAuthClientPermission,
  organizationId: string,
): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User authentication required');
  }

  const client = await getOAuthClient(clientId, organizationId);
  if (!client) {
    throw new Error('OAuth client not found');
  }

  await db.insert(oauthClientPermission).values({
    id: crypto.randomUUID(),
    clientId,
    organizationId,
    scope: permission.scope,
    resource: permission.resource,
    action: permission.action,
    departmentRestrictions: permission.departmentRestrictions || [],
    dataClassification: permission.dataClassification,
    phiAccessLevel: permission.phiAccessLevel,
    description: permission.description,
    riskLevel: permission.riskLevel || 'medium',
    complianceRequired: permission.complianceRequired ?? true,
    grantedBy: userId,
    grantedAt: new Date(),
    expiresAt: permission.expiresAt,
  });

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: userId,
    actorName: 'OAuth Permission Manager',
    action: 'oauth.permission.granted',
    crud: 'create',
    resource: 'oauth_permission',
    resourceId: `${clientId}:${permission.scope}:${permission.resource}`,
    metadata: {
      clientId,
      permission: {
        scope: permission.scope,
        resource: permission.resource,
        action: permission.action,
        riskLevel: permission.riskLevel,
        phiAccessLevel: permission.phiAccessLevel,
      },
    },
  });
}

/**
 * Get client permissions
 */
export async function getClientPermissions(
  clientId: string,
  organizationId: string,
): Promise<OAuthClientPermission[]> {
  const permissions = await db
    .select()
    .from(oauthClientPermission)
    .where(and(
      eq(oauthClientPermission.clientId, clientId),
      eq(oauthClientPermission.organizationId, organizationId),
      isNull(oauthClientPermission.revokedAt),
    ));

  return permissions.map(p => ({
    scope: p.scope,
    resource: p.resource,
    action: p.action,
    departmentRestrictions: p.departmentRestrictions as string[],
    dataClassification: p.dataClassification || undefined,
    phiAccessLevel: p.phiAccessLevel || undefined,
    description: p.description || undefined,
    riskLevel: p.riskLevel || 'medium',
    complianceRequired: p.complianceRequired || true,
    expiresAt: p.expiresAt || undefined,
  }));
}

/**
 * Validate client has permission for scope and resource
 */
export async function validateClientPermission(
  clientId: string,
  scope: string,
  resource: string,
  action: string,
  organizationId: string,
  departmentId?: string,
): Promise<boolean> {
  const client = await getOAuthClient(clientId, organizationId);
  if (!client) {
    return false;
  }

  // Check if client has the required scope
  if (!client.scopes.includes(scope)) {
    return false;
  }

  // Get specific permissions
  const permissions = await db
    .select()
    .from(oauthClientPermission)
    .where(and(
      eq(oauthClientPermission.clientId, clientId),
      eq(oauthClientPermission.organizationId, organizationId),
      eq(oauthClientPermission.scope, scope),
      eq(oauthClientPermission.resource, resource),
      eq(oauthClientPermission.action, action),
      isNull(oauthClientPermission.revokedAt),
    ));

  if (!permissions.length) {
    return false;
  }

  const permission = permissions[0];
  if (!permission) {
    return false;
  }

  // Check if permission is expired
  if (permission.expiresAt && new Date() > permission.expiresAt) {
    return false;
  }

  // Check department restrictions
  if (departmentId && permission.departmentRestrictions?.length) {
    const allowedDepartments = permission.departmentRestrictions as string[];
    if (!allowedDepartments.includes(departmentId)) {
      return false;
    }
  }

  return true;
}

/**
 * Format database client record to API response
 */
function formatOAuthClient(client: any): OAuthClient {
  return {
    id: client.id,
    organizationId: client.organizationId,
    clientId: client.clientId,
    // Never include client secret in responses
    name: client.name,
    description: client.description,
    clientType: client.clientType,
    redirectUris: client.redirectUris as string[],
    allowedOrigins: client.allowedOrigins as string[],
    scopes: client.scopes as string[],
    allowedGrantTypes: client.allowedGrantTypes as string[],
    allowedDepartments: client.allowedDepartments as string[],
    dataAccessLevel: client.dataAccessLevel,
    phiAccess: client.phiAccess,
    auditRequired: client.auditRequired,
    rateLimit: client.rateLimit,
    tokenLifetime: client.tokenLifetime,
    refreshTokenLifetime: client.refreshTokenLifetime,
    logoUrl: client.logoUrl,
    homepageUrl: client.homepageUrl,
    privacyPolicyUrl: client.privacyPolicyUrl,
    termsOfServiceUrl: client.termsOfServiceUrl,
    isActive: client.isActive,
    lastUsedAt: client.lastUsedAt,
    createdBy: client.createdBy,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
}
