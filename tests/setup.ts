/**
 * Test Setup Configuration
 * Sets up testing environment for Phase 1 validation
 */

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Mock Clerk API responses
export const server = setupServer(
  // Mock Clerk user creation
  http.post('https://api.clerk.dev/v1/users', () => {
    return HttpResponse.json({
      id: 'user_mock_123',
      email_addresses: [{ email_address: 'test@hospital.com' }],
      first_name: 'Test',
      last_name: 'User',
      public_metadata: {},
    }, { status: 201 });
  }),

  // Mock Clerk user lookup
  http.get('https://api.clerk.dev/v1/users', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email_address');
    if (email === 'existing@hospital.com') {
      return HttpResponse.json({
        data: [{
          id: 'user_existing_123',
          email_addresses: [{ email_address: email }],
        }],
      });
    }
    return HttpResponse.json({ data: [] });
  }),

  // Mock Clerk session creation
  http.post('https://api.clerk.dev/v1/sessions', () => {
    return HttpResponse.json({
      id: 'sess_mock_123',
      user_id: 'user_mock_123',
      status: 'active',
      last_active_token: 'token_123',
    }, { status: 201 });
  }),

  // Mock organization endpoints
  http.get('https://api.clerk.dev/v1/organizations/:orgId/memberships', () => {
    return HttpResponse.json({ data: [] });
  }),

  // Mock Jackson SAML responses
  http.post('/api/auth/sso/callback', () => {
    return new HttpResponse(null, {
      status: 302,
      headers: {
        Location: '/dashboard?__clerk_session_token=sess_mock_123',
      },
    });
  }),
);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://localhost:5432/hospitalos_test';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
  process.env.SSO_ISSUER = 'https://test.hospitalos.app';

  // Required Clerk environment variables
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_123';
  process.env.CLERK_SECRET_KEY = 'sk_test_123';
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL = '/sign-in';
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL = '/sign-up';
  process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = '/dashboard';
  process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = '/dashboard';

  // Required Stripe environment variables
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_stripe_123';
  process.env.STRIPE_SECRET_KEY = 'sk_test_stripe_123';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123';

  // Other required variables
  process.env.NEXTAUTH_SECRET = 'test_secret_123';
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
  server.close();
});

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/test',
    query: {},
    asPath: '/test',
  }),
}));

// Mock Clerk hooks
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'user_test_123',
      emailAddresses: [{ emailAddress: 'test@hospital.com' }],
      firstName: 'Test',
      lastName: 'User',
    },
    isLoaded: true,
  }),
  useOrganization: () => ({
    organization: {
      id: 'org_test_123',
      name: 'Test Hospital',
      slug: 'test-hospital',
    },
    isLoaded: true,
  }),
  auth: () => ({
    userId: 'user_test_123',
    orgId: 'org_test_123',
  }),
}));

// Mock SWR for data fetching
vi.mock('swr', () => ({
  default: (key: string, fetcher: Function) => {
    if (key?.includes('/sso/connections')) {
      return {
        data: { connections: [] },
        error: null,
        mutate: vi.fn(),
        isLoading: false,
      };
    }
    return {
      data: null,
      error: null,
      mutate: vi.fn(),
      isLoading: false,
    };
  },
}));

// Global test utilities
export const mockSSOConnection = {
  tenant: 'org_test_123',
  product: 'hospitalos',
  name: 'Test Hospital SSO',
  description: 'Test SAML connection',
  redirectUrl: ['http://localhost:3000/api/auth/sso/callback'],
  defaultRedirectUrl: 'http://localhost:3000/api/auth/sso/callback',
  metadataUrl: 'https://test.idp.com/metadata',
};

export const mockSSOUser = {
  id: 'saml_user_123',
  email: 'doctor@hospital.com',
  firstName: 'Dr. John',
  lastName: 'Smith',
  roles: ['doctor', 'emergency'],
  groups: ['medical_staff', 'emergency_department'],
  raw: {
    department: 'emergency',
    license: 'MD123456',
    shift: 'day',
  },
};

export const mockAPIKey = {
  id: 'key_test_123',
  name: 'Test API Key',
  organizationId: 'org_test_123',
  hashedKey: 'hashed_key_value',
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: new Date(Date.now() + 86400000), // 24 hours
  lastUsedAt: null,
};

export const mockInvitation = {
  id: 'inv_test_123',
  organizationId: 'org_test_123',
  email: 'nurse@hospital.com',
  role: 'MEMBER',
  token: 'unique_invitation_token',
  expires: new Date(Date.now() + 86400000), // 24 hours
  invitedBy: 'user_admin_123',
  createdAt: new Date(),
  updatedAt: new Date(),
  sentViaEmail: true,
  allowedDomains: ['hospital.com'],
};

export const mockOrganization = {
  id: 'org_test_123',
  name: 'Test Hospital',
  slug: 'test-hospital',
  imageUrl: 'https://test.com/logo.png',
  hasImage: false,
  createdBy: 'user_admin_123',
  createdAt: new Date(),
  updatedAt: new Date(),
  publicMetadata: {
    hospitalType: 'General',
    bedCount: 200,
    departments: ['Emergency', 'ICU', 'Surgery'],
  },
};

// Test database helpers
export async function cleanupTestData() {
  // This would clean up test data between tests
  // Implementation depends on your database setup
}

export async function seedTestData() {
  // This would seed test data for consistent testing
  // Implementation depends on your requirements
}
