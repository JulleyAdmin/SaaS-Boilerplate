import { auth } from '@clerk/nextjs/server';
import { and, eq, inArray } from 'drizzle-orm';

import { createAuditLog } from '@/libs/audit';
import { db } from '@/libs/DB';
import { scimConfiguration, scimGroup, scimUser } from '@/models/Schema';

import { SCIM_SCHEMAS, type ScimError, type ScimListResponse } from './users';

// SCIM Group resource interface following RFC 7643
export type ScimGroup = {
  'schemas': string[];
  'id': string;
  'externalId'?: string;
  'displayName': string;
  'description'?: string;
  'members'?: Array<{
    value: string;
    $ref?: string;
    display?: string;
    type?: string;
  }>;
  'meta': {
    resourceType: string;
    created: string;
    lastModified: string;
    location?: string;
    version?: string;
  };
  // Hospital-specific extensions
  'urn:ietf:params:scim:schemas:extension:hospital:2.0:Group'?: {
    groupType: 'department' | 'role_group' | 'security_group' | 'custom';
    departmentCode?: string;
    accessLevel?: 'basic' | 'elevated' | 'admin';
    dataAccessScope?: {
      departments: string[];
      patientDataAccess: boolean;
      phiAccess: boolean;
      auditRequired: boolean;
    };
  };
};

export type ScimGroupPatch = {
  schemas: string[];
  Operations: Array<{
    op: 'add' | 'remove' | 'replace';
    path?: string;
    value?: any;
  }>;
};

// SCIM Group schema constants
export const SCIM_GROUP_SCHEMAS = {
  GROUP: 'urn:ietf:params:scim:schemas:core:2.0:Group',
  HOSPITAL_GROUP_EXTENSION: 'urn:ietf:params:scim:schemas:extension:hospital:2.0:Group',
  ...SCIM_SCHEMAS,
};

/**
 * Get SCIM configuration for organization
 */
async function getScimConfiguration(organizationId: string) {
  const config = await db
    .select()
    .from(scimConfiguration)
    .where(eq(scimConfiguration.organizationId, organizationId))
    .limit(1);

  return config[0] || null;
}

/**
 * Create a new SCIM group
 */
export async function createScimGroup(
  groupData: Partial<ScimGroup>,
  organizationId: string,
): Promise<ScimGroup> {
  const { userId } = await auth();

  if (!groupData.displayName) {
    throw new Error('displayName is required');
  }

  const config = await getScimConfiguration(organizationId);
  if (!config?.enabled) {
    throw new Error('SCIM is not enabled for this organization');
  }

  // Extract hospital-specific attributes
  const hospitalExt = groupData['urn:ietf:params:scim:schemas:extension:hospital:2.0:Group'];

  const now = new Date().toISOString();
  const meta = {
    resourceType: 'Group',
    created: now,
    lastModified: now,
    location: `/scim/v2/Groups/${groupData.id || 'temp'}`,
    version: '1',
  };

  // Validate and process members
  const members = groupData.members || [];
  const processedMembers = await validateGroupMembers(members, organizationId);

  // Create group record
  const newGroupResult = await db.insert(scimGroup).values({
    organizationId,
    externalId: groupData.externalId || groupData.id || crypto.randomUUID(),
    displayName: groupData.displayName,
    description: groupData.description,
    groupType: hospitalExt?.groupType || 'department',
    departmentCode: hospitalExt?.departmentCode,
    accessLevel: hospitalExt?.accessLevel || 'basic',
    dataAccessScope: hospitalExt?.dataAccessScope || {
      departments: [],
      patientDataAccess: false,
      phiAccess: false,
      auditRequired: true,
    },
    meta,
    members: processedMembers,
    customAttributes: {},
    lastSyncedAt: new Date(),
    syncErrors: [],
    provisioningStatus: 'provisioned',
  }).returning();

  if (!newGroupResult[0]) {
    throw new Error('Failed to create SCIM group');
  }

  const newGroup = newGroupResult[0];

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: userId || 'system',
    actorName: 'SCIM Service',
    action: 'scim.group.created',
    crud: 'create',
    resource: 'group',
    resourceId: newGroup.id,
    resourceName: newGroup.displayName,
    metadata: {
      externalId: newGroup.externalId,
      displayName: newGroup.displayName,
      groupType: newGroup.groupType,
      memberCount: processedMembers.length,
      departmentCode: hospitalExt?.departmentCode,
      accessLevel: hospitalExt?.accessLevel,
    },
  });

  return formatScimGroup(newGroup);
}

