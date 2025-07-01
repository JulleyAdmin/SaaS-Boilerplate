# Database Schema Analysis and Mapping

## Overview

This document provides a comprehensive analysis of three database schemas and maps their concepts to create a unified approach for HospitalOS template integration.

## Schema Comparison

### Current HospitalOS Schema (Drizzle ORM)
- **Organization-centric**: Built around Clerk organizations
- **Stripe Integration**: Native billing support
- **Minimal Structure**: Only organization and todo tables
- **Modern Stack**: PostgreSQL with Drizzle ORM

### BoxyHQ SaaS Starter Kit (Prisma)
- **Team-centric**: Core concept is "Team" (equivalent to Organization)
- **Enterprise Features**: SSO, API keys, audit logging
- **Rich Authentication**: NextAuth integration with multiple providers
- **Jackson SSO**: SAML enterprise SSO with dedicated tables

### Nextacular (Prisma)
- **Workspace-centric**: Uses "Workspace" concept (similar to Organization/Team)
- **Advanced Invitations**: Sophisticated member invitation system
- **Domain Management**: Custom domain support with verification
- **Simplified Roles**: Only OWNER/MEMBER roles

## Concept Mapping

| Concept | HospitalOS | BoxyHQ | Nextacular | Unified Approach |
|---------|------------|---------|------------|------------------|
| **Organization** | `organization` | `Team` | `Workspace` | Keep `organization` (Clerk-based) |
| **Membership** | Clerk-managed | `TeamMember` | `Member` | Add `teamMember` table |
| **Roles** | Clerk roles | `Role` enum (ADMIN/OWNER/MEMBER) | `TeamRole` enum (OWNER/MEMBER) | Use BoxyHQ's richer role system |
| **Invitations** | Clerk invitations | `Invitation` | `Member` (with status) | Hybrid approach with both |
| **User Management** | Clerk users | `User` (with NextAuth) | `User` (with NextAuth) | Keep Clerk, add extended profile |
| **API Access** | None | `ApiKey` | None | Add BoxyHQ's API key system |
| **SSO** | None | Jackson tables | None | Add Jackson SSO tables |
| **Billing** | Stripe native | `Subscription` | `CustomerPayment` | Keep current Stripe approach |

## Field-Level Mapping

### Organization/Team/Workspace Mapping

| Field | HospitalOS | BoxyHQ Team | Nextacular Workspace | Unified Field |
|-------|------------|-------------|----------------------|---------------|
| **ID** | `id` (text) | `id` (uuid) | `id` (cuid) | `id` (text, uuid) |
| **Name** | N/A | `name` | `name` | `name` |
| **Identifier** | N/A | `slug` (unique) | `slug` | `slug` (unique) |
| **Billing** | `stripeCustomerId` | `billingId` | N/A | Keep Stripe fields |
| **Domain** | N/A | `domain` (unique) | Custom `Domain` table | Add domain support |
| **Settings** | N/A | `defaultRole` | `inviteCode`, `workspaceCode` | Combine approaches |

### Member/User Mapping

| Field | HospitalOS | BoxyHQ | Nextacular | Unified Approach |
|-------|------------|---------|------------|------------------|
| **User ID** | Clerk `userId` | `userId` (uuid) | `userId` (cuid) | Keep Clerk `userId` |
| **Email** | Clerk email | `email` (unique) | `email` (unique) | Use Clerk email |
| **Role** | Clerk roles | `role` enum | `teamRole` enum | Add `teamMember` table with roles |
| **Status** | Clerk status | Active/Inactive | `status` enum | Add status tracking |
| **Timestamps** | N/A | `createdAt`, `updatedAt` | `joinedAt`, `invitedAt` | Add comprehensive timestamps |

### Invitation System Mapping

| Field | BoxyHQ Invitation | Nextacular Member | Unified Approach |
|-------|------------------|-------------------|------------------|
| **Target** | `email` (optional) | `email` (required) | Support both email and domain |
| **Role** | `role` enum | `teamRole` enum | Use BoxyHQ's role system |
| **Token** | `token` (unique) | N/A | Keep token-based system |
| **Expiration** | `expires` | N/A | Add expiration logic |
| **Status** | Implied | `status` enum | Add explicit status |
| **Domains** | `allowedDomains` array | N/A | Add domain-based invitations |
| **Email Flag** | `sentViaEmail` | N/A | Add email tracking |

## New Tables to Add

### 1. Team Member Table (Priority: High)
```typescript
export const teamMember = pgTable('team_members', {
  id: text('id').primaryKey().default(uuid()),
  organizationId: text('organization_id').notNull(), // Clerk org ID
  userId: text('user_id').notNull(), // Clerk user ID
  role: roleEnum('role').default('MEMBER'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### 2. Role System (Priority: High)
```typescript
export const roleEnum = pgEnum('role', ['OWNER', 'ADMIN', 'MEMBER']);
```

### 3. API Key Management (Priority: High)
```typescript
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
```

### 4. Enhanced Invitations (Priority: Medium)
```typescript
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

### 5. Jackson SSO Tables (Priority: Medium)
```typescript
export const jacksonStore = pgTable('jackson_store', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  iv: text('iv'),
  tag: text('tag'),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at'),
  namespace: text('namespace'),
});
```

