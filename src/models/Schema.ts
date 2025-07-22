import {
  bigint,
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// ============================================================================
// ENUMS
// ============================================================================

export const roleEnum = pgEnum('role', ['OWNER', 'ADMIN', 'MEMBER']);

// Hospital-specific enums
export const hospitalRoleEnum = pgEnum('hospital_role', ['administrator', 'doctor', 'nurse', 'technician', 'viewer']);
export const hospitalDepartmentEnum = pgEnum('hospital_department', ['emergency', 'icu', 'surgery', 'cardiology', 'pediatrics', 'radiology', 'general']);
export const auditActionEnum = pgEnum('audit_action', ['create', 'read', 'update', 'delete']);
export const auditResourceEnum = pgEnum('audit_resource', ['sso_connection', 'user', 'role', 'department', 'patient_data', 'medical_record', 'audit_log', 'system_setting', 'subscription', 'invoice', 'checkout_session', 'billing_portal', 'group', 'scim_endpoint', 'license', 'oauth_client', 'oauth_token', 'oauth_authorization', 'oauth_permission', 'oauth_code']);

// ============================================================================
// CORE TABLES
// ============================================================================

export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ============================================================================
// JACKSON SSO TABLES
// ============================================================================

export const jacksonStore = pgTable(
  'jackson_store',
  {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
    iv: text('iv'),
    tag: text('tag'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    modifiedAt: timestamp('modified_at', { mode: 'date' }),
    namespace: text('namespace'),
  },
  (table) => {
    return {
      namespaceIdx: uniqueIndex('jackson_store_namespace_idx').on(table.namespace),
    };
  },
);

export const jacksonIndex = pgTable(
  'jackson_index',
  {
    id: serial('id').primaryKey(),
    key: text('key').notNull(),
    storeKey: text('store_key').notNull(),
  },
  (table) => {
    return {
      keyIdx: uniqueIndex('jackson_index_key_idx').on(table.key),
      keyStoreIdx: uniqueIndex('jackson_index_key_store_idx').on(table.key, table.storeKey),
    };
  },
);

export const jacksonTtl = pgTable(
  'jackson_ttl',
  {
    key: text('key').primaryKey(),
    expiresAt: bigint('expires_at', { mode: 'number' }).notNull(),
  },
  (table) => {
    return {
      expiresAtIdx: uniqueIndex('jackson_ttl_expires_at_idx').on(table.expiresAt),
    };
  },
);

// ============================================================================
// TEAM MANAGEMENT TABLES
// ============================================================================

export const teamMember = pgTable(
  'team_members',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text('organization_id').notNull(),
    userId: text('user_id').notNull(),
    role: roleEnum('role').default('MEMBER').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      uniqueTeamUser: uniqueIndex('unique_team_user_idx').on(
        table.organizationId,
        table.userId,
      ),
      userIdIdx: uniqueIndex('team_members_user_id_idx').on(table.userId),
      organizationIdIdx: uniqueIndex('team_members_organization_id_idx').on(
        table.organizationId,
      ),
    };
  },
);

// ============================================================================
// API KEY MANAGEMENT TABLES
// ============================================================================

export const apiKey = pgTable(
  'api_keys',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    organizationId: text('organization_id').notNull(),
    hashedKey: text('hashed_key').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    expiresAt: timestamp('expires_at', { mode: 'date' }),
    lastUsedAt: timestamp('last_used_at', { mode: 'date' }),
  },
  (table) => {
    return {
      hashedKeyIdx: uniqueIndex('api_keys_hashed_key_idx').on(table.hashedKey),
      organizationIdIdx: uniqueIndex('api_keys_organization_id_idx').on(
        table.organizationId,
      ),
    };
  },
);

// ============================================================================
// INVITATION SYSTEM TABLES
// ============================================================================

export const invitation = pgTable(
  'invitations',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text('organization_id').notNull(),
    email: text('email'),
    role: roleEnum('role').default('MEMBER').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    invitedBy: text('invited_by').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    sentViaEmail: boolean('sent_via_email').default(true).notNull(),
    allowedDomains: jsonb('allowed_domains').$type<string[]>().default([]),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex('invitations_token_idx').on(table.token),
      uniqueTeamEmail: uniqueIndex('unique_team_email_idx').on(
        table.organizationId,
        table.email,
      ),
      emailIdx: uniqueIndex('invitations_email_idx').on(table.email),
      organizationIdIdx: uniqueIndex('invitations_organization_id_idx').on(
        table.organizationId,
      ),
    };
  },
);

