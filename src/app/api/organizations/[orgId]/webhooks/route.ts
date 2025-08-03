import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { canManageWebhooks, getUserRole } from '@/models/team';
import {
  createWebhookEndpoint,
  getWebhookEndpoints,
  type WebhookEventType,
  webhookEventTypes,
} from '@/models/webhook';

const createWebhookSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  url: z.string().url(),
  eventTypes: z.array(z.enum(webhookEventTypes as [WebhookEventType, ...WebhookEventType[]])).min(1),
  headers: z.record(z.string()).optional(),
  timeout: z.number().min(5).max(120).optional(),
  retryCount: z.number().min(0).max(5).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { orgId: string } },
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

    const webhooks = await getWebhookEndpoints(params.orgId);

    // Remove secrets from response for security
    const safeWebhooks = webhooks.map(webhook => ({
      ...webhook,
      secret: undefined, // Don't expose secrets
    }));

    return Response.json({ data: safeWebhooks });
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return Response.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } },
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
        { error: 'Insufficient permissions to create webhooks' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const validatedData = createWebhookSchema.parse(body);

    // Create the webhook endpoint
    const webhook = await createWebhookEndpoint({
      organizationId: params.orgId,
      name: validatedData.name,
      description: validatedData.description,
      url: validatedData.url,
      eventTypes: validatedData.eventTypes,
      headers: validatedData.headers,
      timeout: validatedData.timeout,
      retryCount: validatedData.retryCount,
      createdBy: userId,
    });

    // Return webhook without secret (except for initial creation)
    const response = {
      ...webhook,
      secret: webhook.secret, // Include secret on creation for user to save
    };

    return Response.json({ data: response }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error creating webhook:', error);
    return Response.json(
      { error: 'Failed to create webhook' },
      { status: 500 },
    );
  }
}
