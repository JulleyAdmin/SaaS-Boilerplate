# 📋 HospitalOS Template Integration Detailed Plan

## 🎯 Overview

This document provides a comprehensive, step-by-step plan for integrating the remaining 35% of template capabilities into HospitalOS. Each section includes specific file references, implementation steps, and integration strategies.

**Current Status**: 65% Complete  
**Target**: 100% Enterprise-Ready Hospital Management Platform  
**Timeline**: 4 Weeks  
**Reference Templates**:
- BoxyHQ: `/template-references/boxyhq/`
- Nextacular: `/template-references/nextacular/`
- Supabase: `/template-references/supabase-template/`

---

## 📅 Week 1: Revenue Generation & User Management

### 💳 Stripe Billing Integration (Days 1-3) ✅ [COMPLETED]

#### Source Files to Copy
```
FROM: /template-references/boxyhq/
├── lib/
│   ├── stripe.ts              → /src/libs/Stripe.ts
│   └── models/
│       ├── subscription.ts    → /src/models/subscription.ts
│       └── billing.ts         → /src/models/billing.ts
├── pages/api/
│   ├── stripe/
│   │   ├── webhook.ts        → /src/app/api/stripe/webhook/route.ts
│   │   ├── checkout.ts       → /src/app/api/stripe/checkout/route.ts
│   │   └── portal.ts         → /src/app/api/stripe/portal/route.ts
└── components/
    └── billing/
        ├── PricingPlans.tsx  → /src/components/billing/PricingPlans.tsx
        └── BillingPortal.tsx → /src/components/billing/BillingPortal.tsx
```

#### Implementation Steps

1. **Database Schema Updates** ✅ [COMPLETED]
```sql
-- Add to /src/models/Schema.ts
export const subscriptionEnum = pgEnum('subscription_status', [
  'trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 
  'past_due', 'unpaid', 'paused'
]);

export const subscription = pgTable('subscription', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id'),
  status: subscriptionEnum('status').notNull(),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  // Hospital-specific fields
  departmentLimit: integer('department_limit').default(5),
  userLimit: integer('user_limit').default(100),
  storageLimit: integer('storage_limit_gb').default(50),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const invoice = pgTable('invoice', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id),
  stripeInvoiceId: text('stripe_invoice_id').unique(),
  amountPaid: integer('amount_paid'),
  amountDue: integer('amount_due'),
  currency: text('currency').default('usd'),
  status: text('status'),
  hostedInvoiceUrl: text('hosted_invoice_url'),
  createdAt: timestamp('created_at').defaultNow()
});
```

2. **Hospital-Specific Pricing Tiers** ✅ [COMPLETED]
```typescript
// /src/utils/pricing.ts
export const HOSPITAL_PLANS = {
  CLINIC: {
    name: 'Clinic',
    stripePriceId: process.env.STRIPE_CLINIC_PRICE_ID,
    price: 299,
    features: {
      departments: 5,
      users: 50,
      storage: 25,
      sso: true,
      apiKeys: 10,
      webhooks: 20,
      auditRetention: 90, // days
      support: 'email'
    }
  },
  HOSPITAL: {
    name: 'Hospital',
    stripePriceId: process.env.STRIPE_HOSPITAL_PRICE_ID,
    price: 999,
    features: {
      departments: 25,
      users: 500,
      storage: 250,
      sso: true,
      scim: true,
      apiKeys: 50,
      webhooks: 100,
      auditRetention: 365,
      support: 'priority'
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    price: 'custom',
    features: {
      departments: 'unlimited',
      users: 'unlimited',
      storage: 'unlimited',
      sso: true,
      scim: true,
      apiKeys: 'unlimited',
      webhooks: 'unlimited',
      auditRetention: 'custom',
      support: 'dedicated',
      sla: true,
      customIntegrations: true
    }
  }
};
```

3. **Webhook Handler Adaptation** ✅ [COMPLETED]
```typescript
// Adapt BoxyHQ webhook handler for hospital context
// /src/app/api/stripe/webhook/route.ts
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionChange(event.data.object);
      // Trigger hospital onboarding workflow
      await createHospitalOnboardingTasks(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionCancellation(event.data.object);
      // Archive hospital data, revoke access
      await archiveHospitalData(event.data.object);
      break;
  }
}
```