/**
 * Get SCIM group by ID
 */
export async function getScimGroup(
  groupId: string,
  organizationId: string,
): Promise<ScimGroup | null> {
  const group = await db
    .select()
    .from(scimGroup)
    .where(and(
      eq(scimGroup.id, groupId),
      eq(scimGroup.organizationId, organizationId),
    ))
    .limit(1);

  if (!group[0]) {
    return null;
  }

  return formatScimGroup(group[0]);
}

/**
 * Update SCIM group
 */
export async function updateScimGroup(
  groupId: string,
  groupData: Partial<ScimGroup>,
  organizationId: string,
): Promise<ScimGroup> {
  const { userId } = await auth();

  const existingGroup = await getScimGroup(groupId, organizationId);
  if (!existingGroup) {
    throw new Error('Group not found');
  }

  const hospitalExt = groupData['urn:ietf:params:scim:schemas:extension:hospital:2.0:Group'];

  // Process members if provided
  let processedMembers: any[] | undefined;
  if (groupData.members) {
    processedMembers = await validateGroupMembers(groupData.members, organizationId);
  }

  const now = new Date();
  const meta = {
    ...existingGroup.meta,
    lastModified: now.toISOString(),
    version: String(Number.parseInt(existingGroup.meta.version || '1') + 1),
  };

  // Update group
  const updatedGroupResult = await db
    .update(scimGroup)
    .set({
      displayName: groupData.displayName,
      description: groupData.description,
      groupType: hospitalExt?.groupType,
      departmentCode: hospitalExt?.departmentCode,
      accessLevel: hospitalExt?.accessLevel,
      dataAccessScope: hospitalExt?.dataAccessScope,
      meta,
      members: processedMembers,
      lastSyncedAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(scimGroup.id, groupId),
      eq(scimGroup.organizationId, organizationId),
    ))
    .returning();

  if (!updatedGroupResult[0]) {
    throw new Error('Failed to update SCIM group');
  }

  const updatedGroup = updatedGroupResult[0];

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: userId || 'system',
    actorName: 'SCIM Service',
    action: 'scim.group.updated',
    crud: 'update',
    resource: 'group',
    resourceId: groupId,
    resourceName: updatedGroup.displayName,
    metadata: {
      changes: {
        displayName: groupData.displayName,
        description: groupData.description,
        groupType: hospitalExt?.groupType,
        memberCount: processedMembers?.length,
      },
    },
  });

  return formatScimGroup(updatedGroup);
}

/**
 * Delete SCIM group
 */
export async function deleteScimGroup(
  groupId: string,
  organizationId: string,
): Promise<void> {
  const { userId } = await auth();

  const existingGroup = await getScimGroup(groupId, organizationId);
  if (!existingGroup) {
    throw new Error('Group not found');
  }

  // Delete the group
  await db
    .delete(scimGroup)
    .where(and(
      eq(scimGroup.id, groupId),
      eq(scimGroup.organizationId, organizationId),
    ));

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: userId || 'system',
    actorName: 'SCIM Service',
    action: 'scim.group.deleted',
    crud: 'delete',
    resource: 'group',
    resourceId: groupId,
    resourceName: existingGroup.displayName,
    metadata: {
      deletionType: 'hard_delete',
      memberCount: existingGroup.members?.length || 0,
    },
  });
}

/**
 * List SCIM groups with pagination and filtering
 */
