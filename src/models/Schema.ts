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