### 📧 Email System & Password Reset (Days 4-5) ✅ [COMPLETED]

#### Source Files to Copy
```
FROM: /template-references/boxyhq/
├── lib/
│   ├── email/
│   │   ├── client.ts         → /src/libs/email/client.ts
│   │   ├── templates/        → /src/libs/email/templates/
│   │   │   ├── welcome.tsx
│   │   │   ├── reset.tsx
│   │   │   └── invite.tsx
│   └── models/
│       └── passwordReset.ts  → /src/models/passwordReset.ts
└── pages/api/auth/
    ├── forgot-password.ts    → /src/app/api/auth/forgot-password/route.ts
    └── reset-password.ts     → /src/app/api/auth/reset-password/route.ts
```

#### Implementation Steps

1. **Email Service Configuration**
```typescript
// /src/libs/email/client.ts
import { Resend } from 'resend';
import { renderAsync } from '@react-email/render';

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  template,
  props
}: EmailOptions) => {
  const html = await renderAsync(template(props));
  
  return resend.emails.send({
    from: 'HospitalOS <noreply@hospitalos.com>',
    to,
    subject,
    html,
    // Hospital compliance headers
    headers: {
      'X-Hospital-Compliance': 'HIPAA',
      'X-PHI-Encrypted': 'true'
    }
  });
};
```

2. **Hospital-Specific Email Templates**
```tsx
// /src/libs/email/templates/patient-notification.tsx
export const PatientNotificationEmail = ({
  patientName,
  appointmentDate,
  department,
  doctorName,
  hospitalName
}: PatientNotificationProps) => (
  <Html>
    <Head />
    <Preview>Your appointment at {hospitalName}</Preview>
    <Body>
      <Container>
        <Text>Dear {patientName},</Text>
        <Text>
          Your appointment with Dr. {doctorName} in the {department} department
          is scheduled for {appointmentDate}.
        </Text>
        <Text>
          Please arrive 15 minutes early for registration.
        </Text>
        <Hr />
        <Text className="footer">
          This is a HIPAA-compliant secure communication from {hospitalName}.
          Please do not reply to this email.
        </Text>
      </Container>
    </Body>
  </Html>
);
```

---

## 📅 Week 2: Enterprise Features

### 🔄 Directory Sync (SCIM) (Days 1-3) ✅ [COMPLETED & VALIDATED]

#### Source Files to Copy ✅ [COMPLETED]
```
FROM: /template-references/boxyhq/
├── lib/
│   ├── scim/
│   │   ├── users.ts          → /src/libs/scim/users.ts ✅
│   │   ├── groups.ts         → /src/libs/scim/groups.ts ✅
│   │   └── middleware.ts     → /src/libs/scim/middleware.ts ✅
└── pages/api/scim/
    └── v2/
        ├── Users/            → /src/app/api/scim/v2/Users/ ✅
        └── Groups/           → /src/app/api/scim/v2/Groups/ ✅
```

#### Implementation Steps ✅ [COMPLETED]

1. **SCIM Schema Extensions** ✅ [COMPLETED]
```typescript
// /src/models/scim.ts
export const scimUser = pgTable('scim_user', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  externalId: text('external_id').notNull(),
  email: text('email').notNull(),
  userName: text('user_name'),
  active: boolean('active').default(true),
  // Hospital-specific SCIM attributes
  department: text('department'),
  role: text('role'), // Maps to hospital roles
  licenseNumber: text('license_number'),
  specialization: text('specialization'),
  attributes: json('attributes'), // Custom hospital attributes
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const scimGroup = pgTable('scim_group', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  displayName: text('display_name').notNull(),
  externalId: text('external_id'),
  // Hospital department mapping
  departmentId: text('department_id'),
  members: json('members').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow()
});
```

2. **Hospital SCIM Endpoints** ✅ [COMPLETED]
```typescript
// /src/app/api/scim/v2/Users/route.ts
export async function POST(request: Request) {
  const { schemas, userName, emails, active, ...attributes } = await request.json();
  
  // Map external roles to hospital roles
  const hospitalRole = mapExternalToHospitalRole(attributes.role);
  
  // Validate medical license if provided
  if (attributes.licenseNumber) {
    await validateMedicalLicense(attributes.licenseNumber);
  }
  
  const user = await createScimUser({
    userName,
    email: emails[0].value,
    active,
    department: attributes.department,
    role: hospitalRole,
    licenseNumber: attributes.licenseNumber,
    specialization: attributes.specialization
  });
  
  return Response.json(formatScimUser(user), { status: 201 });
}
```

