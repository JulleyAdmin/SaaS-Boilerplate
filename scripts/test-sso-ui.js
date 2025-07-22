#!/usr/bin/env node

/**
 * SSO UI Testing Helper Script
 * Provides utilities and mock data for UI testing
 */

const colors = {
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
  reset: '\x1B[0m',
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Test data for SSO connections
const testConnections = {
  primary: {
    name: 'St. Mary\'s Hospital SAML',
    description: 'Primary SAML connection for hospital staff',
    tenant: 'st-marys-hospital',
    product: 'hospitalos',
    redirectUrl: 'http://localhost:3000/api/auth/sso/callback',
    metadataUrl: 'https://mocksaml.com/api/saml/metadata',
    metadata: `<?xml version="1.0" encoding="UTF-8"?>
<EntityDescriptor entityID="https://stmarys-idp.hospital.com" xmlns="urn:oasis:names:tc:SAML:2.0:metadata">
  <IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://stmarys-idp.hospital.com/sso"/>
    <KeyDescriptor use="signing">
      <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
        <X509Data>
          <X509Certificate>MIICXjCCAcegAwIBAgIBADANBgkqhkiG9w0BAQ0FADBLMQswCQYDVQQGEwJ1czELMAkGA1UECAwCVVMxDDAKBgNVBAcMA1NUTDEfMB0GA1UECgwWU3QuIE1hcnkncyBHZW5lcmFsIEhvc3BpdGFsMB4XDTIzMTEwMTE2MjMzOFoXDTMzMTAyOTE2MjMzOFowSzELMAkGA1UEBhMCdXMxCzAJBgNVBAgMAlVTMQwwCgYDVQQHDANTVEwxHzAdBgNVBAoMFlN0LiBNYXJ5J3MgR2VuZXJhbCBIb3NwaXRhbDCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA2ZzpT/Demo-Certificate-Here</X509Certificate>
        </X509Data>
      </KeyInfo>
    </KeyDescriptor>
  </IDPSSODescriptor>
</EntityDescriptor>`,
  },
  emergency: {
    name: 'Emergency Department SSO',
    description: 'Dedicated SSO for emergency department staff',
    tenant: 'st-marys-emergency',
    product: 'hospitalos',
    redirectUrl: 'http://localhost:3000/api/auth/sso/callback',
    metadataUrl: 'https://emergency-idp.stmarys.hospital.com/metadata',
  },
};

// Test users for different scenarios
const testUsers = {
  admin: {
    email: 'admin@stmarys.hospital.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'OWNER',
    department: 'IT Administration',
    scenario: 'Full administrative access for SSO management',
  },
  deptHead: {
    email: 'head.emergency@stmarys.hospital.com',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    role: 'ADMIN',
    department: 'Emergency',
    scenario: 'Department head with limited SSO visibility',
  },
  nurse: {
    email: 'nurse.williams@stmarys.hospital.com',
    firstName: 'Lisa',
    lastName: 'Williams',
    role: 'MEMBER',
    department: 'Emergency',
    scenario: 'End user who logs in via SSO',
  },
  doctor: {
    email: 'dr.patel@stmarys.hospital.com',
    firstName: 'Dr. Raj',
    lastName: 'Patel',
    role: 'MEMBER',
    department: 'ICU',
    scenario: 'ICU doctor with department-specific access',
  },
};

// Testing scenarios
const testScenarios = {
  'connection-management': {
    title: 'SSO Connection Management',
    description: 'Test CRUD operations for SSO connections',
    user: 'admin',
    steps: [
      'Navigate to /admin/sso',
      'Create new connection using test data',
      'Edit connection details',
      'View connection metadata',
      'Delete test connection',
    ],
  },
  'emergency-login': {
    title: 'Emergency Department Login',
    description: 'Test rapid login during emergency scenarios',
    user: 'nurse',
    steps: [
      'Navigate to login page',
      'Select SSO login',
      'Enter organization: st-marys-hospital',
      'Complete SAML flow (simulated)',
      'Verify emergency department access',
    ],
  },
  'multi-user': {
    title: 'Multiple Concurrent Users',
    description: 'Test system under multiple simultaneous logins',
    user: 'multiple',
    steps: [
      'Open multiple browser tabs/windows',
      'Simulate 3-5 users logging in simultaneously',
      'Verify all sessions are established',
      'Check for any performance degradation',
    ],
  },
};

// Main CLI interface
function showHelp() {
  log('\n🏥 HospitalOS SSO UI Testing Helper', 'cyan');
  log('=====================================\n', 'cyan');

  log('Available Commands:', 'yellow');
  log('  test-data     Show test data for SSO connections and users');
  log('  scenarios     List all testing scenarios');
  log('  checklist     Show testing checklist summary');
  log('  urls          Show important testing URLs');
  log('  mock-saml     Generate mock SAML response for testing');
  log('  help          Show this help message\n');

  log('Usage Examples:', 'blue');
  log('  node scripts/test-sso-ui.js test-data');
  log('  node scripts/test-sso-ui.js scenarios');
  log('  node scripts/test-sso-ui.js urls\n');
}

function showTestData() {
  log('\n📋 Test Data for SSO UI Testing', 'cyan');
  log('===============================\n');

  log('🔐 SSO Connections:', 'yellow');
  Object.entries(testConnections).forEach(([key, conn]) => {
    log(`\n  ${key.toUpperCase()}:`, 'blue');
    log(`    Name: ${conn.name}`);
    log(`    Description: ${conn.description}`);
    log(`    Tenant: ${conn.tenant}`);
    log(`    Redirect URL: ${conn.redirectUrl}`);
    if (conn.metadataUrl) {
      log(`    Metadata URL: ${conn.metadataUrl}`);
    }
  });

  log('\n👥 Test Users:', 'yellow');
  Object.entries(testUsers).forEach(([key, user]) => {
    log(`\n  ${key.toUpperCase()}:`, 'blue');
    log(`    Name: ${user.firstName} ${user.lastName}`);
    log(`    Email: ${user.email}`);
    log(`    Role: ${user.role}`);
    log(`    Department: ${user.department}`);
    log(`    Scenario: ${user.scenario}`);
  });
}

function showScenarios() {
  log('\n🧪 Testing Scenarios', 'cyan');
  log('===================\n');

  Object.entries(testScenarios).forEach(([key, scenario]) => {
    log(`${scenario.title}`, 'yellow');
    log(`Description: ${scenario.description}`);
    log(`Test User: ${scenario.user}`);
    log(`Steps:`, 'blue');
    scenario.steps.forEach((step, index) => {
      log(`  ${index + 1}. ${step}`);
    });
    log('');
  });
}

function showUrls() {
  log('\n🌐 Important Testing URLs', 'cyan');
  log('==========================\n');

  const urls = {
    'Main Application': 'http://localhost:3000',
    'SSO Admin Page': 'http://localhost:3000/admin/sso',
    'Login Page': 'http://localhost:3000/sign-in',
    'Dashboard': 'http://localhost:3000/dashboard',
    'Jackson Admin': 'http://localhost:5225',
    'Jackson Health': 'http://localhost:5225/api/v1/health',
    'API Health Check': 'http://localhost:3000/api/health',
  };

  Object.entries(urls).forEach(([name, url]) => {
    log(`  ${name}:`, 'yellow');
    log(`    ${url}\n`);
  });
}

function showChecklist() {
  log('\n📝 Quick Testing Checklist', 'cyan');
  log('===========================\n');

  const checklist = [
    'Services running (npm run dev, Jackson container)',
    'Test organization created in Clerk',
    'Test users created with appropriate roles',
    'Navigate to SSO admin page',
    'Create test SSO connection',
    'Test SSO login flow',
    'Verify responsive design on mobile',
    'Test error handling scenarios',
    'Check accessibility with keyboard navigation',
    'Validate form inputs and error messages',
  ];

  checklist.forEach((item, index) => {
    log(`  ${index + 1}. [ ] ${item}`);
  });

  log('\n📊 Success Criteria:', 'yellow');
  log('  ✅ All critical functionality works');
  log('  ✅ User experience is intuitive');
  log('  ✅ Error handling is appropriate');
  log('  ✅ Mobile/responsive design functions');
  log('  ✅ Accessibility standards met\n');
}

function generateMockSaml() {
  log('\n🔧 Mock SAML Response Generator', 'cyan');
  log('===============================\n');

  const mockResponse = {
    user: {
      id: 'saml_user_123',
      email: 'nurse.williams@stmarys.hospital.com',
      firstName: 'Lisa',
      lastName: 'Williams',
      raw: {
        department: 'Emergency',
        shift: 'Day',
        license: 'RN123456',
        roles: ['nurse', 'emergency-staff'],
        groups: ['medical-staff', 'emergency-department'],
      },
    },
    redirect_url: 'http://localhost:3000/dashboard',
  };

  log('Mock SAML User Response:', 'yellow');
  log(JSON.stringify(mockResponse, null, 2), 'green');

  log('\n🔗 Test URLs:', 'yellow');
  log('  SSO Authorize: http://localhost:3000/api/auth/sso/authorize?tenant=st-marys-hospital');
  log('  SSO Callback: http://localhost:3000/api/auth/sso/callback');
  log('  SSO Metadata: http://localhost:3000/api/auth/sso/metadata?tenant=st-marys-hospital\n');
}

// CLI argument handling
const command = process.argv[2];

switch (command) {
  case 'test-data':
    showTestData();
    break;
  case 'scenarios':
    showScenarios();
    break;
  case 'checklist':
    showChecklist();
    break;
  case 'urls':
    showUrls();
    break;
  case 'mock-saml':
    generateMockSaml();
    break;
  case 'help':
  default:
    showHelp();
    break;
}
