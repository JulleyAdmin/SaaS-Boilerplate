import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import type { CreateSSOConnectionParams } from '@/lib/sso/types';
import {
  createSSOConnection,
  getSSOConnections,
} from '@/lib/sso/utils';

const createConnectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  metadataUrl: z.string().url().optional(),
  metadata: z.string().optional(),
  redirectUrl: z.string().url('Valid redirect URL is required'),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { orgId: string } },
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || orgId !== params.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connections = await getSSOConnections(params.orgId);

    return NextResponse.json({ connections: connections.data });
  } catch (error) {
    console.error('Failed to fetch SSO connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SSO connections' },
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

    if (!userId || orgId !== params.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createConnectionSchema.parse(body);

    // Ensure either metadataUrl or metadata is provided
    if (!validatedData.metadataUrl && !validatedData.metadata) {
      return NextResponse.json(
        { error: 'Either metadataUrl or metadata must be provided' },
        { status: 400 },
      );
    }

    const connectionParams: CreateSSOConnectionParams = {
      organizationId: params.orgId,
      name: validatedData.name,
      description: validatedData.description,
      metadataUrl: validatedData.metadataUrl,
      metadata: validatedData.metadata,
      redirectUrl: validatedData.redirectUrl,
    };

    const connection = await createSSOConnection(connectionParams);

    return NextResponse.json({ connection }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Failed to create SSO connection:', error);
    return NextResponse.json(
      { error: 'Failed to create SSO connection' },
      { status: 500 },
    );
  }
}
