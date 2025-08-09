import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createAuditLog } from '@/libs/audit';



const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  email: z.string().email('Invalid email address'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  organizationId: z.string().optional(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email, organizationId } = resetPasswordSchema.parse(body);

    // Get IP address and user agent for security logging
    const ipAddress = request.headers.get('x-forwarded-for')
      || request.headers.get('x-real-ip')
      || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // In a real implementation, you would:
    // 1. Validate the reset token against the database
    // 2. Check if the token hasn't expired
    // 3. Verify the token belongs to the email address
    // 4. Hash the new password and update the user account
    // 5. Invalidate the reset token

    // For this demo, we'll simulate the validation
    if (!token || token.length < 32) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 },
      );
    }

    // Simulate password update success
    const passwordUpdateSuccess = true;

    if (!passwordUpdateSuccess) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 },
      );
    }

    // Create security audit log
    if (organizationId) {
      await createAuditLog({
        organizationId,
        actorId: email,
        actorName: email,
        actorEmail: email,
        action: 'auth.password_reset_completed',
        crud: 'update',
        resource: 'user',
        resourceId: email,
        metadata: {
          requestIp: ipAddress,
          userAgent,
          resetTokenUsed: `${token.substring(0, 8)}...`,
          passwordChanged: true,
        },
        ipAddress,
        userAgent,
        success: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Password reset failed:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 },
    );
  }
}
