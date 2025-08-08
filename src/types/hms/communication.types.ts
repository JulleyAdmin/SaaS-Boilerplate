/**
 * HMS Communication & Audit Type Definitions
 * Matching communication, audit, and webhook tables from Schema.ts
 */

import type {
  AuditAction,
  AuditResource,
  CommunicationType,
  MessageStatus,
  Severity,
  UserRole,
} from './enums.types';
import type { Patient } from './patient.types';
import type { User } from './user.types';

// WhatsApp Template Interface
export type WhatsAppTemplate = {
  templateId: string;
  clinicId: string;

  // Template details
  templateName: string;
  templateCode: string;
  category: 'appointment' | 'medication' | 'report' | 'emergency' | 'billing' | 'general';

  // WhatsApp template structure
  language?: string;
  headerType?: 'text' | 'image' | 'document';
  headerContent?: string;
  bodyContent: string;
  footerContent?: string;

  // Variables/placeholders
  variables?: TemplateVariable[];

  // Status
  isActive?: boolean;
  isApproved?: boolean;
  approvedBy?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
};

// Template Variable Interface
export type TemplateVariable = {
  name: string;
  type: 'text' | 'number' | 'date' | 'time' | 'currency';
  description: string;
  required: boolean;
  defaultValue?: string;
};

// WhatsApp Message Interface
export type WhatsAppMessage = {
  messageId: string;
  clinicId: string;

  // Recipient details
  recipientPhone: string;
  recipientName?: string;
  patientId?: string;

  // Message details
  templateId?: string;
  messageType?: CommunicationType;
  messageContent: string;
  variables?: Record<string, any>;

  // Scheduling
  scheduledAt?: Date | string;
  sentAt?: Date | string;

  // Status tracking
  status?: MessageStatus;
  deliveryStatus?: string;
  failureReason?: string;

  // WhatsApp specific
  whatsappMessageId?: string;
  conversationId?: string;

  // Retry logic
  retryCount?: number;
  maxRetries?: number;
  nextRetryAt?: Date | string;

  // Metadata
  createdAt?: Date | string;
  createdBy?: string;

  // Extended info
  patient?: Patient;
  template?: WhatsAppTemplate;
};

// Audit Log Interface
export type AuditLog = {
  auditId: string;
  clinicId: string;

  // Actor information
  actorId: string;
  actorName: string;
  actorEmail?: string;
  actorRole?: string;

  // Action details
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  resourceName?: string;

  // Change tracking
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };

  // Request context
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;

  // Outcome
  success?: boolean;
  errorMessage?: string;
  duration?: number;

  // Healthcare specific fields
  flags?: string[];
  severity?: Severity;

  // Additional metadata
  metadata?: Record<string, any>;

  // Compliance and retention
  retentionPeriod?: number;

  // Audit trail
  createdAt?: Date | string;

  // Extended info
  actor?: User;
};

// Security Event Interface
export type SecurityEvent = {
  id: string;
  organizationId: string;
  eventType: string;
  severity: Severity;
  description: string;
  metadata?: Record<string, any>;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date | string;
};

// API Key Interface
export type APIKey = {
  id: string;
  name: string;
  organizationId: string;
  hashedKey?: string;
  lastFourChars?: string;
  expiresAt?: Date | string;
  lastUsedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  permissions?: string[];
  ipWhitelist?: string[];
};

// Webhook Endpoint Interface
export type WebhookEndpoint = {
  endpointId: string;
  clinicId: string;

  // Endpoint Configuration
  name: string;
  url: string;
  secret?: string;
  isActive?: boolean;

  // Event Configuration
  events: string[];
  description?: string;
  headers?: Record<string, string>;
  timeout?: number;

  // Retry Policy
  retryPolicy: {
    maxRetries: number;
    retryIntervals: number[];
    backoffStrategy: 'linear' | 'exponential' | 'fixed';
    failureThreshold: number;
  };

  // Health Monitoring
  consecutiveFailures?: number;
  lastFailureAt?: Date | string;
  disabledAt?: Date | string;
  disabledBy?: string;
  disabledReason?: string;

  // Audit
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy: string;

  // Extended info
  createdByUser?: User;
  disabledByUser?: User;
};

// Webhook Event Interface
export type WebhookEvent = {
  eventId: string;
  clinicId: string;

  // Event Details
  eventType: string;
  resourceType: string;
  resourceId: string;

  // Event Data
  payload: Record<string, any>;
  metadata?: Record<string, any>;

  // Audit
  createdAt?: Date | string;
  createdBy?: string;

  // Extended info
  deliveries?: WebhookDelivery[];
};

// Webhook Delivery Interface
export type WebhookDelivery = {
  deliveryId: string;
  endpointId: string;
  eventId: string;
  clinicId: string;

  // Delivery Status
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempt?: number;
  maxAttempts?: number;

  // Retry Logic
  nextRetryAt?: Date | string;
  lastAttemptAt?: Date | string;

  // Response Details
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: string;
  errorMessage?: string;

  // Delivery Metadata
  deliveredAt?: Date | string;
  processingDuration?: number;
  webhookSignature?: string;

  // Audit
  createdAt?: Date | string;

  // Extended info
  endpoint?: WebhookEndpoint;
  event?: WebhookEvent;
};