// ============================================================================
// HOSPITAL-SPECIFIC TABLES
// ============================================================================

// Hospital staff extended information
export const hospitalStaff = pgTable(
  'hospital_staff',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull(), // References Clerk user ID
    organizationId: text('organization_id').notNull(),
    hospitalRole: hospitalRoleEnum('hospital_role').notNull(),
    department: hospitalDepartmentEnum('department').notNull(),
    employeeId: text('employee_id'),
    licenseNumber: text('license_number'),
    specializations: jsonb('specializations').$type<string[]>().default([]),
    isActive: boolean('is_active').default(true).notNull(),
    lastLoginAt: timestamp('last_login_at', { mode: 'date' }),
    failedLoginAttempts: serial('failed_login_attempts'),
    accountLockedAt: timestamp('account_locked_at', { mode: 'date' }),
    accountLockedUntil: timestamp('account_locked_until', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: uniqueIndex('hospital_staff_user_id_idx').on(table.userId),
      organizationIdIdx: uniqueIndex('hospital_staff_organization_id_idx').on(
        table.organizationId,
      ),
      employeeIdIdx: uniqueIndex('hospital_staff_employee_id_idx').on(
        table.employeeId,
      ),
    };
  },
);

// Audit logs for hospital compliance
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text('organization_id').notNull(),
    actorId: text('actor_id').notNull(), // User who performed the action
    actorName: text('actor_name').notNull(),
    actorEmail: text('actor_email'),
    actorRole: hospitalRoleEnum('actor_role'),
    actorDepartment: hospitalDepartmentEnum('actor_department'),
    action: text('action').notNull(), // Event type (e.g., 'sso.connection.create')
    crud: auditActionEnum('crud').notNull(), // CRUD operation
    resource: auditResourceEnum('resource').notNull(),
    resourceId: text('resource_id'), // ID of the affected resource
    resourceName: text('resource_name'),
    targetId: text('target_id'), // Secondary target if applicable
    targetName: text('target_name'),
    targetType: text('target_type'),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    sessionId: text('session_id'),
    success: boolean('success').default(true).notNull(),
    errorMessage: text('error_message'),
    duration: serial('duration'), // Action duration in milliseconds
    complianceFlags: jsonb('compliance_flags').$type<string[]>().default([]),
    retracedEventId: text('retraced_event_id'), // Reference to Retraced event
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('audit_logs_organization_id_idx').on(
        table.organizationId,
      ),
      actorIdIdx: uniqueIndex('audit_logs_actor_id_idx').on(table.actorId),
      actionIdx: uniqueIndex('audit_logs_action_idx').on(table.action),
      resourceIdx: uniqueIndex('audit_logs_resource_idx').on(table.resource),
      createdAtIdx: uniqueIndex('audit_logs_created_at_idx').on(table.createdAt),
      retracedEventIdIdx: uniqueIndex('audit_logs_retraced_event_id_idx').on(
        table.retracedEventId,
      ),
    };
  },
);

// Security events for monitoring and alerting
export const securityEvents = pgTable(
  'security_events',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text('organization_id').notNull(),
    eventType: text('event_type').notNull(), // 'failed_login', 'account_locked', 'suspicious_access'
    severity: text('severity').notNull(), // 'low', 'medium', 'high', 'critical'
    userId: text('user_id'), // May be null for anonymous events
    userEmail: text('user_email'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    location: text('location'), // Geolocation if available
    description: text('description').notNull(),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    resolved: boolean('resolved').default(false).notNull(),
    resolvedBy: text('resolved_by'),
    resolvedAt: timestamp('resolved_at', { mode: 'date' }),
    alertSent: boolean('alert_sent').default(false).notNull(),
    alertSentAt: timestamp('alert_sent_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('security_events_organization_id_idx').on(
        table.organizationId,
      ),
      eventTypeIdx: uniqueIndex('security_events_event_type_idx').on(
        table.eventType,
      ),
      severityIdx: uniqueIndex('security_events_severity_idx').on(table.severity),
      userIdIdx: uniqueIndex('security_events_user_id_idx').on(table.userId),
      createdAtIdx: uniqueIndex('security_events_created_at_idx').on(
        table.createdAt,
      ),
    };
  },
);

