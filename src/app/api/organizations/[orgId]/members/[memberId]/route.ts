import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { z } from 'zod';

import { 
  updateTeamMemberRole, 
  removeTeamMember, 
  getUserRole, 
  canUpdateMemberRole,
  canRemoveMember,
  fetchTeamMembers
} from '@/models/team';
import type { TeamRole } from '@/models/team';

const updateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER']), // Can't promote to OWNER via this endpoint
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string; memberId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId || orgId !== params.orgId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateRoleSchema.parse(body);

    // Get current user's role
    const userRole = await getUserRole(params.orgId, userId);
    
    // Get target member's current role
    const members = await fetchTeamMembers(params.orgId);
    const targetMember = members.find(m => m.id === params.memberId);
    
    if (!targetMember) {
      return Response.json({ error: 'Member not found' }, { status: 404 });
    }

    // Check if user can update this member's role
    if (!canUpdateMemberRole(userRole, targetMember.role, validatedData.role as TeamRole)) {
      return Response.json(
        { error: 'Insufficient permissions to update this member\'s role' },
        { status: 403 }
      );
    }

    // Update the role
    const updated = await updateTeamMemberRole(params.memberId, validatedData.role as TeamRole);

    if (!updated) {
      return Response.json({ error: 'Failed to update member role' }, { status: 500 });
    }

    return Response.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating member role:', error);
    return Response.json(
      { error: 'Failed to update member role' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { orgId: string; memberId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId || orgId !== params.orgId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get current user's role
    const userRole = await getUserRole(params.orgId, userId);
    
    // Get target member's role
    const members = await fetchTeamMembers(params.orgId);
    const targetMember = members.find(m => m.id === params.memberId);
    
    if (!targetMember) {
      return Response.json({ error: 'Member not found' }, { status: 404 });
    }

    // Prevent self-removal
    if (targetMember.userId === userId) {
      return Response.json(
        { error: 'You cannot remove yourself from the team' },
        { status: 400 }
      );
    }

    // Check if user can remove this member
    if (!canRemoveMember(userRole, targetMember.role)) {
      return Response.json(
        { error: 'Insufficient permissions to remove this member' },
        { status: 403 }
      );
    }

    // Remove the member
    await removeTeamMember(params.memberId);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error removing team member:', error);
    return Response.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}