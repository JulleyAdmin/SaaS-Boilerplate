#!/usr/bin/env node

/**
 * Phase 1 Validation Script
 * Checks the current state of Phase 1 implementation
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

// Load environment variables from .env.local
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#') && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value;
      }
    });
  }
} catch {
  // Ignore errors loading env file
}

// Color codes for terminal output
const colors = {
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  reset: '\x1B[0m',
};

// Helper functions
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const checkFile = (filePath, description) => {
  const exists = fs.existsSync(path.join(process.cwd(), filePath));
  log(`${exists ? '✓' : '✗'} ${description}`, exists ? 'green' : 'red');
  return exists;
};

const checkCommand = (command, description) => {
  try {
    execSync(command, { stdio: 'ignore' });
    log(`✓ ${description}`, 'green');
    return true;
  } catch {
    log(`✗ ${description}`, 'red');
    return false;
  }
};

const checkEnvVar = (varName, description) => {
  const exists = !!process.env[varName];
  log(`${exists ? '✓' : '✗'} ${description}`, exists ? 'green' : 'red');
  return exists;
};

// Main validation
console.log('\n🔍 Phase 1 Implementation Validation\n');

// 1. Check Database Schema
log('📊 Database Schema', 'blue');
const schemaChecks = [
  checkFile('src/models/Schema.ts', 'Schema file exists'),
  checkFile('migrations', 'Migrations directory exists'),
];

// 2. Check SSO Implementation
log('\n🔐 SSO Implementation', 'blue');
const ssoChecks = [
  checkFile('src/lib/sso/jackson.ts', 'Jackson client implementation'),
  checkFile('src/lib/sso/types.ts', 'SSO TypeScript types'),
  checkFile('src/features/sso/components/CreateSSOConnectionDialog.tsx', 'Create SSO Dialog component'),
  checkFile('src/features/sso/components/EditSSOConnectionDialog.tsx', 'Edit SSO Dialog component'),
  checkFile('src/features/sso/components/SSOConnectionList.tsx', 'SSO Connection List component'),
];

// 3. Check API Routes
log('\n🔌 API Routes', 'blue');
const apiChecks = [
  checkFile('src/app/api/auth/sso/authorize/route.ts', 'SSO authorize endpoint'),
  checkFile('src/app/api/auth/sso/callback/route.ts', 'SSO callback endpoint'),
  checkFile('src/app/api/auth/sso/metadata/route.ts', 'SSO metadata endpoint'),
  checkFile('src/app/api/organizations/[orgId]/sso/connections/route.ts', 'SSO connections endpoint'),
];

// 4. Check Test Suite
log('\n🧪 Test Suite', 'blue');
const testChecks = [
  checkFile('tests/database/migration.test.ts', 'Database migration tests'),
  checkFile('tests/api/sso-auth.test.ts', 'SSO authentication tests'),
  checkFile('tests/api/sso-connections.test.ts', 'SSO connections tests'),
  checkFile('tests/components/CreateSSOConnectionDialog.test.tsx', 'Create dialog tests'),
  checkFile('tests/components/EditSSOConnectionDialog.test.tsx', 'Edit dialog tests'),
  checkFile('tests/components/SSOConnectionList.test.tsx', 'List component tests'),
  checkFile('tests/e2e/sso-flows.spec.ts', 'E2E SSO flow tests'),
  checkFile('tests/integration/clerk-sso.test.ts', 'Clerk integration tests'),
  checkFile('tests/scenarios/hospital-workflows.test.tsx', 'Hospital workflow tests'),
];

// 5. Check Environment
log('\n⚙️  Environment Configuration', 'blue');
const envChecks = [
  checkEnvVar('DATABASE_URL', 'DATABASE_URL configured'),
  checkEnvVar('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'Clerk publishable key'),
  checkEnvVar('CLERK_SECRET_KEY', 'Clerk secret key'),
];

// 6. Check Dependencies
log('\n📦 Dependencies', 'blue');
const depChecks = [
  checkCommand('npm list @boxyhq/saml-jackson', 'Jackson SSO package installed'),
  checkCommand('npm list @clerk/nextjs', 'Clerk Next.js package installed'),
  checkCommand('npm list drizzle-orm', 'Drizzle ORM installed'),
];

// 7. Run Quick Tests
log('\n🏃 Running Quick Validations', 'blue');
const validationChecks = [
  checkCommand('npm run check-types', 'TypeScript compilation'),
  checkCommand('npm run lint -- --quiet', 'ESLint validation'),
];

// Summary
console.log('\n📊 Summary\n');

const allChecks = [
  ...schemaChecks,
  ...ssoChecks,
  ...apiChecks,
  ...testChecks,
  ...envChecks,
  ...depChecks,
  ...validationChecks,
];

const passed = allChecks.filter(Boolean).length;
const total = allChecks.length;
const percentage = Math.round((passed / total) * 100);

log(`Total checks: ${total}`, 'blue');
log(`Passed: ${passed}`, 'green');
log(`Failed: ${total - passed}`, 'red');
log(`Completion: ${percentage}%`, percentage >= 80 ? 'green' : percentage >= 50 ? 'yellow' : 'red');

// Recommendations
if (percentage < 100) {
  console.log('\n💡 Recommendations:\n');

  if (!ssoChecks.every(Boolean)) {
    log('• Implement SSO components using: claude-code --command "/project:setup-sso"', 'yellow');
  }

  if (!apiChecks.every(Boolean)) {
    log('• Create API routes for SSO authentication and management', 'yellow');
  }

  if (!envChecks.every(Boolean)) {
    log('• Configure missing environment variables in .env.local', 'yellow');
  }

  if (!depChecks[0]) {
    log('• Install Jackson SSO: npm install @boxyhq/saml-jackson', 'yellow');
  }
}

// Next steps
console.log('\n🚀 Next Steps:\n');
if (percentage === 100) {
  log('✨ Phase 1 implementation is complete! Run full test suite:', 'green');
  log('   npm run test && npm run test:e2e', 'blue');
} else if (percentage >= 80) {
  log('📈 Phase 1 is nearly complete. Focus on:', 'yellow');
  log('   - Completing remaining implementations', 'yellow');
  log('   - Running individual test suites', 'yellow');
} else {
  log('🔨 Continue Phase 1 implementation:', 'yellow');
  log('   1. Use Claude Code slash commands for guided implementation', 'yellow');
  log('   2. Follow the Phase 1 Execution Guide', 'yellow');
  log('   3. Run this script periodically to track progress', 'yellow');
}

process.exit(percentage === 100 ? 0 : 1);
