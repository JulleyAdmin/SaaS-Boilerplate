import { clerkClient } from '@clerk/nextjs/server';

import type { SSOProfile, SSOUser } from './types';

export async function createOrUpdateClerkUser(ssoUser: SSOUser): Promise<string> {
  try {
    // Try to find existing user by email
    const existingUsers = await clerkClient.users.getUserList({
      emailAddress: [ssoUser.email],
    });

    if (existingUsers.data.length > 0) {
      const clerkUser = existingUsers.data[0];

      // Update user metadata with SSO information
      await clerkClient.users.updateUserMetadata(clerkUser.id, {
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
      // Create new user
      const clerkUser = await clerkClient.users.createUser({
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
    const session = await clerkClient.sessions.createSession({
      userId,
      actor: organizationId ? { sub: organizationId } : undefined,
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
    const memberships = await clerkClient.organizations.getOrganizationMembershipList({
      organizationId,
      userId,
    });

    if (memberships.data.length === 0) {
      // Add user to organization
      await clerkClient.organizations.createOrganizationMembership({
        organizationId,
        userId,
        role,
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
    const mappedRole = mapSSORolesToInternalRole(ssoRoles);

    // Update team_members table through your database layer
    // This is where you'd use your Drizzle ORM to update the team_members table
    // Syncing user with organization and role
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