// ============================================================================
// WEBHOOK MANAGEMENT TABLES
// ============================================================================

// Webhook event types enum
export const webhookEventEnum = pgEnum('webhook_event', [
  'member.created',
  'member.removed',
  'member.updated',
  'invitation.created', 
  'invitation.accepted',
  'invitation.removed',
  'apikey.created',
  'apikey.deleted',
  'team.created',
  'team.updated',
  'user.updated',
  'organization.updated',
  'sso.connection.created',
  'sso.connection.updated',
  'sso.connection.deleted',
  'audit.log.created',
  'security.event.created'
]);

// Webhook delivery status enum
export const webhookStatusEnum = pgEnum('webhook_status', [
  'active',
  'inactive',
  'failed',
  'paused'
]);

// Subscription status enum for Stripe
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trialing', 
  'active', 
  'canceled', 
  'incomplete', 
  'incomplete_expired', 
  'past_due', 
  'unpaid', 
  'paused'
]);

// Webhook endpoints
export const webhookEndpoint = pgTable(
  'webhook_endpoints',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text('organization_id').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    url: text('url').notNull(),
    secret: text('secret').notNull(), // For signature verification
    status: webhookStatusEnum('status').default('active').notNull(),
    eventTypes: jsonb('event_types').$type<string[]>().default([]),
    headers: jsonb('headers').$type<Record<string, string>>().default({}),
    timeout: serial('timeout').default(30), // Timeout in seconds
    retryCount: serial('retry_count').default(3),
    lastDeliveryAt: timestamp('last_delivery_at', { mode: 'date' }),
    lastDeliveryStatus: text('last_delivery_status'), // 'success', 'failed', 'pending'
    failureCount: serial('failure_count').default(0),
    createdBy: text('created_by').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('webhook_endpoints_organization_id_idx').on(
        table.organizationId,
      ),
      urlIdx: uniqueIndex('webhook_endpoints_url_idx').on(table.url),
      statusIdx: uniqueIndex('webhook_endpoints_status_idx').on(table.status),
      createdByIdx: uniqueIndex('webhook_endpoints_created_by_idx').on(
        table.createdBy,
      ),
    };
  },
);

// Webhook delivery attempts/logs
export const webhookDelivery = pgTable(
  'webhook_deliveries',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    webhookEndpointId: text('webhook_endpoint_id').notNull(),
    eventType: webhookEventEnum('event_type').notNull(),
    eventId: text('event_id').notNull(), // Reference to the triggering event
    payload: jsonb('payload').$type<Record<string, any>>().notNull(),
    httpStatus: serial('http_status'),
    responseBody: text('response_body'),
    responseHeaders: jsonb('response_headers').$type<Record<string, string>>().default({}),
    duration: serial('duration'), // Response time in milliseconds
    attempt: serial('attempt').default(1),
    status: text('status').notNull(), // 'pending', 'success', 'failed', 'retrying'
    errorMessage: text('error_message'),
    nextRetryAt: timestamp('next_retry_at', { mode: 'date' }),
    deliveredAt: timestamp('delivered_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      webhookEndpointIdIdx: uniqueIndex('webhook_deliveries_endpoint_id_idx').on(
        table.webhookEndpointId,
      ),
      eventTypeIdx: uniqueIndex('webhook_deliveries_event_type_idx').on(
        table.eventType,
      ),
      statusIdx: uniqueIndex('webhook_deliveries_status_idx').on(table.status),
      createdAtIdx: uniqueIndex('webhook_deliveries_created_at_idx').on(
        table.createdAt,
      ),
      nextRetryAtIdx: uniqueIndex('webhook_deliveries_next_retry_at_idx').on(
        table.nextRetryAt,
      ),
    };
  },
);

// Webhook events queue for processing
export const webhookEvent = pgTable(
  'webhook_events',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text('organization_id').notNull(),
    eventType: webhookEventEnum('event_type').notNull(),
    resourceId: text('resource_id'), // ID of the resource that triggered the event
    resourceType: text('resource_type'), // Type of resource (user, team, etc.)
    payload: jsonb('payload').$type<Record<string, any>>().notNull(),
    processed: boolean('processed').default(false).notNull(),
    processedAt: timestamp('processed_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('webhook_events_organization_id_idx').on(
        table.organizationId,
      ),
      eventTypeIdx: uniqueIndex('webhook_events_event_type_idx').on(
        table.eventType,
      ),
      processedIdx: uniqueIndex('webhook_events_processed_idx').on(table.processed),
      createdAtIdx: uniqueIndex('webhook_events_created_at_idx').on(
        table.createdAt,
      ),
    };
  },
);

