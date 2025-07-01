/**
 * Clerk SSO Integration Tests
 * Tests the integration between Clerk authentication and SSO flows
 */

import { clerkClient } from '@clerk/nextjs';
import { beforeEach, describe, expect, vi } from 'vitest';

// Mock Clerk client
vi.mock('@clerk/nextjs', () => ({
  clerkClient: {
    organizations: {
      getOrganization: vi.fn(),
      createOrganization: vi.fn(),
      updateOrganization: vi.fn(),
    },
    users: {
      getUser: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
    },
    organizationMemberships: {
      createOrganizationMembership: vi.fn(),
      updateOrganizationMembership: vi.fn(),
      getOrganizationMembershipList: vi.fn(),
    },
    sessions: {
      createSession: vi.fn(),
      getSession: vi.fn(),
    },
  },
  auth: vi.fn(() => ({
    userId: 'user_test_123',
    orgId: 'org_test_123',
    sessionId: 'sess_test_123',
  })),
}));

describe('Clerk SSO Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('User Creation from SSO', () => {
    it('should create new Clerk user from SAML attributes', async () => {
      const samlAttributes = {
        email: 'newdoctor@hospital.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'MEMBER',
        department: 'Cardiology',
        employeeId: 'EMP12345',
      };

      // Mock Clerk user creation
      const mockCreatedUser = {
        id: 'user_new_456',
        emailAddresses: [{ emailAddress: samlAttributes.email }],
        firstName: samlAttributes.firstName,
        lastName: samlAttributes.lastName,
        publicMetadata: {
          role: samlAttributes.role,
          department: samlAttributes.department,
          employeeId: samlAttributes.employeeId,
        },
      };

      vi.mocked(clerkClient.users.createUser).mockResolvedValue(mockCreatedUser);

      // Simulate SSO user creation
      const { createUserFromSSO } = await import('@/lib/auth/sso-integration');
      const result = await createUserFromSSO(samlAttributes, 'org_test_123');

      expect(clerkClient.users.createUser).toHaveBeenCalledWith({
        emailAddress: [samlAttributes.email],
        firstName: samlAttributes.firstName,
        lastName: samlAttributes.lastName,
        publicMetadata: {
          role: samlAttributes.role,
          department: samlAttributes.department,
          employeeId: samlAttributes.employeeId,
          ssoProvider: 'saml',
        },
      });

      expect(result.user.id).toBe('user_new_456');
      expect(result.user.publicMetadata.role).toBe('MEMBER');
    });

    it('should handle user creation with minimal SAML attributes', async () => {
      const minimalAttributes = {
        email: 'minimal@hospital.com',
      };

      const mockUser = {
        id: 'user_minimal_789',
        emailAddresses: [{ emailAddress: minimalAttributes.email }],
        firstName: null,
        lastName: null,
        publicMetadata: {
          role: 'MEMBER', // Default role
          ssoProvider: 'saml',
        },
      };

      vi.mocked(clerkClient.users.createUser).mockResolvedValue(mockUser);

      const { createUserFromSSO } = await import('@/lib/auth/sso-integration');
      const result = await createUserFromSSO(minimalAttributes, 'org_test_123');

      expect(clerkClient.users.createUser).toHaveBeenCalledWith({
        emailAddress: [minimalAttributes.email],
        publicMetadata: {
          role: 'MEMBER',
          ssoProvider: 'saml',
        },
      });

      expect(result.user.publicMetadata.role).toBe('MEMBER');
    });

    it('should handle OIDC user creation with different attribute mapping', async () => {
      const oidcClaims = {
        'email': 'oidcuser@hospital.com',
        'given_name': 'John',
        'family_name': 'Doe',
        'custom:role': 'ADMIN',
        'custom:department': 'Administration',
      };

      const mockUser = {
        id: 'user_oidc_321',
        emailAddresses: [{ emailAddress: oidcClaims.email }],
        firstName: oidcClaims.given_name,
        lastName: oidcClaims.family_name,
        publicMetadata: {
          role: 'ADMIN',
          department: 'Administration',
          ssoProvider: 'oidc',
        },
      };

      vi.mocked(clerkClient.users.createUser).mockResolvedValue(mockUser);

      const { createUserFromOIDC } = await import('@/lib/auth/sso-integration');
      const result = await createUserFromOIDC(oidcClaims, 'org_test_123');

      expect(result.user.publicMetadata.role).toBe('ADMIN');
      expect(result.user.publicMetadata.ssoProvider).toBe('oidc');
    });
  });

  describe('Organization Membership Management', () => {
    it('should add user to organization with correct role', async () => {
      const userId = 'user_test_123';
      const orgId = 'org_test_123';
      const role = 'ADMIN';

      const mockMembership = {
        id: 'orgmem_test_456',
        userId,
        organizationId: orgId,
        role,
        publicMetadata: {
          department: 'Administration',
          joinedViaSSO: true,
        },
      };

      vi.mocked(clerkClient.organizationMemberships.createOrganizationMembership)
        .mockResolvedValue(mockMembership);

      const { addUserToOrganization } = await import('@/lib/auth/sso-integration');
      const result = await addUserToOrganization(userId, orgId, role, 'Administration');

      expect(clerkClient.organizationMemberships.createOrganizationMembership)
        .toHaveBeenCalledWith({
          userId,
          organizationId: orgId,
          role,
          publicMetadata: {
            department: 'Administration',
            joinedViaSSO: true,
          },
        });

      expect(result.membership.role).toBe('ADMIN');
    });

    it('should update existing membership role via SSO', async () => {
      const userId = 'user_test_123';
      const orgId = 'org_test_123';
      const newRole = 'ADMIN';

      // Mock existing membership
      const existingMemberships = [{
        id: 'orgmem_existing_789',
        userId,
        organizationId: orgId,
        role: 'MEMBER',
      }];

      vi.mocked(clerkClient.organizationMemberships.getOrganizationMembershipList)
        .mockResolvedValue({ data: existingMemberships, totalCount: 1 });

      const updatedMembership = {
        ...existingMemberships[0],
        role: newRole,
      };

      vi.mocked(clerkClient.organizationMemberships.updateOrganizationMembership)
        .mockResolvedValue(updatedMembership);

      const { updateUserOrganizationRole } = await import('@/lib/auth/sso-integration');
      const result = await updateUserOrganizationRole(userId, orgId, newRole);

      expect(clerkClient.organizationMemberships.updateOrganizationMembership)
        .toHaveBeenCalledWith({
          organizationId: orgId,
          userId,
          role: newRole,
        });

      expect(result.membership.role).toBe('ADMIN');
    });

    it('should handle role mapping from SSO attributes to Clerk roles', async () => {
      const ssoRoleMappings = [
        { ssoRole: 'hospital_admin', clerkRole: 'admin' },
        { ssoRole: 'doctor', clerkRole: 'basic_member' },
        { ssoRole: 'nurse', clerkRole: 'basic_member' },
        { ssoRole: 'it_admin', clerkRole: 'admin' },
      ];

      const { mapSSORoleToClerkRole } = await import('@/lib/auth/sso-integration');

      for (const mapping of ssoRoleMappings) {
        const clerkRole = mapSSORoleToClerkRole(mapping.ssoRole);

        expect(clerkRole).toBe(mapping.clerkRole);
      }

      // Test unknown role defaults to basic_member
      const unknownRole = mapSSORoleToClerkRole('unknown_role');

      expect(unknownRole).toBe('basic_member');
    });
  });

  describe('Session Management', () => {
    it('should create Clerk session after successful SSO', async () => {
      const userId = 'user_test_123';
      const sessionData = {
        id: 'sess_sso_456',
        userId,
        status: 'active',
        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      vi.mocked(clerkClient.sessions.createSession).mockResolvedValue(sessionData);

      const { createSSOSession } = await import('@/lib/auth/sso-integration');
      const result = await createSSOSession(userId, {
        ssoProvider: 'saml',
        organizationId: 'org_test_123',
      });

      expect(clerkClient.sessions.createSession).toHaveBeenCalledWith({
        userId,
        sessionMetadata: {
          ssoProvider: 'saml',
          organizationId: 'org_test_123',
          authenticatedAt: expect.any(Date),
        },
      });

      expect(result.session.status).toBe('active');
    });

    it('should handle session refresh for SSO users', async () => {
      const existingSession = {
        id: 'sess_existing_789',
        userId: 'user_test_123',
        status: 'active',
        lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        metadata: {
          ssoProvider: 'saml',
          organizationId: 'org_test_123',
        },
      };

      vi.mocked(clerkClient.sessions.getSession).mockResolvedValue(existingSession);

      const { refreshSSOSession } = await import('@/lib/auth/sso-integration');
      const shouldRefresh = await refreshSSOSession('sess_existing_789');

      expect(shouldRefresh).toBe(true); // Session is old enough to refresh
    });

    it('should validate SSO session constraints', async () => {
      const sessionId = 'sess_test_456';
      const mockSession = {
        id: sessionId,
        userId: 'user_test_123',
        status: 'active',
        metadata: {
          ssoProvider: 'saml',
          organizationId: 'org_test_123',
          maxSessionDuration: 8 * 60 * 60 * 1000, // 8 hours
          createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
        },
      };

      vi.mocked(clerkClient.sessions.getSession).mockResolvedValue(mockSession);

      const { validateSSOSession } = await import('@/lib/auth/sso-integration');
      const isValid = await validateSSOSession(sessionId);

      expect(isValid).toBe(false); // Session exceeded max duration
    });
  });

  describe('Attribute Synchronization', () => {
    it('should sync user attributes from SSO provider', async () => {
      const userId = 'user_test_123';
      const updatedAttributes = {
        firstName: 'Jane',
        lastName: 'Smith-Updated',
        publicMetadata: {
          role: 'ADMIN',
          department: 'Emergency',
          employeeId: 'EMP54321',
          lastSSOSync: new Date().toISOString(),
        },
      };

      const mockUpdatedUser = {
        id: userId,
        ...updatedAttributes,
      };

      vi.mocked(clerkClient.users.updateUser).mockResolvedValue(mockUpdatedUser);

      const { syncUserFromSSO } = await import('@/lib/auth/sso-integration');
      const result = await syncUserFromSSO(userId, updatedAttributes);

      expect(clerkClient.users.updateUser).toHaveBeenCalledWith(userId, updatedAttributes);
      expect(result.user.publicMetadata.lastSSOSync).toBeDefined();
    });

    it('should handle partial attribute updates', async () => {
      const userId = 'user_test_123';
      const partialUpdate = {
        publicMetadata: {
          department: 'ICU', // Only updating department
        },
      };

      const existingUser = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        publicMetadata: {
          role: 'MEMBER',
          department: 'Emergency',
          employeeId: 'EMP12345',
        },
      };

      const expectedUpdate = {
        publicMetadata: {
          ...existingUser.publicMetadata,
          department: 'ICU',
          lastSSOSync: expect.any(String),
        },
      };

      vi.mocked(clerkClient.users.getUser).mockResolvedValue(existingUser);
      vi.mocked(clerkClient.users.updateUser).mockResolvedValue({
        ...existingUser,
        ...expectedUpdate,
      });

      const { syncUserFromSSO } = await import('@/lib/auth/sso-integration');
      await syncUserFromSSO(userId, partialUpdate);

      expect(clerkClient.users.updateUser).toHaveBeenCalledWith(userId, expectedUpdate);
    });
  });

  describe('Error Handling', () => {
    it('should handle Clerk API errors gracefully', async () => {
      const samlAttributes = {
        email: 'error@hospital.com',
        firstName: 'Error',
        lastName: 'User',
      };

      // Mock Clerk API error
      vi.mocked(clerkClient.users.createUser).mockRejectedValue(
        new Error('Clerk API Error: Rate limit exceeded'),
      );

      const { createUserFromSSO } = await import('@/lib/auth/sso-integration');

      await expect(createUserFromSSO(samlAttributes, 'org_test_123'))
        .rejects.toThrow('Failed to create user: Clerk API Error: Rate limit exceeded');
    });

    it('should handle duplicate user creation attempts', async () => {
      const email = 'duplicate@hospital.com';
      const samlAttributes = {
        email,
        firstName: 'Duplicate',
        lastName: 'User',
      };

      // Mock Clerk returning error for duplicate email
      vi.mocked(clerkClient.users.createUser).mockRejectedValue(
        new Error('Email address is already in use'),
      );

      // Mock finding existing user
      const existingUser = {
        id: 'user_existing_456',
        emailAddresses: [{ emailAddress: email }],
      };

      const { createUserFromSSO } = await import('@/lib/auth/sso-integration');

      try {
        await createUserFromSSO(samlAttributes, 'org_test_123');
      } catch (error) {
        expect(error.message).toContain('Email address is already in use');
      }
    });

    it('should handle organization membership conflicts', async () => {
      const userId = 'user_test_123';
      const orgId = 'org_test_123';

      // Mock error for user already being a member
      vi.mocked(clerkClient.organizationMemberships.createOrganizationMembership)
        .mockRejectedValue(new Error('User is already a member of this organization'));

      const { addUserToOrganization } = await import('@/lib/auth/sso-integration');

      await expect(addUserToOrganization(userId, orgId, 'MEMBER', 'Emergency'))
        .rejects.toThrow('User is already a member of this organization');
    });
  });

  describe('Security Validations', () => {
    it('should validate SSO assertions before creating users', async () => {
      const invalidAttributes = {
        email: 'invalid-email', // Invalid email format
        role: 'SUPER_ADMIN', // Invalid role
      };

      const { validateSSOAttributes } = await import('@/lib/auth/sso-integration');
      const validation = validateSSOAttributes(invalidAttributes);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Invalid email format');
      expect(validation.errors).toContain('Invalid role specified');
    });

    it('should prevent privilege escalation via SSO', async () => {
      const userId = 'user_test_123';
      const orgId = 'org_test_123';
      const maliciousRole = 'SUPER_ADMIN'; // Not a valid Clerk role

      const { updateUserOrganizationRole } = await import('@/lib/auth/sso-integration');

      await expect(updateUserOrganizationRole(userId, orgId, maliciousRole))
        .rejects.toThrow('Invalid role specified');
    });

    it('should validate organization membership before SSO login', async () => {
      const userId = 'user_test_123';
      const orgId = 'org_unauthorized_456';

      // Mock no membership found
      vi.mocked(clerkClient.organizationMemberships.getOrganizationMembershipList)
        .mockResolvedValue({ data: [], totalCount: 0 });

      const { validateOrganizationAccess } = await import('@/lib/auth/sso-integration');
      const hasAccess = await validateOrganizationAccess(userId, orgId);

      expect(hasAccess).toBe(false);
    });
  });

  describe('Hospital-Specific Features', () => {
    it('should handle medical role assignments correctly', async () => {
      const medicalRoles = [
        { ssoRole: 'attending_physician', clerkRole: 'admin', department: 'Medicine' },
        { ssoRole: 'resident', clerkRole: 'basic_member', department: 'Medicine' },
        { ssoRole: 'nurse_manager', clerkRole: 'admin', department: 'Nursing' },
        { ssoRole: 'rn', clerkRole: 'basic_member', department: 'Nursing' },
      ];

      const { mapMedicalRoleToClerkRole } = await import('@/lib/auth/sso-integration');

      for (const roleMapping of medicalRoles) {
        const result = mapMedicalRoleToClerkRole(roleMapping.ssoRole);

        expect(result.clerkRole).toBe(roleMapping.clerkRole);
        expect(result.department).toBe(roleMapping.department);
      }
    });

    it('should handle HIPAA compliance metadata', async () => {
      const userId = 'user_test_123';
      const hipaaMetadata = {
        hipaaTrainingCompleted: true,
        hipaaTrainingDate: '2024-01-15',
        accessLevel: 'full_patient_records',
        backgroundCheckDate: '2024-01-01',
      };

      const { updateHIPAAMetadata } = await import('@/lib/auth/sso-integration');
      await updateHIPAAMetadata(userId, hipaaMetadata);

      expect(clerkClient.users.updateUser).toHaveBeenCalledWith(userId, {
        publicMetadata: expect.objectContaining({
          hipaa: hipaaMetadata,
        }),
      });
    });

    it('should sync department-specific permissions', async () => {
      const emergencyPermissions = [
        'view_emergency_patients',
        'create_emergency_orders',
        'access_trauma_protocols',
      ];

      const icuPermissions = [
        'view_icu_patients',
        'manage_ventilator_settings',
        'access_critical_care_protocols',
      ];

      const { getDepartmentPermissions } = await import('@/lib/auth/sso-integration');

      const emergencyPerms = getDepartmentPermissions('Emergency');
      const icuPerms = getDepartmentPermissions('ICU');

      expect(emergencyPerms).toEqual(expect.arrayContaining(emergencyPermissions));
      expect(icuPerms).toEqual(expect.arrayContaining(icuPermissions));
    });
  });
});
