import { NextRequest, NextResponse } from 'next/server';
import { getJacksonControllers } from '@/lib/sso/jackson';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenant = searchParams.get('tenant') || 'st-marys-hospital';
    
    // Test Jackson is working
    const { apiController } = await getJacksonControllers();
    
    const connections = await apiController.getConnections({
      tenant,
      product: 'hospitalos',
    });

    const baseUrl = request.nextUrl.origin;
    const ssoUrl = `${baseUrl}/api/auth/sso/authorize?tenant=${tenant}&product=hospitalos&redirect_uri=${baseUrl}/dashboard`;

    return NextResponse.json({
      success: true,
      tenant,
      connectionsCount: connections.length,
      connections: connections.map((conn: any) => ({
        clientID: conn.clientID,
        name: conn.name,
        description: conn.description,
      })),
      ssoUrl,
      testUrl: `${baseUrl}/api/auth/sso/metadata?tenant=${tenant}`,
      callbackUrl: `${baseUrl}/api/auth/sso/callback`,
    });

  } catch (error) {
    console.error('SSO test error:', error);
    return NextResponse.json(
      { 
        error: 'SSO test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}