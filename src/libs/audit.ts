import type { CRUD, Event } from '@retracedhq/retraced';
import { Client } from '@retracedhq/retraced';

import type { auditActionEnum, auditResourceEnum } from '@/models/Schema';
import { auditLogs } from '@/models/Schema';

// Database audit log function for webhook handlers
import { db } from './DB';
import { Env } from './Env';

// Hospital-specific audit event types
export type HospitalAuditEventType =
  // SSO Management Events
  | 'sso.connection.create'
  | 'sso.connection.update'
  | 'sso.connection.delete'
  | 'sso.connection.test'
  | 'sso.login.success'
  | 'sso.login.failure'

  // User and Role Management
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'user.role.update'
  | 'user.login'
  | 'user.logout'
  | 'user.failed_login'

  // Hospital Department Events
  | 'department.create'
  | 'department.update'
  | 'department.delete'
  | 'department.access'

  // Security Events
  | 'account.locked'
  | 'account.unlocked'
  | 'password.changed'
  | 'session.created'
  | 'session.terminated'

  // Compliance Events
  | 'audit.export'
  | 'sensitive.data.access'
  | 'permission.denied'
  | 'compliance.report.generated'

  // Billing Events
  | 'billing.subscription.created'
  | 'billing.subscription.updated'
  | 'billing.subscription.canceled'
  | 'billing.invoice.paid'
  | 'billing.payment.failed'
  | 'billing.checkout.initiated'
  | 'billing.portal.accessed';

export type HospitalAuditRequest = {
  action: HospitalAuditEventType;
  actor: {
    id: string;
    name: string;
    email?: string;
    role?: string;
    department?: string;
  };
  organization: {
    id: string;
    name: string;
  };
  crud: CRUD;
  target?: {
    id?: string;
    name?: string;
    type?: string;
  };
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
};

let retracedClient: Client;

const getRetracedClient = () => {
  if (!Env.RETRACED_API_KEY || !Env.RETRACED_PROJECT_ID || !Env.RETRACED_URL) {
    console.warn('Retraced not configured. Audit events will not be recorded.');
    return null;
  }

  if (!retracedClient) {
    retracedClient = new Client({
      endpoint: `${Env.RETRACED_URL}/auditlog`,
      apiKey: Env.RETRACED_API_KEY,
      projectId: Env.RETRACED_PROJECT_ID,
    });
  }

  return retracedClient;
};

export const sendHospitalAudit = async (request: HospitalAuditRequest) => {
  const client = getRetracedClient();

  if (!client) {
    // Log locally for development/testing
    console.log('🔍 Audit Event (Local):', {
      timestamp: new Date().toISOString(),
      action: request.action,
      actor: request.actor,
      organization: request.organization,
      crud: request.crud,
      target: request.target,
      metadata: request.metadata,
    });
    return;
  }

  const { action, actor, organization, crud, target, metadata } = request;

  const event: Event = {
    action,
    crud,
    group: {
      id: organization.id,
      name: organization.name,
    },
    actor: {
      id: actor.id,
      name: actor.name,
      fields: {
        email: actor.email,
        role: actor.role,
        department: actor.department,
      },
    },
    target: target
      ? {
          id: target.id,
          name: target.name,
          type: target.type,
        }
      : undefined,
    source_ip: request.ipAddress,
    user_agent: request.userAgent,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
      environment: Env.NODE_ENV,
    },
    created: new Date(),
  };

  try {
    await client.reportEvent(event);
    console.log('✅ Audit event recorded:', action);
  } catch (error) {
    console.error('❌ Failed to record audit event:', error);
    // Don't throw error to avoid breaking application flow
  }
};

export const getAuditViewerToken = async (organizationId: string, actorId: string) => {
  const client = getRetracedClient();

  if (!client) {
    throw new Error('Retraced not configured');
  }

  try {
    return await client.getViewerToken(organizationId, actorId, true);
  } catch (error) {
    console.error('Failed to get audit viewer token:', error);
    throw new Error('Unable to get audit viewer token. Please check Retraced configuration.');
  }
};

