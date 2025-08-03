import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { canManageWebhooks, getUserRole } from '@/models/team';
import {
  deleteWebhookEndpoint,
  getWebhookEndpoint,
  updateWebhookEndpoint,
  type WebhookEventType,
  webhookEventTypes,
} from '@/models/webhook';

const updateWebhookSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  url: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'failed', 'paused'] as const).optional(),
  eventTypes: z.array(z.enum(webhookEventTypes as [WebhookEventType, ...WebhookEventType[]])).min(1).optional(),
  headers: z.record(z.string()).optional(),
  timeout: z.number().min(5).max(120).optional(),
  retryCount: z.number().min(0).max(5).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { orgId: string; webhookId: string } },
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
        { error: 'Insufficient permissions to view webhooks' },
        { status: 403 },
      );
    }

    const webhook = await getWebhookEndpoint(params.orgId, params.webhookId);

    if (!webhook) {
      return Response.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Remove secret from response for security
    const safeWebhook = {
      ...webhook,
      secret: undefined,
    };

    return Response.json({ data: safeWebhook });
  } catch (error) {
    console.error('Error fetching webhook:', error);
    return Response.json(
      { error: 'Failed to fetch webhook' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string; webhookId: string } },
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
        { error: 'Insufficient permissions to update webhooks' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const validatedData = updateWebhookSchema.parse(body);

    const updated = await updateWebhookEndpoint(
      params.orgId,
      params.webhookId,
      validatedData,
    );

    if (!updated) {
      return Response.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Remove secret from response
    const safeWebhook = {
      ...updated,
      secret: undefined,
    };

    return Response.json({ data: safeWebhook });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error updating webhook:', error);
    return Response.json(
      { error: 'Failed to update webhook' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { orgId: string; webhookId: string } },
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
        { error: 'Insufficient permissions to delete webhooks' },
        { status: 403 },
      );
    }

    const deleted = await deleteWebhookEndpoint(params.orgId, params.webhookId);

    if (!deleted) {
      return Response.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return Response.json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return Response.json(
      { error: 'Failed to delete webhook' },
      { status: 500 },
    );
  }
}
