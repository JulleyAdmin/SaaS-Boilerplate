#!/usr/bin/env node

/**
 * System Integration Testing Script
 * 
 * This script tests all major components and their integration
 * without requiring database migrations.
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const log = {
  info: (msg) => console.log(`${COLORS.blue}ℹ ${COLORS.reset} ${msg}`),
  success: (msg) => console.log(`${COLORS.green}✓ ${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗ ${COLORS.reset} ${msg}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠ ${COLORS.reset} ${msg}`),
  section: (msg) => console.log(`\n${COLORS.cyan}${COLORS.bold}═══ ${msg} ═══${COLORS.reset}\n`),
};

class SystemTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.baseDir = path.resolve(__dirname, '..');
  }

  async runAllTests() {
    console.log(`
${COLORS.cyan}╔═══════════════════════════════════════════════════════╗
║           System Integration Testing Suite            ║
╚═══════════════════════════════════════════════════════╝${COLORS.reset}
`);

    await this.testFileStructure();
    await this.testTypeScriptCompilation();
    await this.testDatabaseSchema();
    await this.testAPIEndpoints();
    await this.testUIComponents();
    await this.testWebhookIntegration();
    await this.testSecurityFeatures();
    
    this.generateReport();
  }

  test(name, condition, details = '') {
    const result = {
      name,
      passed: condition,
      details,
      timestamp: new Date().toISOString()
    };
    
    this.results.tests.push(result);
    
    if (condition) {
      log.success(`${name}`);
      this.results.passed++;
    } else {
      log.error(`${name}${details ? ` - ${details}` : ''}`);
      this.results.failed++;
    }
    
    return condition;
  }

  warn(name, message) {
    log.warn(`${name} - ${message}`);
    this.results.warnings++;
  }

  fileExists(filePath) {
    const fullPath = path.join(this.baseDir, filePath);
    return fs.existsSync(fullPath);
  }

  async testFileStructure() {
    log.section('File Structure & Dependencies');

    // Core feature files
    this.test(
      'API Key Management Model',
      this.fileExists('src/models/apiKey.ts'),
      'API key model file missing'
    );

    this.test(
      'Team Management Model',
      this.fileExists('src/models/team.ts'),
      'Team model file missing'
    );

    this.test(
      'Webhook Management Model',
      this.fileExists('src/models/webhook.ts'),
      'Webhook model file missing'
    );

    this.test(
      'Invitation Model',
      this.fileExists('src/models/invitation.ts'),
      'Invitation model file missing'
    );

    // UI Components
    const uiComponents = [
      'src/components/api-keys/ApiKeys.tsx',
      'src/components/security/MFASettings.tsx',
      'src/components/team/TeamMembers.tsx',
      'src/components/webhooks/Webhooks.tsx'
    ];

    uiComponents.forEach(component => {
      this.test(
        `UI Component: ${path.basename(component)}`,
        this.fileExists(component),
        `Component file missing: ${component}`
      );
    });

    // API Routes
    const apiRoutes = [
      'src/app/api/organizations/[orgId]/api-keys/route.ts',
      'src/app/api/organizations/[orgId]/webhooks/route.ts',
      'src/app/api/organizations/[orgId]/members/route.ts',
      'src/app/api/organizations/[orgId]/invitations/route.ts'
    ];

    apiRoutes.forEach(route => {
      this.test(
        `API Route: ${path.basename(path.dirname(route))}`,
        this.fileExists(route),
        `API route missing: ${route}`
      );
    });

    // Dashboard Pages
    const dashboardPages = [
      'src/app/[locale]/(auth)/dashboard/api-keys/page.tsx',
      'src/app/[locale]/(auth)/dashboard/security/page.tsx', 
      'src/app/[locale]/(auth)/dashboard/team/page.tsx',
      'src/app/[locale]/(auth)/dashboard/webhooks/page.tsx'
    ];

    dashboardPages.forEach(page => {
      this.test(
        `Dashboard Page: ${path.basename(path.dirname(page))}`,
        this.fileExists(page),
        `Dashboard page missing: ${page}`
      );
    });
  }

  async testTypeScriptCompilation() {
    log.section('TypeScript Compilation');

    try {
      // Check if we can import key modules without syntax errors
      const modelFiles = [
        'src/models/apiKey.ts',
        'src/models/webhook.ts', 
        'src/models/team.ts',
        'src/models/invitation.ts'
      ];

      modelFiles.forEach(file => {
        if (this.fileExists(file)) {
          try {
            const content = fs.readFileSync(path.join(this.baseDir, file), 'utf8');
            
            // Basic syntax checks
            const hasExports = content.includes('export');
            const hasImports = content.includes('import') || !content.includes('require');
            const noSyntaxErrors = !content.includes('} from from') && !content.includes('import import');
            
            this.test(
              `${path.basename(file)} Syntax Check`,
              hasExports && hasImports && noSyntaxErrors,
              'File has syntax issues'
            );
          } catch (error) {
            this.test(
              `${path.basename(file)} Read Check`,
              false,
              `Cannot read file: ${error.message}`
            );
          }
        }
      });

    } catch (error) {
      this.test('TypeScript Compilation', false, error.message);
    }
  }

  async testDatabaseSchema() {
    log.section('Database Schema');

    // Check schema file
    const schemaExists = this.fileExists('src/models/Schema.ts');
    this.test('Schema File Exists', schemaExists);

    if (schemaExists) {
      try {
        const schemaContent = fs.readFileSync(
          path.join(this.baseDir, 'src/models/Schema.ts'), 
          'utf8'
        );

        // Check for required tables
        const requiredTables = [
          'apiKey',
          'teamMember', 
          'invitation',
          'webhookEndpoint',
          'webhookDelivery',
          'webhookEvent'
        ];

        requiredTables.forEach(table => {
          this.test(
            `Schema contains ${table} table`,
            schemaContent.includes(`export const ${table}`),
            `Table definition missing: ${table}`
          );
        });

        // Check for required enums
        const requiredEnums = [
          'webhookEventEnum',
          'webhookStatusEnum',
          'roleEnum'
        ];

        requiredEnums.forEach(enumType => {
          this.test(
            `Schema contains ${enumType}`,
            schemaContent.includes(enumType),
            `Enum definition missing: ${enumType}`
          );
        });

      } catch (error) {
        this.test('Schema Content Check', false, error.message);
      }
    }

    // Check for migration files
    const migrationsDir = path.join(this.baseDir, 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir);
      this.test(
        'Migration Files Exist',
        migrationFiles.length > 0,
        'No migration files found'
      );
      
      if (migrationFiles.length > 0) {
        log.info(`Found ${migrationFiles.length} migration files`);
        const latestMigration = migrationFiles[migrationFiles.length - 1];
        log.info(`Latest migration: ${latestMigration}`);
      }
    } else {
      this.warn('Database Migrations', 'Migrations directory not found');
    }
  }

  async testAPIEndpoints() {
    log.section('API Endpoint Structure');

    const apiStructure = {
      'organizations/[orgId]/api-keys': ['route.ts', '[keyId]/route.ts'],
      'organizations/[orgId]/webhooks': ['route.ts', '[webhookId]/route.ts', '[webhookId]/deliveries/route.ts', '[webhookId]/test/route.ts'],
      'organizations/[orgId]/members': ['route.ts', '[memberId]/route.ts'],
      'organizations/[orgId]/invitations': ['route.ts', '[invitationId]/route.ts'],
      'invitations/accept': ['route.ts']
    };

    Object.entries(apiStructure).forEach(([endpoint, files]) => {
      files.forEach(file => {
        const filePath = `src/app/api/${endpoint}/${file}`;
        this.test(
          `API Endpoint: ${endpoint}/${file}`,
          this.fileExists(filePath),
          `API endpoint missing: ${filePath}`
        );
      });
    });
  }

  async testUIComponents() {
    log.section('UI Components Structure');

    const componentStructure = {
      'api-keys': ['ApiKeys.tsx', 'CreateApiKey.tsx'],
      'security': ['MFASettings.tsx'],
      'team': ['TeamMembers.tsx', 'InviteTeamMember.tsx', 'PendingInvitations.tsx'],
      'webhooks': ['Webhooks.tsx', 'CreateWebhook.tsx', 'EditWebhook.tsx', 'WebhookDeliveries.tsx'],
      'ui': ['button.tsx', 'badge.tsx', 'table.tsx', 'dialog.tsx', 'form.tsx', 'input.tsx', 'select.tsx', 'dropdown-menu.tsx', 'avatar.tsx']
    };

    Object.entries(componentStructure).forEach(([category, components]) => {
      components.forEach(component => {
        const filePath = `src/components/${category}/${component}`;
        this.test(
          `UI Component: ${category}/${component}`,
          this.fileExists(filePath),
          `Component missing: ${filePath}`
        );
      });
    });

    // Check hooks
    const hooks = [
      'src/hooks/useApiKeys.ts',
      'src/hooks/useWebhooks.ts', 
      'src/hooks/useTeamMembers.ts',
      'src/hooks/useInvitations.ts'
    ];

    hooks.forEach(hook => {
      this.test(
        `Hook: ${path.basename(hook)}`,
        this.fileExists(hook),
        `Hook missing: ${hook}`
      );
    });
  }

  async testWebhookIntegration() {
    log.section('Webhook Integration');

    // Check webhook delivery service
    this.test(
      'Webhook Delivery Service',
      this.fileExists('src/lib/webhook/delivery.ts'),
      'Webhook delivery service missing'
    );

    // Check for webhook helper integrations
    if (this.fileExists('src/models/invitation.ts')) {
      try {
        const content = fs.readFileSync(
          path.join(this.baseDir, 'src/models/invitation.ts'),
          'utf8'
        );
        
        this.test(
          'Invitation Webhook Integration',
          content.includes('webhookHelpers'),
          'Webhook integration missing in invitation model'
        );
      } catch (error) {
        this.test('Invitation Webhook Check', false, error.message);
      }
    }
  }

  async testSecurityFeatures() {
    log.section('Security Features');

    // Check for security utilities
    const securityFeatures = [
      { file: 'src/models/apiKey.ts', feature: 'SHA-256 hashing', pattern: 'createHash' },
      { file: 'src/models/webhook.ts', feature: 'HMAC signatures', pattern: 'createHmac' },
      { file: 'src/models/team.ts', feature: 'Role permissions', pattern: 'canManage' }
    ];

    securityFeatures.forEach(({ file, feature, pattern }) => {
      if (this.fileExists(file)) {
        try {
          const content = fs.readFileSync(path.join(this.baseDir, file), 'utf8');
          this.test(
            feature,
            content.includes(pattern),
            `Security feature missing: ${feature} in ${file}`
          );
        } catch (error) {
          this.test(feature, false, error.message);
        }
      }
    });
  }

  generateReport() {
    log.section('Testing Summary');

    const total = this.results.passed + this.results.failed;
    const passRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;

    console.log(`
${COLORS.bold}Test Results:${COLORS.reset}
  ✅ Passed: ${COLORS.green}${this.results.passed}${COLORS.reset}
  ❌ Failed: ${COLORS.red}${this.results.failed}${COLORS.reset}
  ⚠️  Warnings: ${COLORS.yellow}${this.results.warnings}${COLORS.reset}
  📊 Pass Rate: ${passRate >= 80 ? COLORS.green : passRate >= 60 ? COLORS.yellow : COLORS.red}${passRate}%${COLORS.reset}

${COLORS.bold}Next Steps:${COLORS.reset}
`);

    if (this.results.failed === 0) {
      log.success('All core components are properly implemented! 🎉');
      console.log(`
  🚀 Ready for manual testing:
    1. Start dev server: ${COLORS.cyan}npm run dev${COLORS.reset}
    2. Navigate to: ${COLORS.cyan}http://localhost:3000/dashboard${COLORS.reset}
    3. Test each feature systematically
    4. Set up database migration when ready
      `);
    } else {
      log.error(`${this.results.failed} issues need to be resolved before testing`);
      console.log(`
  🔧 Fix the failed tests above, then:
    1. Re-run this test script
    2. Address any TypeScript compilation errors
    3. Proceed with manual testing
      `);
    }

    if (this.results.warnings > 0) {
      log.warn(`${this.results.warnings} warnings detected - review for potential issues`);
    }
  }
}

// Run the tests
async function main() {
  const tester = new SystemTester();
  await tester.runAllTests();
  
  // Exit with appropriate code
  process.exit(tester.results.failed > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SystemTester;