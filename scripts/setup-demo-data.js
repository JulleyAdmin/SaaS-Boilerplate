#!/usr/bin/env node

/**
 * Setup demo data for Phase 4 features
 * This script creates sample API keys and configures demo settings
 */

const { createHash, randomBytes } = require('node:crypto');
const path = require('node:path');

// Import our database and models
async function setupDemoData() {
  console.log('🎭 Setting up demo data for Phase 4 features...\n');

  try {
    // Dynamic imports for ES modules
    const { db } = await import('../src/libs/DB.js');
    const { apiKey } = await import('../src/models/Schema.js');

    console.log('📊 Creating demo API keys...');

    // Demo organization ID (you'll need to replace with a real one)
    const DEMO_ORG_ID = 'org_demo_123';

    // Generate demo API keys
    const demoKeys = [
      {
        name: 'Production API - Main Service',
        description: 'Primary API key for production environment',
        expiresAt: new Date('2025-12-31'),
        lastUsedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        name: 'Development API - Testing',
        description: 'Development environment testing key',
        expiresAt: null, // Never expires
        lastUsedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        name: 'Mobile App Integration',
        description: 'iOS/Android app authentication',
        expiresAt: new Date('2025-06-30'),
        lastUsedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      },
      {
        name: 'CI/CD Pipeline',
        description: 'Automated deployment and testing',
        expiresAt: null,
        lastUsedAt: null, // Never used
      },
      {
        name: 'Analytics Service',
        description: 'Data analytics and reporting API',
        expiresAt: new Date('2025-09-30'),
        lastUsedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
    ];

    // Insert demo keys
    for (const keyData of demoKeys) {
      const plainKey = `sk_demo_${randomBytes(24).toString('hex')}`;
      const hashedKey = createHash('sha256').update(plainKey).digest('hex');

      await db.insert(apiKey).values({
        name: keyData.name,
        organizationId: DEMO_ORG_ID,
        hashedKey,
        expiresAt: keyData.expiresAt,
        lastUsedAt: keyData.lastUsedAt,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      });

      console.log(`✅ Created API key: ${keyData.name}`);
    }

    console.log('\n📝 Demo data setup complete!');
    console.log('\n⚠️  Note: Update DEMO_ORG_ID in the script with your actual organization ID');
    console.log('    You can find your org ID in the Clerk dashboard or browser dev tools\n');
  } catch (error) {
    console.error('❌ Error setting up demo data:', error);
    console.log('\n💡 Tips:');
    console.log('   - Make sure the app is running (npm run dev)');
    console.log('   - Check that migrations have been run');
    console.log('   - Update the DEMO_ORG_ID with a real organization ID');
  }
}

// Run the setup
setupDemoData().then(() => process.exit(0));
