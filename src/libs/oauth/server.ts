// OAuth Server implementation
import { 
  generateAuthorizationCode, 
  validateAuthorizationCode, 
  generateAccessToken,
  refreshAccessToken,
  introspectToken,
  type AccessTokenData,
  type AuthorizationCodeData 
} from './tokens';
import { 
  getOAuthClient, 
  validateClientCredentials,
  validateClientPermission 
} from './clients';

export interface AuthorizeParams {
  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope?: string;
  state?: string;
  code_challenge?: string;
  code_challenge_method?: string;
  // Hospital-specific parameters
  department_id?: string;
  hospital_role?: string;
  data_access_scope?: string;
}

export interface TokenParams {
  grant_type: string;
  client_id: string;
  client_secret?: string;
  code?: string;
  redirect_uri?: string;
  refresh_token?: string;
  scope?: string;
  // PKCE
  code_verifier?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  // Hospital-specific claims
  hospital_role?: string;
  department_id?: string;
  phi_access?: boolean;
}

export interface ErrorResponse {
  error: string;
  error_description?: string;
  error_uri?: string;
}

/**
 * OAuth 2.0 Authorization Server
 */
export class HospitalOAuthServer {
  
  /**
   * Handle authorization request
   */
  async authorize(
    params: AuthorizeParams,
    userId: string,
    organizationId: string
  ): Promise<{ redirectUri: string } | ErrorResponse> {
    try {
      // Validate required parameters
      if (!params.response_type || !params.client_id || !params.redirect_uri) {
        return {
          error: 'invalid_request',
          error_description: 'Missing required parameters'
        };
      }

      // Only support authorization code flow
      if (params.response_type !== 'code') {
        return {
          error: 'unsupported_response_type',
          error_description: 'Only authorization_code flow is supported'
        };
      }

      // Validate client
      const client = await getOAuthClient(params.client_id, organizationId);
      if (!client) {
        return {
          error: 'invalid_client',
          error_description: 'Client not found or inactive'
        };
      }

      // Validate redirect URI
      if (!client.redirectUris.includes(params.redirect_uri)) {
        return {
          error: 'invalid_redirect_uri',
          error_description: 'Redirect URI not registered for this client'
        };
      }

      // Parse and validate scopes
      const requestedScopes = params.scope ? params.scope.split(' ') : ['read'];
      const allowedScopes = client.scopes.filter(scope => requestedScopes.includes(scope));
      
      if (allowedScopes.length === 0) {
        const errorParams = new URLSearchParams({
          error: 'invalid_scope',
          error_description: 'No valid scopes requested'
        });
        if (params.state) errorParams.set('state', params.state);
        return { redirectUri: `${params.redirect_uri}?${errorParams}` };
      }

      // Validate hospital-specific parameters
      let hospitalRole: string | undefined;
      let dataAccessScope: any | undefined;

      if (params.hospital_role) {
        const validRoles = ['administrator', 'doctor', 'nurse', 'technician', 'viewer'];
        if (!validRoles.includes(params.hospital_role)) {
          const errorParams = new URLSearchParams({
            error: 'invalid_request',
            error_description: 'Invalid hospital role specified'
          });
          if (params.state) errorParams.set('state', params.state);
          return { redirectUri: `${params.redirect_uri}?${errorParams}` };
        }
        hospitalRole = params.hospital_role;
      }

      if (params.data_access_scope) {
        try {
          dataAccessScope = JSON.parse(params.data_access_scope);
        } catch {
          const errorParams = new URLSearchParams({
            error: 'invalid_request',
            error_description: 'Invalid data access scope format'
          });
          if (params.state) errorParams.set('state', params.state);
          return { redirectUri: `${params.redirect_uri}?${errorParams}` };
        }
      }

      // Generate authorization code
      const authCodeData: AuthorizationCodeData = {
        clientId: params.client_id,
        organizationId,
        userId,
        scopes: allowedScopes,
        redirectUri: params.redirect_uri,
        codeChallenge: params.code_challenge,
        codeChallengeMethod: params.code_challenge_method,
        departmentId: params.department_id,
        hospitalRole,
        dataAccessScope
      };

      const authCode = await generateAuthorizationCode(authCodeData);

      // Build redirect URI with authorization code
      const redirectParams = new URLSearchParams({
        code: authCode
      });
      if (params.state) redirectParams.set('state', params.state);

      return {
        redirectUri: `${params.redirect_uri}?${redirectParams}`
      };

    } catch (error) {
      console.error('Authorization error:', error);
      return {
        error: 'server_error',
        error_description: 'Internal server error'
      };
    }
  }

