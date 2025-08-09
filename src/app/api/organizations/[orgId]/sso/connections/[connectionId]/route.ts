import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  deleteSSOConnection,
  getSSOConnection,
  updateSSOConnection,
} from '@/lib/sso/utils';


const updateConnectionSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  metadataUrl: z.string().url().optional(),
  metadata: z.string().optional(),
  redirectUrl: z.string().url().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { orgId: string; connectionId: string } },
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || orgId !== params.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await getSSOConnection(params.orgId, params.connectionId);

    return NextResponse.json({ connection });
  } catch (error) {
    console.error('Failed to fetch SSO connection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SSO connection' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string; connectionId: string } },
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || orgId !== params.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateConnectionSchema.parse(body);

    const connection = await updateSSOConnection(
      params.orgId,
      params.connectionId,
      validatedData,
    );

    return NextResponse.json({ connection });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Failed to update SSO connection:', error);
    return NextResponse.json(
      { error: 'Failed to update SSO connection' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { orgId: string; connectionId: string } },
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || orgId !== params.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteSSOConnection(params.orgId, params.connectionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete SSO connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete SSO connection' },
      { status: 500 },
    );
  }
}
