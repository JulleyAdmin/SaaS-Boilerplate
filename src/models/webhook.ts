import { createHmac, randomBytes } from 'node:crypto';

import { and, desc, eq, lte } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { webhookDeliveries, webhookEndpoints, webhookEvents } from '@/models/Schema';

// Re-export types from the types file for backward compatibility with server-side code
export type { WebhookDelivery, WebhookEndpoint, WebhookEvent, WebhookEventType, WebhookStatus } from '@/types/webhook';
export { webhookEventTypes } from '@/types/webhook';

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
  secret: string,
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
    .insert(webhookEndpoints)
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
  organizationId: string,
): Promise<WebhookEndpoint[]> => {
  return db
    .select()
    .from(webhookEndpoints)
    .where(eq(webhookEndpoints.organizationId, organizationId))
    .orderBy(desc(webhookEndpoints.createdAt));
};

// Get webhook endpoint by ID
export const getWebhookEndpoint = async (
  organizationId: string,
  endpointId: string,
): Promise<WebhookEndpoint | null> => {
  const [endpoint] = await db
    .select()
    .from(webhookEndpoints)
    .where(
      and(
        eq(webhookEndpoints.id, endpointId),
        eq(webhookEndpoints.organizationId, organizationId),
      ),
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
  }>,
): Promise<WebhookEndpoint | null> => {
  const [updated] = await db
    .update(webhookEndpoints)
    .set(updates)
    .where(
      and(
        eq(webhookEndpoints.id, endpointId),
        eq(webhookEndpoints.organizationId, organizationId),
      ),
    )
    .returning();

  return updated || null;
};

// Delete webhook endpoint
export const deleteWebhookEndpoint = async (
  organizationId: string,
  endpointId: string,
): Promise<boolean> => {
  const result = await db
    .delete(webhookEndpoints)
    .where(
      and(
        eq(webhookEndpoints.id, endpointId),
        eq(webhookEndpoints.organizationId, organizationId),
      ),
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
    .insert(webhookEvents)
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
  limit = 100,
): Promise<WebhookEvent[]> => {
  return db
    .select()
    .from(webhookEvents)
    .where(eq(webhookEvents.processed, false))
    .orderBy(webhookEvents.createdAt)
    .limit(limit);
};

// Mark webhook event as processed
export const markWebhookEventProcessed = async (eventId: string): Promise<void> => {
  await db
    .update(webhookEvents)
    .set({
      processed: true,
      processedAt: new Date(),
    })
    .where(eq(webhookEvents.id, eventId));
};

// Create webhook delivery record
export const createWebhookDelivery = async (params: {
  webhookEndpointsId: string;
  eventType: WebhookEventType;
  eventId: string;
  payload: Record<string, any>;
  attempt?: number;
}): Promise<WebhookDelivery> => {
  const [delivery] = await db
    .insert(webhookDeliveries)
    .values({
      webhookEndpointsId: params.webhookEndpointsId,
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
  },
): Promise<void> => {
  await db
    .update(webhookDeliveries)
    .set(updates)
    .where(eq(webhookDeliveries.id, deliveryId));
};

// Get webhook deliveries for an endpoint
export const getWebhookDeliveries = async (
  webhookEndpointsId: string,
  limit = 50,
): Promise<WebhookDelivery[]> => {
  return db
    .select()
    .from(webhookDeliveries)
    .where(eq(webhookDeliveries.webhookEndpointsId, webhookEndpointsId))
    .orderBy(desc(webhookDeliveries.createdAt))
    .limit(limit);
};

// Get failed deliveries that need retry
export const getFailedDeliveriesForRetry = async (): Promise<WebhookDelivery[]> => {
  const now = new Date();

  return db
    .select()
    .from(webhookDeliveries)
    .where(
      and(
        eq(webhookDeliveries.status, 'failed'),
        lte(webhookDeliveries.nextRetryAt, now),
      ),
    )
    .orderBy(webhookDeliveries.nextRetryAt);
};

// Get webhook endpoints that should receive an event
export const getWebhookEndpointsForEvent = async (
  organizationId: string,
  eventType: WebhookEventType,
): Promise<WebhookEndpoint[]> => {
  const endpoints = await db
    .select()
    .from(webhookEndpoints)
    .where(
      and(
        eq(webhookEndpoints.organizationId, organizationId),
        eq(webhookEndpoints.status, 'active'),
      ),
    );

  // Filter endpoints that subscribe to this event type
  return endpoints.filter(endpoint =>
    endpoint.eventTypes.includes(eventType),
  );
};

// Update endpoint delivery stats
export const updateEndpointDeliveryStats = async (
  endpointId: string,
  success: boolean,
): Promise<void> => {
  const endpoint = await db
    .select()
    .from(webhookEndpoints)
    .where(eq(webhookEndpoints.id, endpointId))
    .limit(1);

  if (endpoint.length === 0) {
    return;
  }

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
    .update(webhookEndpoints)
    .set(updates)
    .where(eq(webhookEndpoints.id, endpointId));
};

// Webhook event utilities
export const webhookEventsTypes: WebhookEventType[] = [
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
