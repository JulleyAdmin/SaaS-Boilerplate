import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { sendHospitalNotification } from '@/libs/email/client';
import { StaffInvitationEmail } from '@/libs/email/templates/StaffInvitationEmail';
import { createAuditLog } from '@/libs/audit';
import { Env } from '@/libs/Env';
import crypto from 'crypto';

const inviteStaffSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['administrator', 'doctor', 'nurse', 'technician', 'viewer']),
  department: z.string().min(1, 'Department is required'),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, name, role, department, message } = inviteStaffSchema.parse(body);

    // Get organization details
    const [organization] = await db
      .select()
      .from(organizationSchema)
      .where(eq(organizationSchema.id, orgId))
      .limit(1);

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Get inviter details from Clerk (in real implementation)
    // For now, we'll use placeholder data
    const inviterName = 'Hospital Administrator';
    const inviterRole = 'Administrator';

    // Generate invitation token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const acceptInviteUrl = `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/invitations/accept?token=${inviteToken}&email=${encodeURIComponent(email)}&org=${orgId}`;

    // In a real implementation, you would store the invitation in the database
    // with the token, expiration, and other details

    // Prepare hospital context
    const hospitalContext = {
      hospitalName: organization.id, // In real implementation, get actual hospital name
      hospitalType: 'hospital' as const,
      complianceLevel: 'hipaa' as const,
      supportEmail: 'support@hospitalos.com',
    };

    // Send invitation email
    const emailResult = await sendHospitalNotification({
      to: email,
      subject: `Invitation to join ${hospitalContext.hospitalName} team`,
      template: StaffInvitationEmail({
        hospitalName: hospitalContext.hospitalName,
        inviteeName: name,
        inviterName,
        inviterRole,
        role,
        department,
        acceptInviteUrl,
        expirationDate: expirationDate.toLocaleDateString(),
        hospitalType: hospitalContext.hospitalType,
        supportEmail: hospitalContext.supportEmail,
      }),
      hospitalContext,
      organizationId: orgId,
      actorId: userId,
      tags: ['staff-invitation', `role:${role}`, `department:${department}`],
      metadata: {
        inviteToken: inviteToken.substring(0, 8) + '...', // Log partial token
        inviteeEmail: email,
        inviteeName: name,
        assignedRole: role,
        assignedDepartment: department,
        expiresAt: expirationDate.toISOString(),
        customMessage: message,
      },
    });

    // Create audit log
    await createAuditLog({
      organizationId: orgId,
      actorId: userId,
      actorName: inviterName,
      action: 'team.member.invited',
      crud: 'create',
      resource: 'user',
      resourceId: email,
      resourceName: name,
      metadata: {
        inviteeEmail: email,
        inviteeName: name,
        assignedRole: role,
        assignedDepartment: department,
        emailSent: emailResult.success,
        inviteTokenPrefix: inviteToken.substring(0, 8),
        expiresAt: expirationDate.toISOString(),
      },
      success: emailResult.success,
      errorMessage: emailResult.error,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send invitation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${email}`,
      invitation: {
        email,
        name,
        role,
        department,
        expiresAt: expirationDate.toISOString(),
        inviteToken: inviteToken.substring(0, 8) + '...', // Return partial token for reference
      },
    });

  } catch (error) {
    console.error('Staff invitation failed:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send staff invitation' },
      { status: 500 }
    );
  }
}