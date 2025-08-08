import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';

import { createAuditLog } from '@/libs/audit';
import { db } from '@/libs/DB';
import type { hospitalRoleEnum } from '@/models/Schema';
// SCIM tables are not currently defined in Schema.ts
// TODO: Add SCIM table definitions or remove SCIM functionality
// import { scimConfiguration, scimEnterpriseUser, scimUser } from '@/models/Schema';

type HospitalRole = typeof hospitalRoleEnum.enumValues[number];

// SCIM User resource interface following RFC 7643
export type ScimUser = {
  'schemas': string[];
  'id': string;
  'externalId'?: string;
  'userName': string;
  'name'?: {
    formatted?: string;
    familyName?: string;
    givenName?: string;
    middleName?: string;
    honorificPrefix?: string;
    honorificSuffix?: string;
  };
  'displayName'?: string;
  'emails': Array<{
    value: string;
    type?: string;
    primary?: boolean;
  }>;
  'active': boolean;
  'meta': {
    resourceType: string;
    created: string;
    lastModified: string;
    location?: string;
    version?: string;
  };
  // Hospital-specific extensions
  'urn:ietf:params:scim:schemas:extension:hospital:2.0:User'?: {
    department?: string;
    hospitalRole?: HospitalRole;
    licenseNumber?: string;
    licenseType?: string;
    licenseExpiry?: string;
    specialization?: string;
    employeeId?: string;
    supervisorId?: string;
  };
  // Enterprise extension
  'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'?: {
    employeeNumber?: string;
    costCenter?: string;
    organization?: string;
    division?: string;
    department?: string;
    manager?: {
      value?: string;
      $ref?: string;
      displayName?: string;
    };
  };
};

export type ScimUserPatch = {
  schemas: string[];
  Operations: Array<{
    op: 'add' | 'remove' | 'replace';
    path?: string;
    value?: any;
  }>;
};

export type ScimListResponse<T> = {
  schemas: string[];
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  Resources: T[];
};

export type ScimError = {
  schemas: string[];
  status: string;
  detail?: string;
  scimType?: string;
};

// SCIM schema constants
export const SCIM_SCHEMAS = {
  USER: 'urn:ietf:params:scim:schemas:core:2.0:User',
  HOSPITAL_USER_EXTENSION: 'urn:ietf:params:scim:schemas:extension:hospital:2.0:User',
  ENTERPRISE_USER_EXTENSION: 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User',
  LIST_RESPONSE: 'urn:ietf:params:scim:api:messages:2.0:ListResponse',
  PATCH_OP: 'urn:ietf:params:scim:api:messages:2.0:PatchOp',
  ERROR: 'urn:ietf:params:scim:api:messages:2.0:Error',
};

/**
 * Hospital-specific role mapping from external directory roles
 */
export function mapExternalToHospitalRole(externalRole?: string): HospitalRole {
  const roleMap: Record<string, HospitalRole> = {
    physician: 'doctor',
    doctor: 'doctor',
    md: 'doctor',
    nurse: 'nurse',
    rn: 'nurse',
    lpn: 'nurse',
    tech: 'technician',
    technician: 'technician',
    radiology_tech: 'technician',
    lab_tech: 'technician',
    admin: 'administrator',
    administrator: 'administrator',
    manager: 'administrator',
    director: 'administrator',
    viewer: 'viewer',
    readonly: 'viewer',
  };

  if (!externalRole) {
    return 'viewer';
  }

  const lowercaseRole = externalRole.toLowerCase();
  return roleMap[lowercaseRole] || 'viewer';
}

/**
 * Validates medical license number (basic validation)
 */
export async function validateMedicalLicense(
  licenseNumber: string,
  licenseType: string = 'medical',
  organizationId: string,
): Promise<boolean> {
  // In a real implementation, this would:
  // 1. Check against state medical board APIs
  // 2. Validate license format per state requirements
  // 3. Check expiration dates
  // 4. Verify against hospital credentialing database

  // For now, basic format validation
  if (!licenseNumber || licenseNumber.length < 6) {
    return false;
  }

  // Log validation attempt for audit
  await createAuditLog({
    organizationId,
    actorId: 'system',
    actorName: 'SCIM License Validator',
    action: 'scim.license.validation',
    crud: 'read',
    resource: 'license',
    resourceId: licenseNumber,
    metadata: {
      licenseType,
      validationResult: 'passed',
      validationMethod: 'format_check',
    },
  });

  return true;
}

/**
 * Get SCIM configuration for organization
 */
export async function getScimConfiguration(organizationId: string) {
  const config = await db
    .select()
    .from(scimConfiguration)
    .where(eq(scimConfiguration.organizationId, organizationId))
    .limit(1);

  return config[0] || null;
}

/**
 * Create a new SCIM user
 */