// ============================================================================
// BILLING & SUBSCRIPTION TABLES
// ============================================================================

// Subscription table for Stripe integration
export const subscription = pgTable(
  'subscription',
  {
    id: serial('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    stripeCustomerId: text('stripe_customer_id').unique(),
    stripeSubscriptionId: text('stripe_subscription_id').unique(),
    stripePriceId: text('stripe_price_id'),
    status: subscriptionStatusEnum('status').notNull(),
    currentPeriodStart: timestamp('current_period_start', { mode: 'date' }),
    currentPeriodEnd: timestamp('current_period_end', { mode: 'date' }),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
    // Hospital-specific fields
    departmentLimit: serial('department_limit').default(5),
    userLimit: serial('user_limit').default(100),
    storageLimit: serial('storage_limit_gb').default(50),
    apiCallLimit: serial('api_call_limit').default(10000), // Monthly API calls
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('subscription_organization_id_idx').on(
        table.organizationId,
      ),
      stripeCustomerIdIdx: uniqueIndex('subscription_stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
      stripeSubscriptionIdIdx: uniqueIndex('subscription_stripe_subscription_id_idx').on(
        table.stripeSubscriptionId,
      ),
      statusIdx: uniqueIndex('subscription_status_idx').on(table.status),
    };
  },
);

// Invoice table for billing history
export const invoice = pgTable(
  'invoice',
  {
    id: serial('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    stripeInvoiceId: text('stripe_invoice_id').unique(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    amountPaid: serial('amount_paid'), // In cents
    amountDue: serial('amount_due'), // In cents
    currency: text('currency').default('usd'),
    status: text('status'), // draft, open, paid, uncollectible, void
    paidAt: timestamp('paid_at', { mode: 'date' }),
    dueDate: timestamp('due_date', { mode: 'date' }),
    hostedInvoiceUrl: text('hosted_invoice_url'),
    invoicePdf: text('invoice_pdf'),
    receiptNumber: text('receipt_number'),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('invoice_organization_id_idx').on(
        table.organizationId,
      ),
      stripeInvoiceIdIdx: uniqueIndex('invoice_stripe_invoice_id_idx').on(
        table.stripeInvoiceId,
      ),
      statusIdx: uniqueIndex('invoice_status_idx').on(table.status),
      paidAtIdx: uniqueIndex('invoice_paid_at_idx').on(table.paidAt),
    };
  },
);

// Usage tracking for metered billing
export const usageRecord = pgTable(
  'usage_records',
  {
    id: serial('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    subscriptionId: serial('subscription_id').references(() => subscription.id),
    metricType: text('metric_type').notNull(), // 'api_calls', 'storage_gb', 'data_transfer_gb'
    quantity: serial('quantity').notNull(),
    unitAmount: serial('unit_amount'), // Cost per unit in cents
    totalAmount: serial('total_amount'), // Total cost in cents
    period: text('period').notNull(), // YYYY-MM format
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    reportedToStripe: boolean('reported_to_stripe').default(false),
    stripeUsageRecordId: text('stripe_usage_record_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('usage_records_organization_id_idx').on(
        table.organizationId,
      ),
      periodIdx: uniqueIndex('usage_records_period_idx').on(table.period),
      metricTypeIdx: uniqueIndex('usage_records_metric_type_idx').on(table.metricType),
      reportedIdx: uniqueIndex('usage_records_reported_idx').on(
        table.reportedToStripe,
      ),
    };
  },
);

// ============================================================================
// SCIM DIRECTORY SYNC TABLES
// ============================================================================

// SCIM user status enum
export const scimUserStatusEnum = pgEnum('scim_user_status', [
  'active',
  'inactive',
  'suspended',
  'deleted'
]);

// SCIM group type enum  
export const scimGroupTypeEnum = pgEnum('scim_group_type', [
  'department',
  'role_group',
  'security_group',
  'custom'
]);

// OAuth 2.0 enums
export const oauthGrantTypeEnum = pgEnum('oauth_grant_type', [
  'authorization_code',
  'client_credentials',
  'refresh_token'
]);

export const oauthTokenTypeEnum = pgEnum('oauth_token_type', [
  'access_token',
  'refresh_token',
  'authorization_code'
]);

export const oauthClientTypeEnum = pgEnum('oauth_client_type', [
  'confidential',
  'public'
]);

// SCIM users table for directory sync
export const scimUser = pgTable(
  'scim_users',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    externalId: text('external_id').notNull(), // ID from external directory
    userName: text('user_name').notNull(),
    email: text('email').notNull(),
    familyName: text('family_name'),
    givenName: text('given_name'),
    displayName: text('display_name'),
    active: boolean('active').default(true).notNull(),
    status: scimUserStatusEnum('status').default('active').notNull(),
    
    // Hospital-specific SCIM extensions
    department: text('department'),
    hospitalRole: hospitalRoleEnum('hospital_role'),
    licenseNumber: text('license_number'),
    licenseType: text('license_type'), // 'medical', 'nursing', 'technician'
    licenseExpiry: timestamp('license_expiry', { mode: 'date' }),
    specialization: text('specialization'),
    employeeId: text('employee_id'),
    supervisorId: text('supervisor_id'), // Reference to supervisor's SCIM user
    
    // SCIM standard fields
    meta: jsonb('meta').$type<{
      resourceType: string;
      created: string;
      lastModified: string;
      location?: string;
      version?: string;
    }>(),
    
    // Custom hospital attributes
    customAttributes: jsonb('custom_attributes').$type<Record<string, any>>().default({}),
    
    // Sync metadata
    lastSyncedAt: timestamp('last_synced_at', { mode: 'date' }),
    syncErrors: jsonb('sync_errors').$type<string[]>().default([]),
    provisioningStatus: text('provisioning_status').default('pending'), // 'pending', 'provisioned', 'failed'
    
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('scim_users_organization_id_idx').on(
        table.organizationId,
      ),
      externalIdIdx: uniqueIndex('scim_users_external_id_idx').on(
        table.organizationId,
        table.externalId,
      ),
      userNameIdx: uniqueIndex('scim_users_user_name_idx').on(
        table.organizationId,
        table.userName,
      ),
      emailIdx: uniqueIndex('scim_users_email_idx').on(
        table.organizationId,
        table.email,
      ),
      employeeIdIdx: uniqueIndex('scim_users_employee_id_idx').on(
        table.organizationId,
        table.employeeId,
      ),
      statusIdx: uniqueIndex('scim_users_status_idx').on(table.status),
      departmentIdx: uniqueIndex('scim_users_department_idx').on(table.department),
    };
  },
);

