import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createAuditLog } from '@/libs/audit';
import { type AuthorizeParams, oauthServer } from '@/libs/oauth/server';



/**
 * OAuth 2.0 Authorization Endpoint
 * Handles authorization requests and user consent
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.redirect(
        new URL(`/sign-in?redirect_url=${encodeURIComponent(request.url)}`, request.url),
      );
    }

    if (!orgId) {
      return NextResponse.json({
        error: 'invalid_request',
        error_description: 'Organization context required',
      }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;

    // Extract OAuth parameters
    const params: AuthorizeParams = {
      response_type: searchParams.get('response_type') || '',
      client_id: searchParams.get('client_id') || '',
      redirect_uri: searchParams.get('redirect_uri') || '',
      scope: searchParams.get('scope') || undefined,
      state: searchParams.get('state') || undefined,
      code_challenge: searchParams.get('code_challenge') || undefined,
      code_challenge_method: searchParams.get('code_challenge_method') || undefined,
      // Hospital-specific parameters
      department_id: searchParams.get('department_id') || undefined,
      hospital_role: searchParams.get('hospital_role') || undefined,
      data_access_scope: searchParams.get('data_access_scope') || undefined,
    };

    // Validate and process authorization request
    const result = await oauthServer.authorize(params, userId, orgId);

    // Handle error responses
    if ('error' in result) {
      // For authorization errors, redirect back to client with error if redirect_uri is valid
      if (params.redirect_uri && result.error !== 'invalid_redirect_uri') {
        const errorParams = new URLSearchParams({
          error: result.error,
          error_description: result.error_description || '',
        });
        if (params.state) {
          errorParams.set('state', params.state);
        }

        return NextResponse.redirect(`${params.redirect_uri}?${errorParams}`);
      }

      // Otherwise return JSON error response
      return NextResponse.json(result, { status: 400 });
    }

    // Create audit log for successful authorization
    await createAuditLog({
      organizationId: orgId,
      actorId: userId,
      actorName: 'OAuth Authorization',
      action: 'oauth.authorization.granted',
      crud: 'create',
      resource: 'sso_connection',
      resourceId: params.client_id,
      metadata: {
        clientId: params.client_id,
        scopes: params.scope?.split(' ') || [],
        redirectUri: params.redirect_uri,
        departmentId: params.department_id,
        hospitalRole: params.hospital_role,
        hasCodeChallenge: !!params.code_challenge,
      },
    });

    // Redirect to client with authorization code
    return NextResponse.redirect(result.redirectUri);
  } catch (error) {
    console.error('Authorization endpoint error:', error);

    return NextResponse.json({
      error: 'server_error',
      error_description: 'Internal server error',
    }, { status: 500 });
  }
}

/**
 * Handle POST requests for consent flow (if implementing consent screen)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({
        error: 'unauthorized',
        error_description: 'Authentication required',
      }, { status: 401 });
    }

    const body = await request.json();

    // Handle consent approval/denial
    if (body.action === 'approve') {
      // Process approved consent and redirect with authorization code
      const params: AuthorizeParams = {
        response_type: body.response_type,
        client_id: body.client_id,
        redirect_uri: body.redirect_uri,
        scope: body.scope,
        state: body.state,
        code_challenge: body.code_challenge,
        code_challenge_method: body.code_challenge_method,
        department_id: body.department_id,
        hospital_role: body.hospital_role,
        data_access_scope: body.data_access_scope,
      };

      const result = await oauthServer.authorize(params, userId, orgId);

      if ('error' in result) {
        return NextResponse.json(result, { status: 400 });
      }

      return NextResponse.json({ redirect_uri: result.redirectUri });
    } else if (body.action === 'deny') {
      // User denied consent
      const errorParams = new URLSearchParams({
        error: 'access_denied',
        error_description: 'User denied authorization',
      });
      if (body.state) {
        errorParams.set('state', body.state);
      }

      const redirectUri = `${body.redirect_uri}?${errorParams}`;

      // Audit log for denied authorization
      await createAuditLog({
        organizationId: orgId,
        actorId: userId,
        actorName: 'OAuth Authorization',
        action: 'oauth.authorization.denied',
        crud: 'create',
        resource: 'sso_connection',
        resourceId: body.client_id,
        metadata: {
          clientId: body.client_id,
          reason: 'user_denied_consent',
        },
      });

      return NextResponse.json({ redirect_uri: redirectUri });
    }

    return NextResponse.json({
      error: 'invalid_request',
      error_description: 'Invalid action',
    }, { status: 400 });
  } catch (error) {
    console.error('Authorization consent error:', error);

    return NextResponse.json({
      error: 'server_error',
      error_description: 'Internal server error',
    }, { status: 500 });
  }
}
