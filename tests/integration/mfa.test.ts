import { currentUser } from '@clerk/nextjs/server';
import { describe, expect, it, vi } from 'vitest';

import { enforceMFA } from '@/lib/auth/mfa-enforcement';

// Mock Clerk's currentUser function
vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
}));

describe('MFA Enforcement Integration Tests', () => {
  describe('enforceMFA', () => {
    it('should allow access when MFA is enabled', async () => {
      // Mock user with MFA enabled
      vi.mocked(currentUser).mockResolvedValueOnce({
        id: 'user_123',
        totpEnabled: true,
        backupCodeEnabled: true,
        publicMetadata: {},
      } as any);

      const result = await enforceMFA({ requireMFA: true });

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('authorized');
      expect(result.user).toBeDefined();
    });

    it('should deny access when MFA is required but not enabled', async () => {
      // Mock user without MFA
      vi.mocked(currentUser).mockResolvedValueOnce({
        id: 'user_123',
        totpEnabled: false,
        backupCodeEnabled: false,
        publicMetadata: {},
      } as any);

      const result = await enforceMFA({ requireMFA: true });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('mfa_required');
      expect(result.redirect).toBe('/dashboard/security/mfa');
    });

    it('should require TOTP specifically when specified', async () => {
      // Mock user with only backup codes
      vi.mocked(currentUser).mockResolvedValueOnce({
        id: 'user_123',
        totpEnabled: false,
        backupCodeEnabled: true,
        publicMetadata: {},
      } as any);

      const result = await enforceMFA({
        requireMFA: true,
        requireTOTP: true,
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('totp_required');
    });

    it('should check role-based access', async () => {
      // Mock user with MFA but wrong role
      vi.mocked(currentUser).mockResolvedValueOnce({
        id: 'user_123',
        totpEnabled: true,
        backupCodeEnabled: true,
        publicMetadata: { role: 'viewer' },
      } as any);

      const result = await enforceMFA({
        requireMFA: true,
        allowedRoles: ['administrator', 'manager'],
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('insufficient_permissions');
      expect(result.redirect).toBe('/dashboard');
    });

    it('should allow access with correct role and MFA', async () => {
      // Mock user with MFA and correct role
      vi.mocked(currentUser).mockResolvedValueOnce({
        id: 'user_123',
        totpEnabled: true,
        backupCodeEnabled: true,
        publicMetadata: { role: 'administrator' },
      } as any);

      const result = await enforceMFA({
        requireMFA: true,
        allowedRoles: ['administrator', 'manager'],
      });

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('authorized');
    });

    it('should handle unauthenticated users', async () => {
      // Mock no user
      vi.mocked(currentUser).mockResolvedValueOnce(null);

      const result = await enforceMFA({ requireMFA: true });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('unauthenticated');
      expect(result.redirect).toBe('/sign-in');
    });

    it('should use custom redirect URL', async () => {
      // Mock user without MFA
      vi.mocked(currentUser).mockResolvedValueOnce({
        id: 'user_123',
        totpEnabled: false,
        backupCodeEnabled: false,
        publicMetadata: {},
      } as any);

      const result = await enforceMFA({
        requireMFA: true,
        redirectUrl: '/custom/mfa-setup',
      });

      expect(result.allowed).toBe(false);
      expect(result.redirect).toBe('/custom/mfa-setup');
    });
  });

  describe('MFA Status Checks', () => {
    it('should correctly identify MFA methods', async () => {
      const testCases = [
        {
          user: {
            totpEnabled: true,
            backupCodeEnabled: false,
          },
          expectedMFA: true,
          description: 'TOTP only',
        },
        {
          user: {
            totpEnabled: false,
            backupCodeEnabled: true,
          },
          expectedMFA: true,
          description: 'Backup codes only',
        },
        {
          user: {
            totpEnabled: true,
            backupCodeEnabled: true,
          },
          expectedMFA: true,
          description: 'Both TOTP and backup codes',
        },
        {
          user: {
            totpEnabled: false,
            backupCodeEnabled: false,
          },
          expectedMFA: false,
          description: 'No MFA methods',
        },
      ];

      for (const testCase of testCases) {
        vi.mocked(currentUser).mockResolvedValueOnce({
          id: 'user_123',
          ...testCase.user,
          publicMetadata: {},
        } as any);

        const result = await enforceMFA({ requireMFA: true });

        if (testCase.expectedMFA) {
          expect(result.allowed).toBe(true);
        } else {
          expect(result.allowed).toBe(false);
          expect(result.reason).toBe('mfa_required');
        }
      }
    });
  });
});