  /**
   * Handle token request
   */
  async token(
    params: TokenParams,
    organizationId: string
  ): Promise<TokenResponse | ErrorResponse> {
    try {
      // Validate required parameters
      if (!params.grant_type || !params.client_id) {
        return {
          error: 'invalid_request',
          error_description: 'Missing required parameters'
        };
      }

      // Handle different grant types
      switch (params.grant_type) {
        case 'authorization_code':
          return this.handleAuthorizationCodeGrant(params, organizationId);
        case 'refresh_token':
          return this.handleRefreshTokenGrant(params, organizationId);
        case 'client_credentials':
          return this.handleClientCredentialsGrant(params, organizationId);
        default:
          return {
            error: 'unsupported_grant_type',
            error_description: 'Grant type not supported'
          };
      }

    } catch (error) {
      console.error('Token error:', error);
      return {
        error: 'server_error',
        error_description: 'Internal server error'
      };
    }
  }

  /**
   * Handle authorization code grant
   */
  private async handleAuthorizationCodeGrant(
    params: TokenParams,
    organizationId: string
  ): Promise<TokenResponse | ErrorResponse> {
    if (!params.code || !params.redirect_uri) {
      return {
        error: 'invalid_request',
        error_description: 'Missing authorization code or redirect URI'
      };
    }

    // Validate client
    let client;
    if (params.client_secret) {
      client = await validateClientCredentials(params.client_id, params.client_secret, organizationId);
    } else {
      // Public client (PKCE required)
      client = await getOAuthClient(params.client_id, organizationId);
      if (client?.clientType !== 'public') {
        return {
          error: 'invalid_client',
          error_description: 'Client authentication required'
        };
      }
    }

    if (!client) {
      return {
        error: 'invalid_client',
        error_description: 'Client authentication failed'
      };
    }

    // Validate authorization code
    const codeData = await validateAuthorizationCode(
      params.code,
      params.client_id,
      params.redirect_uri
    );

    if (!codeData) {
      return {
        error: 'invalid_grant',
        error_description: 'Authorization code is invalid or expired'
      };
    }

    // Validate PKCE for public clients
    if (client.clientType === 'public') {
      if (!params.code_verifier || !codeData) {
        return {
          error: 'invalid_request',
          error_description: 'PKCE code verifier required for public clients'
        };
      }
      // PKCE validation logic would go here
    }

    // Generate access token
    const tokenData: AccessTokenData = {
      clientId: params.client_id,
      organizationId: codeData.organizationId,
      userId: codeData.userId,
      scopes: codeData.scopes,
      departmentId: codeData.departmentId,
      hospitalRole: codeData.hospitalRole,
      dataAccessScope: codeData.dataAccessScope,
      expiresIn: client.tokenLifetime
    };

    const tokens = await generateAccessToken(tokenData);

    const response: TokenResponse = {
      access_token: tokens.accessToken,
      token_type: tokens.tokenType,
      expires_in: tokens.expiresIn,
      scope: codeData.scopes.join(' ')
    };

    if (tokens.refreshToken) {
      response.refresh_token = tokens.refreshToken;
    }

    // Add hospital-specific claims
    if (codeData.hospitalRole) {
      response.hospital_role = codeData.hospitalRole;
    }
    if (codeData.departmentId) {
      response.department_id = codeData.departmentId;
    }
    if (codeData.dataAccessScope?.phiAccess) {
      response.phi_access = true;
    }

    return response;
  }

  /**
   * Handle refresh token grant
   */
  private async handleRefreshTokenGrant(
    params: TokenParams,
    organizationId: string
  ): Promise<TokenResponse | ErrorResponse> {
    if (!params.refresh_token) {
      return {
        error: 'invalid_request',
        error_description: 'Missing refresh token'
      };
    }

    // Validate client
    const client = await validateClientCredentials(
      params.client_id, 
      params.client_secret || '', 
      organizationId
    );

    if (!client) {
      return {
        error: 'invalid_client',
        error_description: 'Client authentication failed'
      };
    }

    // Refresh tokens
    const tokens = await refreshAccessToken(params.refresh_token, params.client_id);

    if (!tokens) {
      return {
        error: 'invalid_grant',
        error_description: 'Refresh token is invalid or expired'
      };
    }

    return {
      access_token: tokens.accessToken,
      token_type: tokens.tokenType,
      expires_in: tokens.expiresIn,
      refresh_token: tokens.refreshToken
    };
  }