// SCIM groups table for department and role management
export const scimGroup = pgTable(
  'scim_groups',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    externalId: text('external_id').notNull(), // ID from external directory
    displayName: text('display_name').notNull(),
    description: text('description'),
    groupType: scimGroupTypeEnum('group_type').default('department').notNull(),
    
    // Hospital-specific group extensions
    departmentCode: text('department_code'), // Unique department identifier
    accessLevel: text('access_level'), // 'basic', 'elevated', 'admin'
    dataAccessScope: jsonb('data_access_scope').$type<{
      departments: string[];
      patientDataAccess: boolean;
      phiAccess: boolean;
      auditRequired: boolean;
    }>().default({}),
    
    // SCIM standard fields
    meta: jsonb('meta').$type<{
      resourceType: string;
      created: string;
      lastModified: string;
      location?: string;
      version?: string;
    }>(),
    
    // Group membership - stored as array of SCIM user IDs
    members: jsonb('members').$type<Array<{
      value: string; // SCIM user ID
      $ref?: string; // Reference URL
      display?: string; // Display name
      type?: string; // 'User'
    }>>().default([]),
    
    // Custom hospital attributes
    customAttributes: jsonb('custom_attributes').$type<Record<string, any>>().default({}),
    
    // Sync metadata
    lastSyncedAt: timestamp('last_synced_at', { mode: 'date' }),
    syncErrors: jsonb('sync_errors').$type<string[]>().default([]),
    provisioningStatus: text('provisioning_status').default('pending'),
    
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('scim_groups_organization_id_idx').on(
        table.organizationId,
      ),
      externalIdIdx: uniqueIndex('scim_groups_external_id_idx').on(
        table.organizationId,
        table.externalId,
      ),
      displayNameIdx: uniqueIndex('scim_groups_display_name_idx').on(
        table.organizationId,
        table.displayName,
      ),
      departmentCodeIdx: uniqueIndex('scim_groups_department_code_idx').on(
        table.organizationId,
        table.departmentCode,
      ),
      groupTypeIdx: uniqueIndex('scim_groups_group_type_idx').on(table.groupType),
    };
  },
);

