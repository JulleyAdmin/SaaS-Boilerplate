import { createHash, timingSafeEqual } from 'node:crypto';

import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createAuditLog } from '@/libs/audit';
import { db } from '@/libs/DB';
import { scimConfiguration } from '@/models/Schema';

import { SCIM_SCHEMAS } from './users';

export type ScimAuthContext = {
  organizationId: string;
  isAuthenticated: boolean;
  config: any;
};

/**
 * SCIM Bearer token authentication middleware
 */
export async function authenticateScimRequest(
  request: NextRequest,
): Promise<{ success: boolean; context?: ScimAuthContext; error?: string }> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      error: 'Missing or invalid Authorization header',
    };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  if (!token) {
    return {
      success: false,
      error: 'Empty bearer token',
    };
  }

  // Hash the provided token for comparison
  const hashedToken = createHash('sha256').update(token).digest('hex');

  try {
    // Find SCIM configuration with matching hashed token
    const configs = await db
      .select()
      .from(scimConfiguration)
      .where(eq(scimConfiguration.enabled, true));

    let matchedConfig = null;
    for (const config of configs) {
      // Use timing-safe comparison to prevent timing attacks
      const configTokenBuffer = Buffer.from(config.bearerToken, 'hex');
      const providedTokenBuffer = Buffer.from(hashedToken, 'hex');

      if (configTokenBuffer.length === providedTokenBuffer.length
        && timingSafeEqual(configTokenBuffer, providedTokenBuffer)) {
        matchedConfig = config;
        break;
      }
    }

    if (!matchedConfig) {
      return {
        success: false,
        error: 'Invalid bearer token',
      };
    }

    // Log successful authentication
    await createAuditLog({
      organizationId: matchedConfig.organizationId,
      actorId: 'scim-client',
      actorName: 'SCIM Client',
      action: 'scim.authentication.success',
      crud: 'read',
      resource: 'scim_endpoint',
      resourceId: request.url,
      ipAddress: request.headers.get('x-forwarded-for')
        || request.headers.get('x-real-ip')
        || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata: {
        endpoint: request.url,
        method: request.method,
        tokenPrefix: hashedToken.substring(0, 8),
      },
    });

    return {
      success: true,
      context: {
        organizationId: matchedConfig.organizationId,
        isAuthenticated: true,
        config: matchedConfig,
      },
    };
  } catch (error) {
    console.error('SCIM authentication error:', error);
    return {
      success: false,
      error: 'Authentication service error',
    };
  }
}

/**
 * Validate SCIM request content type and format
 */
export function validateScimContentType(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type');

  if (request.method === 'GET' || request.method === 'DELETE') {
    return true; // No content type validation needed
  }

  return contentType === 'application/scim+json'
    || contentType === 'application/json';
}

/**
 * Create standardized SCIM error response
 */
export function createScimErrorResponse(
  status: number,
  scimType?: string,
  detail?: string,
): NextResponse {
  const errorBody = {
    schemas: [SCIM_SCHEMAS.ERROR],
    status: status.toString(),
    scimType,
    detail,
  };

  return NextResponse.json(errorBody, {
    status,
    headers: {
      'Content-Type': 'application/scim+json',
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache',
    },
  });
}

/**
 * Create standardized SCIM success response
 */
export function createScimResponse(
  data: any,
  status: number = 200,
  location?: string,
): NextResponse {
  const headers: Record<string, string> = {
    'Content-Type': 'application/scim+json',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
  };

  if (location) {
    headers.Location = location;
  }

  return NextResponse.json(data, {
    status,
    headers,
  });
}

/**
 * Validate SCIM request parameters
 */
export function validateScimListParams(searchParams: URLSearchParams): {
  valid: boolean;
  params?: {
    startIndex: number;
    count: number;
    filter?: string;
    sortBy?: string;
    sortOrder?: 'ascending' | 'descending';
    attributes?: string[];
    excludedAttributes?: string[];
  };
  error?: string;
} {
  try {
    const startIndex = Number.parseInt(searchParams.get('startIndex') || '1');
    const count = Number.parseInt(searchParams.get('count') || '20');
    const filter = searchParams.get('filter') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrder = (searchParams.get('sortOrder') || 'ascending') as 'ascending' | 'descending';
    const attributes = searchParams.get('attributes')?.split(',') || undefined;
    const excludedAttributes = searchParams.get('excludedAttributes')?.split(',') || undefined;

    // Validation
    if (startIndex < 1) {
      return { valid: false, error: 'startIndex must be >= 1' };
    }

    if (count < 1 || count > 200) {
      return { valid: false, error: 'count must be between 1 and 200' };
    }

    if (sortOrder !== 'ascending' && sortOrder !== 'descending') {
      return { valid: false, error: 'sortOrder must be "ascending" or "descending"' };
    }

    return {
      valid: true,
      params: {
        startIndex,
        count,
        filter,
        sortBy,
        sortOrder,
        attributes,
        excludedAttributes,
      },
    };
  } catch (error) {
    return { valid: false, error: 'Invalid query parameters' };
  }
}

