import crypto from 'node:crypto';

import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createAuditLog } from '@/libs/audit';
import { db } from '@/libs/DB';
import { sendSystemNotification } from '@/libs/email/client';
import { PasswordResetEmail } from '@/libs/email/templates/PasswordResetEmail';
import { Env } from '@/libs/Env';
import { organizationSchema } from '@/models/Schema';



// Add password reset table to Schema.ts
const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
  organizationId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, organizationId } = passwordResetSchema.parse(body);

    // Get IP address and user agent for security logging
    const ipAddress = request.headers.get('x-forwarded-for')
      || request.headers.get('x-real-ip')
      || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get organization details if provided
    let hospital = null;
    if (organizationId) {
      const [org] = await db
        .select()
        .from(organizationSchema)
        .where(eq(organizationSchema.id, organizationId))
        .limit(1);

      hospital = org;
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // In a real implementation, you would:
    // 1. Store the reset token in the database with expiration
    // 2. Associate it with the user account
    // For this demo, we'll just generate the URL

    const resetUrl = `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send password reset email
    const emailResult = await sendSystemNotification({
      to: email,
      subject: `Password Reset Request - ${hospital?.id || 'HospitalOS'}`,
      template: PasswordResetEmail({
        hospitalName: hospital?.id || 'Your Hospital',
        userEmail: email,
        resetUrl,
        expirationTime: '1 hour',
        ipAddress,
        userAgent,
        supportEmail: 'support@hospitalos.com',
      }),
      notificationType: 'security',
      organizationId: hospital?.id,
      actorId: 'system',
      tags: ['password-reset', 'security'],
      metadata: {
        resetToken: `${resetToken.substring(0, 8)}...`, // Log partial token for tracking
        requestIp: ipAddress,
        userAgent,
        expiresAt: expiresAt.toISOString(),
      },
    });

    // Create security audit log
    if (hospital?.id) {
      await createAuditLog({
        organizationId: hospital.id,
        actorId: email,
        actorName: email,
        actorEmail: email,
        action: 'auth.password_reset_requested',
        crud: 'create',
        resource: 'user',
        resourceId: email,
        metadata: {
          requestIp: ipAddress,
          userAgent,
          emailSent: emailResult.success,
          resetTokenPrefix: resetToken.substring(0, 8),
        },
        ipAddress,
        userAgent,
        success: emailResult.success,
        errorMessage: emailResult.error,
      });
    }

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 },
      );
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset request failed:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 },
    );
  }
}
