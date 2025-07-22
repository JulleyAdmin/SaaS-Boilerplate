import { eq, and, desc, gte, lte, inArray } from 'drizzle-orm';
import { randomBytes, createHmac } from 'crypto';

import { db } from '@/libs/DB';
import { webhookEndpoint, webhookDelivery, webhookEvent } from '@/models/Schema';

export type WebhookEndpoint = typeof webhookEndpoint.$inferSelect;
export type WebhookDelivery = typeof webhookDelivery.$inferSelect;
export type WebhookEvent = typeof webhookEvent.$inferSelect;

export type WebhookEventType = 
  | 'member.created'
  | 'member.removed'
  | 'member.updated'
  | 'invitation.created'
  | 'invitation.accepted'
  | 'invitation.removed'
  | 'apikey.created'
  | 'apikey.deleted'
  | 'team.created'
  | 'team.updated'
  | 'user.updated'
  | 'organization.updated'
  | 'sso.connection.created'
  | 'sso.connection.updated'
  | 'sso.connection.deleted'
  | 'audit.log.created'
  | 'security.event.created';

export type WebhookStatus = 'active' | 'inactive' | 'failed' | 'paused';

// Generate a secure webhook secret
export const generateWebhookSecret = (): string => {
  return randomBytes(32).toString('hex');
};

// Create webhook signature for verification
export const createWebhookSignature = (payload: string, secret: string): string => {
  return createHmac('sha256', secret).update(payload).digest('hex');
};

// Verify webhook signature
export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  const expectedSignature = createWebhookSignature(payload, secret);
  return signature === expectedSignature;
};

// Create a webhook endpoint
export const createWebhookEndpoint = async (params: {
  organizationId: string;
  name: string;
  description?: string;
  url: string;
  eventTypes: WebhookEventType[];
  headers?: Record<string, string>;
  timeout?: number;
  retryCount?: number;
  createdBy: string;
}): Promise<WebhookEndpoint> => {
  const secret = generateWebhookSecret();

  const [endpoint] = await db
    .insert(webhookEndpoint)
    .values({
      organizationId: params.organizationId,
      name: params.name,
      description: params.description,
      url: params.url,
      secret,
      eventTypes: params.eventTypes,
      headers: params.headers || {},
      timeout: params.timeout || 30,
      retryCount: params.retryCount || 3,
      createdBy: params.createdBy,
    })
    .returning();

  return endpoint;
};

// Get webhook endpoints for an organization
export const getWebhookEndpoints = async (
  organizationId: string
): Promise<WebhookEndpoint[]> => {
  return db
    .select()
    .from(webhookEndpoint)
    .where(eq(webhookEndpoint.organizationId, organizationId))
    .orderBy(desc(webhookEndpoint.createdAt));
};

// Get webhook endpoint by ID
export const getWebhookEndpoint = async (
  organizationId: string,
  endpointId: string
): Promise<WebhookEndpoint | null> => {
  const [endpoint] = await db
    .select()
    .from(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.id, endpointId),
        eq(webhookEndpoint.organizationId, organizationId)
      )
    )
    .limit(1);

  return endpoint || null;
};

// Update webhook endpoint
export const updateWebhookEndpoint = async (
  organizationId: string,
  endpointId: string,
  updates: Partial<{
    name: string;
    description: string;
    url: string;
    status: WebhookStatus;
    eventTypes: WebhookEventType[];
    headers: Record<string, string>;
    timeout: number;
    retryCount: number;
  }>
): Promise<WebhookEndpoint | null> => {
  const [updated] = await db
    .update(webhookEndpoint)
    .set(updates)
    .where(
      and(
        eq(webhookEndpoint.id, endpointId),
        eq(webhookEndpoint.organizationId, organizationId)
      )
    )
    .returning();

  return updated || null;
};

// Delete webhook endpoint
export const deleteWebhookEndpoint = async (
  organizationId: string,
  endpointId: string
): Promise<boolean> => {
  const result = await db
    .delete(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.id, endpointId),
        eq(webhookEndpoint.organizationId, organizationId)
      )
    );

  return result.count > 0;
};

// Create a webhook event
export const createWebhookEvent = async (params: {
  organizationId: string;
  eventType: WebhookEventType;
  resourceId?: string;
  resourceType?: string;
  payload: Record<string, any>;
}): Promise<WebhookEvent> => {
  const [event] = await db
    .insert(webhookEvent)
    .values({
      organizationId: params.organizationId,
      eventType: params.eventType,
      resourceId: params.resourceId,
      resourceType: params.resourceType,
      payload: params.payload,
    })
    .returning();

  return event;
};

// Get unprocessed webhook events
export const getUnprocessedWebhookEvents = async (
  limit = 100
): Promise<WebhookEvent[]> => {
  return db
    .select()
    .from(webhookEvent)
    .where(eq(webhookEvent.processed, false))
    .orderBy(webhookEvent.createdAt)
    .limit(limit);
};

