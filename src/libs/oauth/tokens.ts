import { db } from '@/libs/DB';
import { 
  oauthAccessToken, 
  oauthRefreshToken, 
  oauthAuthorizationCode
} from '@/models/Schema';
import { eq, and, lt, isNull } from 'drizzle-orm';
import crypto from 'crypto';
import { createAuditLog } from '@/libs/audit';

export interface AccessTokenData {
  clientId: string;
  organizationId: string;
  userId?: string;
  scopes: string[];
  audience?: string;
  departmentId?: string;
  hospitalRole?: string;
  dataAccessScope?: any;
  expiresIn?: number;
}

export interface AuthorizationCodeData {
  clientId: string;
  organizationId: string;
  userId: string;
  scopes: string[];
  redirectUri: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  departmentId?: string;
  hospitalRole?: string;
  dataAccessScope?: any;
}

export interface RefreshTokenData {
  accessTokenId: string;
  clientId: string;
  organizationId: string;
  userId: string;
  scopes: string[];
  departmentId?: string;
  hospitalRole?: string;
  expiresIn?: number;
}

/**
 * Generate secure random token
 */
function generateSecureToken(length: number = 64): string {
  return crypto.randomBytes(length).toString('base64url');
}

/**
 * Generate authorization code
 */
export async function generateAuthorizationCode(
  data: AuthorizationCodeData
): Promise<string> {
  const code = generateSecureToken(32);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.insert(oauthAuthorizationCode).values({
    code,
    clientId: data.clientId,
    organizationId: data.organizationId,
    userId: data.userId,
    scopes: data.scopes,
    redirectUri: data.redirectUri,
    codeChallenge: data.codeChallenge,
    codeChallengeMethod: data.codeChallengeMethod,
    departmentId: data.departmentId,
    hospitalRole: data.hospitalRole,
    dataAccessScope: data.dataAccessScope,
    expiresAt
  });

  // Audit log
  await createAuditLog({
    organizationId: data.organizationId,
    actorId: data.userId,
    actorName: 'OAuth Service',
    action: 'oauth.authorization_code.generated',
    crud: 'create',
    resource: 'oauth_code',
    resourceId: code,
    metadata: {
      clientId: data.clientId,
      scopes: data.scopes,
      redirectUri: data.redirectUri,
      departmentId: data.departmentId,
      hospitalRole: data.hospitalRole
    }
  });

  return code;
}

/**
 * Validate and consume authorization code
 */
export async function validateAuthorizationCode(
  code: string,
  clientId: string,
  redirectUri: string
): Promise<{
  organizationId: string;
  userId: string;
  scopes: string[];
  departmentId?: string;
  hospitalRole?: string;
  dataAccessScope?: any;
} | null> {
  const authCode = await db
    .select()
    .from(oauthAuthorizationCode)
    .where(and(
      eq(oauthAuthorizationCode.code, code),
      eq(oauthAuthorizationCode.clientId, clientId)
    ))
    .limit(1);

  if (!authCode[0]) return null;

  const codeData = authCode[0];

  // Check if code is expired
  if (new Date() > codeData.expiresAt) {
    await deleteAuthorizationCode(code);
    return null;
  }

  // Check if code is already used
  if (codeData.usedAt) {
    return null;
  }

  // Validate redirect URI
  if (codeData.redirectUri !== redirectUri) {
    return null;
  }

  // Mark code as used
  await db
    .update(oauthAuthorizationCode)
    .set({ usedAt: new Date() })
    .where(eq(oauthAuthorizationCode.code, code));

  // Audit log
  await createAuditLog({
    organizationId: codeData.organizationId,
    actorId: codeData.userId,
    actorName: 'OAuth Service',
    action: 'oauth.authorization_code.consumed',
    crud: 'update',
    resource: 'oauth_code',
    resourceId: code,
    metadata: {
      clientId,
      redirectUri,
      departmentId: codeData.departmentId,
      hospitalRole: codeData.hospitalRole
    }
  });

  return {
    organizationId: codeData.organizationId,
    userId: codeData.userId,
    scopes: codeData.scopes as string[],
    departmentId: codeData.departmentId || undefined,
    hospitalRole: codeData.hospitalRole || undefined,
    dataAccessScope: codeData.dataAccessScope
  };
}