export async function createScimUser(
  userData: Partial<ScimUser>,
  organizationId: string,
): Promise<ScimUser> {
  const { userId } = await auth();

  if (!userData.userName || !userData.emails?.[0]?.value) {
    throw new Error('userName and email are required');
  }

  const config = await getScimConfiguration(organizationId);
  if (!config?.enabled) {
    throw new Error('SCIM is not enabled for this organization');
  }

  // Extract hospital-specific attributes
  const hospitalExt = userData['urn:ietf:params:scim:schemas:extension:hospital:2.0:User'];

  // Validate license if provided
  if (hospitalExt?.licenseNumber) {
    const isValid = await validateMedicalLicense(
      hospitalExt.licenseNumber,
      hospitalExt.licenseType || 'medical',
      organizationId,
    );
    if (!isValid) {
      throw new Error('Invalid medical license number');
    }
  }

  // Map external role to hospital role
  const hospitalRole = mapExternalToHospitalRole(hospitalExt?.hospitalRole as string);

  const now = new Date().toISOString();
  const meta = {
    resourceType: 'User',
    created: now,
    lastModified: now,
    location: `/scim/v2/Users/${userData.id || 'temp'}`,
    version: '1',
  };

  // Create user record
  const newUser = await db.insert(scimUser).values({
    organizationId,
    externalId: userData.externalId || userData.id || crypto.randomUUID(),
    userName: userData.userName,
    email: userData.emails[0].value,
    familyName: userData.name?.familyName,
    givenName: userData.name?.givenName,
    displayName: userData.displayName || `${userData.name?.givenName} ${userData.name?.familyName}`.trim(),
    active: userData.active ?? true,
    status: 'active',
    department: hospitalExt?.department,
    hospitalRole,
    licenseNumber: hospitalExt?.licenseNumber,
    licenseType: hospitalExt?.licenseType,
    licenseExpiry: hospitalExt?.licenseExpiry ? new Date(hospitalExt.licenseExpiry) : undefined,
    specialization: hospitalExt?.specialization,
    employeeId: hospitalExt?.employeeId,
    supervisorId: hospitalExt?.supervisorId,
    meta,
    customAttributes: {},
    lastSyncedAt: new Date(),
    syncErrors: [],
    provisioningStatus: 'provisioned',
  }).returning();

  if (!newUser[0]) {
    throw new Error('Failed to create SCIM user');
  }

  const createdUser = newUser[0];

  // Create enterprise extension if provided
  const enterpriseExt = userData['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'];
  if (enterpriseExt) {
    await db.insert(scimEnterpriseUser).values({
      scimUserId: createdUser.id,
      organizationId,
      employeeNumber: enterpriseExt.employeeNumber,
      costCenter: enterpriseExt.costCenter,
      organization: enterpriseExt.organization,
      division: enterpriseExt.division,
      department: enterpriseExt.department,
      manager: enterpriseExt.manager?.value,
    });
  }

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: userId || 'system',
    actorName: 'SCIM Service',
    action: 'scim.user.created',
    crud: 'create',
    resource: 'user',
    resourceId: createdUser.id,
    resourceName: createdUser.displayName || createdUser.userName,
    metadata: {
      externalId: createdUser.externalId,
      userName: createdUser.userName,
      email: createdUser.email,
      hospitalRole,
      department: hospitalExt?.department,
      licenseNumber: hospitalExt?.licenseNumber ? '***REDACTED***' : undefined,
    },
  });

  return formatScimUser(createdUser);
}

/**
 * Get SCIM user by ID
 */
export async function getScimUser(
  userId: string,
  organizationId: string,
): Promise<ScimUser | null> {
  const user = await db
    .select()
    .from(scimUser)
    .where(and(
      eq(scimUser.id, userId),
      eq(scimUser.organizationId, organizationId),
    ))
    .limit(1);

  if (!user[0]) {
    return null;
  }

  return formatScimUser(user[0]);
}

/**
 * Update SCIM user
 */
