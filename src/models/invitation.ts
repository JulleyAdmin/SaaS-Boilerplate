import { randomBytes } from 'crypto';
import { and, desc, eq, gt, isNull, or } from 'drizzle-orm';
import { addDays } from 'date-fns';

import { db } from '@/libs/DB';
import { invitation } from '@/models/Schema';
import type { TeamRole } from '@/models/team';

export type Invitation = typeof invitation.$inferSelect & {
  status?: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
};

// Generate a secure invitation token
const generateInvitationToken = (): string => {
  return randomBytes(32).toString('hex');
};

// Create an invitation
export const createInvitation = async (params: {
  organizationId: string;
  email?: string;
  role: TeamRole;
  invitedBy: string;
  expiresInDays?: number;
  allowedDomains?: string[];
}): Promise<Invitation> => {
  const token = generateInvitationToken();
  const expires = addDays(new Date(), params.expiresInDays || 7);

  const [newInvitation] = await db
    .insert(invitation)
    .values({
      organizationId: params.organizationId,
      email: params.email,
      role: params.role,
      token,
      expires,
      invitedBy: params.invitedBy,
      sentViaEmail: !!params.email,
      allowedDomains: params.allowedDomains || [],
    })
    .returning();

  // Trigger webhook event
  try {
    const { webhookHelpers } = await import('@/lib/webhook/delivery');
    await webhookHelpers.invitationCreated(params.organizationId, newInvitation);
  } catch (error) {
    console.error('Failed to trigger invitation.created webhook:', error);
  }

  return newInvitation;
};

// Fetch all invitations for an organization
export const fetchInvitations = async (
  organizationId: string,
  includePending = true
): Promise<Invitation[]> => {
  let query = db
    .select()
    .from(invitation)
    .where(eq(invitation.organizationId, organizationId));

  if (includePending) {
    // Only show non-expired invitations
    query = query.where(gt(invitation.expires, new Date()));
  }

  const results = await query.orderBy(desc(invitation.createdAt));
  
  return results.map(inv => ({
    ...inv,
    status: getInvitationStatus(inv),
  }));
};

// Get invitation by token
export const getInvitationByToken = async (
  token: string
): Promise<Invitation | null> => {
  const [inv] = await db
    .select()
    .from(invitation)
    .where(eq(invitation.token, token))
    .limit(1);

  return inv || null;
};

// Validate invitation
export const validateInvitation = async (
  token: string,
  email?: string
): Promise<{ valid: boolean; invitation?: Invitation; error?: string }> => {
  const inv = await getInvitationByToken(token);

  if (!inv) {
    return { valid: false, error: 'Invalid invitation token' };
  }

  // Check if expired
  if (inv.expires < new Date()) {
    return { valid: false, error: 'Invitation has expired' };
  }

  // Check email match if invitation was sent to specific email
  if (inv.email && email && inv.email !== email) {
    return { valid: false, error: 'Invitation was sent to a different email' };
  }

  // Check domain restrictions for link invitations
  if (!inv.email && inv.allowedDomains.length > 0 && email) {
    const emailDomain = email.split('@')[1];
    if (!inv.allowedDomains.includes(emailDomain)) {
      return { 
        valid: false, 
        error: `Email domain @${emailDomain} is not allowed for this invitation` 
      };
    }
  }

  return { valid: true, invitation: inv };
};

// Delete invitation
export const deleteInvitation = async (id: string): Promise<void> => {
  await db.delete(invitation).where(eq(invitation.id, id));
};

// Delete expired invitations (cleanup)
export const deleteExpiredInvitations = async (
  organizationId?: string
): Promise<number> => {
  let query = db
    .delete(invitation)
    .where(gt(new Date(), invitation.expires));

  if (organizationId) {
    query = query.where(eq(invitation.organizationId, organizationId));
  }

  const result = await query;
  
  // Return count of deleted rows
  return result.count || 0;
};

// Check if email already has pending invitation
export const hasPendingInvitation = async (
  organizationId: string,
  email: string
): Promise<boolean> => {
  const [existing] = await db
    .select()
    .from(invitation)
    .where(
      and(
        eq(invitation.organizationId, organizationId),
        eq(invitation.email, email),
        gt(invitation.expires, new Date())
      )
    )
    .limit(1);

  return !!existing;
};

// Resend invitation (creates new token)
export const resendInvitation = async (
  invitationId: string
): Promise<Invitation | null> => {
  const [existing] = await db
    .select()
    .from(invitation)
    .where(eq(invitation.id, invitationId))
    .limit(1);

  if (!existing) {
    return null;
  }

  // Create new invitation with same details but new token
  return createInvitation({
    organizationId: existing.organizationId,
    email: existing.email || undefined,
    role: existing.role,
    invitedBy: existing.invitedBy,
    allowedDomains: existing.allowedDomains,
  });
};

// Accept invitation
export const acceptInvitation = async (
  token: string,
  userId: string
): Promise<{ organizationId: string; role: TeamRole }> => {
  const inv = await getInvitationByToken(token);

  if (!inv) {
    throw new Error('Invalid invitation token');
  }

  if (inv.expires < new Date()) {
    throw new Error('Invitation has expired');
  }

  // TODO: Add user to organization with the specified role
  // This would typically involve creating an organizationUser record
  // For now, we'll just return the organization info
  
  // Mark invitation as used by deleting it
  await deleteInvitation(inv.id);

  // Trigger webhook event
  try {
    const { webhookHelpers } = await import('@/lib/webhook/delivery');
    await webhookHelpers.invitationAccepted(inv.organizationId, {
      ...inv,
      acceptedBy: userId,
      acceptedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to trigger invitation.accepted webhook:', error);
  }

  return {
    organizationId: inv.organizationId,
    role: inv.role,
  };
};

// Get invitation URL
export const getInvitationUrl = (token: string, baseUrl: string): string => {
  return `${baseUrl}/invitations/accept?token=${token}`;
};

// Helper to determine invitation status
const getInvitationStatus = (inv: { expires: Date }): 'PENDING' | 'EXPIRED' => {
  return inv.expires < new Date() ? 'EXPIRED' : 'PENDING';
};