/**
 * Generate access token
 */
export async function generateAccessToken(
  data: AccessTokenData
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}> {
  const accessToken = generateSecureToken(64);
  const expiresIn = data.expiresIn || 3600; // 1 hour default
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  // Insert access token
  const tokenInsertResult = await db.insert(oauthAccessToken).values({
    token: accessToken,
    tokenType: 'access_token',
    clientId: data.clientId,
    organizationId: data.organizationId,
    userId: data.userId,
    scopes: data.scopes,
    audience: data.audience,
    issuer: 'hospitalos',
    departmentId: data.departmentId,
    hospitalRole: data.hospitalRole,
    dataAccessScope: data.dataAccessScope,
    expiresAt
  }).returning({ id: oauthAccessToken.id });

  let refreshToken: string | undefined;

  // Generate refresh token if user is present (not client credentials)
  if (data.userId) {
    refreshToken = generateSecureToken(64);
    const refreshExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(oauthRefreshToken).values({
      token: refreshToken,
      accessTokenId: tokenInsertResult[0]?.id,
      clientId: data.clientId,
      organizationId: data.organizationId,
      userId: data.userId,
      scopes: data.scopes,
      departmentId: data.departmentId,
      hospitalRole: data.hospitalRole,
      expiresAt: refreshExpiresAt
    });
  }

  // Audit log
  await createAuditLog({
    organizationId: data.organizationId,
    actorId: data.userId || 'system',
    actorName: 'OAuth Service',
    action: 'oauth.access_token.generated',
    crud: 'create',
    resource: 'oauth_token',
    resourceId: tokenInsertResult[0]?.id || 'unknown',
    metadata: {
      clientId: data.clientId,
      scopes: data.scopes,
      expiresIn,
      hasRefreshToken: !!refreshToken,
      departmentId: data.departmentId,
      hospitalRole: data.hospitalRole,
      phiAccess: data.dataAccessScope?.phiAccess || false
    }
  });

  return {
    accessToken,
    refreshToken,
    expiresIn,
    tokenType: 'Bearer'
  };
}

/**
 * Validate access token
 */
