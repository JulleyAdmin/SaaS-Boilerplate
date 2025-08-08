import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createAuditLog } from '@/libs/audit';
import { validateClientCredentials } from '@/libs/oauth/clients';
import { revokeAccessToken, revokeRefreshToken } from '@/libs/oauth/tokens';

/**
 * OAuth 2.0 Token Revocation Endpoint (RFC 7009)
 * Allows clients to revoke access and refresh tokens
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
        error_description: 'Organization context required',
      }, { status: 400 });
    }

    // Parse request body (should be form data according to RFC)
    const contentType = request.headers.get('content-type') || '';
    let token: string;
    let tokenTypeHint: string | undefined;
    let clientId: string;
    let clientSecret: string;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      token = formData.get('token') as string || '';
      tokenTypeHint = formData.get('token_type_hint') as string || undefined;
      clientId = formData.get('client_id') as string || '';
      clientSecret = formData.get('client_secret') as string || '';
    } else {
      const body = await request.json();
      token = body.token || '';
      tokenTypeHint = body.token_type_hint;
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
        error_description: 'Token parameter is required',
      }, { status: 400 });
    }

    if (!clientId || !clientSecret) {
      return NextResponse.json({
        error: 'invalid_request',
        error_description: 'Client authentication is required',
      }, { status: 400 });
    }

    // Validate client credentials
    const client = await validateClientCredentials(clientId, clientSecret, organizationId);
    if (!client) {
      return NextResponse.json({
        error: 'invalid_client',
        error_description: 'Client authentication failed',
      }, { status: 401 });
    }

    // Revoke the token
    // Note: According to RFC 7009, we should revoke regardless of token type hint
    // and return success even if token doesn't exist (to prevent enumeration)

    try {
      // Try to revoke as access token first
      await revokeAccessToken(token);

      // Also try to revoke as refresh token
      await revokeRefreshToken(token);

      // Create audit log for successful revocation
      await createAuditLog({
        organizationId,
        actorId: 'system',
        actorName: 'OAuth Revocation Service',
        action: 'oauth.token.revoked',
        crud: 'delete',
        resource: 'sso_connection',
        resourceId: clientId,
        metadata: {
          clientId,
          tokenTypeHint,
          tokenHash: hashToken(token), // Don't log actual token
          revokedBy: 'client_request',
        },
      });
    } catch (error) {
      // Log the error but still return success to prevent enumeration
      console.error('Token revocation error:', error);

      await createAuditLog({
        organizationId,
        actorId: 'system',
        actorName: 'OAuth Revocation Service',
        action: 'oauth.token.revocation_failed',
        crud: 'delete',
        resource: 'sso_connection',
        resourceId: clientId,
        metadata: {
          clientId,
          tokenTypeHint,
          tokenHash: hashToken(token),
          error: 'revocation_failed',
        },
      });
    }

    // According to RFC 7009, always return 200 OK for successful requests
    // regardless of whether the token was found or not
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Revocation endpoint error:', error);

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
 * Create a hash of the token for audit logging (don't log actual tokens)
 */
function hashToken(token: string): string {
  const crypto = require('node:crypto');
  return `${crypto.createHash('sha256').update(token).digest('hex').substring(0, 16)}...`;
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