### 6. Organization Settings (Priority: Low)
```typescript
export const organizationSettings = pgTable('organization_settings', {
  id: text('id').primaryKey().default(uuid()),
  organizationId: text('organization_id').notNull().unique(),
  workspaceCode: text('workspace_code').notNull().unique().default(uuid()),
  inviteCode: text('invite_code').notNull().unique().default(uuid()),
  allowDomainInvites: boolean('allow_domain_invites').default(false),
  allowedDomains: jsonb('allowed_domains').default([]),
  defaultRole: roleEnum('default_role').default('MEMBER'),
  requireApproval: boolean('require_approval').default(false),
});
```

## Integration Strategy

### Phase 1: Core Tables (Week 1)
1. **Role System**: Add role enum and team member table
2. **API Keys**: Add API key management tables
3. **Basic Invitations**: Add invitation system
4. **Jackson Tables**: Add SSO infrastructure tables

### Phase 2: Enhanced Features (Week 2)
1. **Organization Settings**: Add workspace-like features
2. **Domain Management**: Add custom domain support
3. **Advanced Invitations**: Add domain-based invitations
4. **Webhook Tables**: Add webhook infrastructure

### Phase 3: Optimization (Week 3)
1. **Indexes**: Add performance indexes
2. **Relationships**: Define proper foreign keys
3. **Constraints**: Add data validation constraints
4. **Audit Tables**: Add change tracking

## Key Differences and Decisions

### 1. Authentication Strategy
- **Keep Clerk**: Maintain Clerk for user management and basic auth
- **Add Jackson**: Integrate Jackson for enterprise SSO
- **Hybrid Approach**: Use Clerk for basic auth, Jackson for enterprise features

### 2. Organization vs Team vs Workspace
- **Preserve Organization**: Keep Clerk's organization concept
- **Map to Team**: BoxyHQ's team maps to Clerk organization
- **Map to Workspace**: Nextacular's workspace maps to Clerk organization

### 3. Role System
- **Use BoxyHQ Roles**: More granular than Nextacular
- **Extend for Hospitals**: Add medical roles (Doctor, Nurse, etc.)
- **Preserve Clerk Roles**: Keep for basic functionality

### 4. Invitation System
- **Hybrid Approach**: Combine BoxyHQ's flexibility with Nextacular's simplicity
- **Token-Based**: Use BoxyHQ's secure token system
- **Status Tracking**: Add Nextacular's status enum

### 5. Billing Integration
- **Keep Current**: HospitalOS Stripe integration is already robust
- **Don't Replace**: BoxyHQ and Nextacular billing is less sophisticated

## Hospital-Specific Adaptations

### Medical Roles
```typescript
export const medicalRoleEnum = pgEnum('medical_role', [
  'OWNER', // Hospital Administrator
  'ADMIN', // IT Administrator
  'DOCTOR', // Attending Physician
  'RESIDENT', // Resident Doctor
  'NURSE', // Registered Nurse
  'TECH', // Medical Technician
  'STAFF', // General Staff
  'MEMBER' // Basic Member
]);
```

### Department Mapping
```typescript
export const department = pgTable('departments', {
  id: text('id').primaryKey().default(uuid()),
  organizationId: text('organization_id').notNull(),
  name: text('name').notNull(), // ICU, Emergency, Surgery, etc.
  code: text('code').notNull(), // ICU, ER, OR, etc.
  parentId: text('parent_id'), // For hierarchical departments
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Staff Certification
```typescript
export const staffCertification = pgTable('staff_certifications', {
  id: text('id').primaryKey().default(uuid()),
  userId: text('user_id').notNull(),
  organizationId: text('organization_id').notNull(),
  certificationType: text('certification_type').notNull(),
  licenseNumber: text('license_number'),
  issuedBy: text('issued_by'),
  issuedAt: timestamp('issued_at'),
  expiresAt: timestamp('expires_at'),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Migration Strategy

### Step 1: Preparation
1. Backup current database
2. Test migration scripts in development
3. Validate data integrity

### Step 2: Core Schema Extension
1. Add role enum
2. Add team_members table
3. Migrate existing organization data
4. Add API key tables

### Step 3: Feature Integration
1. Add invitation tables
2. Add Jackson SSO tables
3. Add organization settings
4. Add indexes and constraints

### Step 4: Hospital Customization
1. Add medical roles
2. Add department structure
3. Add certification tracking
4. Add audit requirements

### Step 5: Testing and Validation
1. Test all CRUD operations
2. Validate foreign key relationships
3. Test performance with indexes
4. Verify data integrity

## Conclusion

The unified schema approach combines the best features from all three templates while preserving HospitalOS's Clerk-based architecture. The strategy prioritizes:

1. **Compatibility**: Maintains existing Clerk integration
2. **Enterprise Features**: Adds BoxyHQ's sophisticated enterprise capabilities
3. **Flexibility**: Incorporates Nextacular's workspace management concepts
4. **Hospital Focus**: Extends for healthcare-specific requirements
5. **Incremental Implementation**: Allows phased rollout with minimal risk

This approach ensures a robust, scalable foundation for the hospital management platform while leveraging proven patterns from successful SaaS templates.