// Communication Statistics
export type CommunicationStats = {
  whatsapp: {
    totalSent: number;
    delivered: number;
    failed: number;
    pending: number;
    read: number;
  };

  email: {
    totalSent: number;
    delivered: number;
    bounced: number;
    opened: number;
  };

  sms: {
    totalSent: number;
    delivered: number;
    failed: number;
  };

  templates: {
    total: number;
    active: number;
    approved: number;
  };

  todayStats: {
    messagesSent: number;
    messagesDelivered: number;
    messagesFailed: number;
    avgDeliveryTime: number;
  };
};

// Audit Statistics
export type AuditStats = {
  today: {
    totalEvents: number;
    uniqueUsers: number;
    failedActions: number;
    emergencyAccess: number;
  };

  byAction: Record<AuditAction, number>;
  byResource: Record<AuditResource, number>;
  bySeverity: Record<Severity, number>;

  topUsers: {
    userId: string;
    userName: string;
    eventCount: number;
  }[];

  recentFailures: AuditLog[];
  suspiciousActivities: AuditLog[];
};

// Message Search Filters
export type MessageSearchFilters = {
  searchQuery?: string;
  status?: MessageStatus[];
  messageType?: CommunicationType[];
  templateId?: string[];
  dateRange?: {
    from?: Date | string;
    to?: Date | string;
  };
  patientId?: string;
  recipientPhone?: string;
};

// Audit Search Filters
export type AuditSearchFilters = {
  action?: AuditAction[];
  resource?: AuditResource[];
  actorId?: string[];
  severity?: Severity[];
  success?: boolean;
  dateRange?: {
    from?: Date | string;
    to?: Date | string;
  };
  searchQuery?: string;
};

// Webhook Event Types
export type WebhookEventType =
  | 'patient.created'
  | 'patient.updated'
  | 'patient.deleted'
  | 'appointment.scheduled'
  | 'appointment.cancelled'
  | 'appointment.completed'
  | 'consultation.started'
  | 'consultation.completed'
  | 'prescription.created'
  | 'bill.created'
  | 'bill.paid'
  | 'payment.received'
  | 'admission.created'
  | 'discharge.completed'
  | 'lab.result.ready'
  | 'critical.alert.triggered';

// Team Member Interface
export type TeamMember = {
  id: string;
  organizationId: string;
  userId: string;
  role: UserRole;
  status?: string;
  joinedAt?: Date | string;
  invitedBy?: string;
  permissions?: Record<string, boolean>;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Extended info
  user?: User;
  invitedByUser?: User;
};

// Invitation Interface
export type Invitation = {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
  token?: string;
  expires: Date | string;
  invitedBy: string;
  acceptedAt?: Date | string;
  sentViaEmail?: boolean;
  allowedDomains?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Extended info
  invitedByUser?: User;
};

// Notification Preference Interface
export type NotificationPreference = {
  userId: string;
  patientId?: string;

  // Channel preferences
  whatsapp: {
    enabled: boolean;
    appointmentReminders: boolean;
    medicationReminders: boolean;
    labResults: boolean;
    billing: boolean;
    marketing: boolean;
  };

  email: {
    enabled: boolean;
    appointmentReminders: boolean;
    reports: boolean;
    billing: boolean;
    marketing: boolean;
  };

  sms: {
    enabled: boolean;
    criticalOnly: boolean;
    appointmentReminders: boolean;
  };

  // Timing preferences
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone?: string;

  // Language preference
  preferredLanguage?: string;

  updatedAt?: Date | string;
};

// Message Template Form Data
export type MessageTemplateData = {
  templateName: string;
  templateCode: string;
  category: string;
  language: string;

  // Content
  headerType?: string;
  headerContent?: string;
  bodyContent: string;
  footerContent?: string;

  // Variables
  variables: {
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: string;
  }[];
};

// Broadcast Message Form Data
export type BroadcastMessageData = {
  recipientType: 'all' | 'filter' | 'individual';

  // Recipients
  individualRecipients?: string[];

  // Filters (if recipientType is 'filter')
  filters?: {
    hasAppointmentToday?: boolean;
    hasOverdueBills?: boolean;
    needsMedicationRefill?: boolean;
    department?: string[];
    scheme?: string[];
  };

  // Message
  templateId: string;
  variables?: Record<string, any>;

  // Scheduling
  sendNow: boolean;
  scheduledTime?: Date | string;
};

// Activity Log (simplified for UI)
export type ActivityLog = {
  id: string;
  timestamp: Date | string;
  user: string;
  action: string;
  resource: string;
  details?: string;
  status: 'success' | 'failure';
  ipAddress?: string;
};
