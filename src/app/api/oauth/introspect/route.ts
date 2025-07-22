import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { oauthServer } from '@/libs/oauth/server';
import { createAuditLog } from '@/libs/audit';

/**
 * OAuth 2.0 Token Introspection Endpoint (RFC 7662)
 * Allows clients to query the authorization server about token status
 */
export async function POST(request: NextRequest) {
  try {
    // Extract organization from headers
    const headersList = await headers();
    const orgHeader = headersList.get('x-organization-id');
    const host = headersList.get('host');
    
    // Extract organization ID from subdomain or header
    let organizationId: string | null = orgHeader || null;
    if (!organizationId && host) {
      const subdomain = host.split('.')[0];
      if (subdomain !== 'www' && subdomain !== 'api') {
        organizationId = subdomain || null;
      }
    }

    if (!organizationId) {
      return NextResponse.json({
        error: 'invalid_request',
        error_description: 'Organization context required'
      }, { status: 400 });
    }

    // Parse request body (should be form data according to RFC)
    const contentType = request.headers.get('content-type') || '';
    let token: string;
    let clientId: string;
    let clientSecret: string;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      token = formData.get('token') as string || '';
      clientId = formData.get('client_id') as string || '';
      clientSecret = formData.get('client_secret') as string || '';
    } else {
      const body = await request.json();
      token = body.token || '';
      clientId = body.client_id || '';
      clientSecret = body.client_secret || '';
    }

    // Handle client authentication via Basic Auth if not in body
    if (!clientSecret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Basic ')) {
        try {
          const credentials = Buffer.from(authHeader.substring(6), 'base64').toString();
          const [authClientId, authClientSecret] = credentials.split(':');
          if (authClientId === clientId && authClientSecret) {
            clientSecret = authClientSecret;
          }
        } catch (error) {
          // Invalid Basic auth format
        }
      }
    }

    // Validate required parameters
    if (!token) {
      return NextResponse.json({
        error: 'invalid_request',
        error_description: 'Token parameter is required'
      }, { status: 400 });
    }

    if (!clientId || !clientSecret) {
      return NextResponse.json({
        error: 'invalid_request',
        error_description: 'Client authentication is required'
      }, { status: 400 });
    }

    // Perform token introspection
    const result = await oauthServer.introspect(token, clientId, clientSecret, organizationId);

    // Handle error responses
    if ('error' in result) {
      const statusCode = getErrorStatusCode(result.error);
      
      // Audit log for failed introspection
      await createAuditLog({
        organizationId,
        actorId: 'system',
        actorName: 'OAuth Introspection Service',
        action: 'oauth.introspection.failed',
        crud: 'read',
        resource: 'oauth_token',
        resourceId: clientId,
        metadata: {
          clientId,
          error: result.error,
          tokenHash: hashToken(token) // Don't log actual token
        }
      });

      return NextResponse.json(result, { 
        status: statusCode,
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache'
        }
      });
    }

    // Audit log for successful introspection (only if token is active)
    if (result.active) {
      await createAuditLog({
        organizationId,
        actorId: 'system',
        actorName: 'OAuth Introspection Service',
        action: 'oauth.introspection.success',
        crud: 'read',
        resource: 'oauth_token',
        resourceId: clientId,
        metadata: {
          clientId,
          tokenActive: result.active,
          scopes: result.scope?.split(' ') || [],
          tokenHash: hashToken(token),
          hospitalRole: result.hospital_role,
          departmentId: result.department_id,
          phiAccess: result.phi_access || false
        }
      });
    }

    // Return introspection response
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Introspection endpoint error:', error);
    
    return NextResponse.json({
      error: 'server_error',
      error_description: 'Internal server error'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      }
    });
  }
}

/**
 * Map OAuth errors to appropriate HTTP status codes
 */
function getErrorStatusCode(error: string): number {
  switch (error) {
    case 'invalid_request':
      return 400;
    case 'invalid_client':
      return 401;
    case 'server_error':
      return 500;
    default:
      return 400;
  }
}

/**
 * Create a hash of the token for audit logging (don't log actual tokens)
 */
function hashToken(token: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(token).digest('hex').substring(0, 16) + '...';
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Organization-Id',
      'Access-Control-Max-Age': '86400'
    }
  });
}