/**
 * Rate limiting for SCIM endpoints
 */
export class ScimRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async checkLimit(identifier: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      // New window or expired window
      const resetTime = now + this.windowMs;
      this.requests.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime };
    }

    if (record.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count++;
    this.requests.set(identifier, record);
    return { allowed: true, remaining: this.maxRequests - record.count, resetTime: record.resetTime };
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

const scimRateLimiter = new ScimRateLimiter();

/**
 * Apply rate limiting to SCIM requests
 */
export async function applyScimRateLimit(
  request: NextRequest,
  organizationId: string,
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const identifier = `${organizationId}:${request.headers.get('x-forwarded-for') || 'unknown'}`;

  const result = await scimRateLimiter.checkLimit(identifier);

  if (!result.allowed) {
    await createAuditLog({
      organizationId,
      actorId: 'scim-client',
      actorName: 'SCIM Client',
      action: 'scim.rate_limit.exceeded',
      crud: 'read',
      resource: 'scim_endpoint',
      resourceId: request.url,
      success: false,
      errorMessage: 'Rate limit exceeded',
      metadata: {
        endpoint: request.url,
        method: request.method,
        rateLimitExceeded: true,
      },
    });

    const response = createScimErrorResponse(
      429,
      'tooMany',
      'Rate limit exceeded. Too many requests.',
    );

    response.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString());
    response.headers.set('X-RateLimit-Limit', scimRateLimiter.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

    return { allowed: false, response };
  }

  return { allowed: true };
}

/**
 * Validate SCIM filter syntax (basic implementation)
 */
export function validateScimFilter(filter: string): { valid: boolean; error?: string } {
  if (!filter) {
    return { valid: true };
  }

  // Basic SCIM filter validation
  // In production, implement full SCIM filter parsing per RFC 7644
  const basicFilterPattern = /^[a-zA-Z][\w.]*(eq|ne|co|sw|ew|gt|ge|lt|le|pr)\s*(?:\S.*|[\t\v\f \xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF])$/;

  if (!basicFilterPattern.test(filter.replace(/\s+/g, ' ').trim())) {
    return {
      valid: false,
      error: 'Invalid filter syntax. Use format: attribute operator value',
    };
  }

  return { valid: true };
}

/**
 * Generate ETag for SCIM resource versioning
 */
export function generateScimETag(resource: any): string {
  const content = JSON.stringify(resource);
  return createHash('md5').update(content).digest('hex');
}

/**
 * Validate ETag for conditional requests
 */
export function validateETag(
  request: NextRequest,
  resource: any,
): { valid: boolean; modified: boolean } {
  const ifMatch = request.headers.get('if-match');
  const ifNoneMatch = request.headers.get('if-none-match');
  const currentETag = generateScimETag(resource);

  if (ifMatch) {
    // If-Match: proceed only if ETag matches
    return { valid: ifMatch === currentETag, modified: true };
  }

  if (ifNoneMatch) {
    // If-None-Match: proceed only if ETag doesn't match
    return { valid: ifNoneMatch !== currentETag, modified: ifNoneMatch !== currentETag };
  }

  return { valid: true, modified: true };
}

/**
 * Hospital-specific SCIM attribute filtering
 */
export function filterHospitalScimAttributes(
  resource: any,
  attributes?: string[],
  excludedAttributes?: string[],
): any {
  if (!attributes && !excludedAttributes) {
    return resource;
  }

  const filtered = { ...resource };

  if (excludedAttributes) {
    // Remove excluded attributes
    excludedAttributes.forEach((attr) => {
      if (attr && attr.includes('.')) {
        // Handle nested attributes like "name.familyName"
        const parts = attr.split('.');
        let current = filtered;
        for (let i = 0; i < parts.length - 1; i++) {
          if (current && current[parts[i]]) {
            current = current[parts[i]];
          } else {
            break;
          }
        }
        if (current && current[parts[parts.length - 1]]) {
          delete current[parts[parts.length - 1]];
        }
      } else if (attr) {
        delete filtered[attr];
      }
    });
  }

  if (attributes) {
    // Only include specified attributes
    const result: any = {
      schemas: filtered.schemas,
      id: filtered.id,
    };

    attributes.forEach((attr) => {
      if (attr && attr.includes('.')) {
        // Handle nested attributes
        const parts = attr.split('.');
        let source = filtered;
        let target = result;

        for (let i = 0; i < parts.length - 1; i++) {
          if (!target[parts[i]]) {
            target[parts[i]] = {};
          }
          target = target[parts[i]];
          if (source && source[parts[i]]) {
            source = source[parts[i]];
          } else {
            break;
          }
        }

        if (source && source[parts[parts.length - 1]] !== undefined) {
          target[parts[parts.length - 1]] = source[parts[parts.length - 1]];
        }
      } else if (attr) {
        if (filtered[attr] !== undefined) {
          result[attr] = filtered[attr];
        }
      }
    });

    return result;
  }

  return filtered;
}

/**
 * Cleanup rate limiter periodically
 */
setInterval(() => {
  scimRateLimiter.cleanup();
}, 300000); // Clean up every 5 minutes
