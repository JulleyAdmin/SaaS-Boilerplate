import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getJacksonControllers } from '@/lib/sso/jackson';



export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenant = searchParams.get('tenant');
    // const product = searchParams.get('product') || 'hospitalos';

    if (!tenant) {
      return NextResponse.json(
        { error: 'Missing required parameter: tenant (organization ID)' },
        { status: 400 },
      );
    }

    const { spConfig } = await getJacksonControllers();

    const metadata = await spConfig.get();

    // Extract XML content from metadata object
    const xmlContent = typeof metadata === 'string' ? metadata : (metadata as any).metadata || '';

    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('SSO metadata error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SSO metadata' },
      { status: 500 },
    );
  }
}
