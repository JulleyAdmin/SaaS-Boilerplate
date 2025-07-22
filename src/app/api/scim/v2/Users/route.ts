import { NextRequest } from 'next/server';
import {
  authenticateScimRequest,
  validateScimContentType,
  createScimErrorResponse,
  createScimResponse,
  validateScimListParams,
  applyScimRateLimit,
  validateScimFilter,
  filterHospitalScimAttributes
} from '@/libs/scim/middleware';
import {
  createScimUser,
  listScimUsers,
  type ScimUser
} from '@/libs/scim/users';

// GET /api/scim/v2/Users - List users
export async function GET(request: NextRequest) {
  try {
    // Authenticate SCIM request
    const authResult = await authenticateScimRequest(request);
    if (!authResult.success || !authResult.context) {
      return createScimErrorResponse(401, 'invalidCredentials', authResult.error);
    }

    const { organizationId } = authResult.context;

    // Apply rate limiting
    const rateLimitResult = await applyScimRateLimit(request, organizationId);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    // Parse and validate query parameters
    const url = new URL(request.url);
    const paramValidation = validateScimListParams(url.searchParams);
    if (!paramValidation.valid) {
      return createScimErrorResponse(400, 'invalidFilter', paramValidation.error);
    }

    const params = paramValidation.params!;

    // Validate filter if provided
    if (params.filter) {
      const filterValidation = validateScimFilter(params.filter);
      if (!filterValidation.valid) {
        return createScimErrorResponse(400, 'invalidFilter', filterValidation.error);
      }
    }

    // List users
    const result = await listScimUsers(organizationId, {
      startIndex: params.startIndex,
      count: params.count,
      filter: params.filter,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder
    });

    // Apply attribute filtering if requested
    if (params.attributes || params.excludedAttributes) {
      result.Resources = result.Resources.map(user =>
        filterHospitalScimAttributes(user, params.attributes, params.excludedAttributes)
      );
    }

    return createScimResponse(result);

  } catch (error) {
    console.error('SCIM Users GET error:', error);
    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}

// POST /api/scim/v2/Users - Create user
export async function POST(request: NextRequest) {
  try {
    // Authenticate SCIM request
    const authResult = await authenticateScimRequest(request);
    if (!authResult.success || !authResult.context) {
      return createScimErrorResponse(401, 'invalidCredentials', authResult.error);
    }

    const { organizationId } = authResult.context;

    // Apply rate limiting
    const rateLimitResult = await applyScimRateLimit(request, organizationId);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    // Validate content type
    if (!validateScimContentType(request)) {
      return createScimErrorResponse(400, 'invalidSyntax', 'Invalid content type. Use application/scim+json');
    }

    // Parse request body
    let userData: Partial<ScimUser>;
    try {
      userData = await request.json();
    } catch (error) {
      return createScimErrorResponse(400, 'invalidSyntax', 'Invalid JSON in request body');
    }

    // Validate required fields
    if (!userData.userName) {
      return createScimErrorResponse(400, 'invalidValue', 'userName is required');
    }

    if (!userData.emails || !userData.emails[0]?.value) {
      return createScimErrorResponse(400, 'invalidValue', 'At least one email is required');
    }

    // Validate SCIM schemas
    if (!userData.schemas || !userData.schemas.includes('urn:ietf:params:scim:schemas:core:2.0:User')) {
      return createScimErrorResponse(400, 'invalidValue', 'Missing required SCIM User schema');
    }

    // Create user
    const newUser = await createScimUser(userData, organizationId);

    const location = `${request.nextUrl.origin}/api/scim/v2/Users/${newUser.id}`;
    return createScimResponse(newUser, 201, location);

  } catch (error) {
    console.error('SCIM Users POST error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('license')) {
        return createScimErrorResponse(400, 'invalidValue', error.message);
      }
      if (error.message.includes('already exists')) {
        return createScimErrorResponse(409, 'uniqueness', error.message);
      }
      if (error.message.includes('required')) {
        return createScimErrorResponse(400, 'invalidValue', error.message);
      }
    }

    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}