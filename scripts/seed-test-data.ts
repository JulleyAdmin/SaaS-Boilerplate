import { createHash, randomBytes } from 'node:crypto';

import { subDays, subHours, subMinutes } from 'date-fns';

import { db } from '@/libs/DB';
import { apiKey, auditLogs, securityEvents } from '@/models/Schema';

async function seedTestData() {
  console.log('🌱 Seeding test data for Phase 4 features...\n');

  try {
    // You'll need to replace this with your actual organization ID
    // You can find it in Clerk dashboard or by logging it from a component
    const organizationId = process.env.TEST_ORG_ID || 'org_test_123';

    console.log(`Using organization ID: ${organizationId}`);
    console.log('Make sure to set TEST_ORG_ID environment variable with your actual org ID\n');

    // 1. Seed API Keys
    console.log('📝 Creating test API keys...');

    const testApiKeys = [
      {
        name: 'Production API - Main Service',
        expiresAt: new Date('2025-12-31'),
        lastUsedAt: subHours(new Date(), 2),
        createdAt: subDays(new Date(), 30),
      },
      {
        name: 'Development API - Testing',
        expiresAt: null, // Never expires
        lastUsedAt: subDays(new Date(), 1),
        createdAt: subDays(new Date(), 45),
      },
      {
        name: 'Mobile App Integration',
        expiresAt: new Date('2025-06-30'),
        lastUsedAt: subDays(new Date(), 7),
        createdAt: subDays(new Date(), 60),
      },
      {
        name: 'CI/CD Pipeline',
        expiresAt: null,
        lastUsedAt: null, // Never used
        createdAt: subDays(new Date(), 20),
      },
      {
        name: 'Analytics Service',
        expiresAt: new Date('2025-09-30'),
        lastUsedAt: subHours(new Date(), 12),
        createdAt: subDays(new Date(), 15),
      },
      {
        name: 'Webhook Handler',
        expiresAt: new Date('2026-01-31'),
        lastUsedAt: subMinutes(new Date(), 30),
        createdAt: subDays(new Date(), 5),
      },
    ];

    for (const keyData of testApiKeys) {
      const plainKey = `sk_test_${randomBytes(24).toString('hex')}`;
      const hashedKey = createHash('sha256').update(plainKey).digest('hex');

      const [newKey] = await db.insert(apiKey).values({
        name: keyData.name,
        organizationId,
        hashedKey,
        expiresAt: keyData.expiresAt,
        lastUsedAt: keyData.lastUsedAt,
        createdAt: keyData.createdAt,
        updatedAt: keyData.lastUsedAt || keyData.createdAt,
      }).returning();

      if (newKey) {
        console.log(`✅ Created API key: ${keyData.name} (ID: ${newKey.id})`);
      }
    }

    // 2. Seed Audit Logs
    console.log('\n📋 Creating test audit logs...');

    const auditEvents = [
      {
        action: 'api_key.create',
        actorName: 'John Smith',
        actorEmail: 'john.smith@hospital.com',
        resourceName: 'Production API - Main Service',
        success: true,
        createdAt: subDays(new Date(), 30),
      },
      {
        action: 'api_key.delete',
        actorName: 'Jane Doe',
        actorEmail: 'jane.doe@hospital.com',
        resourceName: 'Legacy API Key',
        success: true,
        createdAt: subDays(new Date(), 3),
      },
      {
        action: 'mfa.enable',
        actorName: 'Dr. Sarah Johnson',
        actorEmail: 'sarah.johnson@hospital.com',
        resourceName: 'TOTP Authentication',
        success: true,
        createdAt: subDays(new Date(), 7),
      },
      {
        action: 'mfa.disable',
        actorName: 'Mike Wilson',
        actorEmail: 'mike.wilson@hospital.com',
        resourceName: 'SMS Authentication',
        success: false,
        errorMessage: 'Requires admin approval',
        createdAt: subDays(new Date(), 2),
      },
      {
        action: 'security.login',
        actorName: 'Emily Brown',
        actorEmail: 'emily.brown@hospital.com',
        resourceName: 'Web Application',
        success: true,
        createdAt: subHours(new Date(), 4),
      },
    ];

    for (const event of auditEvents) {
      await db.insert(auditLogs).values({
        organizationId,
        actorId: `user_${randomBytes(8).toString('hex')}`,
        actorName: event.actorName,
        actorEmail: event.actorEmail,
        action: event.action,
        crud: 'create',
        resource: 'system_setting',
        resourceName: event.resourceName,
        success: event.success,
        errorMessage: event.errorMessage,
        metadata: {},
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: event.createdAt,
      });

      console.log(`✅ Created audit log: ${event.action} by ${event.actorName}`);
    }

    // 3. Seed Security Events
    console.log('\n🔒 Creating test security events...');

    const securityEventData = [
      {
        eventType: 'failed_login',
        severity: 'medium',
        userEmail: 'test.user@hospital.com',
        description: 'Multiple failed login attempts detected',
        createdAt: subHours(new Date(), 6),
      },
      {
        eventType: 'mfa_bypass_attempt',
        severity: 'high',
        userEmail: 'suspicious@external.com',
        description: 'Attempted to bypass MFA verification',
        createdAt: subDays(new Date(), 1),
      },
      {
        eventType: 'api_rate_limit',
        severity: 'low',
        description: 'API rate limit exceeded for development key',
        createdAt: subHours(new Date(), 3),
      },
      {
        eventType: 'account_locked',
        severity: 'medium',
        userEmail: 'locked.user@hospital.com',
        description: 'Account locked after 5 failed login attempts',
        createdAt: subDays(new Date(), 2),
      },
    ];

    for (const eventData of securityEventData) {
      await db.insert(securityEvents).values({
        organizationId,
        eventType: eventData.eventType,
        severity: eventData.severity,
        userEmail: eventData.userEmail,
        description: eventData.description,
        ipAddress: `10.0.0.${Math.floor(Math.random() * 255)}`,
        metadata: {},
        resolved: false,
        alertSent: eventData.severity === 'high',
        createdAt: eventData.createdAt,
      });

      console.log(`✅ Created security event: ${eventData.eventType}`);
    }

    console.log('\n✨ Test data seeding complete!');
    console.log('\n📌 Next steps:');
    console.log('1. Make sure your app is running (npm run dev)');
    console.log('2. Sign in and navigate to /dashboard/api-keys');
    console.log('3. You should see the seeded API keys');
    console.log('4. Check audit logs and security events in their respective pages');
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure DATABASE_URL is set in .env.local');
    console.log('2. Run migrations first: npm run db:migrate');
    console.log('3. Set TEST_ORG_ID to your actual Clerk organization ID');
  }
}

// Run the seeding
seedTestData()
  .then(() => {
    console.log('\n👋 Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