  /**
   * Handle client credentials grant
   */
  private async handleClientCredentialsGrant(
    params: TokenParams,
    organizationId: string
  ): Promise<TokenResponse | ErrorResponse> {
    if (!params.client_secret) {
      return {
        error: 'invalid_request',
        error_description: 'Client secret required for client credentials grant'
      };
    }

    // Validate client
    const client = await validateClientCredentials(
      params.client_id,
      params.client_secret,
      organizationId
    );

    if (!client) {
      return {
        error: 'invalid_client',
        error_description: 'Client authentication failed'
      };
    }

    // Check if client is allowed to use client credentials grant
    if (!client.allowedGrantTypes.includes('client_credentials')) {
      return {
        error: 'unauthorized_client',
        error_description: 'Client not authorized for client credentials grant'
      };
    }

    // Parse requested scopes
    const requestedScopes = params.scope ? params.scope.split(' ') : ['read'];
    const allowedScopes = client.scopes.filter(scope => requestedScopes.includes(scope));

    if (allowedScopes.length === 0) {
      return {
        error: 'invalid_scope',
        error_description: 'No valid scopes requested'
      };
    }

    // Generate access token (no refresh token for client credentials)
    const tokenData: AccessTokenData = {
      clientId: params.client_id,
      organizationId,
      scopes: allowedScopes,
      expiresIn: client.tokenLifetime
    };

    const tokens = await generateAccessToken(tokenData);

    return {
      access_token: tokens.accessToken,
      token_type: tokens.tokenType,
      expires_in: tokens.expiresIn,
      scope: allowedScopes.join(' ')
    };
  }

  /**
   * Handle token introspection (RFC 7662)
   */
  async introspect(
    token: string,
    clientId: string,
    clientSecret: string,
    organizationId: string
  ): Promise<any | ErrorResponse> {
    try {
      // Validate client
      const client = await validateClientCredentials(clientId, clientSecret, organizationId);
      if (!client) {
        return {
          error: 'invalid_client',
          error_description: 'Client authentication failed'
        };
      }

      // Introspect token
      const tokenInfo = await introspectToken(token);
      
      return tokenInfo || { active: false };

    } catch (error) {
      console.error('Introspection error:', error);
      return {
        error: 'server_error',
        error_description: 'Internal server error'
      };
    }
  }

  /**
   * Validate token and extract claims for API access
   */
  async validateTokenForAPI(
    authHeader: string,
    requiredScope: string,
    requiredResource: string,
    requiredAction: string,
    organizationId: string,
    departmentId?: string
  ): Promise<{
    valid: boolean;
    clientId?: string;
    userId?: string;
    scopes?: string[];
    hospitalRole?: string;
    departmentId?: string;
    phiAccess?: boolean;
  }> {
    try {
      // Extract bearer token
      if (!authHeader.startsWith('Bearer ')) {
        return { valid: false };
      }

      const token = authHeader.substring(7);
      
      // Validate token
      const tokenInfo = await introspectToken(token);
      if (!tokenInfo || !tokenInfo.active) {
        return { valid: false };
      }

      // Check organization access
      if (tokenInfo.client_id) {
        const client = await getOAuthClient(tokenInfo.client_id, organizationId);
        if (!client) {
          return { valid: false };
        }

        // Validate client permission
        const hasPermission = await validateClientPermission(
          tokenInfo.client_id,
          requiredScope,
          requiredResource,
          requiredAction,
          organizationId,
          departmentId
        );

        if (!hasPermission) {
          return { valid: false };
        }
      }

      return {
        valid: true,
        clientId: tokenInfo.client_id,
        userId: tokenInfo.username,
        scopes: tokenInfo.scope?.split(' ') || [],
        hospitalRole: tokenInfo.hospital_role,
        departmentId: tokenInfo.department_id,
        phiAccess: tokenInfo.phi_access || false
      };

    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }
}

// Export singleton instance
export const oauthServer = new HospitalOAuthServer();