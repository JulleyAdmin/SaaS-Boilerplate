import type { IConnectionAPIController, IOAuthController, ISPSSOConfig } from '@boxyhq/saml-jackson';
import { afterAll, beforeAll, beforeEach } from 'vitest';

import { getJacksonControllers } from '@/lib/sso/jackson';

// Test Database Setup
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://localhost:5432/hospitalos_test';

// Test Organization Data
export const TEST_HOSPITAL_ORG = {
  id: 'org_test_hospital_123',
  name: 'St. Mary\'s Test Hospital',
  slug: 'st-marys-test-hospital',
};

// Test User Data
export const TEST_HOSPITAL_USERS = {
  admin: {
    id: 'user_admin_123',
    email: 'admin@stmarys.test.com',
    firstName: 'Hospital',
    lastName: 'Admin',
    organizationId: TEST_HOSPITAL_ORG.id,
  },
  doctor: {
    id: 'user_doctor_123',
    email: 'dr.smith@stmarys.test.com',
    firstName: 'Dr. John',
    lastName: 'Smith',
    organizationId: TEST_HOSPITAL_ORG.id,
    department: 'emergency',
    role: 'doctor',
  },
  nurse: {
    id: 'user_nurse_123',
    email: 'nurse.jones@stmarys.test.com',
    firstName: 'Sarah',
    lastName: 'Jones',
    organizationId: TEST_HOSPITAL_ORG.id,
    department: 'icu',
    role: 'nurse',
  },
};

// Mock SAML Metadata
export const MOCK_SAML_METADATA = `<?xml version="1.0" encoding="UTF-8"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" 
                  entityID="https://mocksaml.com/hospital-test">
  <IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                         Location="https://mocksaml.com/sso/hospital-test"/>
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                         Location="https://mocksaml.com/sso/hospital-test"/>
  </IDPSSODescriptor>
</EntityDescriptor>`;

// Mock SAML Response (Base64 encoded)
export const MOCK_SAML_RESPONSE = 'PHNhbWxwOlJlc3BvbnNlIElEPSJ0ZXN0LXJlc3BvbnNlIiBWZXJzaW9uPSIyLjAiIElzc3VlSW5zdGFudD0iMjAyNC0xMi0wMVQxMjowMDowMFoiIERlc3RpbmF0aW9uPSJodHRwOi8vbG9jYWxob3N0OjMwMDMvYXBpL2F1dGgvc3NvL2NhbGxiYWNrIiB4bWxuczpzYW1scD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIj48c2FtbDpJc3N1ZXIgeG1sbnM6c2FtbD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiI+aHR0cHM6Ly9tb2Nrc2FtbC5jb20vaG9zcGl0YWwtdGVzdDwvc2FtbDpJc3N1ZXI+PHNhbWxwOlN0YXR1cz48c2FtbHA6U3RhdHVzQ29kZSBWYWx1ZT0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnN0YXR1czpTdWNjZXNzIi8+PC9zYW1scDpTdGF0dXM+PC9zYW1scDpSZXNwb25zZT4=';

// Test Infrastructure Setup
export class TestInfrastructure {
  private static instance: TestInfrastructure;
  public apiController: IConnectionAPIController | null = null;
  public oauthController: IOAuthController | null = null;
  public spConfig: ISPSSOConfig | null = null;

  static getInstance(): TestInfrastructure {
    if (!TestInfrastructure.instance) {
      TestInfrastructure.instance = new TestInfrastructure();
    }
    return TestInfrastructure.instance;
  }

  async initialize() {
    try {
      // Initialize Jackson controllers
      const controllers = await getJacksonControllers();
      this.apiController = controllers.apiController;
      this.oauthController = controllers.oauthController;
      this.spConfig = controllers.spConfig;

      console.log('Test infrastructure initialized successfully');
    } catch (error) {
      console.error('Failed to initialize test infrastructure:', error);
      throw error;
    }
  }

  async cleanup() {
    // Clean up test data
    if (this.apiController) {
      try {
        // Delete all test connections
        const connections = await this.apiController.getConnections({
          tenant: TEST_HOSPITAL_ORG.id,
          product: 'hospitalos',
        });

        for (const connection of connections) {
          await this.apiController.deleteConnections({
            tenant: TEST_HOSPITAL_ORG.id,
            product: 'hospitalos',
            clientID: connection.clientID,
          });
        }
      } catch (error) {
        console.warn('Error cleaning up test connections:', error);
      }
    }
  }

  async createTestConnection(overrides: Partial<any> = {}) {
    if (!this.apiController) {
      throw new Error('Test infrastructure not initialized');
    }

    const defaultConnection = {
      tenant: TEST_HOSPITAL_ORG.id,
      product: 'hospitalos',
      name: 'Test Hospital SAML',
      description: 'Test connection for hospital staff | Department: emergency | Roles: doctor, nurse',
      rawMetadata: MOCK_SAML_METADATA,
      redirectUrl: ['http://localhost:3003/api/auth/sso/callback'],
      defaultRedirectUrl: 'http://localhost:3003/api/auth/sso/callback',
      ...overrides,
    };

    return await this.apiController.createSAMLConnection(defaultConnection);
  }
}

// Test Utilities
export const testUtils = {
  // Mock API call helper
  async mockApiCall(method: string, url: string, data?: any, headers?: Record<string, string>) {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`http://localhost:3003${url}`, options);
    return {
      status: response.status,
      headers: response.headers,
      body: await response.json().catch(() => null),
    };
  },

  // Generate test SAML metadata
  generateTestMetadata(entityId: string = 'test-hospital') {
    return MOCK_SAML_METADATA.replace('https://mocksaml.com/hospital-test', `https://mocksaml.com/${entityId}`);
  },

  // Create test hospital departments
  getHospitalDepartments() {
    return ['emergency', 'icu', 'surgery', 'laboratory', 'radiology', 'pharmacy', 'administration'];
  },

  // Create test medical roles
  getMedicalRoles() {
    return ['doctor', 'nurse', 'technician', 'administrator'];
  },

  // Generate test connection data
  generateTestConnectionData(department: string = 'general', roles: string[] = ['doctor']) {
    return {
      name: `${department.toUpperCase()} Department SAML`,
      description: `${department} department access for medical staff`,
      department,
      roles,
      redirectUrl: 'http://localhost:3003/api/auth/sso/callback',
      metadata: MOCK_SAML_METADATA,
    };
  },

  // Simulate authentication delay
  async simulateNetworkDelay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Validate SAML metadata structure
  validateSAMLMetadata(metadata: string) {
    return (
      metadata.includes('<EntityDescriptor')
      && metadata.includes('xmlns="urn:oasis:names:tc:SAML:2.0:metadata"')
      && metadata.includes('IDPSSODescriptor')
    );
  },
};

// Global Test Setup
export const setupTestEnvironment = () => {
  const testInfra = TestInfrastructure.getInstance();

  beforeAll(async () => {
    await testInfra.initialize();
  });

  afterAll(async () => {
    await testInfra.cleanup();
  });

  beforeEach(async () => {
    // Clean up before each test
    await testInfra.cleanup();
  });

  return testInfra;
};