export async function listScimGroups(
  organizationId: string,
  options: {
    startIndex?: number;
    count?: number;
    filter?: string;
    sortBy?: string;
    sortOrder?: 'ascending' | 'descending';
  } = {},
): Promise<ScimListResponse<ScimGroup>> {
  const {
    startIndex = 1,
    count = 50,
  } = options;

  // Basic query
  const query = db
    .select()
    .from(scimGroup)
    .where(eq(scimGroup.organizationId, organizationId));

  const groups = await query.limit(count).offset(startIndex - 1);
  const totalResults = groups.length; // In production, do a separate count query

  return {
    schemas: [SCIM_SCHEMAS.LIST_RESPONSE],
    totalResults,
    startIndex,
    itemsPerPage: count,
    Resources: groups.map(formatScimGroup),
  };
}

/**
 * Add members to a group
 */
export async function addGroupMembers(
  groupId: string,
  memberIds: string[],
  organizationId: string,
): Promise<ScimGroup> {
  const { userId } = await auth();

  const existingGroup = await getScimGroup(groupId, organizationId);
  if (!existingGroup) {
    throw new Error('Group not found');
  }

  // Validate member IDs exist
  const members = await db
    .select({ id: scimUser.id, userName: scimUser.userName, displayName: scimUser.displayName })
    .from(scimUser)
    .where(and(
      inArray(scimUser.id, memberIds),
      eq(scimUser.organizationId, organizationId),
      eq(scimUser.active, true),
    ));

  if (members.length !== memberIds.length) {
    throw new Error('One or more users not found or inactive');
  }

  // Get current members and add new ones
  const currentMembers = existingGroup.members || [];
  const newMembers = members.map(user => ({
    value: user.id,
    display: user.displayName || user.userName,
    type: 'User',
  }));

  // Merge without duplicates
  const existingMemberIds = new Set(currentMembers.map(m => m.value));
  const uniqueNewMembers = newMembers.filter(m => !existingMemberIds.has(m.value));
  const updatedMembers = [...currentMembers, ...uniqueNewMembers];

  const now = new Date();
  const meta = {
    ...existingGroup.meta,
    lastModified: now.toISOString(),
    version: String(Number.parseInt(existingGroup.meta.version || '1') + 1),
  };

  // Update group with new members
  const updatedGroupResult = await db
    .update(scimGroup)
    .set({
      members: updatedMembers,
      meta,
      lastSyncedAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(scimGroup.id, groupId),
      eq(scimGroup.organizationId, organizationId),
    ))
    .returning();

  if (!updatedGroupResult[0]) {
    throw new Error('Failed to update group members');
  }

  const updatedGroup = updatedGroupResult[0];

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: userId || 'system',
    actorName: 'SCIM Service',
    action: 'scim.group.members.added',
    crud: 'update',
    resource: 'group',
    resourceId: groupId,
    resourceName: existingGroup.displayName,
    metadata: {
      addedMemberIds: uniqueNewMembers.map(m => m.value),
      totalMembers: updatedMembers.length,
    },
  });

  return formatScimGroup(updatedGroup);
}

/**
 * Remove members from a group
 */
export async function removeGroupMembers(
  groupId: string,
  memberIds: string[],
  organizationId: string,
): Promise<ScimGroup> {
  const { userId } = await auth();

  const existingGroup = await getScimGroup(groupId, organizationId);
  if (!existingGroup) {
    throw new Error('Group not found');
  }

  // Remove specified members
  const currentMembers = existingGroup.members || [];
  const memberIdsToRemove = new Set(memberIds);
  const updatedMembers = currentMembers.filter(m => !memberIdsToRemove.has(m.value));

  const now = new Date();
  const meta = {
    ...existingGroup.meta,
    lastModified: now.toISOString(),
    version: String(Number.parseInt(existingGroup.meta.version || '1') + 1),
  };

  // Update group
  const updatedGroupResult2 = await db
    .update(scimGroup)
    .set({
      members: updatedMembers,
      meta,
      lastSyncedAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(scimGroup.id, groupId),
      eq(scimGroup.organizationId, organizationId),
    ))
    .returning();

  if (!updatedGroupResult2[0]) {
    throw new Error('Failed to remove group members');
  }

  const updatedGroup2 = updatedGroupResult2[0];

  // Create audit log
  await createAuditLog({
    organizationId,
    actorId: userId || 'system',
    actorName: 'SCIM Service',
    action: 'scim.group.members.removed',
    crud: 'update',
    resource: 'group',
    resourceId: groupId,
    resourceName: existingGroup.displayName,
    metadata: {
      removedMemberIds: memberIds,
      totalMembers: updatedMembers.length,
    },
  });

  return formatScimGroup(updatedGroup2);
}

