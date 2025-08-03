import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createAuditLog } from '@/libs/audit';
import { oauthServer, type TokenParams } from '@/libs/oauth/server';

/**
 * OAuth 2.0 Token Endpoint
 * Handles token exchange requests
 */
export async function POST(request: NextRequest) {
  try {
    // Extract organization from headers (could be from subdomain, header, etc.)
    const headersList = await headers();
    const orgHeader = headersList.get('x-organization-id');
    const host = headersList.get('host');

    // Extract organization ID from subdomain or header
    let organizationId: string | null = orgHeader || null;
    if (!organizationId && host) {
      // Extract from subdomain (e.g., hospital1.hospitalos.com)
      const subdomain = host.split('.')[0];
      if (subdomain !== 'www' && subdomain !== 'api') {
        organizationId = subdomain || null;
      }
    }

    if (!organizationId) {
      return NextResponse.json({
        error: 'invalid_request',
        error_description: 'Organization context required',
      }, { status: 400 });
    }

    // Parse request body (form data or JSON)
    const contentType = request.headers.get('content-type') || '';
    let params: TokenParams;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      params = {
        grant_type: formData.get('grant_type') as string || '',
        client_id: formData.get('client_id') as string || '',
        client_secret: formData.get('client_secret') as string || undefined,
        code: formData.get('code') as string || undefined,
        redirect_uri: formData.get('redirect_uri') as string || undefined,
        refresh_token: formData.get('refresh_token') as string || undefined,
        scope: formData.get('scope') as string || undefined,
        code_verifier: formData.get('code_verifier') as string || undefined,
      };
    } else {
      const body = await request.json();
      params = {
        grant_type: body.grant_type || '',
        client_id: body.client_id || '',
        client_secret: body.client_secret,
        code: body.code,
        redirect_uri: body.redirect_uri,
        refresh_token: body.refresh_token,
        scope: body.scope,
        code_verifier: body.code_verifier,
      };
    }

    // Handle client authentication via Basic Auth if not in body
    if (!params.client_secret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Basic ')) {
        try {
          const credentials = Buffer.from(authHeader.substring(6), 'base64').toString();
          const [clientId, clientSecret] = credentials.split(':');
          if (clientId === params.client_id) {
            params.client_secret = clientSecret;
          }
        } catch (error) {
          // Invalid Basic auth format
        }
      }
    }

    // Process token request
    const result = await oauthServer.token(params, organizationId);

    // Handle error responses
    if ('error' in result) {
      const statusCode = getErrorStatusCode(result.error);

      // Audit log for failed token request
      await createAuditLog({
        organizationId,
        actorId: 'system',
        actorName: 'OAuth Token Service',
        action: 'oauth.token.failed',
        crud: 'create',
        resource: 'oauth_token',
        resourceId: params.client_id,
        metadata: {
          clientId: params.client_id,
          grantType: params.grant_type,
          error: result.error,
          errorDescription: result.error_description,
        },
      });

      return NextResponse.json(result, {
        status: statusCode,
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
        },
      });
    }

    // Audit log for successful token issuance
    await createAuditLog({
      organizationId,
      actorId: result.hospital_role ? 'user' : 'system',
      actorName: 'OAuth Token Service',
      action: 'oauth.token.issued',
      crud: 'create',
      resource: 'oauth_token',
      resourceId: params.client_id,
      metadata: {
        clientId: params.client_id,
        grantType: params.grant_type,
        scopes: result.scope?.split(' ') || [],
        expiresIn: result.expires_in,
        hasRefreshToken: !!result.refresh_token,
        hospitalRole: result.hospital_role,
        departmentId: result.department_id,
        phiAccess: result.phi_access || false,
      },
    });

    // Return successful token response
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Token endpoint error:', error);

    return NextResponse.json({
      error: 'server_error',
      error_description: 'Internal server error',
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
      },
    });
  }
}

/**
 * Map OAuth errors to appropriate HTTP status codes
 */
function getErrorStatusCode(error: string): number {
  switch (error) {
    case 'invalid_request':
    case 'invalid_grant':
    case 'invalid_scope':
    case 'unsupported_grant_type':
      return 400;
    case 'invalid_client':
      return 401;
    case 'unauthorized_client':
      return 403;
    case 'server_error':
      return 500;
    default:
      return 400;
  }
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
      'Access-Control-Max-Age': '86400',
    },
  });
}
