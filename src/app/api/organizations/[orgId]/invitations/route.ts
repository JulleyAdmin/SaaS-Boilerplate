import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { Env } from '@/libs/Env';
import {
  createInvitation,
  fetchInvitations,
  hasPendingInvitation,
} from '@/models/invitation';
import { canManageTeamMembers, getUserRole } from '@/models/team';

const createInvitationSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'MEMBER']), // Can't invite as OWNER
  allowedDomains: z.array(z.string()).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { orgId: string } },
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId || orgId !== params.orgId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check permissions
    const userRole = await getUserRole(params.orgId, userId);
    if (!canManageTeamMembers(userRole)) {
      return Response.json(
        { error: 'Insufficient permissions to view invitations' },
        { status: 403 },
      );
    }

    const invitations = await fetchInvitations(params.orgId);

    return Response.json({ data: invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return Response.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } },
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId || orgId !== params.orgId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check permissions
    const userRole = await getUserRole(params.orgId, userId);
    if (!canManageTeamMembers(userRole)) {
      return Response.json(
        { error: 'Insufficient permissions to create invitations' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const validatedData = createInvitationSchema.parse(body);

    // Check if email already has pending invitation
    if (validatedData.email) {
      const hasPending = await hasPendingInvitation(params.orgId, validatedData.email);
      if (hasPending) {
        return Response.json(
          { error: 'This email already has a pending invitation' },
          { status: 400 },
        );
      }
    }

    // Create the invitation
    const invitation = await createInvitation({
      organizationId: params.orgId,
      email: validatedData.email,
      role: validatedData.role,
      invitedBy: userId,
      allowedDomains: validatedData.allowedDomains,
    });

    // Generate invitation URL
    const baseUrl = Env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`;
    const invitationUrl = `${baseUrl}/invitations/accept?token=${invitation.token}`;

    // TODO: Send invitation email if email is provided
    if (invitation.email) {
      // await sendInvitationEmail(invitation.email, invitationUrl);
      console.log(`Invitation email would be sent to: ${invitation.email}`);
    }

    return Response.json({
      data: {
        ...invitation,
        invitationUrl,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error creating invitation:', error);
    return Response.json(
      { error: 'Failed to create invitation' },
      { status: 500 },
    );
  }
}
