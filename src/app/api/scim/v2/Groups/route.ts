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
  createScimGroup,
  listScimGroups,
  type ScimGroup
} from '@/libs/scim/groups';

// GET /api/scim/v2/Groups - List groups
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

    // List groups
    const result = await listScimGroups(organizationId, {
      startIndex: params.startIndex,
      count: params.count,
      filter: params.filter,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder
    });

    // Apply attribute filtering if requested
    if (params.attributes || params.excludedAttributes) {
      result.Resources = result.Resources.map(group =>
        filterHospitalScimAttributes(group, params.attributes, params.excludedAttributes)
      );
    }

    return createScimResponse(result);

  } catch (error) {
    console.error('SCIM Groups GET error:', error);
    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}

// POST /api/scim/v2/Groups - Create group
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
    let groupData: Partial<ScimGroup>;
    try {
      groupData = await request.json();
    } catch (error) {
      return createScimErrorResponse(400, 'invalidSyntax', 'Invalid JSON in request body');
    }

    // Validate required fields
    if (!groupData.displayName) {
      return createScimErrorResponse(400, 'invalidValue', 'displayName is required');
    }

    // Validate SCIM schemas
    if (!groupData.schemas || !groupData.schemas.includes('urn:ietf:params:scim:schemas:core:2.0:Group')) {
      return createScimErrorResponse(400, 'invalidValue', 'Missing required SCIM Group schema');
    }

    // Hospital-specific validation
    const hospitalExt = groupData['urn:ietf:params:scim:schemas:extension:hospital:2.0:Group'];
    if (hospitalExt) {
      // Validate hospital group type
      const validGroupTypes = ['department', 'role_group', 'security_group', 'custom'];
      if (hospitalExt.groupType && !validGroupTypes.includes(hospitalExt.groupType)) {
        return createScimErrorResponse(400, 'invalidValue', 'Invalid hospital group type');
      }

      // Validate access level
      const validAccessLevels = ['basic', 'elevated', 'admin'];
      if (hospitalExt.accessLevel && !validAccessLevels.includes(hospitalExt.accessLevel)) {
        return createScimErrorResponse(400, 'invalidValue', 'Invalid access level');
      }

      // Validate data access scope
      if (hospitalExt.dataAccessScope) {
        const scope = hospitalExt.dataAccessScope;
        if (scope.phiAccess && !scope.auditRequired) {
          return createScimErrorResponse(400, 'invalidValue', 'PHI access requires audit logging');
        }
      }
    }

    // Create group
    const newGroup = await createScimGroup(groupData, organizationId);

    const location = `${request.nextUrl.origin}/api/scim/v2/Groups/${newGroup.id}`;
    return createScimResponse(newGroup, 201, location);

  } catch (error) {
    console.error('SCIM Groups POST error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return createScimErrorResponse(409, 'uniqueness', error.message);
      }
      if (error.message.includes('required')) {
        return createScimErrorResponse(400, 'invalidValue', error.message);
      }
      if (error.message.includes('Invalid') || error.message.includes('not found')) {
        return createScimErrorResponse(400, 'invalidValue', error.message);
      }
    }

    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}