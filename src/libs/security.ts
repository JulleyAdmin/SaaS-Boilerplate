import { clerkClient } from '@clerk/nextjs/server';

import { HospitalAuditLogger } from './audit';

export type SecuritySettings = {
  maxFailedAttempts: number;
  lockoutDuration: number; // in minutes
  enableIpBlocking: boolean;
  maxLoginAttemptsPerIp: number;
  ipBlockDuration: number; // in minutes
};

export const defaultSecuritySettings: SecuritySettings = {
  maxFailedAttempts: 5,
  lockoutDuration: 30, // 30 minutes
  enableIpBlocking: true,
  maxLoginAttemptsPerIp: 10,
  ipBlockDuration: 60, // 1 hour
};

export class HospitalSecurityManager {
  private static failedAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private static blockedIPs: Map<string, { blockedUntil: Date; attempts: number }> = new Map();
  private static accountLockouts: Map<string, { lockedUntil: Date; attempts: number }> = new Map();

  /**
   * Record a failed login attempt
   */
  static async recordFailedLogin(
    email: string,
    organizationId: string,
    ipAddress?: string,
    userAgent?: string,
    reason = 'Invalid credentials',
  ): Promise<{ shouldLockAccount: boolean; shouldBlockIp: boolean }> {
    const settings = defaultSecuritySettings;
    const now = new Date();

    // Record failed attempt for user
    const userKey = `${email}:${organizationId}`;
    const userAttempts = this.failedAttempts.get(userKey) || { count: 0, lastAttempt: now };
    userAttempts.count += 1;
    userAttempts.lastAttempt = now;
    this.failedAttempts.set(userKey, userAttempts);

    // Record failed attempt for IP
    let shouldBlockIp = false;
    if (ipAddress && settings.enableIpBlocking) {
      const ipAttempts = this.blockedIPs.get(ipAddress) || { blockedUntil: now, attempts: 0 };
      ipAttempts.attempts += 1;

      if (ipAttempts.attempts >= settings.maxLoginAttemptsPerIp) {
        ipAttempts.blockedUntil = new Date(now.getTime() + settings.ipBlockDuration * 60 * 1000);
        shouldBlockIp = true;
      }

      this.blockedIPs.set(ipAddress, ipAttempts);
    }

    // Check if account should be locked
    const shouldLockAccount = userAttempts.count >= settings.maxFailedAttempts;

    if (shouldLockAccount) {
      await this.lockAccount(email, organizationId, settings.lockoutDuration);
    }

    // Log audit event
    await HospitalAuditLogger.userLoginFailed(
      email,
      { id: organizationId, name: 'Hospital Organization' },
      reason,
      ipAddress,
      userAgent,
    );

    return { shouldLockAccount, shouldBlockIp };
  }

  /**
   * Record a successful login
   */
  static async recordSuccessfulLogin(
    userId: string,
    email: string,
    organizationId: string,
    loginMethod: 'sso' | 'email' | 'magic_link',
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    // Clear failed attempts on successful login
    const userKey = `${email}:${organizationId}`;
    this.failedAttempts.delete(userKey);
    this.accountLockouts.delete(userKey);

    // Update user metadata with last login
    try {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(userId, {
        privateMetadata: {
          lastLoginAt: new Date().toISOString(),
          lastLoginIp: ipAddress,
          lastLoginMethod: loginMethod,
        },
      });
    } catch (error) {
      console.error('Failed to update user metadata:', error);
    }

    // Log audit event
    await HospitalAuditLogger.userLogin(
      {
        id: userId,
        name: email,
        email,
      },
      { id: organizationId, name: 'Hospital Organization' },
      loginMethod,
      ipAddress,
      userAgent,
    );
  }

  /**
   * Lock an account
   */
  static async lockAccount(
    email: string,
    organizationId: string,
    durationMinutes: number,
  ): Promise<void> {
    const userKey = `${email}:${organizationId}`;
    const lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);

    this.accountLockouts.set(userKey, {
      lockedUntil,
      attempts: this.failedAttempts.get(userKey)?.count || 0,
    });

    // Log security event
    console.log(`Account locked: ${email} until ${lockedUntil}`);
  }

  /**
   * Check if account is locked
   */
  static isAccountLocked(email: string, organizationId: string): boolean {
    const userKey = `${email}:${organizationId}`;
    const lockout = this.accountLockouts.get(userKey);

    if (!lockout) {
      return false;
    }

    if (lockout.lockedUntil > new Date()) {
      return true;
    }

    // Lockout expired, remove it
    this.accountLockouts.delete(userKey);
    return false;
  }

  /**
   * Check if IP is blocked
   */
  static isIpBlocked(ipAddress: string): boolean {
    if (!ipAddress) {
      return false;
    }

    const blocked = this.blockedIPs.get(ipAddress);
    if (!blocked) {
      return false;
    }

    if (blocked.blockedUntil > new Date()) {
      return true;
    }

    // Block expired, remove it
    this.blockedIPs.delete(ipAddress);
    return false;
  }

  /**
   * Unlock an account manually (admin function)
   */
  static async unlockAccount(
    email: string,
    organizationId: string,
    adminUserId: string,
  ): Promise<void> {
    const userKey = `${email}:${organizationId}`;
    this.accountLockouts.delete(userKey);
    this.failedAttempts.delete(userKey);

    console.log(`Account unlocked by admin: ${email} (admin: ${adminUserId})`);
  }

  /**
   * Get security status for a user
   */
  static getSecurityStatus(email: string, organizationId: string): {
    isLocked: boolean;
    failedAttempts: number;
    lockedUntil?: Date;
    remainingAttempts: number;
  } {
    const userKey = `${email}:${organizationId}`;
    const attempts = this.failedAttempts.get(userKey);
    const lockout = this.accountLockouts.get(userKey);

    return {
      isLocked: this.isAccountLocked(email, organizationId),
      failedAttempts: attempts?.count || 0,
      lockedUntil: lockout?.lockedUntil,
      remainingAttempts: Math.max(0, defaultSecuritySettings.maxFailedAttempts - (attempts?.count || 0)),
    };
  }

  /**
   * Clean up expired entries (should be called periodically)
   */
  static cleanupExpiredEntries(): void {
    const now = new Date();

    // Clean up expired IP blocks
    for (const [ip, data] of this.blockedIPs.entries()) {
      if (data.blockedUntil <= now) {
        this.blockedIPs.delete(ip);
      }
    }

    // Clean up expired account lockouts
    for (const [userKey, data] of this.accountLockouts.entries()) {
      if (data.lockedUntil <= now) {
        this.accountLockouts.delete(userKey);
      }
    }

    // Clean up old failed attempts (older than 24 hours)
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    for (const [userKey, data] of this.failedAttempts.entries()) {
      if (data.lastAttempt <= dayAgo) {
        this.failedAttempts.delete(userKey);
      }
    }
  }
}

// Utility functions for extracting request information
export const getClientIP = (req: Request): string | undefined => {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim();
  }

  return (
    req.headers.get('x-real-ip')
    || req.headers.get('x-client-ip')
    || req.headers.get('cf-connecting-ip')
    || undefined
  );
};

export const getUserAgent = (req: Request): string | undefined => {
  return req.headers.get('user-agent') || undefined;
};

// Initialize cleanup interval (runs every hour)
if (typeof window === 'undefined') {
  setInterval(() => {
    HospitalSecurityManager.cleanupExpiredEntries();
  }, 60 * 60 * 1000); // 1 hour
}
