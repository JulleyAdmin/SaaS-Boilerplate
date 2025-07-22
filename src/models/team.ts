import { and, desc, eq, or, sql } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { teamMember, invitation, organizationSchema } from '@/models/Schema';
import type { roleEnum } from '@/models/Schema';

export type TeamMember = typeof teamMember.$inferSelect;
export type Invitation = typeof invitation.$inferSelect;
export type TeamRole = typeof roleEnum.enumValues[number];

export interface TeamMemberWithUser extends TeamMember {
  user?: {
    id: string;
    email: string;
    name: string;
    imageUrl?: string;
  };
}

// Fetch all team members for an organization
export const fetchTeamMembers = async (
  organizationId: string
): Promise<TeamMemberWithUser[]> => {
  const members = await db
    .select()
    .from(teamMember)
    .where(eq(teamMember.organizationId, organizationId))
    .orderBy(desc(teamMember.createdAt));

  // Note: In a real app, you'd fetch user data from Clerk
  // For now, returning members without user data
  return members;
};

// Add a team member
export const addTeamMember = async (params: {
  organizationId: string;
  userId: string;
  role: TeamRole;
}): Promise<TeamMember> => {
  const [member] = await db
    .insert(teamMember)
    .values({
      organizationId: params.organizationId,
      userId: params.userId,
      role: params.role,
    })
    .returning();

  return member;
};

// Update team member role
export const updateTeamMemberRole = async (
  memberId: string,
  role: TeamRole
): Promise<TeamMember | null> => {
  const [updated] = await db
    .update(teamMember)
    .set({ role, updatedAt: new Date() })
    .where(eq(teamMember.id, memberId))
    .returning();

  return updated || null;
};

// Remove team member
export const removeTeamMember = async (memberId: string): Promise<void> => {
  await db.delete(teamMember).where(eq(teamMember.id, memberId));
};

// Check if user is a team member
export const isTeamMember = async (
  organizationId: string,
  userId: string
): Promise<boolean> => {
  const [member] = await db
    .select()
    .from(teamMember)
    .where(
      and(
        eq(teamMember.organizationId, organizationId),
        eq(teamMember.userId, userId)
      )
    )
    .limit(1);

  return !!member;
};

// Get user's role in organization
export const getUserRole = async (
  organizationId: string,
  userId: string
): Promise<TeamRole | null> => {
  const [member] = await db
    .select()
    .from(teamMember)
    .where(
      and(
        eq(teamMember.organizationId, organizationId),
        eq(teamMember.userId, userId)
      )
    )
    .limit(1);

  return member?.role || null;
};

// Count team members by role
export const countTeamMembersByRole = async (
  organizationId: string
): Promise<Record<TeamRole, number>> => {
  const result = await db
    .select({
      role: teamMember.role,
      count: sql<number>`count(*)`,
    })
    .from(teamMember)
    .where(eq(teamMember.organizationId, organizationId))
    .groupBy(teamMember.role);

  const counts: Record<string, number> = {};
  result.forEach((row) => {
    counts[row.role] = row.count;
  });

  return {
    OWNER: counts.OWNER || 0,
    ADMIN: counts.ADMIN || 0,
    MEMBER: counts.MEMBER || 0,
  };
};

// Check if action is allowed based on user's role
export const canManageTeamMembers = (userRole: TeamRole | null): boolean => {
  return userRole === 'OWNER' || userRole === 'ADMIN';
};

export const canUpdateMemberRole = (
  userRole: TeamRole | null,
  targetRole: TeamRole,
  newRole: TeamRole
): boolean => {
  // Only owners can change roles
  if (userRole !== 'OWNER') return false;
  
  // Can't change owner role
  if (targetRole === 'OWNER') return false;
  
  // Can't promote to owner (transfer ownership is separate)
  if (newRole === 'OWNER') return false;
  
  return true;
};

export const canRemoveMember = (
  userRole: TeamRole | null,
  targetRole: TeamRole
): boolean => {
  // Owners can remove anyone except other owners
  if (userRole === 'OWNER' && targetRole !== 'OWNER') return true;
  
  // Admins can only remove members
  if (userRole === 'ADMIN' && targetRole === 'MEMBER') return true;
  
  return false;
};

export const canManageWebhooks = (userRole: TeamRole | null): boolean => {
  // Only owners and admins can manage webhooks
  return userRole === 'OWNER' || userRole === 'ADMIN';
};

export const getUserRole = async (
  organizationId: string,
  userId: string
): Promise<TeamRole | null> => {
  const [member] = await db
    .select()
    .from(teamMember)
    .where(
      and(
        eq(teamMember.organizationId, organizationId),
        eq(teamMember.userId, userId)
      )
    )
    .limit(1);

  return member?.role || null;
};

export const canManageApiKeys = (userRole: TeamRole | null): boolean => {
  // Only owners and admins can manage API keys
  return userRole === 'OWNER' || userRole === 'ADMIN';
};