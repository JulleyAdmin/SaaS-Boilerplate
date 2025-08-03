import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  applyScimRateLimit,
  authenticateScimRequest,
  createScimErrorResponse,
  createScimResponse,
  filterHospitalScimAttributes,
  generateScimETag,
  validateETag,
  validateScimContentType,
} from '@/libs/scim/middleware';
import {
  deleteScimUser,
  getScimUser,
  type ScimUser,
  type ScimUserPatch,
  updateScimUser,
} from '@/libs/scim/users';

type RouteParams = {
  params: {
    id: string;
  };
};

// GET /api/scim/v2/Users/{id} - Get user by ID
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

    const userId = params.id;
    if (!userId) {
      return createScimErrorResponse(400, 'invalidPath', 'User ID is required');
    }

    // Get user
    const user = await getScimUser(userId, organizationId);
    if (!user) {
      return createScimErrorResponse(404, 'resourceNotFound', 'User not found');
    }

    // Check conditional requests (ETag)
    const etagValidation = validateETag(request, user);
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

    let responseUser = user;
    if (attributes || excludedAttributes) {
      responseUser = filterHospitalScimAttributes(user, attributes, excludedAttributes);
    }

    const response = createScimResponse(responseUser);

    // Add ETag header
    const etag = generateScimETag(user);
    response.headers.set('ETag', etag);

    return response;
  } catch (error) {
    console.error('SCIM User GET error:', error);
    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}

// PUT /api/scim/v2/Users/{id} - Update user (full replace)
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

    const userId = params.id;
    if (!userId) {
      return createScimErrorResponse(400, 'invalidPath', 'User ID is required');
    }

    // Check if user exists
    const existingUser = await getScimUser(userId, organizationId);
    if (!existingUser) {
      return createScimErrorResponse(404, 'resourceNotFound', 'User not found');
    }

    // Validate ETag for optimistic concurrency control
    const etagValidation = validateETag(request, existingUser);
    if (!etagValidation.valid) {
      return createScimErrorResponse(412, 'preconditionFailed', 'Resource has been modified');
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

    // Update user
    const updatedUser = await updateScimUser(userId, userData, organizationId);

    const response = createScimResponse(updatedUser);

    // Add ETag header
    const etag = generateScimETag(updatedUser);
    response.headers.set('ETag', etag);

    return response;
  } catch (error) {
    console.error('SCIM User PUT error:', error);

    if (error instanceof Error) {
      if (error.message.includes('license')) {
        return createScimErrorResponse(400, 'invalidValue', error.message);
      }
      if (error.message.includes('not found')) {
        return createScimErrorResponse(404, 'resourceNotFound', error.message);
      }
      if (error.message.includes('required')) {
        return createScimErrorResponse(400, 'invalidValue', error.message);
      }
    }

    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}

// PATCH /api/scim/v2/Users/{id} - Partial update user
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

    const userId = params.id;
    if (!userId) {
      return createScimErrorResponse(400, 'invalidPath', 'User ID is required');
    }

    // Check if user exists
    const existingUser = await getScimUser(userId, organizationId);
    if (!existingUser) {
      return createScimErrorResponse(404, 'resourceNotFound', 'User not found');
    }

    // Validate ETag for optimistic concurrency control
    const etagValidation = validateETag(request, existingUser);
    if (!etagValidation.valid) {
      return createScimErrorResponse(412, 'preconditionFailed', 'Resource has been modified');
    }

    // Parse request body
    let patchData: ScimUserPatch;
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

    // Process PATCH operations
    let updatedUserData: Partial<ScimUser> = {};

    for (const operation of patchData.Operations) {
      if (!['add', 'remove', 'replace'].includes(operation.op)) {
        return createScimErrorResponse(400, 'invalidValue', `Invalid operation: ${operation.op}`);
      }

      switch (operation.op) {
        case 'replace':
          if (operation.path) {
            // Path-specific replace
            if (operation.path === 'active') {
              updatedUserData.active = operation.value;
            } else if (operation.path === 'userName') {
              updatedUserData.userName = operation.value;
            } else if (operation.path === 'emails[0].value') {
              updatedUserData.emails = [{ value: operation.value, type: 'work', primary: true }];
            }
            // Add more path-specific operations as needed
          } else {
            // Full resource replace (merge with existing)
            updatedUserData = { ...updatedUserData, ...operation.value };
          }
          break;

        case 'add':
          // Add operation implementation
          if (operation.path === 'emails') {
            const existingEmails = existingUser.emails || [];
            const newEmails = Array.isArray(operation.value) ? operation.value : [operation.value];
            updatedUserData.emails = [...existingEmails, ...newEmails];
          }
          break;

        case 'remove':
          // Remove operation implementation
          if (operation.path === 'active') {
            updatedUserData.active = false;
          }
          break;
      }
    }

    // Apply the updates
    const updatedUser = await updateScimUser(userId, updatedUserData, organizationId);

    const response = createScimResponse(updatedUser);

    // Add ETag header
    const etag = generateScimETag(updatedUser);
    response.headers.set('ETag', etag);

    return response;
  } catch (error) {
    console.error('SCIM User PATCH error:', error);

    if (error instanceof Error) {
      if (error.message.includes('license')) {
        return createScimErrorResponse(400, 'invalidValue', error.message);
      }
      if (error.message.includes('not found')) {
        return createScimErrorResponse(404, 'resourceNotFound', error.message);
      }
    }

    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}

// DELETE /api/scim/v2/Users/{id} - Delete user
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

    const userId = params.id;
    if (!userId) {
      return createScimErrorResponse(400, 'invalidPath', 'User ID is required');
    }

    // Check if user exists
    const existingUser = await getScimUser(userId, organizationId);
    if (!existingUser) {
      return createScimErrorResponse(404, 'resourceNotFound', 'User not found');
    }

    // Validate ETag for optimistic concurrency control
    const etagValidation = validateETag(request, existingUser);
    if (!etagValidation.valid) {
      return createScimErrorResponse(412, 'preconditionFailed', 'Resource has been modified');
    }

    // Delete user (soft delete)
    await deleteScimUser(userId, organizationId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('SCIM User DELETE error:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return createScimErrorResponse(404, 'resourceNotFound', error.message);
      }
    }

    return createScimErrorResponse(500, 'internalError', 'Internal server error');
  }
}