export async function updateScimUser(
  userId: string,
  userData: Partial<ScimUser>,
  organizationId: string,
): Promise<ScimUser> {
  const { userId: actorId } = await auth();

  const existingUser = await getScimUser(userId, organizationId);
  if (!existingUser) {
    throw new Error('User not found');
  }

  const hospitalExt = userData['urn:ietf:params:scim:schemas:extension:hospital:2.0:User'];
  const enterpriseExt = userData['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'];

  // Validate license if being updated
  if (hospitalExt?.licenseNumber) {
    const isValid = await validateMedicalLicense(
      hospitalExt.licenseNumber,
      hospitalExt.licenseType || 'medical',
      organizationId,
    );
    if (!isValid) {
      throw new Error('Invalid medical license number');
    }
  }

  const hospitalRole = hospitalExt?.hospitalRole
    ? mapExternalToHospitalRole(hospitalExt.hospitalRole as string)
    : undefined;

  const now = new Date();
  const meta = {
    ...existingUser.meta,
    lastModified: now.toISOString(),
    version: String(Number.parseInt(existingUser.meta.version || '1') + 1),
  };

  // Update user
  const updatedUserResult = await db
    .update(scimUser)
    .set({
      userName: userData.userName,
      email: userData.emails?.[0]?.value,
      familyName: userData.name?.familyName,
      givenName: userData.name?.givenName,
      displayName: userData.displayName,
      active: userData.active,
      department: hospitalExt?.department,
      hospitalRole,
      licenseNumber: hospitalExt?.licenseNumber,
      licenseType: hospitalExt?.licenseType,
      licenseExpiry: hospitalExt?.licenseExpiry ? new Date(hospitalExt.licenseExpiry) : undefined,
      specialization: hospitalExt?.specialization,
      employeeId: hospitalExt?.employeeId,
      supervisorId: hospitalExt?.supervisorId,
      meta,
      lastSyncedAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(scimUser.id, userId),
      eq(scimUser.organizationId, organizationId),
    ))
    .returning();

  if (!updatedUserResult[0]) {
    throw new Error('Failed to update SCIM user');
  }

  const updatedUser = updatedUserResult[0];

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: actorId || 'system',
    actorName: 'SCIM Service',
    action: 'scim.user.updated',
    crud: 'update',
    resource: 'user',
    resourceId: userId,
    resourceName: updatedUser.displayName || updatedUser.userName,
    metadata: {
      changes: {
        userName: userData.userName,
        email: userData.emails?.[0]?.value,
        active: userData.active,
        hospitalRole,
        department: hospitalExt?.department,
      },
    },
  });

  return formatScimUser(updatedUser);
}

/**
 * Delete SCIM user (soft delete by setting active = false)
 */
export async function deleteScimUser(
  userId: string,
  organizationId: string,
): Promise<void> {
  const { userId: actorId } = await auth();

  const existingUser = await getScimUser(userId, organizationId);
  if (!existingUser) {
    throw new Error('User not found');
  }

  // Soft delete by setting active to false
  await db
    .update(scimUser)
    .set({
      active: false,
      status: 'deleted',
      lastSyncedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(
      eq(scimUser.id, userId),
      eq(scimUser.organizationId, organizationId),
    ));

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: actorId || 'system',
    actorName: 'SCIM Service',
    action: 'scim.user.deleted',
    crud: 'delete',
    resource: 'user',
    resourceId: userId,
    resourceName: existingUser.displayName || existingUser.userName,
    metadata: {
      deletionType: 'soft_delete',
      previousActive: existingUser.active,
    },
  });
}

/**
 * List SCIM users with pagination and filtering
 */
export async function listScimUsers(
  organizationId: string,
  options: {
    startIndex?: number;
    count?: number;
    filter?: string;
    sortBy?: string;
    sortOrder?: 'ascending' | 'descending';
  } = {},
): Promise<ScimListResponse<ScimUser>> {
  const {
    startIndex = 1,
    count = 50,
  } = options;

  // Basic query
  const query = db
    .select()
    .from(scimUser)
    .where(eq(scimUser.organizationId, organizationId));

  // Apply basic filter (userName, email, displayName)
  // Note: Full SCIM filter implementation would be more complex

  const users = await query.limit(count).offset(startIndex - 1);
  const totalResults = users.length; // In production, do a separate count query

  return {
    schemas: [SCIM_SCHEMAS.LIST_RESPONSE],
    totalResults,
    startIndex,
    itemsPerPage: count,
    Resources: users.map(formatScimUser),
  };
}

/**
 * Format database user record to SCIM user format
 */
export function formatScimUser(user: any): ScimUser {
  const scimUser: ScimUser = {
    schemas: [SCIM_SCHEMAS.USER],
    id: user.id,
    externalId: user.externalId,
    userName: user.userName,
    name: {
      familyName: user.familyName,
      givenName: user.givenName,
      formatted: user.displayName,
    },
    displayName: user.displayName,
    emails: [
      {
        value: user.email,
        type: 'work',
        primary: true,
      },
    ],
    active: user.active,
    meta: user.meta || {
      resourceType: 'User',
      created: user.createdAt?.toISOString() || new Date().toISOString(),
      lastModified: user.updatedAt?.toISOString() || new Date().toISOString(),
    },
  };

  // Add hospital extension if data exists
  if (user.department || user.hospitalRole || user.licenseNumber) {
    scimUser.schemas.push(SCIM_SCHEMAS.HOSPITAL_USER_EXTENSION);
    scimUser['urn:ietf:params:scim:schemas:extension:hospital:2.0:User'] = {
      department: user.department,
      hospitalRole: user.hospitalRole,
      licenseNumber: user.licenseNumber,
      licenseType: user.licenseType,
      licenseExpiry: user.licenseExpiry?.toISOString(),
      specialization: user.specialization,
      employeeId: user.employeeId,
      supervisorId: user.supervisorId,
    };
  }

  return scimUser;
}

/**
 * Create SCIM error response
 */
export function createScimError(
  status: number,
  scimType?: string,
  detail?: string,
): ScimError {
  return {
    schemas: [SCIM_SCHEMAS.ERROR],
    status: status.toString(),
    scimType,
    detail,
  };
}
