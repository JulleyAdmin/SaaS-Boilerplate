import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getJacksonControllers } from '@/lib/sso/jackson';

export async function POST(request: NextRequest) {
  try {
    const { oauthController } = await getJacksonControllers();

    // Parse form data for SAML response
    const formData = await request.formData();
    const body: any = {};

    for (const [key, value] of formData.entries()) {
      body[key] = value as string;
    }

    // Add required params for Jackson
    const requestUrl = new URL(request.url);
    body.RelayState = body.RelayState || requestUrl.searchParams.get('RelayState') || '';

    console.log('Processing SAML response...', { bodyKeys: Object.keys(body) });

    // Handle SAML response with Jackson
    const response = await oauthController.samlResponse(body);
    
    if (response.redirect_url) {
      console.log('Redirecting to:', response.redirect_url);
      return NextResponse.redirect(response.redirect_url);
    }

    // For testing, return JSON response with user info
    return NextResponse.json({ 
      success: true, 
      message: 'SAML authentication successful',
      user: response.user || 'No user data returned',
      redirectUrl: '/dashboard'
    });

  } catch (error) {
    console.error('SSO callback error:', error);
    return NextResponse.json(
      { 
        error: 'SSO authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json(
      { error: `SSO error: ${error}` },
      { status: 400 }
    );
  }

  // Handle OIDC callback
  try {
    const { oauthController } = await getJacksonControllers();

    const body = {
      code: code || '',
      state: state || '',
    };

    console.log('Processing OIDC callback...', body);

    const response = await oauthController.oidcAuthzResponse(body);
    
    if (response.redirect_url) {
      console.log('Redirecting to:', response.redirect_url);
      return NextResponse.redirect(response.redirect_url);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'OIDC authentication successful',
      user: response.user || 'No user data returned',
      redirectUrl: '/dashboard'
    });

  } catch (error) {
    console.error('OIDC callback error:', error);
    return NextResponse.json(
      { 
        error: 'SSO authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