// Hospital-specific audit helpers
export class HospitalAuditLogger {
  static async ssoConnectionCreated(
    actor: HospitalAuditRequest['actor'],
    organization: HospitalAuditRequest['organization'],
    connectionData: {
      name: string;
      department: string;
      provider: string;
    },
    metadata?: Record<string, any>,
  ) {
    await sendHospitalAudit({
      action: 'sso.connection.create',
      actor,
      organization,
      crud: 'c',
      target: {
        id: connectionData.name,
        name: connectionData.name,
        type: 'sso_connection',
      },
      metadata: {
        ...metadata,
        department: connectionData.department,
        provider: connectionData.provider,
      },
    });
  }

  static async userLogin(
    actor: HospitalAuditRequest['actor'],
    organization: HospitalAuditRequest['organization'],
    loginMethod: 'sso' | 'email' | 'magic_link',
    ipAddress?: string,
    userAgent?: string,
  ) {
    await sendHospitalAudit({
      action: 'user.login',
      actor,
      organization,
      crud: 'r',
      metadata: {
        login_method: loginMethod,
        success: true,
      },
      ipAddress,
      userAgent,
    });
  }

  static async userLoginFailed(
    actorEmail: string,
    organization: HospitalAuditRequest['organization'],
    reason: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    await sendHospitalAudit({
      action: 'user.failed_login',
      actor: {
        id: 'unknown',
        name: actorEmail,
        email: actorEmail,
      },
      organization,
      crud: 'r',
      metadata: {
        failure_reason: reason,
        success: false,
      },
      ipAddress,
      userAgent,
    });
  }

  static async sensitiveDataAccess(
    actor: HospitalAuditRequest['actor'],
    organization: HospitalAuditRequest['organization'],
    dataType: string,
    resourceId?: string,
  ) {
    await sendHospitalAudit({
      action: 'sensitive.data.access',
      actor,
      organization,
      crud: 'r',
      target: {
        id: resourceId,
        type: dataType,
      },
      metadata: {
        security_classification: 'sensitive',
        compliance_relevant: true,
      },
    });
  }

  static async permissionDenied(
    actor: HospitalAuditRequest['actor'],
    organization: HospitalAuditRequest['organization'],
    resource: string,
    action: string,
    requiredRole?: string,
  ) {
    await sendHospitalAudit({
      action: 'permission.denied',
      actor,
      organization,
      crud: 'r',
      target: {
        type: resource,
        name: resource,
      },
      metadata: {
        attempted_action: action,
        required_role: requiredRole,
        security_event: true,
      },
    });
  }
}

type AuditLogInput = {
  organizationId: string;
  actorId: string;
  actorName: string;
  actorEmail?: string;
  action: string;
  crud: typeof auditActionEnum.enumValues[number];
  resource: typeof auditResourceEnum.enumValues[number];
  resourceId?: string;
  resourceName?: string;
  targetId?: string;
  targetName?: string;
  targetType?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  success?: boolean;
  errorMessage?: string;
  duration?: number;
};

export async function createAuditLog(input: AuditLogInput) {
  try {
    // Insert into database
    await db.insert(auditLogs).values({
      organizationId: input.organizationId,
      actorId: input.actorId,
      actorName: input.actorName,
      actorEmail: input.actorEmail,
      action: input.action,
      crud: input.crud,
      resource: input.resource,
      resourceId: input.resourceId,
      resourceName: input.resourceName,
      targetId: input.targetId,
      targetName: input.targetName,
      targetType: input.targetType,
      metadata: input.metadata || {},
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      sessionId: input.sessionId,
      success: input.success ?? true,
      errorMessage: input.errorMessage,
      duration: input.duration,
      complianceFlags: [],
    });

    // Also send to Retraced if configured
    const client = getRetracedClient();
    if (client) {
      await sendHospitalAudit({
        action: input.action as HospitalAuditEventType,
        actor: {
          id: input.actorId,
          name: input.actorName,
          email: input.actorEmail,
        },
        organization: {
          id: input.organizationId,
          name: 'Organization', // This would be fetched from organization data
        },
        crud: input.crud === 'create' ? 'c' : input.crud === 'read' ? 'r' : input.crud === 'update' ? 'u' : 'd',
        target: input.resourceId
          ? {
              id: input.resourceId,
              name: input.resourceName,
              type: input.resource,
            }
          : undefined,
        metadata: input.metadata,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });
    }
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit failures shouldn't break the application
  }
}
