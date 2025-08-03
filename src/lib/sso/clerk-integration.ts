import { clerkClient } from '@clerk/nextjs/server';

import type { SSOProfile, SSOUser } from './types';

export async function createOrUpdateClerkUser(ssoUser: SSOUser): Promise<string> {
  try {
    const clerk = await clerkClient();
    // Try to find existing user by email
    const existingUsers = await clerk.users.getUserList({
      emailAddress: [ssoUser.email],
    });

    if (existingUsers.data.length > 0) {
      const clerkUser = existingUsers.data[0];

      // Update user metadata with SSO information
      if (clerkUser?.id) {
        await clerk.users.updateUserMetadata(clerkUser.id, {
          publicMetadata: {
            ssoProvider: 'saml',
            ssoUserId: ssoUser.id,
            ssoRoles: ssoUser.roles || [],
            ssoGroups: ssoUser.groups || [],
            lastSSOLogin: new Date().toISOString(),
            ...ssoUser.raw,
          },
        });

        return clerkUser.id;
      } else {
        throw new Error('User found but no ID available');
      }
    } else {
      // Create new user
      const clerkUser = await clerk.users.createUser({
        emailAddress: [ssoUser.email],
        firstName: ssoUser.firstName || '',
        lastName: ssoUser.lastName || '',
        skipPasswordRequirement: true,
        skipPasswordChecks: true,
        publicMetadata: {
          ssoProvider: 'saml',
          ssoUserId: ssoUser.id,
          ssoRoles: ssoUser.roles || [],
          ssoGroups: ssoUser.groups || [],
          createdViaSso: true,
          lastSSOLogin: new Date().toISOString(),
          ...ssoUser.raw,
        },
      });

      return clerkUser.id;
    }
  } catch (error) {
    console.error('Failed to create/update Clerk user:', error);
    throw new Error('User creation failed');
  }
}

export async function createClerkSession(userId: string, organizationId?: string) {
  try {
    const clerk = await clerkClient();
    const session = await clerk.sessions.createSession({
      userId,
    });

    return session;
  } catch (error) {
    console.error('Failed to create Clerk session:', error);
    throw new Error('Session creation failed');
  }
}

export async function addUserToOrganization(
  userId: string,
  organizationId: string,
  role: 'admin' | 'basic_member' = 'basic_member',
) {
  try {
    // Check if user is already a member
    const clerk = await clerkClient();
    const memberships = await clerk.organizations.getOrganizationMembershipList({
      organizationId,
    });

    // Check if user is already a member
    const userMembership = memberships.data.find(m => m.publicUserData?.userId === userId);

    if (!userMembership) {
      // Add user to organization
      await clerk.organizations.createOrganizationMembership({
        organizationId,
        userId,
        role: role as any, // Type cast to bypass incorrect type definition
      });
    }
  } catch (error) {
    console.error('Failed to add user to organization:', error);
    // Don't throw error - user can be created without org membership
  }
}

export function mapSSOProfileToClerkUser(profile: SSOProfile): SSOUser {
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    roles: profile.raw.roles || [],
    groups: profile.raw.groups || [],
    raw: profile.raw,
  };
}

export function extractOrganizationFromEmail(email: string): string | null {
  const domain = email.split('@')[1];
  if (!domain) {
    return null;
  }

  // Convert domain to organization identifier
  // This is a simple mapping - in production you'd want a more sophisticated approach
  return domain.replace(/\./g, '-').toLowerCase();
}

export async function syncSSOUserWithTeamMember(
  userId: string,
  organizationId: string,
  ssoRoles: string[] = [],
) {
  // This would integrate with your team_members table
  // to sync SSO roles with internal role system
  try {
    // Map SSO roles to internal roles
    // const mappedRole = mapSSORolesToInternalRole(ssoRoles);

    // Update team_members table through your database layer
    // This is where you'd use your Drizzle ORM to update the team_members table
    // Syncing user with organization and role
    console.log('Syncing SSO user with team member:', { userId, organizationId, ssoRoles });
  } catch (error) {
    console.error('Failed to sync SSO user with team member:', error);
  }
}

function mapSSORolesToInternalRole(ssoRoles: string[]): 'OWNER' | 'ADMIN' | 'MEMBER' {
  // Map SSO roles to internal role system
  const roleMap: Record<string, 'OWNER' | 'ADMIN' | 'MEMBER'> = {
    admin: 'ADMIN',
    administrator: 'ADMIN',
    owner: 'OWNER',
    manager: 'ADMIN',
    user: 'MEMBER',
    member: 'MEMBER',
  };

  for (const role of ssoRoles) {
    const mapped = roleMap[role.toLowerCase()];
    if (mapped) {
      return mapped;
    }
  }

  return 'MEMBER'; // Default to member
}
