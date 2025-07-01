# Migration Log - Phase 1 Schema Extensions

## Migration: 0001_closed_shaman.sql

**Date:** 2025-06-29
**Status:** ✅ Generated, Ready for Application
**Migration File:** `migrations/0001_closed_shaman.sql`

## Changes Applied

### 1. Role System
- **Added:** `role` enum with values: `OWNER`, `ADMIN`, `MEMBER`
- **Purpose:** Unified role system supporting both basic and enterprise features

### 2. Team Members Table
- **Table:** `team_members`
- **Purpose:** Link users to organizations with specific roles
- **Fields:**
  - `id` (text, primary key, UUID)
  - `organization_id` (text, references Clerk organizations)
  - `user_id` (text, references Clerk users)
  - `role` (role enum, default: MEMBER)
  - `created_at`, `updated_at` (timestamps)
- **Indexes:**
  - Unique constraint on `(organization_id, user_id)`
  - Individual indexes on `user_id` and `organization_id`

### 3. API Keys Table
- **Table:** `api_keys`
- **Purpose:** Enterprise API key management system
- **Fields:**
  - `id` (text, primary key, UUID)
  - `name` (text, key identifier)
  - `organization_id` (text, org scoping)
  - `hashed_key` (text, never store plain text)
  - `expires_at` (timestamp, optional expiration)
  - `last_used_at` (timestamp, usage tracking)
  - `created_at`, `updated_at` (timestamps)
- **Indexes:**
  - Unique constraint on `hashed_key`
  - Index on `organization_id` for performance

### 4. Invitations Table
- **Table:** `invitations`
- **Purpose:** Enhanced invitation system with tokens and domain support
- **Fields:**
  - `id` (text, primary key, UUID)
  - `organization_id` (text, org scoping)
  - `email` (text, optional for domain-based invites)
  - `role` (role enum, default: MEMBER)
  - `token` (text, secure invitation token)
  - `expires` (timestamp, token expiration)
  - `invited_by` (text, user who sent invite)
  - `sent_via_email` (boolean, delivery tracking)
  - `allowed_domains` (jsonb, domain-based invitations)
  - `created_at`, `updated_at` (timestamps)
- **Indexes:**
  - Unique constraint on `token`
  - Unique constraint on `(organization_id, email)`
  - Individual indexes for performance

## Database Setup Instructions

### For Local Development

1. **Start PostgreSQL Database:**
   ```bash
   # Using Docker
   docker run --name hospitalos-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=hospitalos_dev -p 5432:5432 -d postgres:15

   # Or using local PostgreSQL
   createdb hospitalos_dev
   ```

2. **Update Environment Variables:**
   ```bash
   # In .env.local
   DATABASE_URL="postgresql://postgres:password@localhost:5432/hospitalos_dev"
   ```

3. **Apply Migration:**
   ```bash
   npm run db:migrate
   ```

4. **Verify with Drizzle Studio:**
   ```bash
   npm run db:studio
   ```

### For Production/Staging

1. **Set DATABASE_URL** in your deployment environment
2. **Run migration** as part of deployment process
3. **Verify tables** are created correctly

## Rollback Procedure

If rollback is needed, execute the following SQL:

```sql
-- Drop indexes first
DROP INDEX IF EXISTS "team_members_organization_id_idx";
DROP INDEX IF EXISTS "team_members_user_id_idx";
DROP INDEX IF EXISTS "unique_team_user_idx";
DROP INDEX IF EXISTS "invitations_organization_id_idx";
DROP INDEX IF EXISTS "invitations_email_idx";
DROP INDEX IF EXISTS "unique_team_email_idx";
DROP INDEX IF EXISTS "invitations_token_idx";
DROP INDEX IF EXISTS "api_keys_organization_id_idx";
DROP INDEX IF EXISTS "api_keys_hashed_key_idx";

-- Drop tables
DROP TABLE IF EXISTS "team_members";
DROP TABLE IF EXISTS "invitations";
DROP TABLE IF EXISTS "api_keys";

-- Drop enum
DROP TYPE IF EXISTS "public"."role";
```

## Validation Checklist

- [ ] All tables created successfully
- [ ] Indexes applied correctly
- [ ] Role enum values match expectations
- [ ] Unique constraints prevent duplicate data
- [ ] Foreign key relationships work with Clerk IDs
- [ ] Timestamps default to current time
- [ ] UUID generation works for primary keys

## Next Steps

1. **Phase 2 Schema Extensions:**
   - Jackson SSO tables
   - Webhook infrastructure
   - Organization settings

2. **API Implementation:**
   - Team member management endpoints
   - API key CRUD operations
   - Invitation system APIs

3. **UI Components:**
   - Team management interface
   - API key management dashboard
   - Invitation workflow

## Integration Notes

### Clerk Integration
- `organization_id` fields reference Clerk organization IDs
- `user_id` fields reference Clerk user IDs
- Role system extends Clerk's basic roles

### Security Considerations
- API keys stored as hashed values only
- Invitation tokens are cryptographically secure
- Organization-scoped access for all operations
- Proper indexing for performance and security

### Hospital-Specific Adaptations (Future)
- Role enum can be extended for medical roles
- Team members can represent hospital departments
- API keys can be scoped for medical device integrations
- Invitations can support medical licensing requirements

This migration establishes the foundation for enterprise-grade team management, API access control, and secure invitation systems while maintaining compatibility with the existing Clerk-based architecture.
