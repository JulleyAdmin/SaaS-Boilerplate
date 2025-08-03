import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

import { canManageWebhooks, getUserRole } from '@/models/team';
import { getWebhookDeliveries, getWebhookEndpoint } from '@/models/webhook';

export async function GET(
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
        { error: 'Insufficient permissions to view webhook deliveries' },
        { status: 403 },
      );
    }

    // Verify webhook exists and belongs to organization
    const webhook = await getWebhookEndpoint(params.orgId, params.webhookId);
    if (!webhook) {
      return Response.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number.parseInt(searchParams.get('limit') || '50'), 100);

    const deliveries = await getWebhookDeliveries(params.webhookId, limit);

    return Response.json({ data: deliveries });
  } catch (error) {
    console.error('Error fetching webhook deliveries:', error);
    return Response.json(
      { error: 'Failed to fetch webhook deliveries' },
      { status: 500 },
    );
  }
}