// SCIM enterprise user extensions
export const scimEnterpriseUser = pgTable(
  'scim_enterprise_users',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    scimUserId: text('scim_user_id').notNull().references(() => scimUser.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    
    // Enterprise extension fields
    employeeNumber: text('employee_number'),
    costCenter: text('cost_center'),
    organization: text('organization'),
    division: text('division'),
    department: text('department'),
    manager: text('manager'), // Reference to manager's SCIM user ID
    
    // Hospital-specific enterprise fields
    npiNumber: text('npi_number'), // National Provider Identifier
    deaNumber: text('dea_number'), // Drug Enforcement Administration number
    stateNumber: text('state_number'), // State license number
    boardCertifications: jsonb('board_certifications').$type<Array<{
      board: string;
      certification: string;
      issueDate: string;
      expiryDate: string;
      certificationNumber: string;
    }>>().default([]),
    
    // Compliance and access
    backgroundCheckDate: timestamp('background_check_date', { mode: 'date' }),
    backgroundCheckStatus: text('background_check_status'), // 'pending', 'passed', 'failed'
    hipaaTrained: boolean('hipaa_trained').default(false),
    hipaaTrainingDate: timestamp('hipaa_training_date', { mode: 'date' }),
    emergencyContact: jsonb('emergency_contact').$type<{
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    }>(),
    
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      scimUserIdIdx: uniqueIndex('scim_enterprise_users_scim_user_id_idx').on(
        table.scimUserId,
      ),
      organizationIdIdx: uniqueIndex('scim_enterprise_users_organization_id_idx').on(
        table.organizationId,
      ),
      employeeNumberIdx: uniqueIndex('scim_enterprise_users_employee_number_idx').on(
        table.organizationId,
        table.employeeNumber,
      ),
      npiNumberIdx: uniqueIndex('scim_enterprise_users_npi_number_idx').on(
        table.npiNumber,
      ),
    };
  },
);

// SCIM provisioning configuration
export const scimConfiguration = pgTable(
  'scim_configurations',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    
    // SCIM endpoint configuration
    enabled: boolean('enabled').default(false).notNull(),
    bearerToken: text('bearer_token').notNull(), // Hashed
    baseUrl: text('base_url'), // SCIM base URL for this organization
    version: text('version').default('2.0').notNull(), // SCIM version
    
    // Sync configuration
    autoProvisionUsers: boolean('auto_provision_users').default(true),
    autoProvisionGroups: boolean('auto_provision_groups').default(true),
    autoDeprovisionUsers: boolean('auto_deprovision_users').default(false), // Safety setting
    syncInterval: serial('sync_interval_minutes').default(60), // Sync every hour
    
    // Hospital-specific SCIM settings
    requireLicenseValidation: boolean('require_license_validation').default(true),
    allowedDepartments: jsonb('allowed_departments').$type<string[]>().default([]),
    restrictedRoles: jsonb('restricted_roles').$type<string[]>().default([]),
    attributeMapping: jsonb('attribute_mapping').$type<Record<string, string>>().default({}),
    
    // Sync status
    lastSyncAt: timestamp('last_sync_at', { mode: 'date' }),
    lastSyncStatus: text('last_sync_status'), // 'success', 'failed', 'partial'
    lastSyncErrors: jsonb('last_sync_errors').$type<string[]>().default([]),
    syncStats: jsonb('sync_stats').$type<{
      usersCreated: number;
      usersUpdated: number;
      usersDeleted: number;
      groupsCreated: number;
      groupsUpdated: number;
      groupsDeleted: number;
    }>(),
    
    createdBy: text('created_by').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('scim_configurations_organization_id_idx').on(
        table.organizationId,
      ),
      enabledIdx: uniqueIndex('scim_configurations_enabled_idx').on(table.enabled),
      bearerTokenIdx: uniqueIndex('scim_configurations_bearer_token_idx').on(
        table.bearerToken,
      ),
    };
  },
);

// ============================================================================
// OAUTH 2.0 SERVER TABLES
// ============================================================================

