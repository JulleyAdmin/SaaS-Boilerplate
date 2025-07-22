import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateScimRequest,
  validateScimContentType,
  createScimErrorResponse,
  createScimResponse,
  applyScimRateLimit,
  generateScimETag,
  validateETag,
  filterHospitalScimAttributes
} from '@/libs/scim/middleware';
import {
  getScimGroup,
  updateScimGroup,
  deleteScimGroup,
  patchScimGroup,
  type ScimGroup,
  type ScimGroupPatch
} from '@/libs/scim/groups';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/scim/v2/Groups/{id} - Get group by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const groupId = params.id;
    if (!groupId) {
      return createScimErrorResponse(400, 'invalidPath', 'Group ID is required');
    }

    // Get group
    const group = await getScimGroup(groupId, organizationId);
    if (!group) {
      return createScimErrorResponse(404, 'resourceNotFound', 'Group not found');
    }

    // Check conditional requests (ETag)
    const etagValidation = validateETag(request, group);
    if (!etagValidation.valid) {
      return createScimErrorResponse(412, 'preconditionFailed', 'Precondition failed');
    }

    if (!etagValidation.modified) {
      return new NextResponse(null, { status: 304 });
    }

    // Apply attribute filtering if requested
    const url = new URL(request.url);
    const attributes = url.searchParams.get('attributes')?.split(',');
    const excludedAttributes = url.searchParams.get('excludedAttributes')?.split(',');

    let responseGroup = group;
    if (attributes || excludedAttributes) {
      responseGroup = filterHospitalScimAttributes(group, attributes, excludedAttributes);
    }

    const response = createScimResponse(responseGroup);
    
    // Add ETag header
    const etag = generateScimETag(group);
    response.headers.set('ETag', etag);

    return response;

  } catch (error) {
    console.error('SCIM Group GET error:', error);
    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}

// PUT /api/scim/v2/Groups/{id} - Update group (full replace)
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const groupId = params.id;
    if (!groupId) {
      return createScimErrorResponse(400, 'invalidPath', 'Group ID is required');
    }

    // Check if group exists
    const existingGroup = await getScimGroup(groupId, organizationId);
    if (!existingGroup) {
      return createScimErrorResponse(404, 'resourceNotFound', 'Group not found');
    }

    // Validate ETag for optimistic concurrency control
    const etagValidation = validateETag(request, existingGroup);
    if (!etagValidation.valid) {
      return createScimErrorResponse(412, 'preconditionFailed', 'Resource has been modified');
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

    // Update group
    const updatedGroup = await updateScimGroup(groupId, groupData, organizationId);

    const response = createScimResponse(updatedGroup);
    
    // Add ETag header
    const etag = generateScimETag(updatedGroup);
    response.headers.set('ETag', etag);

    return response;

  } catch (error) {
    console.error('SCIM Group PUT error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return createScimErrorResponse(404, 'resourceNotFound', error.message);
      }
      if (error.message.includes('required')) {
        return createScimErrorResponse(400, 'invalidValue', error.message);
      }
      if (error.message.includes('Invalid')) {
        return createScimErrorResponse(400, 'invalidValue', error.message);
      }
    }

    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}

// PATCH /api/scim/v2/Groups/{id} - Partial update group
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const groupId = params.id;
    if (!groupId) {
      return createScimErrorResponse(400, 'invalidPath', 'Group ID is required');
    }

    // Check if group exists
    const existingGroup = await getScimGroup(groupId, organizationId);
    if (!existingGroup) {
      return createScimErrorResponse(404, 'resourceNotFound', 'Group not found');
    }

    // Validate ETag for optimistic concurrency control
    const etagValidation = validateETag(request, existingGroup);
    if (!etagValidation.valid) {
      return createScimErrorResponse(412, 'preconditionFailed', 'Resource has been modified');
    }

    // Parse request body
    let patchData: ScimGroupPatch;
    try {
      patchData = await request.json();
    } catch (error) {
      return createScimErrorResponse(400, 'invalidSyntax', 'Invalid JSON in request body');
    }

    // Validate PATCH operation schema
    if (!patchData.schemas || !patchData.schemas.includes('urn:ietf:params:scim:api:messages:2.0:PatchOp')) {
      return createScimErrorResponse(400, 'invalidValue', 'Missing required SCIM PatchOp schema');
    }

    if (!patchData.Operations || !Array.isArray(patchData.Operations)) {
      return createScimErrorResponse(400, 'invalidValue', 'Operations array is required');
    }

    // Validate operations
    for (const operation of patchData.Operations) {
      if (!['add', 'remove', 'replace'].includes(operation.op)) {
        return createScimErrorResponse(400, 'invalidValue', `Invalid operation: ${operation.op}`);
      }

      // Validate member operations
      if (operation.path === 'members') {
        if (operation.op === 'add' || operation.op === 'remove') {
          if (!operation.value || !Array.isArray(operation.value)) {
            return createScimErrorResponse(400, 'invalidValue', 'Members operation requires array value');
          }

          for (const member of operation.value) {
            if (!member.value) {
              return createScimErrorResponse(400, 'invalidValue', 'Member must have value field');
            }
          }
        }
      }
    }

    // Apply PATCH operations
    const updatedGroup = await patchScimGroup(groupId, patchData, organizationId);

    const response = createScimResponse(updatedGroup);
    
    // Add ETag header
    const etag = generateScimETag(updatedGroup);
    response.headers.set('ETag', etag);

    return response;

  } catch (error) {
    console.error('SCIM Group PATCH error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return createScimErrorResponse(404, 'resourceNotFound', error.message);
      }
      if (error.message.includes('Invalid') || error.message.includes('inactive')) {
        return createScimErrorResponse(400, 'invalidValue', error.message);
      }
    }

    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}

// DELETE /api/scim/v2/Groups/{id} - Delete group
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const groupId = params.id;
    if (!groupId) {
      return createScimErrorResponse(400, 'invalidPath', 'Group ID is required');
    }

    // Check if group exists
    const existingGroup = await getScimGroup(groupId, organizationId);
    if (!existingGroup) {
      return createScimErrorResponse(404, 'resourceNotFound', 'Group not found');
    }

    // Validate ETag for optimistic concurrency control
    const etagValidation = validateETag(request, existingGroup);
    if (!etagValidation.valid) {
      return createScimErrorResponse(412, 'preconditionFailed', 'Resource has been modified');
    }

    // Hospital-specific validation: Check if group is critical
    const hospitalExt = existingGroup['urn:ietf:params:scim:schemas:extension:hospital:2.0:Group'];
    if (hospitalExt?.groupType === 'department' && hospitalExt?.departmentCode) {
      // Check if this is a critical department group
      const criticalDepartments = ['emergency', 'icu', 'surgery'];
      if (criticalDepartments.includes(hospitalExt.departmentCode)) {
        return createScimErrorResponse(400, 'invalidOperation', 
          'Cannot delete critical department group. Please contact administrator.');
      }
    }

    // Delete group
    await deleteScimGroup(groupId, organizationId);

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('SCIM Group DELETE error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return createScimErrorResponse(404, 'resourceNotFound', error.message);
      }
      if (error.message.includes('Cannot delete')) {
        return createScimErrorResponse(400, 'invalidOperation', error.message);
      }
    }

    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}