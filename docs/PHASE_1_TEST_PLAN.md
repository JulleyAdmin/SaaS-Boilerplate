# Phase 1 Test Plan - Foundation & SSO

## Overview

This comprehensive test plan validates all Phase 1 components before proceeding to Phase 2. Phase 1 includes database schema extensions, role system, team management, SSO integration, and Clerk authentication.

## Test Environment Setup

### Prerequisites
```bash
# Install test dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event msw
npm install --save-dev supertest @types/supertest

# Database setup for testing
createdb hospitalos_test
export DATABASE_URL="postgresql://localhost:5432/hospitalos_test"
```

### Test Data Requirements
- Test organization IDs from Clerk
- Sample SAML metadata XML
- Test user profiles
- Mock IdP responses

## Test Categories

### 1. Database Migration Testing

#### Test 1.1: Schema Creation
```bash
# Test: Verify all tables are created correctly
npm run db:migrate
npm run db:studio

# Validate:
✓ team_members table exists with correct columns
✓ api_keys table exists with proper indexes
✓ invitations table exists with constraints
✓ jackson_store table exists for SSO
✓ jackson_index table exists for performance
✓ jackson_ttl table exists for TTL
✓ role enum exists with OWNER/ADMIN/MEMBER values
```

#### Test 1.2: Data Integrity
```sql
-- Test: Foreign key constraints
INSERT INTO team_members (organization_id, user_id, role) VALUES ('test_org', 'test_user', 'ADMIN');

-- Test: Unique constraints
INSERT INTO api_keys (name, organization_id, hashed_key) VALUES ('Test Key', 'org1', 'hash123');
INSERT INTO api_keys (name, organization_id, hashed_key) VALUES ('Test Key 2', 'org1', 'hash123'); -- Should fail

-- Test: Role enum validation
INSERT INTO team_members (organization_id, user_id, role) VALUES ('test_org', 'test_user', 'INVALID'); -- Should fail
```

#### Test 1.3: Migration Rollback
```bash
# Test: Verify rollback procedures work
# Run rollback SQL from MIGRATION_LOG.md
# Confirm all Phase 1 tables are removed
```

### 2. API Endpoint Testing

#### Test 2.1: SSO Connection Management
```typescript
// File: tests/api/sso-connections.test.ts
describe('SSO Connection API', () => {
  test('GET /api/organizations/[orgId]/sso/connections', async () => {
    const response = await request(app)
      .get('/api/organizations/org_123/sso/connections')
      .set('Authorization', 'Bearer valid_clerk_token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('connections');
    expect(Array.isArray(response.body.connections)).toBe(true);
  });

  test('POST /api/organizations/[orgId]/sso/connections', async () => {
    const connectionData = {
      name: 'Test SSO',
      description: 'Test connection',
      metadataUrl: 'https://idp.example.com/metadata',
      redirectUrl: 'http://localhost:3000/api/auth/sso/callback'
    };

    const response = await request(app)
      .post('/api/organizations/org_123/sso/connections')
      .set('Authorization', 'Bearer valid_clerk_token')
      .send(connectionData);

    expect(response.status).toBe(201);
    expect(response.body.connection).toHaveProperty('name', 'Test SSO');
  });

  test('PATCH /api/organizations/[orgId]/sso/connections/[id]', async () => {
    const updates = { name: 'Updated SSO Name' };

    const response = await request(app)
      .patch('/api/organizations/org_123/sso/connections/conn_123')
      .set('Authorization', 'Bearer valid_clerk_token')
      .send(updates);

    expect(response.status).toBe(200);
    expect(response.body.connection.name).toBe('Updated SSO Name');
  });

  test('DELETE /api/organizations/[orgId]/sso/connections/[id]', async () => {
    const response = await request(app)
      .delete('/api/organizations/org_123/sso/connections/conn_123')
      .set('Authorization', 'Bearer valid_clerk_token');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

#### Test 2.2: SSO Authentication Flow
```typescript
// File: tests/api/sso-auth.test.ts
describe('SSO Authentication', () => {
  test('GET /api/auth/sso/authorize', async () => {
    const response = await request(app)
      .get('/api/auth/sso/authorize')
      .query({
        tenant: 'org_123',
        redirect_uri: 'http://localhost:3000/callback'
      });

    expect(response.status).toBe(302);
    expect(response.headers.location).toContain('saml');
  });

  test('POST /api/auth/sso/callback - SAML Response', async () => {
    const mockSAMLResponse = 'PHNhbWw6UmVzcG9uc2U...'; // Base64 encoded SAML

    const response = await request(app)
      .post('/api/auth/sso/callback')
      .type('form')
      .send({
        SAMLResponse: mockSAMLResponse,
        RelayState: 'test_state'
      });

    expect(response.status).toBe(302);
    expect(response.headers.location).toContain('dashboard');
  });

  test('GET /api/auth/sso/metadata', async () => {
    const response = await request(app)
      .get('/api/auth/sso/metadata')
      .query({ tenant: 'org_123' });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/xml');
    expect(response.text).toContain('<EntityDescriptor');
  });
});
```

#### Test 2.3: Authorization & Security
```typescript
// File: tests/api/auth-security.test.ts
describe('API Security', () => {
  test('Unauthorized access blocked', async () => {
    const response = await request(app)
      .get('/api/organizations/org_123/sso/connections');

    expect(response.status).toBe(401);
  });

  test('Cross-organization access blocked', async () => {
    const response = await request(app)
      .get('/api/organizations/org_456/sso/connections')
      .set('Authorization', 'Bearer org_123_token');

    expect(response.status).toBe(403);
  });

  test('Input validation works', async () => {
    const invalidData = {
      name: '', // Required field empty
      redirectUrl: 'invalid-url' // Invalid URL format
    };

    const response = await request(app)
      .post('/api/organizations/org_123/sso/connections')
      .set('Authorization', 'Bearer valid_token')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });
});
```

### 3. UI Component Testing

#### Test 3.1: SSO Connection List
```typescript
// File: tests/components/SSOConnectionList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { SSOConnectionList } from '@/features/sso/components/SSOConnectionList';