### 🔐 OAuth 2.0 Server (Days 4-5)

#### Source Files to Copy
```
FROM: /template-references/boxyhq/
├── lib/
│   ├── oauth/
│   │   ├── server.ts         → /src/libs/oauth/server.ts
│   │   ├── tokens.ts         → /src/libs/oauth/tokens.ts
│   │   └── clients.ts        → /src/libs/oauth/clients.ts
└── pages/api/oauth/
    ├── authorize.ts          → /src/app/api/oauth/authorize/route.ts
    ├── token.ts              → /src/app/api/oauth/token/route.ts
    └── introspect.ts         → /src/app/api/oauth/introspect/route.ts
```

#### Implementation Steps

1. **OAuth Client Management**
```typescript
// /src/models/oauthClient.ts
export const oauthClient = pgTable('oauth_client', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  clientId: text('client_id').unique().notNull(),
  clientSecret: text('client_secret').notNull(), // Hashed
  name: text('name').notNull(),
  redirectUris: json('redirect_uris').$type<string[]>(),
  scopes: json('scopes').$type<string[]>().default(['read']),
  // Hospital-specific OAuth settings
  allowedDepartments: json('allowed_departments').$type<string[]>(),
  dataAccessLevel: text('data_access_level'), // 'department', 'organization', 'patient'
  phiAccess: boolean('phi_access').default(false),
  rateLimit: integer('rate_limit').default(1000), // requests per hour
  createdAt: timestamp('created_at').defaultNow(),
  revokedAt: timestamp('revoked_at')
});
```

---

## 📅 Week 3: Advanced Platform Features

### 📁 File Storage System (Days 1-2)

#### Source Files to Reference
```
FROM: /template-references/supabase-template/
├── supabase/
│   └── storage/              → Reference for policies
└── lib/
    └── storage/              → Reference for client implementation
```

#### Implementation Steps

1. **Storage Service Implementation**
```typescript
// /src/libs/storage/client.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

export class MedicalDocumentStorage {
  private s3Client: S3Client;
  
  constructor() {
    this.s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
      }
    });
  }
  
  async uploadMedicalDocument({
    file,
    patientId,
    documentType,
    departmentId,
    encryptionRequired = true
  }: UploadOptions) {
    const fileKey = this.generateSecureKey(patientId, documentType);
    
    // Encrypt sensitive medical documents
    const processedFile = encryptionRequired 
      ? await this.encryptFile(file)
      : file;
    
    const command = new PutObjectCommand({
      Bucket: env.MEDICAL_DOCUMENTS_BUCKET,
      Key: fileKey,
      Body: processedFile,
      Metadata: {
        patientId,
        documentType,
        departmentId,
        uploadedBy: userId,
        encryptionAlgorithm: 'AES-256-GCM'
      },
      ServerSideEncryption: 'AES256'
    });
    
    await this.s3Client.send(command);
    
    // Log PHI access for compliance
    await auditLog.create({
      action: 'MEDICAL_DOCUMENT_UPLOAD',
      resourceType: 'document',
      resourceId: fileKey,
      phiAccessed: true,
      metadata: { documentType, patientId }
    });
    
    return fileKey;
  }
  
  async getSignedDownloadUrl(fileKey: string, expiresIn = 300) {
    // Verify access permissions
    await this.verifyDocumentAccess(fileKey, userId);
    
    const command = new GetObjectCommand({
      Bucket: env.MEDICAL_DOCUMENTS_BUCKET,
      Key: fileKey
    });
    
    const url = await getSignedUrl(this.s3Client, command, { expiresIn });
    
    // Log PHI access
    await auditLog.create({
      action: 'MEDICAL_DOCUMENT_ACCESS',
      resourceType: 'document',
      resourceId: fileKey,
      phiAccessed: true
    });
    
    return url;
  }
}
```