// Mark webhook event as processed
export const markWebhookEventProcessed = async (eventId: string): Promise<void> => {
  await db
    .update(webhookEvent)
    .set({
      processed: true,
      processedAt: new Date(),
    })
    .where(eq(webhookEvent.id, eventId));
};

// Create webhook delivery record
export const createWebhookDelivery = async (params: {
  webhookEndpointId: string;
  eventType: WebhookEventType;
  eventId: string;
  payload: Record<string, any>;
  attempt?: number;
}): Promise<WebhookDelivery> => {
  const [delivery] = await db
    .insert(webhookDelivery)
    .values({
      webhookEndpointId: params.webhookEndpointId,
      eventType: params.eventType,
      eventId: params.eventId,
      payload: params.payload,
      attempt: params.attempt || 1,
      status: 'pending',
    })
    .returning();

  return delivery;
};

// Update webhook delivery status
export const updateWebhookDelivery = async (
  deliveryId: string,
  updates: {
    httpStatus?: number;
    responseBody?: string;
    responseHeaders?: Record<string, string>;
    duration?: number;
    status: 'success' | 'failed' | 'retrying';
    errorMessage?: string;
    nextRetryAt?: Date;
    deliveredAt?: Date;
  }
): Promise<void> => {
  await db
    .update(webhookDelivery)
    .set(updates)
    .where(eq(webhookDelivery.id, deliveryId));
};

// Get webhook deliveries for an endpoint
export const getWebhookDeliveries = async (
  webhookEndpointId: string,
  limit = 50
): Promise<WebhookDelivery[]> => {
  return db
    .select()
    .from(webhookDelivery)
    .where(eq(webhookDelivery.webhookEndpointId, webhookEndpointId))
    .orderBy(desc(webhookDelivery.createdAt))
    .limit(limit);
};

// Get failed deliveries that need retry
export const getFailedDeliveriesForRetry = async (): Promise<WebhookDelivery[]> => {
  const now = new Date();
  
  return db
    .select()
    .from(webhookDelivery)
    .where(
      and(
        eq(webhookDelivery.status, 'failed'),
        lte(webhookDelivery.nextRetryAt, now)
      )
    )
    .orderBy(webhookDelivery.nextRetryAt);
};

// Get webhook endpoints that should receive an event
export const getWebhookEndpointsForEvent = async (
  organizationId: string,
  eventType: WebhookEventType
): Promise<WebhookEndpoint[]> => {
  const endpoints = await db
    .select()
    .from(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.organizationId, organizationId),
        eq(webhookEndpoint.status, 'active')
      )
    );

  // Filter endpoints that subscribe to this event type
  return endpoints.filter(endpoint => 
    endpoint.eventTypes.includes(eventType)
  );
};

// Update endpoint delivery stats
export const updateEndpointDeliveryStats = async (
  endpointId: string,
  success: boolean
): Promise<void> => {
  const endpoint = await db
    .select()
    .from(webhookEndpoint)
    .where(eq(webhookEndpoint.id, endpointId))
    .limit(1);

  if (endpoint.length === 0) return;

  const updates: any = {
    lastDeliveryAt: new Date(),
    lastDeliveryStatus: success ? 'success' : 'failed',
  };

  if (success) {
    updates.failureCount = 0;
  } else {
    updates.failureCount = (endpoint[0].failureCount || 0) + 1;
    
    // Auto-pause endpoint after too many failures
    if (updates.failureCount >= 10) {
      updates.status = 'failed';
    }
  }

  await db
    .update(webhookEndpoint)
    .set(updates)
    .where(eq(webhookEndpoint.id, endpointId));
};

// Webhook event utilities
export const webhookEventTypes: WebhookEventType[] = [
  'member.created',
  'member.removed',
  'member.updated',
  'invitation.created',
  'invitation.accepted',
  'invitation.removed',
  'apikey.created',
  'apikey.deleted',
  'team.created',
  'team.updated',
  'user.updated',
  'organization.updated',
  'sso.connection.created',
  'sso.connection.updated',
  'sso.connection.deleted',
  'audit.log.created',
  'security.event.created',
];

export const getEventTypeDescription = (eventType: WebhookEventType): string => {
  const descriptions: Record<WebhookEventType, string> = {
    'member.created': 'A new team member was added',
    'member.removed': 'A team member was removed',
    'member.updated': 'A team member was updated',
    'invitation.created': 'A team invitation was created',
    'invitation.accepted': 'A team invitation was accepted',
    'invitation.removed': 'A team invitation was removed',
    'apikey.created': 'An API key was created',
    'apikey.deleted': 'An API key was deleted',
    'team.created': 'A team was created',
    'team.updated': 'A team was updated',
    'user.updated': 'A user profile was updated',
    'organization.updated': 'An organization was updated',
    'sso.connection.created': 'An SSO connection was created',
    'sso.connection.updated': 'An SSO connection was updated',
    'sso.connection.deleted': 'An SSO connection was deleted',
    'audit.log.created': 'An audit log entry was created',
    'security.event.created': 'A security event was recorded',
  };

  return descriptions[eventType] || eventType;
};