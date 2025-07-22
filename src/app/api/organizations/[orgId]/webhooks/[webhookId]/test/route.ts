import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { getWebhookEndpoint } from '@/models/webhook';
import { getUserRole, canManageWebhooks } from '@/models/team';
import { deliverWebhookToEndpoint } from '@/lib/webhook/delivery';

export async function POST(
  _request: NextRequest,
  { params }: { params: { orgId: string; webhookId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId || orgId !== params.orgId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check permissions
    const userRole = await getUserRole(params.orgId, userId);
    if (!canManageWebhooks(userRole)) {
      return Response.json(
        { error: 'Insufficient permissions to test webhooks' },
        { status: 403 }
      );
    }

    // Get the webhook endpoint
    const webhook = await getWebhookEndpoint(params.orgId, params.webhookId);
    if (!webhook) {
      return Response.json({ error: 'Webhook not found' }, { status: 404 });
    }

    if (webhook.status !== 'active') {
      return Response.json(
        { error: 'Webhook must be active to test' },
        { status: 400 }
      );
    }

    // Create test payload
    const testPayload = {
      id: 'test-event-' + Date.now(),
      eventType: 'webhook.test' as any, // Not in our enum but for testing
      timestamp: new Date().toISOString(),
      data: {
        test: true,
        message: 'This is a test webhook delivery from HospitalOS',
        organization: {
          id: params.orgId,
        },
        webhook: {
          id: webhook.id,
          name: webhook.name,
          url: webhook.url,
        },
        triggeredBy: {
          userId,
          timestamp: new Date().toISOString(),
        },
      },
    };

    // Send test webhook
    try {
      await deliverWebhookToEndpoint(
        webhook,
        testPayload.id,
        'webhook.test' as any,
        testPayload.data
      );

      return Response.json({
        message: 'Test webhook sent successfully',
        testEvent: {
          id: testPayload.id,
          timestamp: testPayload.timestamp,
        },
      });
    } catch (error) {
      console.error('Test webhook delivery failed:', error);
      return Response.json(
        { 
          error: 'Test webhook delivery failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error testing webhook:', error);
    return Response.json(
      { error: 'Failed to test webhook' },
      { status: 500 }
    );
  }
}