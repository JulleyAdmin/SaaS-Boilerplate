import {
  createWebhookDelivery,
  createWebhookEvent,
  createWebhookSignature,
  getWebhookEndpointsForEvent,
  updateEndpointDeliveryStats,
  updateWebhookDelivery,
  type WebhookEndpoint,
  type WebhookEventType,
} from '@/models/webhook';

type WebhookPayload = {
  id: string;
  eventType: WebhookEventType;
  createdAt: string;
  data: Record<string, any>;
};

type DeliveryResult = {
  success: boolean;
  httpStatus?: number;
  responseBody?: string;
  responseHeaders?: Record<string, string>;
  duration: number;
  errorMessage?: string;
};

// Main function to send webhook events
export const sendWebhookEvent = async (
  organizationId: string,
  eventType: WebhookEventType,
  data: Record<string, any>,
  resourceId?: string,
  resourceType?: string,
): Promise<void> => {
  try {
    // 1. Create webhook event record
    const event = await createWebhookEvent({
      organizationId,
      eventType,
      resourceId,
      resourceType,
      payload: data,
    });

    // 2. Get all webhook endpoints that should receive this event
    const endpoints = await getWebhookEndpointsForEvent(organizationId, eventType);

    if (endpoints.length === 0) {
      console.log(`No webhook endpoints found for event ${eventType} in org ${organizationId}`);
      return;
    }

    // 3. Send to each endpoint
    const deliveryPromises = endpoints.map(endpoint =>
      deliverWebhookToEndpoint(endpoint, event.id, eventType, data),
    );

    await Promise.allSettled(deliveryPromises);

    console.log(`Webhook event ${eventType} sent to ${endpoints.length} endpoints`);
  } catch (error) {
    console.error('Failed to send webhook event:', error);
  }
};

// Deliver webhook to a specific endpoint
export const deliverWebhookToEndpoint = async (
  endpoint: WebhookEndpoint,
  eventId: string,
  eventType: WebhookEventType,
  data: Record<string, any>,
  attempt = 1,
): Promise<void> => {
  const payload: WebhookPayload = {
    id: eventId,
    eventType,
    createdAt: new Date().toISOString(),
    data,
  };

  // Create delivery record
  const delivery = await createWebhookDelivery({
    webhookEndpointId: endpoint.id,
    eventType,
    eventId,
    payload,
    attempt,
  });

  try {
    const result = await executeWebhookDelivery(endpoint, payload);

    // Update delivery record with result
    await updateWebhookDelivery(delivery.id, {
      httpStatus: result.httpStatus,
      responseBody: result.responseBody,
      responseHeaders: result.responseHeaders,
      duration: result.duration,
      status: result.success ? 'success' : 'failed',
      errorMessage: result.errorMessage,
      deliveredAt: result.success ? new Date() : undefined,
      nextRetryAt: result.success ? undefined : calculateNextRetry(attempt),
    });

    // Update endpoint stats
    await updateEndpointDeliveryStats(endpoint.id, result.success);

    if (result.success) {
      console.log(`Webhook delivered successfully to ${endpoint.url}`);
    } else {
      console.error(`Webhook delivery failed to ${endpoint.url}:`, result.errorMessage);

      // Schedule retry if within retry limit
      if (attempt < endpoint.retryCount) {
        console.log(`Scheduling retry ${attempt + 1} for ${endpoint.url}`);
      }
    }
  } catch (error) {
    console.error(`Webhook delivery error to ${endpoint.url}:`, error);

    await updateWebhookDelivery(delivery.id, {
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      nextRetryAt: attempt < endpoint.retryCount ? calculateNextRetry(attempt) : undefined,
    });

    await updateEndpointDeliveryStats(endpoint.id, false);
  }
};

// Execute the actual HTTP request to webhook endpoint
const executeWebhookDelivery = async (
  endpoint: WebhookEndpoint,
  payload: WebhookPayload,
): Promise<DeliveryResult> => {
  const startTime = Date.now();
  const payloadString = JSON.stringify(payload);

  // Create signature for verification
  const signature = createWebhookSignature(payloadString, endpoint.secret);
  const timestamp = Math.floor(Date.now() / 1000);

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'HospitalOS-Webhooks/1.0',
    'X-Webhook-Signature': signature,
    'X-Webhook-Timestamp': timestamp.toString(),
    'X-Webhook-ID': payload.id,
    'X-Webhook-Event': payload.eventType,
    ...endpoint.headers, // Custom headers from endpoint config
  };

  try {
    const controller = new AbortController();
    const timeoutMs = endpoint.timeout * 1000;

    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers,
      body: payloadString,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    // Read response
    let responseBody = '';
    try {
      responseBody = await response.text();
    } catch (e) {
      // Ignore response body read errors
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const success = response.status >= 200 && response.status < 300;

    return {
      success,
      httpStatus: response.status,
      responseBody: responseBody.slice(0, 1000), // Limit response body size
      responseHeaders,
      duration,
      errorMessage: success ? undefined : `HTTP ${response.status}: ${response.statusText}`,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          duration,
          errorMessage: `Timeout after ${endpoint.timeout}s`,
        };
      }

      return {
        success: false,
        duration,
        errorMessage: error.message,
      };
    }

    return {
      success: false,
      duration,
      errorMessage: 'Unknown error occurred',
    };
  }
};

