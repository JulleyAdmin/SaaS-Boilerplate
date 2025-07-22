import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { deleteInvitation } from '@/models/invitation';
import { getUserRole, canManageTeamMembers } from '@/models/team';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { orgId: string; invitationId: string } }
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
        { error: 'Insufficient permissions to delete invitations' },
        { status: 403 }
      );
    }

    await deleteInvitation(params.invitationId);

    return Response.json({ message: 'Invitation deleted successfully' });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return Response.json(
      { error: 'Failed to delete invitation' },
      { status: 500 }
    );
  }
}