2. **Storage Policies**
```typescript
// /src/libs/storage/policies.ts
export const STORAGE_POLICIES = {
  MEDICAL_RECORDS: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/dicom'],
    encryption: 'required',
    retention: 7 * 365, // 7 years per HIPAA
    backupRequired: true
  },
  LAB_RESULTS: {
    maxFileSize: 25 * 1024 * 1024,
    allowedTypes: ['application/pdf', 'text/csv', 'application/json'],
    encryption: 'required',
    retention: 2 * 365,
    autoArchive: true
  },
  PRESCRIPTIONS: {
    maxFileSize: 5 * 1024 * 1024,
    allowedTypes: ['application/pdf'],
    encryption: 'required',
    retention: 2 * 365,
    auditTrail: 'detailed'
  }
};
```

### 🏢 Workspace Management (Days 3-4)

#### Source Files to Copy
```
FROM: /template-references/nextacular/
├── models/
│   └── workspace.ts          → /src/models/workspace.ts
├── hooks/
│   └── useWorkspace.ts       → /src/hooks/useWorkspace.ts
└── components/
    └── workspace/
        ├── WorkspaceSwitcher → /src/components/workspace/WorkspaceSwitcher.tsx
        └── WorkspaceSettings → /src/components/workspace/WorkspaceSettings.tsx
```

#### Implementation Steps

1. **Multi-Hospital Workspace Schema**
```typescript
// /src/models/workspace.ts
export const hospitalNetwork = pgTable('hospital_network', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  // Network-level settings
  networkType: text('network_type'), // 'single', 'multi-facility', 'health-system'
  parentNetworkId: text('parent_network_id'), // For hierarchical networks
  settings: json('settings').$type<NetworkSettings>(),
  createdAt: timestamp('created_at').defaultNow()
});

export const hospitalFacility = pgTable('hospital_facility', {
  id: serial('id').primaryKey(),
  networkId: integer('network_id').references(() => hospitalNetwork.id),
  name: text('name').notNull(),
  code: text('code').unique(), // Hospital code
  type: text('type'), // 'main', 'satellite', 'clinic'
  address: json('address').$type<Address>(),
  // Facility-specific settings
  bedCount: integer('bed_count'),
  departments: json('departments').$type<string[]>(),
  emergencyServices: boolean('emergency_services').default(false),
  operatingHours: json('operating_hours'),
  accreditations: json('accreditations').$type<Accreditation[]>(),
  createdAt: timestamp('created_at').defaultNow()
});
```

### ⚡ Real-time Features (Day 5)

#### Implementation Steps

1. **WebSocket Service**
```typescript
// /src/libs/realtime/service.ts
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';

export class HospitalRealtimeService {
  private io: SocketIOServer;
  
  constructor(httpServer: any) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: env.NEXT_PUBLIC_APP_URL,
        credentials: true
      }
    });
    
    // Redis adapter for scaling
    const pubClient = new Redis(env.REDIS_URL);
    const subClient = pubClient.duplicate();
    this.io.adapter(createAdapter(pubClient, subClient));
    
    this.setupMiddleware();
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('subscribe:department', async (departmentId) => {
        // Verify user has access to department
        if (await this.canAccessDepartment(socket.userId, departmentId)) {
          socket.join(`department:${departmentId}`);
        }
      });
      
      socket.on('subscribe:patient', async (patientId) => {
        // Verify user has access to patient data
        if (await this.canAccessPatient(socket.userId, patientId)) {
          socket.join(`patient:${patientId}`);
        }
      });
    });
  }
  
  // Emit hospital events
  async notifyBedAvailability(departmentId: string, available: number) {
    this.io.to(`department:${departmentId}`).emit('bed:availability', {
      departmentId,
      availableBeds: available,
      timestamp: new Date()
    });
  }
  
  async notifyEmergencyAlert(alert: EmergencyAlert) {
    // Notify relevant departments
    alert.departments.forEach(dept => {
      this.io.to(`department:${dept}`).emit('emergency:alert', alert);
    });
  }
}
```

---

## 📅 Week 4: Security & Production Polish

### 🛡️ Security Hardening (Days 1-2)

#### Implementation Steps