export async function validateAccessToken(
  token: string
): Promise<{
  clientId: string;
  organizationId: string;
  userId?: string;
  scopes: string[];
  departmentId?: string;
  hospitalRole?: string;
  dataAccessScope?: any;
} | null> {
  const accessToken = await db
    .select()
    .from(oauthAccessToken)
    .where(eq(oauthAccessToken.token, token))
    .limit(1);

  if (!accessToken[0]) return null;

  const tokenData = accessToken[0];

  // Check if token is expired
  if (new Date() > tokenData.expiresAt) {
    return null;
  }

  // Check if token is revoked
  if (tokenData.revokedAt) {
    return null;
  }

  // Update last used timestamp
  await db
    .update(oauthAccessToken)
    .set({ lastUsedAt: new Date() })
    .where(eq(oauthAccessToken.token, token));

  return {
    clientId: tokenData.clientId,
    organizationId: tokenData.organizationId,
    userId: tokenData.userId || undefined,
    scopes: tokenData.scopes as string[],
    departmentId: tokenData.departmentId || undefined,
    hospitalRole: tokenData.hospitalRole || undefined,
    dataAccessScope: tokenData.dataAccessScope
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  refreshToken: string,
  clientId: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
} | null> {
  const refreshTokenData = await db
    .select()
    .from(oauthRefreshToken)
    .where(and(
      eq(oauthRefreshToken.token, refreshToken),
      eq(oauthRefreshToken.clientId, clientId)
    ))
    .limit(1);

  if (!refreshTokenData[0]) return null;

  const tokenData = refreshTokenData[0];

  // Check if refresh token is expired
  if (new Date() > tokenData.expiresAt) {
    await revokeRefreshToken(refreshToken);
    return null;
  }

  // Check if refresh token is revoked
  if (tokenData.revokedAt) {
    return null;
  }

  // Revoke old tokens
  await revokeAccessToken(tokenData.accessTokenId!);
  await revokeRefreshToken(refreshToken);

  // Generate new tokens
  const newTokens = await generateAccessToken({
    clientId: tokenData.clientId,
    organizationId: tokenData.organizationId,
    userId: tokenData.userId,
    scopes: tokenData.scopes as string[],
    departmentId: tokenData.departmentId || undefined,
    hospitalRole: tokenData.hospitalRole || undefined
  });

  return newTokens;
}

/**
 * Revoke access token
 */
export async function revokeAccessToken(tokenIdOrToken: string): Promise<void> {
  // Try to revoke by ID first, then by token value
  const revokedAt = new Date();
  
  await db
    .update(oauthAccessToken)
    .set({ revokedAt })
    .where(eq(oauthAccessToken.id, tokenIdOrToken));

  await db
    .update(oauthAccessToken)
    .set({ revokedAt })
    .where(eq(oauthAccessToken.token, tokenIdOrToken));
}

/**
 * Revoke refresh token
 */
export async function revokeRefreshToken(token: string): Promise<void> {
  const revokedAt = new Date();
  
  await db
    .update(oauthRefreshToken)
    .set({ revokedAt })
    .where(eq(oauthRefreshToken.token, token));
}

/**
 * Delete authorization code
 */
export async function deleteAuthorizationCode(code: string): Promise<void> {
  await db
    .delete(oauthAuthorizationCode)
    .where(eq(oauthAuthorizationCode.code, code));
}

/**
 * Clean up expired tokens (for maintenance)
 */
export async function cleanupExpiredTokens(): Promise<void> {
  const now = new Date();

  // Delete expired authorization codes
  await db
    .delete(oauthAuthorizationCode)
    .where(lt(oauthAuthorizationCode.expiresAt, now));

  // Mark expired access tokens as revoked
  await db
    .update(oauthAccessToken)
    .set({ revokedAt: now })
    .where(and(
      lt(oauthAccessToken.expiresAt, now),
      isNull(oauthAccessToken.revokedAt)
    ));

  // Mark expired refresh tokens as revoked
  await db
    .update(oauthRefreshToken)
    .set({ revokedAt: now })
    .where(and(
      lt(oauthRefreshToken.expiresAt, now),
      isNull(oauthRefreshToken.revokedAt)
    ));
}

/**
 * Get token introspection data
 */
export async function introspectToken(
  token: string
): Promise<{
  active: boolean;
  scope?: string;
  client_id?: string;
  username?: string;
  exp?: number;
  iat?: number;
  sub?: string;
  aud?: string;
  iss?: string;
  // Hospital-specific claims
  hospital_role?: string;
  department_id?: string;
  phi_access?: boolean;
} | null> {
  const tokenData = await validateAccessToken(token);
  
  if (!tokenData) {
    return { active: false };
  }

  const accessToken = await db
    .select()
    .from(oauthAccessToken)
    .where(eq(oauthAccessToken.token, token))
    .limit(1);

  if (!accessToken[0]) {
    return { active: false };
  }

  const tokenRecord = accessToken[0];

  return {
    active: true,
    scope: tokenData.scopes.join(' '),
    client_id: tokenData.clientId,
    username: tokenData.userId,
    exp: Math.floor(tokenRecord.expiresAt.getTime() / 1000),
    iat: Math.floor(tokenRecord.createdAt.getTime() / 1000),
    sub: tokenData.userId,
    aud: tokenRecord.audience,
    iss: tokenRecord.issuer,
    // Hospital-specific claims
    hospital_role: tokenData.hospitalRole,
    department_id: tokenData.departmentId,
    phi_access: tokenData.dataAccessScope?.phiAccess || false
  };
}