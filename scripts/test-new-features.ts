#!/usr/bin/env tsx

import { config } from 'dotenv';

import { db } from '../src/libs/DB';
import { apiKey, invitation, teamMember } from '../src/models/Schema';

config({ path: '.env.local' });

const COLORS = {
  reset: '\x1B[0m',
  green: '\x1B[32m',
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  cyan: '\x1B[36m',
};

const log = {
  info: (msg: string) => console.log(`${COLORS.blue}ℹ ${COLORS.reset} ${msg}`),
  success: (msg: string) => console.log(`${COLORS.green}✓ ${COLORS.reset} ${msg}`),
  error: (msg: string) => console.log(`${COLORS.red}✗ ${COLORS.reset} ${msg}`),
  warn: (msg: string) => console.log(`${COLORS.yellow}⚠ ${COLORS.reset} ${msg}`),
  section: (msg: string) => console.log(`\n${COLORS.cyan}═══ ${msg} ═══${COLORS.reset}\n`),
};

async function testDatabaseConnections() {
  log.section('Testing Database Connections');

  try {
    // Test API Keys table
    const apiKeyCount = await db.select({ count: apiKey.id }).from(apiKey);
    log.success(`API Keys table accessible - ${apiKeyCount.length} records found`);

    // Test Invitations table
    const invitationCount = await db.select({ count: invitation.id }).from(invitation);
    log.success(`Invitations table accessible - ${invitationCount.length} records found`);

    // Test Team Members table
    const teamMemberCount = await db.select({ count: teamMember.id }).from(teamMember);
    log.success(`Team Members table accessible - ${teamMemberCount.length} records found`);

    return true;
  } catch (error) {
    log.error(`Database connection failed: ${error}`);
    return false;
  }
}

async function checkFeatureEndpoints() {
  log.section('Checking Feature Endpoints');

  const baseUrl = 'http://localhost:3000';
  const endpoints = [
    { path: '/dashboard/api-keys', name: 'API Keys Management' },
    { path: '/dashboard/security', name: 'MFA/Security Settings' },
    { path: '/dashboard/team', name: 'Team Management' },
    { path: '/api/organizations', name: 'Organizations API' },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint.path}`, {
        method: 'GET',
        redirect: 'manual', // Don't follow redirects
      });

      if (response.status === 307 || response.status === 302) {
        log.warn(`${endpoint.name} (${endpoint.path}) - Requires authentication (redirect)`);
      } else if (response.status === 200) {
        log.success(`${endpoint.name} (${endpoint.path}) - Accessible`);
      } else {
        log.error(`${endpoint.name} (${endpoint.path}) - Status: ${response.status}`);
      }
    } catch (error) {
      log.error(`${endpoint.name} (${endpoint.path}) - Failed: ${error}`);
    }
  }
}

async function validateSchemaIntegrity() {
  log.section('Validating Schema Integrity');

  try {
    // Check if all required columns exist
    const apiKeyColumns = await db.execute(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'api_keys' 
       ORDER BY ordinal_position`,
    );

    const requiredApiKeyColumns = ['id', 'organization_id', 'name', 'hashed_key', 'prefix', 'created_at'];
    const actualColumns = apiKeyColumns.rows.map((row: any) => row.column_name);

    for (const col of requiredApiKeyColumns) {
      if (actualColumns.includes(col)) {
        log.success(`API Keys table has required column: ${col}`);
      } else {
        log.error(`API Keys table missing column: ${col}`);
      }
    }

    // Check invitation table
    const invitationColumns = await db.execute(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'invitations' 
       ORDER BY ordinal_position`,
    );

    const requiredInvColumns = ['id', 'organization_id', 'email', 'role', 'token', 'expires'];
    const actualInvColumns = invitationColumns.rows.map((row: any) => row.column_name);

    for (const col of requiredInvColumns) {
      if (actualInvColumns.includes(col)) {
        log.success(`Invitations table has required column: ${col}`);
      } else {
        log.error(`Invitations table missing column: ${col}`);
      }
    }
  } catch (error) {
    log.error(`Schema validation failed: ${error}`);
  }
}

async function listAvailableRoutes() {
  log.section('Available Feature Routes');

  const routes = [
    { path: '/dashboard', desc: 'Main dashboard' },
    { path: '/dashboard/api-keys', desc: 'API Key Management' },
    { path: '/dashboard/security', desc: 'Security & MFA Settings' },
    { path: '/dashboard/team', desc: 'Team Management' },
    { path: '/dashboard/organization-profile', desc: 'Organization Settings' },
    { path: '/dashboard/user-profile', desc: 'User Profile' },
    { path: '/invitations/accept?token=xxx', desc: 'Accept Team Invitation' },
  ];

  log.info('The following routes are available for testing:');
  routes.forEach((route) => {
    console.log(`  ${COLORS.cyan}${route.path}${COLORS.reset} - ${route.desc}`);
  });
}

async function main() {
  console.log(`
${COLORS.cyan}╔═══════════════════════════════════════════════════════╗
║         New Features Testing & Validation Suite         ║
╚═══════════════════════════════════════════════════════╝${COLORS.reset}
`);

  log.info('Testing API Key Management, MFA, and Team Management features...\n');

  // Test database connections
  const dbOk = await testDatabaseConnections();

  if (!dbOk) {
    log.error('Database connection failed. Please check your DATABASE_URL in .env.local');
    process.exit(1);
  }

  // Validate schema
  await validateSchemaIntegrity();

  // Check endpoints
  await checkFeatureEndpoints();

  // List available routes
  await listAvailableRoutes();

  log.section('Testing Summary');
  log.info(`To fully test the features:
  1. Navigate to http://localhost:3000 and sign in
  2. Visit /dashboard/api-keys to test API Key management
  3. Visit /dashboard/security to test MFA settings
  4. Visit /dashboard/team to test Team management
  5. Create test data using the UI
  `);

  log.success('Feature validation complete!');
}

main().catch(console.error);