1. **Rate Limiting Implementation**
```typescript
// /src/libs/security/rateLimiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const createRateLimiter = (tier: 'clinic' | 'hospital' | 'enterprise') => {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN
  });
  
  const limits = {
    clinic: { requests: 1000, window: '1h' },
    hospital: { requests: 5000, window: '1h' },
    enterprise: { requests: 20000, window: '1h' }
  };
  
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      limits[tier].requests,
      limits[tier].window
    ),
    analytics: true,
    prefix: 'hospital-api'
  });
};

// Middleware
export async function rateLimitMiddleware(request: Request) {
  const identifier = request.headers.get('x-api-key') || 
                    request.headers.get('x-forwarded-for') || 
                    'anonymous';
  
  const { success, limit, reset, remaining } = await rateLimiter.limit(identifier);
  
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(reset).toISOString(),
        'Retry-After': Math.floor((reset - Date.now()) / 1000).toString()
      }
    });
  }
}
```

2. **Security Headers**
```typescript
// /src/middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // HIPAA-compliant headers
  response.headers.set('X-PHI-Protection', 'enabled');
  response.headers.set('X-Audit-Trail', 'enforced');
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https://api.stripe.com wss://*.hospitalos.com;
    frame-src 'self' https://js.stripe.com;
  `.replace(/\n/g, ' ').trim());
  
  return response;
}
```

### 📊 Analytics & Monitoring (Days 3-4)

#### Implementation Steps

1. **Analytics Integration**
```typescript
// /src/libs/analytics/client.ts
import mixpanel from 'mixpanel-browser';
import { PostHog } from 'posthog-node';

export class HospitalAnalytics {
  private mixpanel: typeof mixpanel;
  private posthog: PostHog;
  
  constructor() {
    // Initialize analytics services
    this.mixpanel = mixpanel;
    this.mixpanel.init(env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
      track_pageview: true,
      persistence: 'localStorage',
      // HIPAA compliance - no PHI in analytics
      property_blacklist: ['$email', '$name', 'patientId', 'medicalRecordNumber']
    });
    
    this.posthog = new PostHog(env.POSTHOG_API_KEY, {
      host: env.POSTHOG_HOST
    });
  }
  
  // Track hospital-specific events
  trackDepartmentActivity(event: string, properties: Record<string, any>) {
    // Strip any PHI before tracking
    const sanitized = this.sanitizeProperties(properties);
    
    this.mixpanel.track(`department_${event}`, {
      ...sanitized,
      timestamp: new Date().toISOString(),
      hospitalId: properties.hospitalId,
      departmentType: properties.departmentType
    });
  }
  
  trackClinicalWorkflow(workflow: string, metadata: WorkflowMetadata) {
    this.posthog.capture({
      distinctId: metadata.userId,
      event: `workflow_${workflow}`,
      properties: {
        duration: metadata.duration,
        steps: metadata.steps,
        department: metadata.department,
        // Aggregated metrics only, no PHI
        patientsProcessed: metadata.patientCount,
        documentsGenerated: metadata.documentCount
      }
    });
  }
}
```

2. **Admin Analytics Dashboard**
```typescript
// /src/components/analytics/HospitalMetrics.tsx
export const HospitalMetrics = () => {
  const { data: metrics } = useHospitalAnalytics();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Patient Flow"
        value={metrics.patientFlow.today}
        change={metrics.patientFlow.changePercent}
        icon={<Users />}
      />
      
      <MetricCard
        title="Bed Utilization"
        value={`${metrics.bedUtilization}%`}
        status={metrics.bedUtilization > 90 ? 'critical' : 'normal'}
        icon={<Bed />}
      />
      
      <MetricCard
        title="ER Wait Time"
        value={`${metrics.avgERWaitTime} min`}
        target="< 30 min"
        icon={<Clock />}
      />
      
      <MetricCard
        title="Staff Efficiency"
        value={`${metrics.staffEfficiency}%`}
        breakdown={{
          doctors: metrics.doctorEfficiency,
          nurses: metrics.nurseEfficiency,
          admin: metrics.adminEfficiency
        }}
        icon={<Activity />}
      />
    </div>
  );
};
```

### 🚀 Production Preparation (Day 5)

#### Implementation Checklist

1. **Performance Optimization**
```typescript
// /src/libs/performance/optimizer.ts
export const performanceConfig = {
  // Database connection pooling
  database: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  
  // API response caching
  caching: {
    staticData: 3600, // 1 hour
    patientList: 300, // 5 minutes
    departmentStats: 600, // 10 minutes
    // Never cache PHI
    medicalRecords: 0
  },
  
  // Image optimization for medical imaging
  images: {
    quality: 85,
    formats: ['webp', 'avif'],
    sizes: [640, 750, 828, 1080, 1200],
    // Medical image specific
    dicomViewer: {
      preloadAdjacent: 2,
      cacheSize: '500MB'
    }
  }
};
```

2. **Database Indexing**
```sql
-- Performance indexes for hospital queries
CREATE INDEX idx_patient_department ON patient(department_id, status);
CREATE INDEX idx_appointment_date ON appointment(appointment_date, department_id);
CREATE INDEX idx_medical_record_patient ON medical_record(patient_id, created_at DESC);
CREATE INDEX idx_audit_log_phi ON audit_log(phi_accessed, created_at DESC) WHERE phi_accessed = true;
CREATE INDEX idx_staff_schedule ON staff_schedule(staff_id, shift_date, department_id);

