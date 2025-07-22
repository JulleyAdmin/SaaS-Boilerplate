import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export interface MFAEnforcementOptions {
  requireMFA?: boolean;
  requireTOTP?: boolean;
  redirectUrl?: string;
  allowedRoles?: string[];
}

export async function enforceMFA(options: MFAEnforcementOptions = {}) {
  const {
    requireMFA = true,
    requireTOTP = false,
    redirectUrl = '/dashboard/security/mfa',
    allowedRoles = [],
  } = options;

  const user = await currentUser();

  if (!user) {
    return {
      allowed: false,
      reason: 'unauthenticated',
      redirect: '/sign-in',
    };
  }

  // Check if user has required role (if specified)
  if (allowedRoles.length > 0) {
    const userRole = user.publicMetadata?.role as string | undefined;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return {
        allowed: false,
        reason: 'insufficient_permissions',
        redirect: '/dashboard',
      };
    }
  }

  // Check MFA requirements
  const hasMFA = user.totpEnabled || user.backupCodeEnabled;
  const hasTOTP = user.totpEnabled;

  if (requireMFA && !hasMFA) {
    return {
      allowed: false,
      reason: 'mfa_required',
      redirect: redirectUrl,
    };
  }

  if (requireTOTP && !hasTOTP) {
    return {
      allowed: false,
      reason: 'totp_required',
      redirect: redirectUrl,
    };
  }

  return {
    allowed: true,
    reason: 'authorized',
    user,
  };
}

// Middleware helper for API routes
export async function withMFAProtection(
  handler: Function,
  options: MFAEnforcementOptions = {},
) {
  return async (request: Request, ...args: any[]) => {
    const mfaCheck = await enforceMFA(options);

    if (!mfaCheck.allowed) {
      return NextResponse.json(
        {
          error: 'MFA Required',
          reason: mfaCheck.reason,
          redirect: mfaCheck.redirect,
        },
        { status: 403 },
      );
    }

    return handler(request, ...args);
  };
}

// React hook for client-side MFA enforcement
export function useMFAEnforcement(_options: MFAEnforcementOptions = {}) {
  // This would be implemented as a React hook for client-side usage
  // For now, we'll keep it server-side only
  throw new Error('useMFAEnforcement is not yet implemented for client-side usage');
}