/**
 * Webhook types and interfaces for HospitalOS
 */

export type WebhookEventType =
  | 'patient.created'
  | 'patient.updated'
  | 'patient.deleted'
  | 'appointment.created'
  | 'appointment.updated'
  | 'appointment.cancelled'
  | 'consultation.completed'
  | 'prescription.created'
  | 'prescription.dispensed'
  | 'lab.result.ready'
  | 'invoice.created'
  | 'invoice.paid'
  | 'invoice.overdue'
  | 'admission.created'
  | 'discharge.completed'
  | 'emergency.alert'
  | 'staff.login'
  | 'staff.logout'
  | 'system.maintenance'
  | 'backup.completed'
  | 'user.created'
  | 'user.updated'
  | 'user.deleted';

export const webhookEventTypes: WebhookEventType[] = [
  'patient.created',
  'patient.updated',
  'patient.deleted',
  'appointment.created',
  'appointment.updated',
  'appointment.cancelled',
  'consultation.completed',
  'prescription.created',
  'prescription.dispensed',
  'lab.result.ready',
  'invoice.created',
  'invoice.paid',
  'invoice.overdue',
  'admission.created',
  'discharge.completed',
  'emergency.alert',
  'staff.login',
  'staff.logout',
  'system.maintenance',
  'backup.completed',
  'user.created',
  'user.updated',
  'user.deleted',
];

export type WebhookEndpoint = {
  webhookId: string;
  organizationId: string;
  name: string;
  url: string;
  description?: string;
  eventTypes: WebhookEventType[];
  isActive: boolean;
  secretKey: string;
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
  headers?: Record<string, string>;
  retryAttempts: number;
  timeoutSeconds: number;
};

export type WebhookDelivery = {
  deliveryId: string;
  webhookId: string;
  eventType: WebhookEventType;
  payload: Record<string, any>;
  url: string;
  httpStatus?: number;
  responseBody?: string;
  errorMessage?: string;
  attempts: number;
  successful: boolean;
  deliveredAt?: string;
  createdAt: string;
  nextRetryAt?: string;
};

export type WebhookEvent = {
  eventId: string;
  eventType: WebhookEventType;
  organizationId: string;
  resourceId: string;
  resourceType: string;
  payload: Record<string, any>;
  createdAt: string;
  processedAt?: string;
  webhookDeliveries: WebhookDelivery[];
};

export type CreateWebhookRequest = {
  name: string;
  url: string;
  description?: string;
  eventTypes: WebhookEventType[];
  headers?: Record<string, string>;
  retryAttempts?: number;
  timeoutSeconds?: number;
};

export type UpdateWebhookRequest = {
  name?: string;
  url?: string;
  description?: string;
  eventTypes?: WebhookEventType[];
  isActive?: boolean;
  headers?: Record<string, string>;
  retryAttempts?: number;
  timeoutSeconds?: number;
};

export type WebhookTestRequest = {
  eventType: WebhookEventType;
  testPayload?: Record<string, any>;
};

export function getEventTypeDescription(eventType: WebhookEventType): string {
  const descriptions: Record<WebhookEventType, string> = {
    'patient.created': 'Triggered when a new patient is registered',
    'patient.updated': 'Triggered when patient information is updated',
    'patient.deleted': 'Triggered when a patient record is deleted',
    'appointment.created': 'Triggered when a new appointment is scheduled',
    'appointment.updated': 'Triggered when an appointment is modified',
    'appointment.cancelled': 'Triggered when an appointment is cancelled',
    'consultation.completed': 'Triggered when a consultation is completed',
    'prescription.created': 'Triggered when a prescription is created',
    'prescription.dispensed': 'Triggered when medication is dispensed',
    'lab.result.ready': 'Triggered when lab results are available',
    'invoice.created': 'Triggered when a new invoice is generated',
    'invoice.paid': 'Triggered when an invoice is paid',
    'invoice.overdue': 'Triggered when an invoice becomes overdue',
    'admission.created': 'Triggered when a patient is admitted',
    'discharge.completed': 'Triggered when a patient is discharged',
    'emergency.alert': 'Triggered for emergency situations',
    'staff.login': 'Triggered when staff member logs in',
    'staff.logout': 'Triggered when staff member logs out',
    'system.maintenance': 'Triggered during system maintenance',
    'backup.completed': 'Triggered when system backup is completed',
    'user.created': 'Triggered when a new user account is created',
    'user.updated': 'Triggered when user account is updated',
    'user.deleted': 'Triggered when user account is deleted',
  };

  return descriptions[eventType] || 'Unknown event type';
}

export function getEventTypeCategory(eventType: WebhookEventType): string {
  if (eventType.startsWith('patient.')) {
    return 'Patient Management';
  }
  if (eventType.startsWith('appointment.')) {
    return 'Scheduling';
  }
  if (eventType.startsWith('consultation.')) {
    return 'Clinical';
  }
  if (eventType.startsWith('prescription.')) {
    return 'Pharmacy';
  }
  if (eventType.startsWith('lab.')) {
    return 'Laboratory';
  }
  if (eventType.startsWith('invoice.')) {
    return 'Billing';
  }
  if (eventType.startsWith('admission.') || eventType.startsWith('discharge.')) {
    return 'Ward Management';
  }
  if (eventType.startsWith('emergency.')) {
    return 'Emergency';
  }
  if (eventType.startsWith('staff.')) {
    return 'Staff Management';
  }
  if (eventType.startsWith('system.') || eventType.startsWith('backup.')) {
    return 'System';
  }
  if (eventType.startsWith('user.')) {
    return 'User Management';
  }
  return 'Other';
}