// OAuth clients table for hospital applications
export const oauthClient = pgTable(
  'oauth_clients',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    clientId: text('client_id').unique().notNull(),
    clientSecret: text('client_secret').notNull(), // Hashed
    name: text('name').notNull(),
    description: text('description'),
    clientType: oauthClientTypeEnum('client_type').default('confidential').notNull(),
    
    // Redirect URIs for authorization code flow
    redirectUris: jsonb('redirect_uris').$type<string[]>().default([]),
    allowedOrigins: jsonb('allowed_origins').$type<string[]>().default([]),
    
    // OAuth scopes and permissions
    scopes: jsonb('scopes').$type<string[]>().default(['read']),
    allowedGrantTypes: jsonb('allowed_grant_types').$type<string[]>().default(['authorization_code']),
    
    // Hospital-specific OAuth settings
    allowedDepartments: jsonb('allowed_departments').$type<string[]>().default([]),
    dataAccessLevel: text('data_access_level').default('basic'), // 'basic', 'department', 'organization', 'patient'
    phiAccess: boolean('phi_access').default(false),
    auditRequired: boolean('audit_required').default(true),
    
    // Rate limiting and security
    rateLimit: serial('rate_limit').default(1000), // requests per hour
    tokenLifetime: serial('token_lifetime').default(3600), // seconds
    refreshTokenLifetime: serial('refresh_token_lifetime').default(86400), // seconds
    
    // Client metadata
    logoUrl: text('logo_url'),
    homepageUrl: text('homepage_url'),
    privacyPolicyUrl: text('privacy_policy_url'),
    termsOfServiceUrl: text('terms_of_service_url'),
    
    // Status and lifecycle
    isActive: boolean('is_active').default(true),
    lastUsedAt: timestamp('last_used_at', { mode: 'date' }),
    createdBy: text('created_by').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: uniqueIndex('oauth_clients_organization_id_idx').on(
        table.organizationId,
      ),
      clientIdIdx: uniqueIndex('oauth_clients_client_id_idx').on(table.clientId),
      nameIdx: uniqueIndex('oauth_clients_name_idx').on(
        table.organizationId,
        table.name,
      ),
      isActiveIdx: uniqueIndex('oauth_clients_is_active_idx').on(table.isActive),
    };
  },
);

// OAuth authorization codes table
export const oauthAuthorizationCode = pgTable(
  'oauth_authorization_codes',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    code: text('code').unique().notNull(),
    clientId: text('client_id').notNull().references(() => oauthClient.clientId),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    userId: text('user_id').notNull(),
    
    // Authorization details
    scopes: jsonb('scopes').$type<string[]>().default([]),
    redirectUri: text('redirect_uri').notNull(),
    codeChallenge: text('code_challenge'), // PKCE
    codeChallengeMethod: text('code_challenge_method'), // S256 or plain
    
    // Hospital context
    departmentId: text('department_id'),
    hospitalRole: hospitalRoleEnum('hospital_role'),
    dataAccessScope: jsonb('data_access_scope').$type<{
      departments: string[];
      phiAccess: boolean;
      patientDataAccess: boolean;
    }>(),
    
    // Lifecycle
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    usedAt: timestamp('used_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      codeIdx: uniqueIndex('oauth_authorization_codes_code_idx').on(table.code),
      clientIdIdx: uniqueIndex('oauth_authorization_codes_client_id_idx').on(
        table.clientId,
      ),
      organizationIdIdx: uniqueIndex('oauth_authorization_codes_organization_id_idx').on(
        table.organizationId,
      ),
      expiresAtIdx: uniqueIndex('oauth_authorization_codes_expires_at_idx').on(
        table.expiresAt,
      ),
    };
  },
);