-- Full-text search for medical records
CREATE INDEX idx_medical_record_search ON medical_record USING gin(to_tsvector('english', diagnosis || ' ' || notes));
```

---

## 🔄 Integration Testing Strategy

### Test Coverage Requirements

```typescript
// /tests/integration/full-platform.test.ts
describe('HospitalOS Platform Integration', () => {
  describe('Revenue Flow', () => {
    test('Complete billing cycle from signup to invoice');
    test('Subscription upgrade/downgrade with prorated billing');
    test('Usage-based billing for API calls and storage');
  });
  
  describe('Enterprise Features', () => {
    test('SCIM user provisioning with department assignment');
    test('OAuth flow with PHI access controls');
    test('SSO login with role mapping');
  });
  
  describe('Healthcare Workflows', () => {
    test('Patient admission to discharge workflow');
    test('Lab result upload and notification flow');
    test('Prescription management with audit trail');
    test('Emergency alert broadcast system');
  });
  
  describe('Compliance', () => {
    test('HIPAA audit trail completeness');
    test('PHI encryption at rest and in transit');
    test('Access control enforcement');
    test('Data retention and purging');
  });
});
```

---

## 📋 Migration Commands

```bash
# After each feature implementation
npm run db:generate       # Generate migration files
npm run db:migrate       # Apply migrations
npm run test:integration # Run integration tests

# Feature flags for gradual rollout
FEATURE_BILLING=true
FEATURE_SCIM=true
FEATURE_STORAGE=true
FEATURE_REALTIME=true
FEATURE_ANALYTICS=true
```

---

## 🎯 Success Criteria

### Technical Metrics
- ✅ All existing tests pass (currently 70/70)
- ✅ New features have >80% test coverage
- ✅ API response time <200ms (95th percentile)
- ✅ Zero security vulnerabilities (npm audit)
- ✅ HIPAA compliance maintained

### Business Metrics
- ✅ Complete subscription flow works end-to-end
- ✅ Enterprise customers can use SCIM/SSO
- ✅ Medical documents stored securely
- ✅ Real-time updates for critical workflows
- ✅ Analytics dashboard shows key metrics

### Compliance Metrics
- ✅ All PHI access logged
- ✅ Encryption implemented for sensitive data
- ✅ Audit trails meet regulatory requirements
- ✅ Data retention policies enforced

---

## 🚦 Risk Mitigation

### Integration Risks

1. **Dependency Conflicts**
   - Review all package versions before adding
   - Use exact versions in package.json
   - Test in isolated environment first

2. **Performance Impact**
   - Profile before/after each feature
   - Implement caching strategically
   - Use database connection pooling

3. **Security Vulnerabilities**
   - Run security audit after each phase
   - Penetration test critical features
   - Regular dependency updates

### Rollback Plan

```bash
# Tag before each major integration
git tag -a pre-billing-integration -m "Before Stripe integration"
git tag -a pre-enterprise-features -m "Before SCIM/OAuth"

# Quick rollback if needed
git checkout pre-billing-integration
npm install
npm run build
```

---

## 📚 Documentation Updates

After each phase, update:
1. `/CLAUDE.md` - New commands and workflows
2. `/docs/API.md` - New endpoints and webhooks
3. `/docs/DEPLOYMENT.md` - Environment variables
4. `/docs/ADMIN_GUIDE.md` - Feature configuration

---

This plan provides a complete roadmap for integrating the remaining 35% of capabilities, with specific file references, implementation details, and hospital-specific adaptations throughout.