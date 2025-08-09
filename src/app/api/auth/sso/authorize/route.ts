import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getJacksonControllers } from '@/lib/sso/jackson';
import { sanitizeTenant } from '@/lib/sso/utils';



export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenant = searchParams.get('tenant');
    const product = searchParams.get('product') || 'hospitalos';
    const redirect_uri = searchParams.get('redirect_uri') || `${request.nextUrl.origin}/api/auth/sso/callback`;
    const state = searchParams.get('state') || '';
    const idp_hint = searchParams.get('idp_hint');

    if (!tenant) {
      return NextResponse.json(
        { error: 'Missing required parameter: tenant (organization ID)' },
        { status: 400 },
      );
    }

    const { oauthController } = await getJacksonControllers();

    const authParams: any = {
      tenant: sanitizeTenant(tenant),
      product,
      redirect_uri,
      state,
      response_type: 'code',
      client_id: 'dummy',
      code_challenge: 'challenge',
      code_challenge_method: 'S256',
      ...(idp_hint && { idp_hint }),
    };

    const { redirect_url } = await oauthController.authorize(authParams);

    if (!redirect_url) {
      throw new Error('No redirect URL returned from SSO provider');
    }

    return NextResponse.redirect(redirect_url);
  } catch (error) {
    console.error('SSO authorize error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate SSO authentication' },
      { status: 500 },
    );
  }
}