// OAuth access tokens table
export const oauthAccessToken = pgTable(
  'oauth_access_tokens',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    token: text('token').unique().notNull(), // Hashed
    tokenType: oauthTokenTypeEnum('token_type').default('access_token').notNull(),
    clientId: text('client_id').notNull().references(() => oauthClient.clientId),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    userId: text('user_id'),
    
    // Token details
    scopes: jsonb('scopes').$type<string[]>().default([]),
    audience: text('audience'), // Intended recipient
    issuer: text('issuer').default('hospitalos'),
    
    // Hospital context from authorization
    departmentId: text('department_id'),
    hospitalRole: hospitalRoleEnum('hospital_role'),
    dataAccessScope: jsonb('data_access_scope').$type<{
      departments: string[];
      phiAccess: boolean;
      patientDataAccess: boolean;
      auditRequired: boolean;
    }>(),
    
    // Token lifecycle
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    revokedAt: timestamp('revoked_at', { mode: 'date' }),
    lastUsedAt: timestamp('last_used_at', { mode: 'date' }),
    
    // Security metadata
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex('oauth_access_tokens_token_idx').on(table.token),
      clientIdIdx: uniqueIndex('oauth_access_tokens_client_id_idx').on(
        table.clientId,
      ),
      organizationIdIdx: uniqueIndex('oauth_access_tokens_organization_id_idx').on(
        table.organizationId,
      ),
      userIdIdx: uniqueIndex('oauth_access_tokens_user_id_idx').on(table.userId),
      expiresAtIdx: uniqueIndex('oauth_access_tokens_expires_at_idx').on(
        table.expiresAt,
      ),
    };
  },
);

// OAuth refresh tokens table
export const oauthRefreshToken = pgTable(
  'oauth_refresh_tokens',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    token: text('token').unique().notNull(), // Hashed
    accessTokenId: text('access_token_id').references(() => oauthAccessToken.id),
    clientId: text('client_id').notNull().references(() => oauthClient.clientId),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    userId: text('user_id').notNull(),
    
    // Token details
    scopes: jsonb('scopes').$type<string[]>().default([]),
    
    // Hospital context
    departmentId: text('department_id'),
    hospitalRole: hospitalRoleEnum('hospital_role'),
    
    // Token lifecycle
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    revokedAt: timestamp('revoked_at', { mode: 'date' }),
    lastUsedAt: timestamp('last_used_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex('oauth_refresh_tokens_token_idx').on(table.token),
      accessTokenIdIdx: uniqueIndex('oauth_refresh_tokens_access_token_id_idx').on(
        table.accessTokenId,
      ),
      clientIdIdx: uniqueIndex('oauth_refresh_tokens_client_id_idx').on(
        table.clientId,
      ),
      organizationIdIdx: uniqueIndex('oauth_refresh_tokens_organization_id_idx').on(
        table.organizationId,
      ),
      userIdIdx: uniqueIndex('oauth_refresh_tokens_user_id_idx').on(table.userId),
      expiresAtIdx: uniqueIndex('oauth_refresh_tokens_expires_at_idx').on(
        table.expiresAt,
      ),
    };
  },
);

// OAuth client permissions (for hospital-specific scopes)
export const oauthClientPermission = pgTable(
  'oauth_client_permissions',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    clientId: text('client_id').notNull().references(() => oauthClient.clientId, { onDelete: 'cascade' }),
    organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
    
    // Permission details
    scope: text('scope').notNull(), // e.g., 'read:patients', 'write:medical_records'
    resource: text('resource').notNull(), // e.g., 'patients', 'medical_records', 'departments'
    action: text('action').notNull(), // 'read', 'write', 'delete', 'admin'
    
    // Hospital-specific permission context
    departmentRestrictions: jsonb('department_restrictions').$type<string[]>().default([]),
    dataClassification: text('data_classification'), // 'public', 'internal', 'confidential', 'restricted'
    phiAccessLevel: text('phi_access_level'), // 'none', 'limited', 'full'
    
    // Permission metadata
    description: text('description'),
    riskLevel: text('risk_level').default('medium'), // 'low', 'medium', 'high', 'critical'
    complianceRequired: boolean('compliance_required').default(true),
    
    // Lifecycle
    grantedBy: text('granted_by').notNull(),
    grantedAt: timestamp('granted_at', { mode: 'date' }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { mode: 'date' }),
    revokedAt: timestamp('revoked_at', { mode: 'date' }),
  },
  (table) => {
    return {
      clientIdIdx: uniqueIndex('oauth_client_permissions_client_id_idx').on(
        table.clientId,
      ),
      organizationIdIdx: uniqueIndex('oauth_client_permissions_organization_id_idx').on(
        table.organizationId,
      ),
      scopeIdx: uniqueIndex('oauth_client_permissions_scope_idx').on(
        table.clientId,
        table.scope,
      ),
      resourceActionIdx: uniqueIndex('oauth_client_permissions_resource_action_idx').on(
        table.resource,
        table.action,
      ),
    };
  },
);
