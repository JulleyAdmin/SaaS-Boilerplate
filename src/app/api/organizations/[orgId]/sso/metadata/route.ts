import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getSSOMetadata } from '@/lib/sso/utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: { orgId: string } },
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || orgId !== params.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metadata = await getSSOMetadata(params.orgId);

    return new NextResponse(metadata, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="saml-metadata-${params.orgId}.xml"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Failed to generate SSO metadata:', error);
    return NextResponse.json(
      { error: 'Failed to generate SSO metadata' },
      { status: 500 },
    );
  }
}
