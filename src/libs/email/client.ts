import type { ReactElement } from 'react';
import { Resend } from 'resend';

import { createAuditLog } from '@/libs/audit';
import { Env } from '@/libs/Env';

// Check if we're in demo mode or building
const isDemoMode = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Lazy initialization of Resend client
let resend: Resend | null = null;
const getResendClient = () => {
  if (isDemoMode) {
    // Return a mock client for demo mode
    return {
      emails: {
        send: async () => ({ data: { id: 'demo-email-id' }, error: null }),
      },
    } as any;
  }
  
  if (!resend && Env.RESEND_API_KEY) {
    resend = new Resend(Env.RESEND_API_KEY);
  }
  
  return resend;
};

export type EmailOptions = {
  to: string | string[];
  subject: string;
  template: ReactElement;
  organizationId?: string;
  actorId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
};

export type HospitalEmailContext = {
  hospitalName: string;
  hospitalType?: 'clinic' | 'hospital' | 'health_system';
  complianceLevel: 'basic' | 'hipaa' | 'hipaa_plus';
  supportEmail?: string;
  logoUrl?: string;
};

// HIPAA-compliant email service
export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Validate required environment
    if (!Env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    // Prepare email data with React component
    const emailData = {
      from: `HospitalOS <noreply@${Env.RESEND_DOMAIN || 'hospitalos.com'}>`,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      react: options.template,
      replyTo: options.replyTo,
      attachments: options.attachments,
      headers: {
        // HIPAA compliance headers
        'X-Hospital-Compliance': 'HIPAA',
        'X-PHI-Status': 'No-PHI', // We never send PHI via email
        'X-Email-Type': 'Healthcare-Notification',
        'X-Audit-Required': 'true',
      },
      tags: [
        'hospital-notification',
        ...(options.tags || []),
        ...(options.organizationId ? [`org:${options.organizationId}`] : []),
      ],
    };

    // Send email via Resend
    const client = getResendClient();
    if (!client) {
      throw new Error('Email service not configured');
    }
    const response = await client.emails.send(emailData);

    if (response.error) {
      throw new Error(`Resend API error: ${response.error.message}`);
    }

    // Create audit log for email sending
    if (options.organizationId && options.actorId) {
      await createAuditLog({
        organizationId: options.organizationId,
        actorId: options.actorId,
        actorName: 'System',
        action: 'notification.email.sent',
        crud: 'create',
        resource: 'system_setting',
        resourceId: response.data?.id,
        metadata: {
          emailType: options.subject,
          recipient: Array.isArray(options.to) ? options.to.length : 1,
          tags: options.tags,
          ...options.metadata,
        },
        success: true,
      });
    }

    return {
      success: true,
      messageId: response.data?.id,
    };
  } catch (error) {
    console.error('Email sending failed:', error);

    // Create audit log for failed email
    if (options.organizationId && options.actorId) {
      await createAuditLog({
        organizationId: options.organizationId,
        actorId: options.actorId,
        actorName: 'System',
        action: 'notification.email.failed',
        crud: 'create',
        resource: 'system_setting',
        metadata: {
          emailType: options.subject,
          recipient: Array.isArray(options.to) ? options.to.length : 1,
          error: error instanceof Error ? error.message : 'Unknown error',
          ...options.metadata,
        },
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Send notification to hospital staff
export const sendHospitalNotification = async (
  options: Omit<EmailOptions, 'template'> & {
    template: ReactElement;
    hospitalContext: HospitalEmailContext;
  },
) => {
  return sendEmail({
    ...options,
    tags: [
      'hospital-staff',
      `hospital-type:${options.hospitalContext.hospitalType || 'unknown'}`,
      `compliance:${options.hospitalContext.complianceLevel}`,
      ...(options.tags || []),
    ],
    metadata: {
      hospitalName: options.hospitalContext.hospitalName,
      hospitalType: options.hospitalContext.hospitalType,
      complianceLevel: options.hospitalContext.complianceLevel,
      ...options.metadata,
    },
  });
};

// Send system notification (billing, security, etc.)
export const sendSystemNotification = async (
  options: Omit<EmailOptions, 'template'> & {
    template: ReactElement;
    notificationType: 'billing' | 'security' | 'system' | 'onboarding';
  },
) => {
  return sendEmail({
    ...options,
    tags: [
      'system-notification',
      `type:${options.notificationType}`,
      ...(options.tags || []),
    ],
    metadata: {
      notificationType: options.notificationType,
      ...options.metadata,
    },
  });
};

// Bulk email for hospital announcements (with rate limiting)
export const sendBulkHospitalEmail = async (
  recipients: string[],
  options: Omit<EmailOptions, 'to'> & {
    hospitalContext: HospitalEmailContext;
    batchSize?: number;
    delayBetweenBatches?: number;
  },
): Promise<{ success: number; failed: number; results: Array<{ email: string; success: boolean; error?: string }> }> => {
  const batchSize = options.batchSize || 50; // Respect rate limits
  const delay = options.delayBetweenBatches || 1000; // 1 second between batches
  const results: Array<{ email: string; success: boolean; error?: string }> = [];
  let success = 0;
  let failed = 0;

  // Process in batches to respect rate limits
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    const batchPromises = batch.map(async (email) => {
      const result = await sendHospitalNotification({
        ...options,
        to: email,
      });

      if (result.success) {
        success++;
        return { email, success: true };
      } else {
        failed++;
        return { email, success: false, error: result.error };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Delay between batches (except for the last batch)
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return { success, failed, results };
};

// Get email delivery status (if supported by Resend)
export const getEmailStatus = async (messageId: string) => {
  try {
    // Note: This would require Resend to support delivery status checking
    // For now, we'll return a placeholder
    return {
      messageId,
      status: 'delivered', // or 'pending', 'failed', 'bounced'
      deliveredAt: new Date(),
    };
  } catch (error) {
    console.error('Failed to get email status:', error);
    return null;
  }
};

// Email templates registry for tracking
export const EMAIL_TEMPLATES = {
  // Billing related
  SUBSCRIPTION_WELCOME: 'subscription-welcome',
  SUBSCRIPTION_CANCELLED: 'subscription-cancelled',
  PAYMENT_FAILED: 'payment-failed',
  INVOICE_AVAILABLE: 'invoice-available',

  // Hospital operations
  PATIENT_NOTIFICATION: 'patient-notification',
  STAFF_INVITATION: 'staff-invitation',
  DEPARTMENT_ALERT: 'department-alert',
  SYSTEM_MAINTENANCE: 'system-maintenance',

  // Security
  PASSWORD_RESET: 'password-reset',
  SECURITY_ALERT: 'security-alert',
  LOGIN_NOTIFICATION: 'login-notification',

  // Onboarding
  HOSPITAL_WELCOME: 'hospital-welcome',
  USER_INVITATION: 'user-invitation',
  SETUP_COMPLETE: 'setup-complete',
} as const;

export type EmailTemplateType = typeof EMAIL_TEMPLATES[keyof typeof EMAIL_TEMPLATES];
