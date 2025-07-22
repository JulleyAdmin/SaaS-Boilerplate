import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { z } from 'zod';

import { fetchTeamMembers, addTeamMember, getUserRole, canManageTeamMembers } from '@/models/team';
import type { TeamRole } from '@/models/team';

const addMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId || orgId !== params.orgId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch team members
    const members = await fetchTeamMembers(params.orgId);

    // Fetch user details from Clerk
    const clerk = await clerkClient();
    const userIds = members.map(m => m.userId);
    const users = await clerk.users.getUserList({ userId: userIds });

    // Combine member data with user data
    const membersWithUsers = members.map(member => {
      const user = users.data.find(u => u.id === member.userId);
      return {
        ...member,
        user: user ? {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
          imageUrl: user.imageUrl,
        } : undefined,
      };
    });

    return Response.json({ data: membersWithUsers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return Response.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId || orgId !== params.orgId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if user can manage team members
    const userRole = await getUserRole(params.orgId, userId);
    if (!canManageTeamMembers(userRole)) {
      return Response.json(
        { error: 'Insufficient permissions to manage team members' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = addMemberSchema.parse(body);

    // Add the team member
    const member = await addTeamMember({
      organizationId: params.orgId,
      userId: validatedData.userId,
      role: validatedData.role as TeamRole,
    });

    return Response.json({ data: member }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error adding team member:', error);
    return Response.json(
      { error: 'Failed to add team member' },
      { status: 500 }
    );
  }
}