/**
 * Validate group members exist and are active
 */
async function validateGroupMembers(
  members: Array<{ value: string; display?: string; type?: string }>,
  organizationId: string,
): Promise<Array<{ value: string; $ref?: string; display?: string; type: string }>> {
  if (!members.length) {
    return [];
  }

  const memberIds = members.map(m => m.value);

  // Validate all member IDs exist and are active
  const existingUsers = await db
    .select({ id: scimUser.id, userName: scimUser.userName, displayName: scimUser.displayName })
    .from(scimUser)
    .where(and(
      inArray(scimUser.id, memberIds),
      eq(scimUser.organizationId, organizationId),
      eq(scimUser.active, true),
    ));

  const existingUserIds = new Set(existingUsers.map(u => u.id));
  const invalidIds = memberIds.filter(id => !existingUserIds.has(id));

  if (invalidIds.length > 0) {
    throw new Error(`Invalid or inactive user IDs: ${invalidIds.join(', ')}`);
  }

  // Return formatted members with display names
  return members.map((member) => {
    const user = existingUsers.find(u => u.id === member.value);
    return {
      value: member.value,
      $ref: `/scim/v2/Users/${member.value}`,
      display: member.display || user?.displayName || user?.userName || 'Unknown User',
      type: 'User',
    };
  });
}

/**
 * Format database group record to SCIM group format
 */
export function formatScimGroup(group: any): ScimGroup {
  const scimGroup: ScimGroup = {
    schemas: [SCIM_GROUP_SCHEMAS.GROUP],
    id: group.id,
    externalId: group.externalId,
    displayName: group.displayName,
    description: group.description,
    members: group.members || [],
    meta: group.meta || {
      resourceType: 'Group',
      created: group.createdAt?.toISOString() || new Date().toISOString(),
      lastModified: group.updatedAt?.toISOString() || new Date().toISOString(),
    },
  };

  // Add hospital extension if data exists
  if (group.groupType || group.departmentCode || group.accessLevel) {
    scimGroup.schemas.push(SCIM_GROUP_SCHEMAS.HOSPITAL_GROUP_EXTENSION);
    scimGroup['urn:ietf:params:scim:schemas:extension:hospital:2.0:Group'] = {
      groupType: group.groupType,
      departmentCode: group.departmentCode,
      accessLevel: group.accessLevel,
      dataAccessScope: group.dataAccessScope,
    };
  }

  return scimGroup;
}

/**
 * Apply SCIM patch operations to a group
 */
export async function patchScimGroup(
  groupId: string,
  patchOps: ScimGroupPatch,
  organizationId: string,
): Promise<ScimGroup> {
  const existingGroup = await getScimGroup(groupId, organizationId);
  if (!existingGroup) {
    throw new Error('Group not found');
  }

  // Process each operation
  for (const operation of patchOps.Operations) {
    switch (operation.op) {
      case 'add':
        if (operation.path === 'members') {
          const membersToAdd = Array.isArray(operation.value) ? operation.value : [operation.value];
          await addGroupMembers(groupId, membersToAdd.map(m => m.value), organizationId);
        }
        break;

      case 'remove':
        if (operation.path === 'members') {
          const membersToRemove = Array.isArray(operation.value) ? operation.value : [operation.value];
          await removeGroupMembers(groupId, membersToRemove.map(m => m.value || m), organizationId);
        }
        break;

      case 'replace':
        // Handle replace operations for group attributes
        if (operation.path) {
          const updateData: Partial<ScimGroup> = {};
          if (operation.path === 'displayName') {
            updateData.displayName = operation.value;
          } else if (operation.path === 'members') {
            updateData.members = operation.value;
          }
          await updateScimGroup(groupId, updateData, organizationId);
        }
        break;
    }
  }

  // Return updated group
  return await getScimGroup(groupId, organizationId) as ScimGroup;
}

/**
 * Create SCIM error response for groups
 */
export function createScimGroupError(
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