// Calculate next retry time with exponential backoff
const calculateNextRetry = (attempt: number): Date => {
  // Exponential backoff: 2^attempt minutes, max 60 minutes
  const delayMinutes = Math.min(2 ** attempt, 60);
  const delayMs = delayMinutes * 60 * 1000;

  return new Date(Date.now() + delayMs);
};

// Retry failed webhook deliveries
export const retryFailedWebhooks = async (): Promise<void> => {
  const { getFailedDeliveriesForRetry } = await import('@/models/webhook');

  try {
    const failedDeliveries = await getFailedDeliveriesForRetry();

    if (failedDeliveries.length === 0) {
      return;
    }

    console.log(`Retrying ${failedDeliveries.length} failed webhook deliveries`);

    for (const delivery of failedDeliveries) {
      try {
        // Get the endpoint for this delivery
        const { getWebhookEndpoint } = await import('@/models/webhook');

        // We need to get the endpoint, but we don't have organizationId in delivery
        // This is a limitation - we should store it or get it differently
        // For now, skip retry if we can't get the endpoint
        console.log(`Retrying delivery ${delivery.id} (attempt ${delivery.attempt + 1})`);

        // TODO: Implement proper retry logic with endpoint lookup
        // This would require either storing organizationId in delivery record
        // or joining with webhook_endpoints table
      } catch (error) {
        console.error(`Failed to retry delivery ${delivery.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to retry webhooks:', error);
  }
};

// Webhook event helpers for common scenarios
export const webhookHelpers = {
  // Team member events
  memberCreated: (organizationId: string, member: any) =>
    sendWebhookEvent(organizationId, 'member.created', member, member.id, 'member'),

  memberRemoved: (organizationId: string, member: any) =>
    sendWebhookEvent(organizationId, 'member.removed', member, member.id, 'member'),

  memberUpdated: (organizationId: string, member: any) =>
    sendWebhookEvent(organizationId, 'member.updated', member, member.id, 'member'),

  // Invitation events
  invitationCreated: (organizationId: string, invitation: any) =>
    sendWebhookEvent(organizationId, 'invitation.created', invitation, invitation.id, 'invitation'),

  invitationAccepted: (organizationId: string, invitation: any) =>
    sendWebhookEvent(organizationId, 'invitation.accepted', invitation, invitation.id, 'invitation'),

  // API key events
  apiKeyCreated: (organizationId: string, apiKey: any) =>
    sendWebhookEvent(organizationId, 'apikey.created', {
      id: apiKey.id,
      name: apiKey.name,
      prefix: apiKey.prefix,
      createdAt: apiKey.createdAt,
      createdBy: apiKey.createdBy,
    }, apiKey.id, 'apikey'),

  apiKeyDeleted: (organizationId: string, apiKey: any) =>
    sendWebhookEvent(organizationId, 'apikey.deleted', {
      id: apiKey.id,
      name: apiKey.name,
      prefix: apiKey.prefix,
      deletedAt: new Date().toISOString(),
    }, apiKey.id, 'apikey'),

  // Organization events
  organizationUpdated: (organizationId: string, organization: any) =>
    sendWebhookEvent(organizationId, 'organization.updated', organization, organizationId, 'organization'),

  // SSO events
  ssoConnectionCreated: (organizationId: string, connection: any) =>
    sendWebhookEvent(organizationId, 'sso.connection.created', connection, connection.id, 'sso_connection'),

  ssoConnectionUpdated: (organizationId: string, connection: any) =>
    sendWebhookEvent(organizationId, 'sso.connection.updated', connection, connection.id, 'sso_connection'),

  ssoConnectionDeleted: (organizationId: string, connection: any) =>
    sendWebhookEvent(organizationId, 'sso.connection.deleted', connection, connection.id, 'sso_connection'),
};
