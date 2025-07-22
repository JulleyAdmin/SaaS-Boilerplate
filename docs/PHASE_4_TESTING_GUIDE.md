# 🧪 Phase 4 Testing Guide

## Overview

This guide explains how to test the API Key Management and MFA features with real database integration.

---

## 🚀 Quick Start

### 1. Find Your Organization ID

Navigate to: `http://localhost:3002/en/dashboard/dev-info`

This page shows:
- Your Organization ID (needed for seeding data)
- User information
- MFA status
- Quick links to features

### 2. Seed Test Data

```bash
# Make the script executable (first time only)
chmod +x scripts/seed-db.sh

# Run with your organization ID
./scripts/seed-db.sh org_YOUR_ORG_ID_HERE
```

Example:
```bash
./scripts/seed-db.sh org_2abcdef123456789
```

### 3. View Seeded Data

After seeding, navigate to:
- **API Keys**: http://localhost:3002/en/dashboard/api-keys
- **Security/MFA**: http://localhost:3002/en/dashboard/security/mfa
- **Test Features**: http://localhost:3002/en/dashboard/test-features

---

## 📊 What Gets Seeded

### API Keys (6 test keys)
- Production API - Main Service (expires Dec 31, 2025)
- Development API - Testing (never expires)
- Mobile App Integration (expires Jun 30, 2025)
- CI/CD Pipeline (never used)
- Analytics Service (expires Sep 30, 2025)
- Webhook Handler (expires Jan 31, 2026)

### Audit Logs (5 test events)
- API key creation
- API key deletion
- MFA enablement
- Failed MFA disable attempt
- Recent login

### Security Events (4 test events)
- Failed login attempts
- MFA bypass attempt
- API rate limit exceeded
- Account locked

---

## 🧪 Running Tests

### Unit Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test tests/integration/api-keys.test.ts
npm test tests/integration/mfa.test.ts
```

### Manual Testing Checklist

#### API Keys
- [ ] View list of seeded API keys
- [ ] Create a new API key
- [ ] Copy the generated key (shown only once!)
- [ ] Delete an API key
- [ ] Verify deleted key is removed from list

#### MFA
- [ ] Check current MFA status
- [ ] Enable two-factor authentication
- [ ] Scan QR code with authenticator app
- [ ] Enter verification code
- [ ] Save backup codes
- [ ] View updated MFA status

---

## 🔍 Database Queries

### Check API Keys
```sql
-- Connect to your database
SELECT id, name, organization_id, created_at, expires_at, last_used_at 
FROM api_keys 
WHERE organization_id = 'your_org_id'
ORDER BY created_at DESC;
```

### Check Audit Logs
```sql
SELECT action, actor_name, resource_name, created_at 
FROM audit_logs 
WHERE organization_id = 'your_org_id'
ORDER BY created_at DESC
LIMIT 10;
```

### Check Security Events
```sql
SELECT event_type, severity, description, created_at 
FROM security_events 
WHERE organization_id = 'your_org_id'
ORDER BY created_at DESC;
```

---

## 🛠️ Troubleshooting

### "Organization not found" error
1. Make sure you're signed in
2. Create or join an organization
3. Get the correct org ID from `/dashboard/dev-info`

### Database connection issues
1. Check DATABASE_URL in `.env.local`
2. Ensure PostgreSQL is running
3. Run migrations: `npm run db:migrate`

### Test data not showing
1. Verify the organization ID is correct
2. Check browser console for errors
3. Refresh the page
4. Check database directly with SQL queries above

---

## 🎯 Test Scenarios

### Scenario 1: API Key Lifecycle
1. View existing API keys
2. Create "Test Integration Key"
3. Copy the key
4. Note the key format: `sk_test_[48 hex chars]`
5. Delete the key
6. Confirm deletion

### Scenario 2: MFA Setup Flow
1. Start with MFA disabled
2. Click "Enable Two-Factor Authentication"
3. Choose TOTP method
4. Scan QR code
5. Enter 6-digit code
6. Save backup codes
7. Verify MFA is now enabled

### Scenario 3: Security Validation
1. Try to access API keys from different org (should fail)
2. Test API key with wrong format (should reject)
3. View audit logs for all actions

---

## 📝 Notes

- API keys are hashed with SHA-256 before storage
- Plain keys are shown only once during creation
- MFA is handled by Clerk's secure infrastructure
- All actions are logged for audit compliance
- Test data uses realistic timestamps and patterns

---

## 🚀 Next Steps

After testing these features:
1. Proceed with Team Management integration
2. Add webhook management
3. Implement hospital-specific adaptations

Happy testing! 🎉