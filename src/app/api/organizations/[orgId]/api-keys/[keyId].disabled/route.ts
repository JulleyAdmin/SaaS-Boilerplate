import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

import { deleteApiKey, getApiKey } from '@/models/apiKey';
import { canManageApiKeys, getUserRole } from '@/models/team';

export async function GET(
  _request: NextRequest,
  { params }: { params: { orgId: string; keyId: string } },
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
    if (!canManageApiKeys(userRole)) {
      return Response.json(
        { error: 'Insufficient permissions to view API keys' },
        { status: 403 },
      );
    }

    const apiKey = await getApiKey(params.orgId, params.keyId);

    if (!apiKey) {
      return Response.json({ error: 'API key not found' }, { status: 404 });
    }

    // Remove sensitive data from response
    const safeApiKey = {
      ...apiKey,
      hashedKey: undefined,
    };

    return Response.json({ data: safeApiKey });
  } catch (error) {
    console.error('Error fetching API key:', error);
    return Response.json(
      { error: 'Failed to fetch API key' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { orgId: string; keyId: string } },
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
    if (!canManageApiKeys(userRole)) {
      return Response.json(
        { error: 'Insufficient permissions to delete API keys' },
        { status: 403 },
      );
    }

    const deleted = await deleteApiKey(params.orgId, params.keyId);

    if (!deleted) {
      return Response.json({ error: 'API key not found' }, { status: 404 });
    }

    return Response.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return Response.json(
      { error: 'Failed to delete API key' },
      { status: 500 },
    );
  }
}