// Mock organization context
jest.mock('@clerk/nextjs', () => ({
  useOrganization: () => ({
    organization: { id: 'org_123', name: 'Test Hospital' }
  })
}));

describe('SSOConnectionList', () => {
  test('renders empty state when no connections', async () => {
    // Mock empty API response
    fetchMock.mockResponseOnce(JSON.stringify({ connections: [] }));

    render(<SSOConnectionList />);

    await waitFor(() => {
      expect(screen.getByText('No SSO connections')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add connection/i })).toBeInTheDocument();
    });
  });

  test('renders connection list with data', async () => {
    const mockConnections = [{
      tenant: 'org_123',
      name: 'Hospital SSO',
      description: 'Main identity provider',
      defaultRedirectUrl: 'http://localhost:3000/callback'
    }];

    fetchMock.mockResponseOnce(JSON.stringify({ connections: mockConnections }));

    render(<SSOConnectionList />);

    await waitFor(() => {
      expect(screen.getByText('Hospital SSO')).toBeInTheDocument();
      expect(screen.getByText('Main identity provider')).toBeInTheDocument();
    });
  });

  test('delete connection works', async () => {
    const mockConnections = [{ tenant: 'org_123', name: 'Test SSO' }];
    fetchMock.mockResponses(
      [JSON.stringify({ connections: mockConnections }), { status: 200 }],
      [JSON.stringify({ success: true }), { status: 200 }],
      [JSON.stringify({ connections: [] }), { status: 200 }]
    );

    render(<SSOConnectionList />);

    await waitFor(() => screen.getByText('Test SSO'));

    // Click dropdown menu
    const menuButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(menuButton);

    // Click delete
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Confirm deletion
    window.confirm = jest.fn(() => true);

    await waitFor(() => {
      expect(screen.getByText('No SSO connections')).toBeInTheDocument();
    });
  });
});
```

#### Test 3.2: Create SSO Connection Dialog
```typescript
// File: tests/components/CreateSSOConnectionDialog.test.tsx
describe('CreateSSOConnectionDialog', () => {
  test('form validation works', async () => {
    const onSuccess = jest.fn();

    render(
      <CreateSSOConnectionDialog
        open={true}
        onOpenChange={() => {}}
        onSuccess={onSuccess}
      />
    );

    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /create connection/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  test('successful connection creation', async () => {
    const onSuccess = jest.fn();
    fetchMock.mockResponseOnce(JSON.stringify({ connection: { id: 'new_conn' } }));

    render(
      <CreateSSOConnectionDialog
        open={true}
        onOpenChange={() => {}}
        onSuccess={onSuccess}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/connection name/i), {
      target: { value: 'Test Connection' }
    });
    fireEvent.change(screen.getByLabelText(/redirect url/i), {
      target: { value: 'http://localhost:3000/callback' }
    });
    fireEvent.change(screen.getByPlaceholderText(/metadata/i), {
      target: { value: 'https://idp.example.com/metadata' }
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /create connection/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

### 4. End-to-End SSO Testing

#### Test 4.1: Complete SSO Flow
```typescript
// File: tests/e2e/sso-flow.spec.ts
import { expect, test } from '@playwright/test';

test.describe('SSO End-to-End Flow', () => {
  test('complete SAML authentication flow', async ({ page }) => {
    // 1. Navigate to SSO settings
    await page.goto('/dashboard/organization-profile/sso');

    // 2. Create SSO connection
    await page.click('text=Add Connection');
    await page.fill('[placeholder="e.g., Company Active Directory"]', 'Test Hospital SSO');
    await page.fill('[placeholder="https://idp.example.com/metadata"]', 'https://samltest.id/saml/idp');
    await page.click('text=Create Connection');

    // 3. Verify connection appears
    await expect(page.locator('text=Test Hospital SSO')).toBeVisible();

    // 4. Test SSO initiation
    await page.goto('/auth/sso?tenant=org_123');

    // 5. Should redirect to IdP (mock)
    await expect(page.url()).toContain('saml');

    // 6. Mock SAML response (in real test, would interact with test IdP)
    await page.goto('/api/auth/sso/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      postData: 'SAMLResponse=PHNhbWw6UmVzcG9uc2U...'
    });

    // 7. Should redirect to dashboard
    await expect(page.url()).toContain('/dashboard');

    // 8. User should be authenticated
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});
```

#### Test 4.2: Error Handling
```typescript
test('SSO error scenarios', async ({ page }) => {
  // Test invalid SAML response
  await page.goto('/api/auth/sso/callback', {
    method: 'POST',
    postData: 'SAMLResponse=invalid_response'
  });

  await expect(page.locator('text=SSO authentication failed')).toBeVisible();

  // Test missing connection
  await page.goto('/auth/sso?tenant=nonexistent_org');

  await expect(page.locator('text=No SSO connection found')).toBeVisible();
});
```

### 5. Clerk Integration Testing

#### Test 5.1: User Creation and Updates
```typescript
// File: tests/integration/clerk-sso.test.ts
describe('Clerk SSO Integration', () => {
  test('creates new user from SSO', async () => {
    const mockSSOUser = {
      id: 'saml_user_123',
      email: 'doctor@hospital.com',
      firstName: 'Dr. John',
      lastName: 'Smith',
      roles: ['doctor', 'staff'],
      raw: { department: 'cardiology' }
    };

    const clerkUserId = await createOrUpdateClerkUser(mockSSOUser);

    expect(clerkUserId).toBeDefined();

    // Verify user in Clerk
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    expect(clerkUser.emailAddresses[0].emailAddress).toBe('doctor@hospital.com');
    expect(clerkUser.publicMetadata.ssoProvider).toBe('saml');
    expect(clerkUser.publicMetadata.ssoRoles).toContain('doctor');
  });

  test('updates existing user from SSO', async () => {
    // Create user first
    const existingUser = await clerkClient.users.createUser({
      emailAddress: ['existing@hospital.com']
    });

    const mockSSOUser = {
      id: 'saml_user_456',
      email: 'existing@hospital.com',
      firstName: 'Updated',
      lastName: 'Name',
      roles: ['admin'],
      raw: { newAttribute: 'value' }
    };

    const clerkUserId = await createOrUpdateClerkUser(mockSSOUser);

    expect(clerkUserId).toBe(existingUser.id);

    // Verify metadata updated
    const updatedUser = await clerkClient.users.getUser(clerkUserId);

    expect(updatedUser.publicMetadata.ssoRoles).toContain('admin');
    expect(updatedUser.publicMetadata.newAttribute).toBe('value');
  });
});
```

#### Test 5.2: Session Management
```typescript
test('creates valid Clerk session after SSO', async () => {
  const userId = 'user_123';
  const organizationId = 'org_123';

  const session = await createClerkSession(userId, organizationId);

  expect(session.id).toBeDefined();
  expect(session.userId).toBe(userId);

  // Verify session is active
  const sessionStatus = await clerkClient.sessions.verifySession(session.id, session.lastActiveToken);

  expect(sessionStatus.status).toBe('active');
});
```

### 6. Hospital-Specific Testing

#### Test 6.1: Medical Role Mapping
```typescript
// File: tests/hospital/role-mapping.test.ts
describe('Hospital Role Mapping', () => {
  test('maps SSO roles to medical positions', () => {
    const ssoRoles = ['physician', 'department_head', 'cardiology'];
    const internalRole = mapSSORolesToInternalRole(ssoRoles);

    expect(internalRole).toBe('ADMIN'); // Department head = Admin
  });

  test('handles unknown roles gracefully', () => {
    const ssoRoles = ['unknown_role', 'custom_permission'];
    const internalRole = mapSSORolesToInternalRole(ssoRoles);

    expect(internalRole).toBe('MEMBER'); // Default fallback
  });
});
```

#### Test 6.2: Department Integration
```typescript
test('extracts department from SSO attributes', () => {
  const ssoProfile = {
    id: 'user_123',
    email: 'nurse@hospital.com',
    raw: {
      department: 'emergency',
      shift: 'night',
      license: 'RN123456'
    }
  };

  const department = extractDepartmentFromSSO(ssoProfile);

  expect(department).toBe('emergency');
});
```

### 7. Performance Testing

#### Test 7.1: Database Performance
```sql
-- Test: Query performance with indexes
EXPLAIN ANALYZE SELECT * FROM team_members WHERE organization_id = 'org_123';
EXPLAIN ANALYZE SELECT * FROM api_keys WHERE organization_id = 'org_123';
EXPLAIN ANALYZE SELECT * FROM invitations WHERE token = 'unique_token';

-- Verify index usage and query times < 10ms
```

#### Test 7.2: API Response Times
```typescript
test('API endpoints respond within acceptable limits', async () => {
  const startTime = Date.now();

  const response = await request(app)
    .get('/api/organizations/org_123/sso/connections')
    .set('Authorization', 'Bearer valid_token');

  const responseTime = Date.now() - startTime;

  expect(response.status).toBe(200);
  expect(responseTime).toBeLessThan(500); // < 500ms
});
```

## Test Execution Plan

### Phase 1: Infrastructure Testing
1. **Database Migration Tests** (Day 1)
   - Run all migration scripts
   - Validate schema creation
   - Test rollback procedures

2. **API Integration Tests** (Day 2)
   - Test all SSO endpoints
   - Validate authorization
   - Test error scenarios

### Phase 2: Component Testing
3. **UI Component Tests** (Day 3)
   - Test all SSO components
   - Validate form handling
   - Test user interactions

4. **E2E Flow Tests** (Day 4)
   - Complete SSO authentication flows
   - Test error scenarios
   - Validate user journeys

### Phase 3: Integration Testing
5. **Clerk Integration** (Day 5)
   - User creation/updates
   - Session management
   - Metadata synchronization

6. **Hospital-Specific Tests** (Day 5)
   - Medical role mapping
   - Department assignment
   - Compliance scenarios

## Success Criteria

### ✅ **Phase 1 Complete When:**
- [ ] All database migrations succeed without errors
- [ ] All API endpoints return correct responses
- [ ] All UI components render and function properly
- [ ] Complete SSO flow works end-to-end
- [ ] Clerk integration creates/updates users correctly
- [ ] All security validations pass
- [ ] Performance meets requirements (< 500ms API, < 10ms DB)
- [ ] Hospital-specific features work as designed

### 📋 **Test Coverage Requirements:**
- **API Endpoints**: 100% coverage
- **UI Components**: 90% coverage
- **Integration Flows**: 100% critical paths
- **Error Scenarios**: 80% coverage

### 🔧 **Test Commands:**
```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run test:api
npm run test:components
npm run test:e2e
npm run test:integration

# Run with coverage
npm run test:coverage

# Performance tests
npm run test:performance
```

Once all tests pass and criteria are met, we'll have a bulletproof Phase 1 foundation ready for Phase 2 advanced features!

Would you like me to implement any specific test category first, or shall we start with the database migration testing?
