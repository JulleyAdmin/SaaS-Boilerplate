import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { createApiKey, fetchApiKeys } from '@/models/apiKey';



const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  expiresAt: z.string().datetime().optional(),
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

    const apiKeys = await fetchApiKeys(params.orgId);

    return Response.json({ data: apiKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return Response.json(
      { error: 'Failed to fetch API keys' },
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

    const body = await request.json();
    const validatedData = createApiKeySchema.parse(body);

    const { apiKey, plainKey } = await createApiKey({
      name: validatedData.name,
      organizationId: params.orgId,
      expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
    });

    return Response.json(
      {
        data: {
          apiKey,
          plainKey,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error creating API key:', error);
    return Response.json(
      { error: 'Failed to create API key' },
      { status: 500 },
    );
  }
}
