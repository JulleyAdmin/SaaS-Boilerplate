# HospitalOS Template Integration: Detailed Implementation Plan

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Reference Templates Analysis](#reference-templates-analysis)
3. [Phase 1: Foundation & SSO](#phase-1-foundation--sso)
4. [Phase 2: Advanced Features](#phase-2-advanced-features)
5. [Phase 3: Audit & Security](#phase-3-audit--security)
6. [Phase 4: Hospital-Specific Adaptation](#phase-4-hospital-specific-adaptation)
7. [Cross-Phase Dependencies](#cross-phase-dependencies)
8. [Risk Management](#risk-management)
9. [Success Metrics](#success-metrics)

## Executive Summary

### Objective
Transform HospitalOS from a basic SaaS template into an enterprise-grade hospital management platform by integrating proven code from three battle-tested templates: BoxyHQ, Nextacular, and Supabase Template.

### Approach
- **Copy & Adapt** proven implementations rather than recreating from scratch
- **Incremental Integration** with each phase building on the previous
- **Preserve Existing Code** to maintain current functionality
- **Comprehensive Testing** at each phase

### Timeline
4 weeks total, with each phase designed for parallel development where possible.

---

## Reference Templates Analysis

### BoxyHQ SaaS Starter Kit
**Source:** `/template-references/boxyhq/`

**Key Technologies:**
- Next.js 15.3.3 with Pages Router
- Prisma 6.9.0 with PostgreSQL
- NextAuth 4.24.11
- React-DaisyUI 5.0.5
- SAML Jackson 1.49.0
- Svix 1.67.0 for webhooks
- Retraced for audit logging

**Features to Extract:**
1. **SSO/SAML Integration** - Enterprise SAML authentication
2. **API Key Management** - Full CRUD with expiration and usage tracking
3. **Webhook Infrastructure** - Event-driven architecture with delivery guarantees
4. **Audit Logging** - Complete activity tracking
5. **Team Management** - Role-based permissions and invitations
6. **Billing Integration** - Stripe subscription management

### Nextacular
**Source:** `/template-references/nextacular/`

**Key Technologies:**
- Next.js 13.5.1 with Pages Router
- Prisma 4.8.0 with PostgreSQL
- NextAuth 4.24.5
- Tailwind CSS 3.0.11
- Stripe 10.13.0

**Features to Extract:**
1. **Advanced Workspace Management** - Multi-tenant architecture
2. **Custom Domain System** - Domain verification and subdomain routing
3. **Enhanced Invitations** - Flexible invitation system with role management
4. **Team Collaboration** - Advanced team features

### Supabase Template
**Source:** `/template-references/supabase-template/`

**Key Technologies:**
- Next.js (App Router)
- Supabase Auth
- Shadcn/UI components
- TypeScript

**Features to Extract:**
1. **Multi-Factor Authentication** - TOTP-based 2FA
2. **Advanced Auth Patterns** - Enhanced security flows
3. **Modern UI Components** - Already compatible with our stack

---

## Phase 1: Foundation & SSO

### Duration: Week 1 (5 days)

### Day 1-2: Database Schema Extension

#### Inputs
- **Source Files:**
  - `template-references/boxyhq/prisma/schema.prisma`
  - `template-references/nextacular/prisma/schema.prisma`
  - `src/models/Schema.ts` (current)

#### Dependencies
- Current database connection working
- Drizzle ORM configured
- Migration system functional

#### Tasks

**Task 1.1: Analyze and Map Schemas**
```bash
# Compare schemas
claude "Compare BoxyHQ and Nextacular Prisma schemas with our Drizzle schema:
1. Identify overlapping concepts (Team vs Organization)
2. Map role systems
3. Find unique features in each
4. Create unified schema design
5. Document field mappings in SCHEMA_MAPPING.md"
```

**Task 1.2: Convert BoxyHQ Core Models**
```typescript
// New models to add to src/models/Schema.ts

// Role system
export const roleEnum = pgEnum('role', ['OWNER', 'ADMIN', 'MEMBER']);

// Team members (extends organization membership)
export const teamMember = pgTable('team_members', {
  id: text('id').primaryKey().default(uuid()),
  organizationId: text('organization_id').notNull(),
  userId: text('user_id').notNull(),
  role: roleEnum('role').default('MEMBER'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// API Keys
export const apiKey = pgTable('api_keys', {
  id: text('id').primaryKey().default(uuid()),
  name: text('name').notNull(),
  organizationId: text('organization_id').notNull(),
  hashedKey: text('hashed_key').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  lastUsedAt: timestamp('last_used_at'),
});

// Invitations
export const invitation = pgTable('invitations', {
  id: text('id').primaryKey().default(uuid()),
  organizationId: text('organization_id').notNull(),
  email: text('email'),
  role: roleEnum('role').default('MEMBER'),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
  invitedBy: text('invited_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  sentViaEmail: boolean('sent_via_email').default(true),
  allowedDomains: jsonb('allowed_domains').default([]),
});
```

**Task 1.3: Add Jackson SSO Tables**
```typescript
// Jackson SAML store tables
export const jacksonStore = pgTable('jackson_store', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  iv: text('iv'),
  tag: text('tag'),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at'),
  namespace: text('namespace'),
});

export const jacksonIndex = pgTable('jackson_index', {
  id: serial('id').primaryKey(),
  key: text('key').notNull(),
  storeKey: text('store_key').notNull(),
});

export const jacksonTtl = pgTable('jackson_ttl', {
  key: text('key').primaryKey(),
  expiresAt: bigint('expires_at', { mode: 'number' }).notNull(),
});
```

#### Expected Outputs
- Updated `src/models/Schema.ts` with new tables
- Migration files generated via `npm run db:generate`
- `SCHEMA_MAPPING.md` documentation

#### Verification Steps
1. **Schema Validation:**
   ```bash
   npm run check-types  # TypeScript validation
   npm run db:generate  # Generate migration files
   ```

2. **Migration Test:**
   ```bash
   npm run db:migrate   # Apply to development database
   ```

3. **Drizzle Studio Verification:**
   ```bash
   npm run db:studio    # Visual schema verification
   ```

#### Documentation Required
- **SCHEMA_MAPPING.md** - Field mappings between templates
- **MIGRATION_LOG.md** - Migration steps and rollback procedures
- Update **CLAUDE.md** with new schema information

### Day 3-4: SSO Implementation

#### Inputs
- **Source Files:**
  - `template-references/boxyhq/lib/jackson.ts`
  - `template-references/boxyhq/pages/api/auth/sso/`
  - `template-references/boxyhq/components/auth/`

#### Dependencies
- Jackson tables migrated
- Database connection configured
- Environment variables for SSO

#### Tasks

**Task 3.1: Copy and Adapt Jackson Configuration**
```typescript
// src/lib/sso/jackson.ts
import jackson, {
  IConnectionAPIController,
  IDirectorySyncController,
  IOAuthController,
  ISPSSOConfig,
  JacksonOption,
} from '@boxyhq/saml-jackson';

import { env } from '@/lib/Env';

const opts: JacksonOption = {
  externalUrl: env.APP_URL,
  samlPath: '/api/auth/sso/saml',
  oidcPath: '/api/auth/sso/oidc',
  samlAudience: env.SSO_ISSUER,
  db: {
    engine: 'sql',
    type: 'postgres',
    url: env.DATABASE_URL,
  },
  idpDiscoveryPath: '/auth/sso/idp-select',
  idpEnabled: true,
};

// Singleton pattern for Jackson controllers
export async function getJacksonControllers() {
  const ret = await jackson(opts);
  return {
    apiController: ret.apiController,
    oauthController: ret.oauthController,
    directorySync: ret.directorySyncController,
    spConfig: ret.spConfig,
  };
}
```

**Task 3.2: Create SSO API Routes**
```typescript
// src/app/api/auth/sso/acs/route.ts
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

import { getJacksonControllers } from '@/lib/sso/jackson';

export async function POST(request: NextRequest) {
  try {
    const { oauthController } = await getJacksonControllers();
    const body = await request.formData();

    // Handle SAML ACS callback
    const { redirect_url } = await oauthController.samlResponse(body);

    return NextResponse.redirect(redirect_url);
  } catch (error) {
    console.error('SSO ACS Error:', error);
    return NextResponse.json({ error: 'SSO authentication failed' }, { status: 400 });
  }
}
```

**Task 3.3: Create SSO UI Components**
```typescript
// src/features/sso/components/SSOSettings.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SSOSettingsProps {
  organizationId: string;
}

export function SSOSettings({ organizationId }: SSOSettingsProps) {
  // Component logic adapted from BoxyHQ
  return (
    <Card>
      <CardHeader>
        <CardTitle>Single Sign-On (SSO)</CardTitle>
        <CardDescription>
          Configure SAML SSO for your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* SSO configuration form */}
      </CardContent>
    </Card>
  );
}
```

#### Expected Outputs
- SSO Jackson integration in `src/lib/sso/`
- SSO API routes in `src/app/api/auth/sso/`
- SSO UI components in `src/features/sso/`
- Updated navigation with SSO settings

#### Verification Steps
1. **Integration Test:**
   ```bash
   npm run dev
   # Navigate to /dashboard/organization-profile
   # Verify SSO settings appear
   ```

2. **API Endpoint Test:**
   ```bash
   curl -X GET http://localhost:3000/api/auth/sso/well-known
   # Should return SAML metadata
   ```

3. **Component Rendering:**
   - SSO settings page loads without errors
   - Form elements render correctly
   - Clerk integration works

#### Documentation Required
- **SSO_SETUP.md** - Configuration guide for administrators
- **SSO_INTEGRATION.md** - Developer integration guide
- Update API documentation

### Day 5: API Key Management

#### Inputs
- **Source Files:**
  - `template-references/boxyhq/components/apiKey/`
  - `template-references/boxyhq/hooks/useAPIKeys.ts`
  - `template-references/boxyhq/pages/api/teams/[slug]/api-keys/`

#### Dependencies
- API Key schema migrated
- Clerk authentication working
- Organization context available

#### Tasks

**Task 5.1: Create API Key Hooks**
```typescript
// src/hooks/useAPIKeys.ts
import { useOrganization } from '@clerk/nextjs';
import useSWR from 'swr';

export function useAPIKeys() {
  const { organization } = useOrganization();

  const { data, error, mutate } = useSWR(
    organization ? `/api/organizations/${organization.id}/api-keys` : null
  );

  return {
    apiKeys: data?.apiKeys || [],
    isLoading: !error && !data,
    error,
    mutate,
  };
}
```

**Task 5.2: Create API Routes**
```typescript
// src/app/api/organizations/[orgId]/api-keys/route.ts
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/DB';
import { apiKey } from '@/models/Schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || orgId !== params.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keys = await db
      .select()
      .from(apiKey)
      .where(eq(apiKey.organizationId, params.orgId));

    return NextResponse.json({ apiKeys: keys });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}
```

**Task 5.3: Create UI Components**
```typescript
// src/features/api-keys/components/APIKeyList.tsx
import { useAPIKeys } from '@/hooks/useAPIKeys';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function APIKeyList() {
  const { apiKeys, isLoading, error, mutate } = useAPIKeys();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading API keys</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
      </CardHeader>
      <CardContent>
        {/* API key list implementation */}
      </CardContent>
    </Card>
  );
}
```

#### Expected Outputs
- API key management system in `src/features/api-keys/`
- API routes for CRUD operations
- Integration with dashboard navigation
- Hooks for state management

#### Verification Steps
1. **Functionality Test:**
   ```bash
   npm run dev
   # Navigate to API Keys section
   # Create, view, revoke API keys
   ```

2. **API Testing:**
   ```bash
   # Test API key creation
   curl -X POST http://localhost:3000/api/organizations/{orgId}/api-keys \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Key"}'
   ```

3. **Security Validation:**
   - Only organization members can access keys
   - Keys are properly hashed
   - Expiration logic works

#### Documentation Required
- **API_KEYS.md** - Usage guide for developers
- API endpoint documentation
- Security best practices guide

---

## Phase 2: Advanced Features

### Duration: Week 2 (5 days)

### Day 1-2: Webhook Infrastructure

#### Inputs
- **Source Files:**
  - `template-references/boxyhq/components/webhook/`
  - `template-references/boxyhq/hooks/useWebhooks.ts`
  - `template-references/boxyhq/pages/api/teams/[slug]/webhooks/`
  - `template-references/boxyhq/lib/svix.ts`

#### Dependencies
- Svix webhook service account
- Database schema updated
- API key system working

#### Tasks

**Task 1.1: Install and Configure Svix**
```bash
npm install svix
```

```typescript
// src/lib/svix.ts
import { Svix } from 'svix';

import { env } from '@/lib/Env';

export function getSvixClient() {
  return new Svix(env.SVIX_API_KEY);
}

export async function createWebhookApp(organizationId: string, name: string) {
  const svix = getSvixClient();

  return await svix.application.create({
    name: `${name} - ${organizationId}`,
    uid: organizationId,
  });
}
```

**Task 1.2: Create Webhook Schema**
```typescript
// Add to src/models/Schema.ts
export const webhook = pgTable('webhooks', {
  id: text('id').primaryKey().default(uuid()),
  organizationId: text('organization_id').notNull(),
  endpointId: text('endpoint_id').notNull(), // Svix endpoint ID
  url: text('url').notNull(),
  description: text('description'),
  eventTypes: jsonb('event_types').default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const webhookDelivery = pgTable('webhook_deliveries', {
  id: text('id').primaryKey().default(uuid()),
  webhookId: text('webhook_id').notNull(),
  eventType: text('event_type').notNull(),
  payload: jsonb('payload'),
  status: text('status'), // success, failed, pending
  responseCode: integer('response_code'),
  responseBody: text('response_body'),
  attemptCount: integer('attempt_count').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Task 1.3: Create Webhook API Routes**
```typescript
// src/app/api/organizations/[orgId]/webhooks/route.ts
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/DB';
import { getSvixClient } from '@/lib/svix';
import { webhook } from '@/models/Schema';

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { userId, orgId } = auth();
    if (!userId || orgId !== params.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, description, eventTypes } = body;

    // Create endpoint in Svix
    const svix = getSvixClient();
    const endpoint = await svix.endpoint.create(params.orgId, {
      url,
      description,
      eventTypes,
    });

    // Store in database
    const newWebhook = await db.insert(webhook).values({
      organizationId: params.orgId,
      endpointId: endpoint.id,
      url,
      description,
      eventTypes,
    }).returning();

    return NextResponse.json({ webhook: newWebhook[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 });
  }
}
```

**Task 1.4: Create Webhook UI Components**
```typescript
// src/features/webhooks/components/WebhookList.tsx
import { useWebhooks } from '@/hooks/useWebhooks';
import { CreateWebhookDialog } from './CreateWebhookDialog';
import { WebhookCard } from './WebhookCard';

export function WebhookList() {
  const { webhooks, isLoading, error } = useWebhooks();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Webhooks</h2>
        <CreateWebhookDialog />
      </div>

      {isLoading && <div>Loading webhooks...</div>}
      {error && <div>Error: {error.message}</div>}

      <div className="grid gap-4">
        {webhooks?.map((webhook) => (
          <WebhookCard key={webhook.id} webhook={webhook} />
        ))}
      </div>
    </div>
  );
}
```

#### Expected Outputs
- Complete webhook management system
- Svix integration for reliable delivery
- Webhook delivery tracking
- Event type configuration

#### Verification Steps
1. **Webhook Creation Test:**
   ```bash
   # Create test webhook
   curl -X POST http://localhost:3000/api/organizations/{orgId}/webhooks \
     -H "Content-Type: application/json" \
     -d '{"url": "https://httpbin.org/post", "eventTypes": ["user.created"]}'
   ```

2. **Delivery Test:**
   ```bash
   # Trigger test event
   curl -X POST http://localhost:3000/api/organizations/{orgId}/webhooks/{webhookId}/test
   ```

3. **UI Verification:**
   - Webhook list displays correctly
   - Create/edit dialogs work
   - Delivery logs show status

#### Documentation Required
- **WEBHOOKS.md** - Setup and usage guide
- Event type documentation
- Troubleshooting guide

### Day 3-4: Enhanced Team Management

#### Inputs
- **Source Files:**
  - `template-references/nextacular/src/hooks/data/useWorkspaces.js`
  - `template-references/nextacular/prisma/schema.prisma` (Workspace, Member models)
  - `template-references/nextacular/src/pages/api/workspace/`

#### Dependencies
- Clerk organization system
- Team member schema migrated
- Role system implemented

#### Tasks

**Task 3.1: Extend Organization Model**
```typescript
// Add to src/models/Schema.ts
export const organizationSettings = pgTable('organization_settings', {
  id: text('id').primaryKey().default(uuid()),
  organizationId: text('organization_id').notNull().unique(),
  workspaceCode: text('workspace_code').notNull().unique().default(uuid()),
  inviteCode: text('invite_code').notNull().unique().default(uuid()),
  allowDomainInvites: boolean('allow_domain_invites').default(false),
  allowedDomains: jsonb('allowed_domains').default([]),
  defaultRole: roleEnum('default_role').default('MEMBER'),
  requireApproval: boolean('require_approval').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const memberInvitation = pgTable('member_invitations', {
  id: text('id').primaryKey().default(uuid()),
  organizationId: text('organization_id').notNull(),
  email: text('email').notNull(),
  inviterUserId: text('inviter_user_id').notNull(),
  role: roleEnum('role').default('MEMBER'),
  status: text('status').default('PENDING'), // PENDING, ACCEPTED, DECLINED, EXPIRED
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  invitedAt: timestamp('invited_at').defaultNow(),
  respondedAt: timestamp('responded_at'),
  allowedDomains: jsonb('allowed_domains').default([]),
  message: text('message'),
});
```

**Task 3.2: Create Enhanced Invitation System**
```typescript
// src/features/team/components/InviteMemberDialog.tsx
import { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function InviteMemberDialog() {
  const { organization } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [message, setMessage] = useState('');

  const handleInvite = async () => {
    const response = await fetch(`/api/organizations/${organization?.id}/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, message }),
    });

    if (response.ok) {
      setIsOpen(false);
      // Refresh invitation list
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label htmlFor="email">Email Address</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@hospital.com"
            />
          </div>

          <div>
            <label htmlFor="role">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="OWNER">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="message">Personal Message (Optional)</label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Welcome to our team!"
            />
          </div>

          <Button onClick={handleInvite} className="w-full">
            Send Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Task 3.3: Create Invitation Management API**
```typescript
// src/app/api/organizations/[orgId]/invitations/route.ts
import { auth, clerkClient } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/DB';
import { sendInvitationEmail } from '@/lib/email/sendInvitationEmail';
import { generateInviteToken } from '@/lib/utils/tokenGenerator';
import { memberInvitation } from '@/models/Schema';

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { userId, orgId } = auth();
    if (!userId || orgId !== params.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, role, message } = body;

    // Generate secure token
    const token = generateInviteToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create invitation record
    const invitation = await db.insert(memberInvitation).values({
      organizationId: params.orgId,
      email,
      inviterUserId: userId,
      role,
      token,
      expiresAt,
      message,
    }).returning();

    // Send invitation email
    await sendInvitationEmail({
      to: email,
      inviterName: (await clerkClient.users.getUser(userId)).firstName || 'Team Member',
      organizationName: (await clerkClient.organizations.getOrganization(params.orgId)).name,
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`,
      message,
    });

    return NextResponse.json({ invitation: invitation[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}
```

#### Expected Outputs
- Enhanced invitation system with custom messages
- Workspace-style organization management
- Bulk invitation capabilities
- Domain-based invitation rules

#### Verification Steps
1. **Invitation Flow Test:**
   ```bash
   # Send invitation
   curl -X POST http://localhost:3000/api/organizations/{orgId}/invitations \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "role": "MEMBER"}'
   ```

2. **Email Delivery Test:**
   - Check email delivery
   - Verify invitation links work
   - Test acceptance flow

3. **UI Verification:**
   - Invitation dialog works
   - Pending invitations display
   - Role assignment works

#### Documentation Required
- **TEAM_MANAGEMENT.md** - Feature overview
- **INVITATION_SYSTEM.md** - Setup and configuration
- Email template documentation

### Day 5: MFA Integration

#### Inputs
- **Source Files:**
  - `template-references/supabase-template/nextjs/src/components/MFASetup.tsx`

#### Dependencies
- Clerk Pro plan (for MFA support)
- User settings page structure
- Security settings section

#### Tasks

**Task 5.1: Adapt MFA Component for Clerk**
```typescript
// src/features/auth/components/MFASetup.tsx
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function MFASetup() {
  const { user } = useUser();
  const [step, setStep] = useState<'list' | 'setup' | 'verify'>('list');
  const [qrCode, setQrCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const startMFASetup = async () => {
    setLoading(true);
    setError('');

    try {
      // Create TOTP factor using Clerk
      const totpFactor = await user?.createTOTP();

      if (totpFactor) {
        setQrCode(totpFactor.qrCode);
        setStep('setup');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup MFA');
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async () => {
    setLoading(true);
    setError('');

    try {
      // Verify TOTP code
      const verification = await user?.verifyTOTP({ code: verifyCode });

      if (verification?.verified) {
        // Generate backup codes
        const codes = await user?.createBackupCodes();
        setBackupCodes(codes || []);
        setStep('list');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const disableMFA = async () => {
    setLoading(true);

    try {
      await user?.disableTOTP();
      setStep('list');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable MFA');
    } finally {
      setLoading(false);
    }
  };

  const isMFAEnabled = user?.twoFactorEnabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'list' && (
          <div className="space-y-4">
            {isMFAEnabled ? (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-gray-500">
                      Two-factor authentication is enabled
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={disableMFA}
                  disabled={loading}
                >
                  Disable
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <XCircle className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="font-medium">Two-factor authentication is disabled</p>
                  <p className="text-sm text-gray-500">
                    Enable 2FA to secure your account with an authenticator app
                  </p>
                </div>
                <Button onClick={startMFASetup} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enable 2FA'}
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 'setup' && (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Scan this QR code with your authenticator app
              </p>

              {qrCode && (
                <div className="flex justify-center">
                  <img
                    src={qrCode}
                    alt="MFA QR Code"
                    className="w-48 h-48 border rounded-lg"
                  />
                </div>
              )}

              <p className="text-xs text-gray-500">
                Use apps like Google Authenticator, Authy, or 1Password
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="verify-code" className="text-sm font-medium">
                Verification Code
              </label>
              <Input
                id="verify-code"
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('list')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={verifyMFA}
                disabled={loading || verifyCode.length !== 6}
                className="flex-1"
              >
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </div>
          </div>
        )}

        {backupCodes.length > 0 && (
          <Alert>
            <AlertDescription>
              <p className="font-medium mb-2">Backup Codes Generated</p>
              <p className="text-sm mb-3">
                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="p-2 bg-gray-100 rounded">
                    {code}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
```

**Task 5.2: Integrate with User Settings**
```typescript
// src/features/dashboard/components/SecuritySettings.tsx
import { MFASetup } from '@/features/auth/components/MFASetup';
import { PasswordUpdate } from '@/features/auth/components/PasswordUpdate';
import { SessionManagement } from '@/features/auth/components/SessionManagement';

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and privacy</p>
      </div>

      <MFASetup />
      <PasswordUpdate />
      <SessionManagement />
    </div>
  );
}
```

#### Expected Outputs
- MFA setup component integrated with Clerk
- Security settings page with MFA options
- Backup code generation and display
- MFA disable functionality

#### Verification Steps
1. **MFA Setup Test:**
   - Navigate to security settings
   - Start MFA setup process
   - Scan QR code with authenticator app
   - Verify with generated code

2. **Backup Codes Test:**
   - Ensure backup codes are generated
   - Test backup code authentication
   - Verify codes are one-time use

3. **Integration Test:**
   - MFA requirement on sensitive actions
   - Login flow with MFA enabled
   - Account recovery with backup codes

#### Documentation Required
- **MFA_SETUP.md** - User guide for enabling MFA
- **SECURITY_FEATURES.md** - Overview of security features
- Administrator guide for MFA policies

---

## Phase 3: Audit & Security

### Duration: Week 3 (5 days)

### Day 1-2: Audit Logging

#### Inputs
- **Source Files:**
  - `template-references/boxyhq/lib/retraced.ts`
  - `template-references/boxyhq/pages/teams/[slug]/audit-logs.tsx`
  - BoxyHQ audit log middleware

#### Dependencies
- Database schema for audit logs
- User action tracking system
- Organization context

#### Tasks

**Task 1.1: Create Audit Log Schema**
```typescript
// Add to src/models/Schema.ts
export const auditLog = pgTable('audit_logs', {
  id: text('id').primaryKey().default(uuid()),
  organizationId: text('organization_id').notNull(),
  userId: text('user_id').notNull(),
  action: text('action').notNull(), // 'user.created', 'api_key.deleted', etc.
  resource: text('resource'), // Resource type affected
  resourceId: text('resource_id'), // ID of affected resource
  metadata: jsonb('metadata').default({}), // Additional context
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  success: boolean('success').default(true),
  errorMessage: text('error_message'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const auditLogEvent = pgTable('audit_log_events', {
  id: text('id').primaryKey().default(uuid()),
  eventType: text('event_type').notNull().unique(),
  description: text('description').notNull(),
  category: text('category').notNull(), // 'auth', 'admin', 'data', etc.
  severity: text('severity').default('info'), // 'info', 'warning', 'critical'
  isEnabled: boolean('is_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Task 1.2: Create Audit Logging Service**
```typescript
// src/lib/audit/auditLogger.ts
import { auth } from '@clerk/nextjs';
import { headers } from 'next/headers';

import { db } from '@/lib/DB';
import { auditLog } from '@/models/Schema';

export type AuditLogEntry = {
  action: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  success?: boolean;
  errorMessage?: string;
};

export class AuditLogger {
  private organizationId: string;
  private userId: string;
  private ipAddress: string;
  private userAgent: string;

  constructor(organizationId: string, userId: string) {
    this.organizationId = organizationId;
    this.userId = userId;

    const headersList = headers();
    this.ipAddress = headersList.get('x-forwarded-for')
    || headersList.get('x-real-ip')
    || 'unknown';
    this.userAgent = headersList.get('user-agent') || 'unknown';
  }

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await db.insert(auditLog).values({
        organizationId: this.organizationId,
        userId: this.userId,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        metadata: entry.metadata || {},
        ipAddress: this.ipAddress,
        userAgent: this.userAgent,
        success: entry.success ?? true,
        errorMessage: entry.errorMessage,
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
      // Don't throw to avoid breaking the main operation
    }
  }

  // Convenience methods for common actions
  async logUserAction(action: string, metadata?: Record<string, any>) {
    await this.log({
      action: `user.${action}`,
      resource: 'user',
      resourceId: this.userId,
      metadata,
    });
  }

  async logApiKeyAction(action: string, apiKeyId: string, metadata?: Record<string, any>) {
    await this.log({
      action: `api_key.${action}`,
      resource: 'api_key',
      resourceId: apiKeyId,
      metadata,
    });
  }

  async logWebhookAction(action: string, webhookId: string, metadata?: Record<string, any>) {
    await this.log({
      action: `webhook.${action}`,
      resource: 'webhook',
      resourceId: webhookId,
      metadata,
    });
  }

  async logOrganizationAction(action: string, metadata?: Record<string, any>) {
    await this.log({
      action: `organization.${action}`,
      resource: 'organization',
      resourceId: this.organizationId,
      metadata,
    });
  }
}

export function createAuditLogger(organizationId: string, userId: string): AuditLogger {
  return new AuditLogger(organizationId, userId);
}

// Helper function to get audit logger from request context
export function getAuditLogger(): AuditLogger | null {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    return null;
  }

  return createAuditLogger(orgId, userId);
}
```

**Task 1.3: Create Audit Middleware**
```typescript
// src/lib/audit/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

import { getAuditLogger } from './auditLogger';

export function withAuditLogging(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  options: {
    action: string;
    resource?: string;
    getResourceId?: (request: NextRequest, ...args: any[]) => string;
  }
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const logger = getAuditLogger();
    const startTime = Date.now();

    try {
      const response = await handler(request, ...args);

      // Log successful operation
      if (logger) {
        await logger.log({
          action: options.action,
          resource: options.resource,
          resourceId: options.getResourceId?.(request, ...args),
          metadata: {
            method: request.method,
            url: request.url,
            statusCode: response.status,
            duration: Date.now() - startTime,
          },
          success: response.ok,
        });
      }

      return response;
    } catch (error) {
      // Log failed operation
      if (logger) {
        await logger.log({
          action: options.action,
          resource: options.resource,
          resourceId: options.getResourceId?.(request, ...args),
          metadata: {
            method: request.method,
            url: request.url,
            duration: Date.now() - startTime,
          },
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      throw error;
    }
  };
}
```

**Task 1.4: Create Audit Log UI**
```typescript
// src/features/audit/components/AuditLogList.tsx
import { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter, Search, Download } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  action: string;
  resource: string;
  userId: string;
  username: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  metadata: Record<string, any>;
}

export function AuditLogList() {
  const { organization } = useOrganization();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7d');

  useEffect(() => {
    if (organization) {
      fetchAuditLogs();
    }
  }, [organization, searchTerm, actionFilter, dateFilter]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        action: actionFilter,
        period: dateFilter,
      });

      const response = await fetch(
        `/api/organizations/${organization?.id}/audit-logs?${params}`
      );

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = async () => {
    const response = await fetch(
      `/api/organizations/${organization?.id}/audit-logs/export`
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Audit Logs
          </CardTitle>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="user">User Actions</SelectItem>
              <SelectItem value="api_key">API Key Actions</SelectItem>
              <SelectItem value="webhook">Webhook Actions</SelectItem>
              <SelectItem value="organization">Organization Actions</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last Day</SelectItem>
              <SelectItem value="7d">Last Week</SelectItem>
              <SelectItem value="30d">Last Month</SelectItem>
              <SelectItem value="90d">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audit Log Table */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading audit logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No audit logs found</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={log.success ? "default" : "destructive"}>
                      {log.action}
                    </Badge>
                    <span className="font-medium">{log.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {log.ipAddress}
                  </div>
                </div>

                {Object.keys(log.metadata).length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <details>
                      <summary className="cursor-pointer">View Details</summary>
                      <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### Expected Outputs
- Complete audit logging system
- Audit log UI with filtering and search
- Automated logging for all API operations
- Export functionality for compliance

#### Verification Steps
1. **Logging Test:**
   ```bash
   # Perform various actions and verify logs
   # Create API key, invite user, etc.
   # Check audit logs appear correctly
   ```

2. **Filtering Test:**
   - Test search functionality
   - Verify action filters work
   - Test date range filtering

3. **Export Test:**
   - Export audit logs as CSV
   - Verify data completeness
   - Test with large datasets

#### Documentation Required
- **AUDIT_LOGGING.md** - System overview and configuration
- **COMPLIANCE.md** - Meeting regulatory requirements
- **AUDIT_API.md** - API documentation for audit endpoints

### Day 3-4: Permissions & RBAC

#### Inputs
- **Source Files:**
  - `template-references/boxyhq/lib/permissions.ts`
  - `template-references/boxyhq/lib/rbac.ts`
  - `template-references/boxyhq/components/shared/AccessControl.tsx`

#### Dependencies
- Role system implemented
- Organization membership working
- Audit logging system

#### Tasks

**Task 3.1: Create Permission System**
```typescript
// src/lib/permissions/permissions.ts
export enum Permission {
  // Organization management
  ORG_READ = 'org:read',
  ORG_UPDATE = 'org:update',
  ORG_DELETE = 'org:delete',
  ORG_BILLING = 'org:billing',

  // Member management
  MEMBER_READ = 'member:read',
  MEMBER_INVITE = 'member:invite',
  MEMBER_UPDATE = 'member:update',
  MEMBER_REMOVE = 'member:remove',

  // API key management
  API_KEY_READ = 'api_key:read',
  API_KEY_CREATE = 'api_key:create',
  API_KEY_DELETE = 'api_key:delete',

  // Webhook management
  WEBHOOK_READ = 'webhook:read',
  WEBHOOK_CREATE = 'webhook:create',
  WEBHOOK_UPDATE = 'webhook:update',
  WEBHOOK_DELETE = 'webhook:delete',

  // SSO management
  SSO_READ = 'sso:read',
  SSO_UPDATE = 'sso:update',

  // Audit logs
  AUDIT_READ = 'audit:read',
  AUDIT_EXPORT = 'audit:export',

  // Hospital-specific permissions
  PATIENT_READ = 'patient:read',
  PATIENT_CREATE = 'patient:create',
  PATIENT_UPDATE = 'patient:update',
  PATIENT_DELETE = 'patient:delete',

  MEDICAL_RECORD_READ = 'medical_record:read',
  MEDICAL_RECORD_CREATE = 'medical_record:create',
  MEDICAL_RECORD_UPDATE = 'medical_record:update',

  PRESCRIPTION_READ = 'prescription:read',
  PRESCRIPTION_CREATE = 'prescription:create',
  PRESCRIPTION_APPROVE = 'prescription:approve',

  SCHEDULE_READ = 'schedule:read',
  SCHEDULE_CREATE = 'schedule:create',
  SCHEDULE_UPDATE = 'schedule:update',

  BILLING_READ = 'billing:read',
  BILLING_CREATE = 'billing:create',
  BILLING_UPDATE = 'billing:update',
}

export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  // Hospital-specific roles
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  PHARMACIST = 'PHARMACIST',
  RECEPTIONIST = 'RECEPTIONIST',
  BILLING_STAFF = 'BILLING_STAFF',
}

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.OWNER]: Object.values(Permission), // Full access

  [Role.ADMIN]: [
    Permission.ORG_READ,
    Permission.ORG_UPDATE,
    Permission.ORG_BILLING,
    Permission.MEMBER_READ,
    Permission.MEMBER_INVITE,
    Permission.MEMBER_UPDATE,
    Permission.MEMBER_REMOVE,
    Permission.API_KEY_READ,
    Permission.API_KEY_CREATE,
    Permission.API_KEY_DELETE,
    Permission.WEBHOOK_READ,
    Permission.WEBHOOK_CREATE,
    Permission.WEBHOOK_UPDATE,
    Permission.WEBHOOK_DELETE,
    Permission.SSO_READ,
    Permission.SSO_UPDATE,
    Permission.AUDIT_READ,
    Permission.AUDIT_EXPORT,
    // Hospital admin permissions
    Permission.PATIENT_READ,
    Permission.PATIENT_CREATE,
    Permission.PATIENT_UPDATE,
    Permission.MEDICAL_RECORD_READ,
    Permission.SCHEDULE_READ,
    Permission.SCHEDULE_CREATE,
    Permission.SCHEDULE_UPDATE,
    Permission.BILLING_READ,
    Permission.BILLING_CREATE,
    Permission.BILLING_UPDATE,
  ],

  [Role.MEMBER]: [
    Permission.ORG_READ,
    Permission.MEMBER_READ,
    Permission.API_KEY_READ,
    Permission.WEBHOOK_READ,
  ],

  [Role.DOCTOR]: [
    Permission.ORG_READ,
    Permission.MEMBER_READ,
    Permission.PATIENT_READ,
    Permission.PATIENT_CREATE,
    Permission.PATIENT_UPDATE,
    Permission.MEDICAL_RECORD_READ,
    Permission.MEDICAL_RECORD_CREATE,
    Permission.MEDICAL_RECORD_UPDATE,
    Permission.PRESCRIPTION_READ,
    Permission.PRESCRIPTION_CREATE,
    Permission.PRESCRIPTION_APPROVE,
    Permission.SCHEDULE_READ,
    Permission.SCHEDULE_UPDATE,
  ],

  [Role.NURSE]: [
    Permission.ORG_READ,
    Permission.PATIENT_READ,
    Permission.PATIENT_UPDATE,
    Permission.MEDICAL_RECORD_READ,
    Permission.MEDICAL_RECORD_CREATE,
    Permission.PRESCRIPTION_READ,
    Permission.SCHEDULE_READ,
  ],

  [Role.PHARMACIST]: [
    Permission.ORG_READ,
    Permission.PATIENT_READ,
    Permission.PRESCRIPTION_READ,
    Permission.PRESCRIPTION_APPROVE,
  ],

  [Role.RECEPTIONIST]: [
    Permission.ORG_READ,
    Permission.PATIENT_READ,
    Permission.PATIENT_CREATE,
    Permission.PATIENT_UPDATE,
    Permission.SCHEDULE_READ,
    Permission.SCHEDULE_CREATE,
    Permission.SCHEDULE_UPDATE,
    Permission.BILLING_READ,
  ],

  [Role.BILLING_STAFF]: [
    Permission.ORG_READ,
    Permission.PATIENT_READ,
    Permission.BILLING_READ,
    Permission.BILLING_CREATE,
    Permission.BILLING_UPDATE,
  ],
};

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(userRole: Role, permission: Permission): boolean {
  const permissions = getRolePermissions(userRole);
  return permissions.includes(permission);
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}
```

**Task 3.2: Create Permission Hooks**
```typescript
// src/hooks/usePermissions.ts
import { useOrganization, useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

import { getRolePermissions, hasPermission, Permission, Role } from '@/lib/permissions/permissions';

export function usePermissions() {
  const { user } = useUser();
  const { organization, membership } = useOrganization();

  const userRole = useMemo(() => {
    if (!membership) {
      return null;
    }

    // Map Clerk roles to our Role enum
    const clerkRole = membership.role;
    switch (clerkRole) {
      case 'admin':
        return Role.ADMIN;
      case 'basic_member':
        return Role.MEMBER;
      default:
        // Check for custom roles in metadata
        const customRole = membership.publicMetadata?.role as Role;
        return customRole || Role.MEMBER;
    }
  }, [membership]);

  const permissions = useMemo(() => {
    if (!userRole) {
      return [];
    }
    return getRolePermissions(userRole);
  }, [userRole]);

  const can = (permission: Permission): boolean => {
    if (!userRole) {
      return false;
    }
    return hasPermission(userRole, permission);
  };

  const canAny = (permissionList: Permission[]): boolean => {
    if (!userRole) {
      return false;
    }
    return permissionList.some(permission => hasPermission(userRole, permission));
  };

  const canAll = (permissionList: Permission[]): boolean => {
    if (!userRole) {
      return false;
    }
    return permissionList.every(permission => hasPermission(userRole, permission));
  };

  return {
    userRole,
    permissions,
    can,
    canAny,
    canAll,
  };
}
```

**Task 3.3: Create Access Control Components**
```typescript
// src/components/auth/AccessControl.tsx
import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/permissions/permissions';

interface AccessControlProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  showFallback?: boolean;
}

export function AccessControl({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  showFallback = true,
}: AccessControlProps) {
  const { can, canAny, canAll } = usePermissions();

  const hasAccess = (() => {
    if (permission) {
      return can(permission);
    }

    if (permissions.length > 0) {
      return requireAll ? canAll(permissions) : canAny(permissions);
    }

    return true; // No permissions specified, allow access
  })();

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showFallback && fallback) {
    return <>{fallback}</>;
  }

  return null;
}

// Convenience wrapper for protecting routes
export function ProtectedRoute({
  children,
  permission,
  permissions,
  requireAll = false,
}: {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
}) {
  return (
    <AccessControl
      permission={permission}
      permissions={permissions}
      requireAll={requireAll}
      fallback={
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-gray-600">
              You don't have permission to access this resource.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </AccessControl>
  );
}
```

**Task 3.4: Create Permission-aware API Middleware**
```typescript
// src/lib/permissions/middleware.ts
import { auth, clerkClient } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

import { hasPermission, Permission, Role } from './permissions';

export function requirePermission(permission: Permission) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
    ...args: any[]
  ): Promise<NextResponse> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Get user's organization membership
      const membership = await clerkClient.organizations.getOrganizationMembership({
        organizationId: orgId,
        userId,
      });

      // Determine user role
      let userRole: Role;
      if (membership.role === 'admin') {
        userRole = Role.ADMIN;
      } else {
        userRole = (membership.publicMetadata?.role as Role) || Role.MEMBER;
      }

      // Check permission
      if (!hasPermission(userRole, permission)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // User has permission, proceed with handler
      return await handler(request, ...args);
    } catch (error) {
      console.error('Permission check failed:', error);
      return NextResponse.json(
        { error: 'Permission check failed' },
        { status: 500 }
      );
    }
  };
}

// Usage in API routes
export function withPermission(permission: Permission) {
  return function <T extends any[]>(
    handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
  ) {
    return (request: NextRequest, ...args: T) =>
      requirePermission(permission)(request, handler, ...args);
  };
}
```

#### Expected Outputs
- Comprehensive RBAC system
- Hospital-specific roles and permissions
- Permission-aware UI components
- API endpoint protection

#### Verification Steps
1. **Permission Test:**
   ```bash
   # Test different user roles
   # Verify correct permissions are enforced
   # Test UI element visibility
   ```

2. **API Protection Test:**
   - Test API endpoints with different roles
   - Verify 403 responses for insufficient permissions
   - Test edge cases and error handling

3. **UI Verification:**
   - Components show/hide based on permissions
   - Navigation items filtered correctly
   - Fallback messages display properly

#### Documentation Required
- **RBAC_SYSTEM.md** - Role and permission documentation
- **HOSPITAL_ROLES.md** - Medical staff role definitions
- **PERMISSION_GUIDE.md** - Developer guide for using permissions

### Day 5: Security Enhancements

#### Inputs
- Account lockout system from BoxyHQ
- Session management patterns
- Security middleware

#### Dependencies
- Audit logging working
- Permission system implemented
- User management functional

#### Tasks

**Task 5.1: Implement Account Lockout**
```typescript
// src/lib/security/accountLockout.ts
import { eq } from 'drizzle-orm';

import { db } from '@/lib/DB';
import { userSecurity } from '@/models/Schema';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export async function recordFailedLogin(userId: string): Promise<boolean> {
  try {
    // Get current security record
    const security = await db
      .select()
      .from(userSecurity)
      .where(eq(userSecurity.userId, userId))
      .limit(1);

    const now = new Date();

    if (security.length === 0) {
      // Create new security record
      await db.insert(userSecurity).values({
        userId,
        failedLoginAttempts: 1,
        lastFailedLogin: now,
      });
      return false;
    }

    const current = security[0];
    const attempts = current.failedLoginAttempts + 1;

    // Check if account should be locked
    const shouldLock = attempts >= MAX_LOGIN_ATTEMPTS;

    await db
      .update(userSecurity)
      .set({
        failedLoginAttempts: attempts,
        lastFailedLogin: now,
        isLocked: shouldLock,
        lockedAt: shouldLock ? now : current.lockedAt,
      })
      .where(eq(userSecurity.userId, userId));

    return shouldLock;
  } catch (error) {
    console.error('Failed to record failed login:', error);
    return false;
  }
}

export async function clearFailedLogins(userId: string): Promise<void> {
  try {
    await db
      .update(userSecurity)
      .set({
        failedLoginAttempts: 0,
        lastFailedLogin: null,
        isLocked: false,
        lockedAt: null,
      })
      .where(eq(userSecurity.userId, userId));
  } catch (error) {
    console.error('Failed to clear failed logins:', error);
  }
}

export async function isAccountLocked(userId: string): Promise<boolean> {
  try {
    const security = await db
      .select()
      .from(userSecurity)
      .where(eq(userSecurity.userId, userId))
      .limit(1);

    if (security.length === 0) {
      return false;
    }

    const current = security[0];

    if (!current.isLocked) {
      return false;
    }

    // Check if lockout has expired
    if (current.lockedAt) {
      const lockoutExpiry = new Date(current.lockedAt.getTime() + LOCKOUT_DURATION);
      if (new Date() > lockoutExpiry) {
        // Auto-unlock expired account
        await clearFailedLogins(userId);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to check account lock status:', error);
    return false; // Fail open for availability
  }
}
```

**Task 5.2: Enhanced Session Management**
```typescript
// src/lib/security/sessionManager.ts
import { and, eq, lt } from 'drizzle-orm';

import { db } from '@/lib/DB';
import { userSession } from '@/models/Schema';

export type SessionInfo = {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  isActive: boolean;
  lastActivity: Date;
  expiresAt: Date;
};

export async function createSessionRecord(
  sessionId: string,
  userId: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(userSession).values({
      id: sessionId,
      userId,
      ipAddress,
      userAgent,
      isActive: true,
      lastActivity: new Date(),
      expiresAt,
    });
  } catch (error) {
    console.error('Failed to create session record:', error);
  }
}

export async function updateSessionActivity(sessionId: string): Promise<void> {
  try {
    await db
      .update(userSession)
      .set({
        lastActivity: new Date(),
      })
      .where(eq(userSession.id, sessionId));
  } catch (error) {
    console.error('Failed to update session activity:', error);
  }
}

export async function getUserSessions(userId: string): Promise<SessionInfo[]> {
  try {
    return await db
      .select()
      .from(userSession)
      .where(and(
        eq(userSession.userId, userId),
        eq(userSession.isActive, true)
      ));
  } catch (error) {
    console.error('Failed to get user sessions:', error);
    return [];
  }
}

export async function terminateSession(sessionId: string): Promise<void> {
  try {
    await db
      .update(userSession)
      .set({
        isActive: false,
        terminatedAt: new Date(),
      })
      .where(eq(userSession.id, sessionId));
  } catch (error) {
    console.error('Failed to terminate session:', error);
  }
}

export async function terminateAllUserSessions(userId: string, except?: string): Promise<void> {
  try {
    const condition = except
      ? and(eq(userSession.userId, userId), eq(userSession.isActive, true))
      : and(eq(userSession.userId, userId), eq(userSession.isActive, true));

    await db
      .update(userSession)
      .set({
        isActive: false,
        terminatedAt: new Date(),
      })
      .where(condition);
  } catch (error) {
    console.error('Failed to terminate user sessions:', error);
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await db
      .update(userSession)
      .set({
        isActive: false,
        terminatedAt: new Date(),
      })
      .where(and(
        eq(userSession.isActive, true),
        lt(userSession.expiresAt, new Date())
      ));
  } catch (error) {
    console.error('Failed to cleanup expired sessions:', error);
  }
}
```

**Task 5.3: Security Monitoring Dashboard**
```typescript
// src/features/security/components/SecurityDashboard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Users, Activity } from 'lucide-react';

export function SecurityDashboard() {
  const [securityMetrics, setSecurityMetrics] = useState({
    activeThreats: 0,
    failedLogins: 0,
    activeSessions: 0,
    suspiciousActivity: 0,
  });

  const [recentSecurityEvents, setRecentSecurityEvents] = useState([]);

  useEffect(() => {
    fetchSecurityMetrics();
    fetchRecentEvents();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <p className="text-gray-600">Monitor security events and threats</p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.activeThreats}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins (24h)</CardTitle>
            <Shield className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.failedLogins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.activeSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Activity</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.suspiciousActivity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSecurityEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-3">
                  <Badge variant={event.severity === 'high' ? 'destructive' : 'default'}>
                    {event.type}
                  </Badge>
                  <span>{event.description}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Expected Outputs
- Account lockout system
- Enhanced session management
- Security monitoring dashboard
- Threat detection capabilities

#### Verification Steps
1. **Lockout Test:**
   - Attempt multiple failed logins
   - Verify account locks correctly
   - Test auto-unlock after timeout

2. **Session Management Test:**
   - Create multiple sessions
   - Test session termination
   - Verify cleanup processes

3. **Security Dashboard Test:**
   - Verify metrics display correctly
   - Test real-time updates
   - Check alert functionality

#### Documentation Required
- **SECURITY_FEATURES.md** - Complete security feature overview
- **INCIDENT_RESPONSE.md** - Security incident procedures
- **SECURITY_MONITORING.md** - Monitoring and alerting setup

---

## Phase 4: Hospital-Specific Adaptation

### Duration: Week 4 (5 days)

### Day 1-2: Domain Customization

#### Inputs
- **Source Files:**
  - `template-references/nextacular/src/pages/api/workspace/domain/`
  - `template-references/nextacular/src/components/Card/domain.js`
  - Domain verification logic

#### Dependencies
- DNS configuration access
- SSL certificate management
- Subdomain routing setup

#### Tasks

**Task 1.1: Domain Management Schema**
```typescript
// Add to src/models/Schema.ts
export const customDomain = pgTable('custom_domains', {
  id: text('id').primaryKey().default(uuid()),
  organizationId: text('organization_id').notNull(),
  domain: text('domain').notNull().unique(),
  subdomain: text('subdomain'),
  verified: boolean('verified').default(false),
  verificationToken: text('verification_token').notNull(),
  txtRecord: text('txt_record'),
  cnameRecord: text('cname_record'),
  sslEnabled: boolean('ssl_enabled').default(false),
  sslCertificate: text('ssl_certificate'),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  verifiedAt: timestamp('verified_at'),
  lastChecked: timestamp('last_checked'),
});

export const domainVerification = pgTable('domain_verifications', {
  id: text('id').primaryKey().default(uuid()),
  domainId: text('domain_id').notNull(),
  method: text('method').notNull(), // 'TXT', 'CNAME', 'FILE'
  challenge: text('challenge').notNull(),
  response: text('response'),
  status: text('status').default('pending'), // 'pending', 'verified', 'failed'
  attempts: integer('attempts').default(0),
  lastAttempt: timestamp('last_attempt'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Task 1.2: Domain Verification Service**
```typescript
// src/lib/domains/verificationService.ts
import dns from 'node:dns/promises';
import https from 'node:https';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/DB';
import { customDomain, domainVerification } from '@/models/Schema';

export class DomainVerificationService {
  async addDomain(organizationId: string, domain: string): Promise<string> {
    const verificationToken = this.generateVerificationToken();
    const txtRecord = `hospitalos-verification=${verificationToken}`;

    const domainRecord = await db.insert(customDomain).values({
      organizationId,
      domain,
      verificationToken,
      txtRecord,
    }).returning();

    // Create verification challenge
    await db.insert(domainVerification).values({
      domainId: domainRecord[0].id,
      method: 'TXT',
      challenge: txtRecord,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return domainRecord[0].id;
  }

  async verifyDomain(domainId: string): Promise<boolean> {
    const domain = await db
      .select()
      .from(customDomain)
      .where(eq(customDomain.id, domainId))
      .limit(1);

    if (!domain.length) {
      throw new Error('Domain not found');
    }

    const domainRecord = domain[0];

    try {
      // Verify TXT record
      const txtRecords = await dns.resolveTxt(domainRecord.domain);
      const verificationRecord = txtRecords
        .flat()
        .find(record => record === domainRecord.txtRecord);

      if (verificationRecord) {
        // Domain verified
        await db
          .update(customDomain)
          .set({
            verified: true,
            verifiedAt: new Date(),
            lastChecked: new Date(),
          })
          .where(eq(customDomain.id, domainId));

        // Update verification status
        await db
          .update(domainVerification)
          .set({
            status: 'verified',
            response: verificationRecord,
          })
          .where(eq(domainVerification.domainId, domainId));

        return true;
      }
    } catch (error) {
      console.error('Domain verification failed:', error);

      // Update verification attempt
      await db
        .update(domainVerification)
        .set({
          status: 'failed',
          lastAttempt: new Date(),
        })
        .where(eq(domainVerification.domainId, domainId));
    }

    return false;
  }

  async setupSubdomain(organizationId: string, subdomain: string): Promise<string> {
    const fullDomain = `${subdomain}.hospitalos.com`;

    const domainRecord = await db.insert(customDomain).values({
      organizationId,
      domain: fullDomain,
      subdomain,
      verified: true, // Auto-verify subdomains
      verifiedAt: new Date(),
      isActive: true,
    }).returning();

    return domainRecord[0].id;
  }

  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15)
      + Math.random().toString(36).substring(2, 15);
  }

  async getOrganizationDomains(organizationId: string) {
    return await db
      .select()
      .from(customDomain)
      .where(eq(customDomain.organizationId, organizationId));
  }

  async activateDomain(domainId: string): Promise<void> {
    await db
      .update(customDomain)
      .set({
        isActive: true,
      })
      .where(eq(customDomain.id, domainId));
  }
}

export const domainService = new DomainVerificationService();
```

**Task 1.3: Domain Management UI**
```typescript
// src/features/domains/components/DomainManagement.tsx
import { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, Plus, Check, X, RefreshCw } from 'lucide-react';

export function DomainManagement() {
  const { organization } = useOrganization();
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (organization) {
      fetchDomains();
    }
  }, [organization]);

  const fetchDomains = async () => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/domains`
      );
      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains);
      }
    } catch (error) {
      console.error('Failed to fetch domains:', error);
    }
  };

  const addCustomDomain = async () => {
    if (!newDomain.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/domains`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: newDomain.trim() }),
        }
      );

      if (response.ok) {
        await fetchDomains();
        setNewDomain('');
        setIsAddingDomain(false);
      }
    } catch (error) {
      console.error('Failed to add domain:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyDomain = async (domainId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/domains/${domainId}/verify`,
        { method: 'POST' }
      );

      if (response.ok) {
        await fetchDomains();
      }
    } catch (error) {
      console.error('Failed to verify domain:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSubdomain = async () => {
    if (!organization) return;

    const subdomain = organization.slug || organization.name.toLowerCase().replace(/\s+/g, '-');

    setLoading(true);
    try {
      const response = await fetch(
        `/api/organizations/${organization.id}/domains/subdomain`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subdomain }),
        }
      );

      if (response.ok) {
        await fetchDomains();
      }
    } catch (error) {
      console.error('Failed to setup subdomain:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subdomain Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Free Subdomain</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get a free .hospitalos.com subdomain for your organization
            </p>

            {domains.find(d => d.subdomain) ? (
              <div className="flex items-center gap-2">
                <Badge variant="default">Active</Badge>
                <span className="font-mono">
                  {domains.find(d => d.subdomain)?.domain}
                </span>
              </div>
            ) : (
              <Button onClick={setupSubdomain} disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Setup Subdomain
              </Button>
            )}
          </div>

          {/* Custom Domain Section */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Custom Domains</h3>
              <Button
                onClick={() => setIsAddingDomain(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </div>

            {isAddingDomain && (
              <div className="space-y-3 mb-4 p-3 border rounded">
                <Input
                  placeholder="yourhospital.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={addCustomDomain} disabled={loading}>
                    Add Domain
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingDomain(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {domains.filter(d => !d.subdomain).map((domain) => (
                <div key={domain.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <span className="font-mono">{domain.domain}</span>
                    <Badge variant={domain.verified ? "default" : "secondary"}>
                      {domain.verified ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                    {domain.isActive && (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </div>

                  {!domain.verified && (
                    <Button
                      onClick={() => verifyDomain(domain.id)}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                    >
                      Verify
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {domains.filter(d => !d.subdomain && !d.verified).length > 0 && (
              <Alert className="mt-4">
                <AlertDescription>
                  <p className="font-medium mb-2">To verify your domain:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Add a TXT record to your domain's DNS settings</li>
                    <li>Use the verification token shown above</li>
                    <li>Click "Verify" once the DNS changes propagate</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Expected Outputs
- Domain verification system
- Subdomain management
- DNS configuration guides
- SSL certificate handling

#### Verification Steps
1. **Domain Addition Test:**
   - Add custom domain
   - Verify DNS instructions
   - Test verification process

2. **Subdomain Test:**
   - Setup organization subdomain
   - Test subdomain routing
   - Verify SSL certificate

3. **Integration Test:**
   - Multi-domain routing works
   - Organization context preserved
   - Custom branding applied

#### Documentation Required
- **DOMAIN_SETUP.md** - Complete domain configuration guide
- **DNS_CONFIGURATION.md** - DNS setup instructions
- **SSL_CERTIFICATES.md** - SSL certificate management

### Day 3-5: Integration & Testing

#### Inputs
- All previous phase implementations
- Test scenarios and requirements
- Performance benchmarks

#### Dependencies
- All features from previous phases
- Testing infrastructure
- Documentation templates

#### Tasks

**Task 3.1: Integration Testing Suite**
```typescript
// tests/integration/template-features.test.ts
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { cleanupTestEnvironment, setupTestEnvironment } from '../setup';

describe('Template Features Integration', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  afterAll(async () => {
    await cleanupTestEnvironment();
  });

  describe('SSO Integration', () => {
    it('should configure SAML SSO for organization', async () => {
      // Test SSO configuration
    });

    it('should handle SSO authentication flow', async () => {
      // Test SSO login flow
    });
  });

  describe('API Key Management', () => {
    it('should create and manage API keys', async () => {
      // Test API key CRUD operations
    });

    it('should enforce API key permissions', async () => {
      // Test API key authentication
    });
  });

  describe('Webhook System', () => {
    it('should create and configure webhooks', async () => {
      // Test webhook management
    });

    it('should deliver webhook events reliably', async () => {
      // Test webhook delivery
    });
  });

  describe('Audit Logging', () => {
    it('should log all user actions', async () => {
      // Test audit log creation
    });

    it('should support audit log filtering and export', async () => {
      // Test audit log queries
    });
  });

  describe('Permission System', () => {
    it('should enforce role-based permissions', async () => {
      // Test RBAC enforcement
    });

    it('should handle hospital-specific roles', async () => {
      // Test medical staff roles
    });
  });

  describe('Domain Management', () => {
    it('should setup and verify custom domains', async () => {
      // Test domain verification
    });

    it('should handle subdomain routing', async () => {
      // Test subdomain functionality
    });
  });
});
```

**Task 3.2: Performance Testing**
```typescript
// tests/performance/load-test.ts
import { performance } from 'node:perf_hooks';

import { describe, expect, it } from 'vitest';

describe('Performance Tests', () => {
  it('should handle concurrent API key operations', async () => {
    const startTime = performance.now();

    const promises = Array.from({ length: 100 }, (_, i) =>
      fetch('/api/organizations/test-org/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name: `Test Key ${i}` }),
      }));

    await Promise.all(promises);

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
  });

  it('should handle webhook delivery load', async () => {
    // Test webhook delivery performance
  });

  it('should query audit logs efficiently', async () => {
    // Test audit log query performance
  });
});
```

**Task 3.3: End-to-End Testing**
```typescript
// tests/e2e/complete-workflow.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Complete Hospital Management Workflow', () => {
  test('should complete full organization setup with all features', async ({ page }) => {
    // 1. Organization setup
    await page.goto('/dashboard');

    await expect(page.locator('h1')).toContainText('Dashboard');

    // 2. Setup SSO
    await page.click('[data-testid="sso-settings"]');
    await page.fill('[data-testid="sso-issuer"]', 'test-hospital.com');
    await page.click('[data-testid="save-sso"]');

    await expect(page.locator('[data-testid="sso-status"]')).toContainText('Configured');

    // 3. Create API keys
    await page.click('[data-testid="api-keys"]');
    await page.click('[data-testid="create-api-key"]');
    await page.fill('[data-testid="api-key-name"]', 'Integration Key');
    await page.click('[data-testid="create-key-button"]');

    await expect(page.locator('[data-testid="api-key-list"]')).toContainText('Integration Key');

    // 4. Setup webhooks
    await page.click('[data-testid="webhooks"]');
    await page.click('[data-testid="add-webhook"]');
    await page.fill('[data-testid="webhook-url"]', 'https://example.com/webhook');
    await page.click('[data-testid="save-webhook"]');

    await expect(page.locator('[data-testid="webhook-list"]')).toContainText('example.com');

    // 5. Invite team members
    await page.click('[data-testid="team-management"]');
    await page.click('[data-testid="invite-member"]');
    await page.fill('[data-testid="member-email"]', 'doctor@hospital.com');
    await page.selectOption('[data-testid="member-role"]', 'DOCTOR');
    await page.click('[data-testid="send-invitation"]');

    await expect(page.locator('[data-testid="pending-invitations"]')).toContainText('doctor@hospital.com');

    // 6. Setup custom domain
    await page.click('[data-testid="domain-management"]');
    await page.click('[data-testid="add-domain"]');
    await page.fill('[data-testid="domain-input"]', 'testhospital.com');
    await page.click('[data-testid="add-domain-button"]');

    await expect(page.locator('[data-testid="domain-list"]')).toContainText('testhospital.com');

    // 7. Verify audit logs
    await page.click('[data-testid="audit-logs"]');

    await expect(page.locator('[data-testid="audit-log-list"]')).toContainText('sso.configured');
    await expect(page.locator('[data-testid="audit-log-list"]')).toContainText('api_key.created');
    await expect(page.locator('[data-testid="audit-log-list"]')).toContainText('webhook.created');
  });

  test('should handle role-based access correctly', async ({ page }) => {
    // Test different user roles and their permissions
  });

  test('should maintain security throughout workflow', async ({ page }) => {
    // Test security features during normal operations
  });
});
```

**Task 3.4: Documentation Consolidation**
```markdown
# HospitalOS Feature Documentation

## Overview
This document provides a comprehensive guide to all features integrated from template codebases.

## Feature Catalog

### 1. Enterprise SSO (from BoxyHQ)
- **Source**: BoxyHQ SAML Jackson integration
- **Features**: SAML 2.0, OIDC, IdP discovery
- **Setup**: [SSO_SETUP.md](./SSO_SETUP.md)
- **API**: [SSO_API.md](./SSO_API.md)

### 2. API Key Management (from BoxyHQ)
- **Source**: BoxyHQ API key system
- **Features**: Key generation, expiration, usage tracking
- **Setup**: [API_KEYS.md](./API_KEYS.md)
- **Security**: Rate limiting, key rotation

### 3. Webhook Infrastructure (from BoxyHQ)
- **Source**: BoxyHQ + Svix integration
- **Features**: Reliable delivery, retry logic, monitoring
- **Setup**: [WEBHOOKS.md](./WEBHOOKS.md)
- **Events**: [WEBHOOK_EVENTS.md](./WEBHOOK_EVENTS.md)

### 4. Enhanced Team Management (from Nextacular)
- **Source**: Nextacular workspace system
- **Features**: Advanced invitations, role management
- **Setup**: [TEAM_MANAGEMENT.md](./TEAM_MANAGEMENT.md)
- **Roles**: [HOSPITAL_ROLES.md](./HOSPITAL_ROLES.md)

### 5. Multi-Factor Authentication (from Supabase Template)
- **Source**: Supabase MFA adapted for Clerk
- **Features**: TOTP, backup codes, device management
- **Setup**: [MFA_SETUP.md](./MFA_SETUP.md)

### 6. Audit Logging (from BoxyHQ)
- **Source**: BoxyHQ audit system
- **Features**: Complete activity tracking, compliance reporting
- **Setup**: [AUDIT_LOGGING.md](./AUDIT_LOGGING.md)
- **Compliance**: [COMPLIANCE.md](./COMPLIANCE.md)

### 7. Domain Management (from Nextacular)
- **Source**: Nextacular domain system
- **Features**: Custom domains, subdomain routing, SSL
- **Setup**: [DOMAIN_SETUP.md](./DOMAIN_SETUP.md)
- **DNS**: [DNS_CONFIGURATION.md](./DNS_CONFIGURATION.md)

## Hospital-Specific Adaptations

### Medical Staff Roles
- **Doctor**: Full patient and medical record access
- **Nurse**: Patient care and limited medical records
- **Pharmacist**: Prescription management
- **Receptionist**: Scheduling and basic patient info
- **Billing Staff**: Financial and insurance data

### Compliance Features
- **HIPAA Audit Trails**: Complete activity logging
- **Access Controls**: Role-based permissions
- **Data Security**: Encryption and secure transmission
- **Session Management**: Secure authentication flows

## Integration Points

### Clerk Authentication
All features integrate seamlessly with Clerk's:
- Organization management
- User authentication
- Role-based access control
- Session management

### Database Integration
All features use Drizzle ORM with:
- Type-safe database operations
- Migration management
- Connection pooling
- Performance optimization

### UI/UX Consistency
All features use Shadcn/UI for:
- Consistent design language
- Accessibility compliance
- Mobile responsiveness
- Dark mode support

## Deployment Considerations

### Environment Variables
```env
# SSO Configuration
JACKSON_SECRET=your-jackson-secret
SSO_ISSUER=your-sso-issuer

# Webhook Configuration
SVIX_API_KEY=your-svix-api-key
WEBHOOK_SECRET=your-webhook-secret

# Domain Configuration
DOMAIN_VERIFICATION_SECRET=your-domain-secret

# Security Configuration
SECURITY_SECRET=your-security-secret
```

### Database Migrations
Run all migrations in order:
```bash
npm run db:generate
npm run db:migrate
```

### Feature Flags
Enable features progressively:
```typescript
const FEATURE_FLAGS = {
  SSO_ENABLED: process.env.SSO_ENABLED === 'true',
  WEBHOOKS_ENABLED: process.env.WEBHOOKS_ENABLED === 'true',
  CUSTOM_DOMAINS_ENABLED: process.env.CUSTOM_DOMAINS_ENABLED === 'true',
};
```

## Monitoring and Maintenance

### Health Checks
- SSO service connectivity
- Webhook delivery rates
- Audit log collection
- Domain verification status

### Performance Metrics
- API response times
- Database query performance
- Webhook delivery latency
- User session duration

### Security Monitoring
- Failed authentication attempts
- Suspicious activity detection
- Access pattern analysis
- Compliance report generation
```

#### Expected Outputs
- Complete integration test suite
- Performance benchmarks
- End-to-end testing coverage
- Comprehensive documentation
- Deployment guides

#### Verification Steps
1. **Full Integration Test:**
   ```bash
   npm run test:integration
   npm run test:e2e
   npm run test:performance
   ```

2. **Manual Testing:**
   - Complete workflow testing
   - Cross-feature integration
   - Security testing
   - Usability testing

3. **Documentation Review:**
   - All features documented
   - Setup guides complete
   - API documentation current
   - Troubleshooting guides available

#### Documentation Required
- **INTEGRATION_COMPLETE.md** - Final integration summary
- **DEPLOYMENT_GUIDE.md** - Production deployment instructions
- **TROUBLESHOOTING.md** - Common issues and solutions
- **FEATURE_COMPARISON.md** - Before/after feature comparison

---

## Cross-Phase Dependencies

### Database Dependencies
- **Phase 1 → Phase 2**: API key schema needed for webhooks
- **Phase 2 → Phase 3**: Team management needed for audit logging
- **Phase 3 → Phase 4**: Permission system needed for domain management

### Feature Dependencies
- **SSO → Audit**: SSO events must be logged
- **API Keys → Webhooks**: API authentication for webhook setup
- **Permissions → All Features**: Access control for all operations
- **Domains → Security**: Domain-based security policies

### UI Dependencies
- **Base Components → All**: Shadcn/UI foundation required
- **Navigation → Features**: Menu structure for feature access
- **Dashboard → Metrics**: Central monitoring display

---

## Risk Management

### Technical Risks
1. **Database Migration Failures**
   - **Mitigation**: Backup before each phase
   - **Rollback**: Migration reversal scripts
   - **Testing**: Staging environment validation

2. **Clerk Integration Issues**
   - **Mitigation**: Incremental integration testing
   - **Fallback**: Traditional auth backup
   - **Monitoring**: Authentication health checks

3. **Performance Degradation**
   - **Mitigation**: Load testing at each phase
   - **Optimization**: Database indexing and caching
   - **Monitoring**: Performance metric tracking

### Security Risks
1. **Permission Bypass**
   - **Mitigation**: Comprehensive RBAC testing
   - **Defense**: Multiple permission layers
   - **Monitoring**: Access attempt logging

2. **Data Exposure**
   - **Mitigation**: Encryption and secure transmission
   - **Validation**: Security audit at each phase
   - **Compliance**: HIPAA requirement verification

### Operational Risks
1. **Feature Conflicts**
   - **Mitigation**: Integration testing between features
   - **Resolution**: Feature flag rollback capability
   - **Prevention**: Code review requirements

2. **User Adoption Issues**
   - **Mitigation**: Comprehensive documentation
   - **Training**: User guide creation
   - **Support**: Help system integration

---

## Success Metrics

### Technical Metrics
- **Test Coverage**: >90% for all integrated features
- **Performance**: <200ms API response times
- **Reliability**: 99.9% uptime for critical features
- **Security**: Zero critical vulnerabilities

### Business Metrics
- **Feature Adoption**: >80% organization usage
- **User Satisfaction**: >4.5/5 rating
- **Compliance**: 100% audit requirement coverage
- **Productivity**: 50% reduction in admin overhead

### Hospital-Specific Metrics
- **Patient Data Security**: Zero breaches
- **Staff Efficiency**: 30% faster operations
- **Compliance Reporting**: Automated generation
- **Integration Success**: Medical system connectivity

This detailed plan provides a comprehensive roadmap for integrating proven SaaS template features into HospitalOS, transforming it into an enterprise-grade hospital management platform while maintaining security, compliance, and usability standards.
