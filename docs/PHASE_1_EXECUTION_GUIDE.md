# Phase 1 Execution Guide

This guide provides step-by-step instructions for implementing and validating Phase 1 of the HospitalOS template integration.

## 📋 Pre-requisites

### Environment Setup
```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local

# 3. Configure database
# Ensure PostgreSQL is running and create database
createdb hospitalos_development
createdb hospitalos_test

# 4. Run initial migrations
npm run db:migrate
```

### Required Environment Variables
```env
# Database
DATABASE_URL="postgresql://localhost:5432/hospitalos_development"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Stripe (for existing functionality)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# SSO Configuration
JACKSON_API_KEY="your_jackson_api_key"
JACKSON_URL="http://localhost:5225"
SSO_ISSUER="https://your-hospital.app"
```

## 🚀 Phase 1 Implementation Steps

### Step 1: Database Schema Implementation

```bash
# 1. Verify schema changes in src/models/Schema.ts
# 2. Generate migration
npm run db:generate

# 3. Apply migration
npm run db:migrate

# 4. Verify tables were created
npm run db:studio
```

**Validation:**
```bash
# Run database tests
npm run test -- tests/database/migration.test.ts
```

### Step 2: SSO Integration Setup

#### 2.1 Install Jackson SSO
```bash
# Using Docker
docker run -d \
  -p 5225:5225 \
  -e DB_ENGINE=sql \
  -e DB_TYPE=postgres \
  -e DB_URL=$DATABASE_URL \
  -e JACKSON_API_KEY=$JACKSON_API_KEY \
  boxyhq/jackson

# Or using npm
npm install -g @boxyhq/jackson
```

#### 2.2 Implement SSO Components
```bash
# Use Claude Code to implement SSO components
claude-code --command "/project:setup-sso BoxyHQ Jackson SAML integration"
```

**Files to implement:**
- `/src/lib/sso/jackson.ts` - Jackson client initialization
- `/src/lib/sso/types.ts` - TypeScript types for SSO
- `/src/features/sso/components/*` - UI components
- `/src/app/api/auth/sso/*` - API routes
- `/src/app/api/organizations/[orgId]/sso/*` - Management endpoints

**Validation:**
```bash
# Run SSO component tests
npm run test -- tests/components/CreateSSOConnectionDialog.test.tsx
npm run test -- tests/components/EditSSOConnectionDialog.test.tsx
npm run test -- tests/components/SSOConnectionList.test.tsx
```

### Step 3: API Endpoints Implementation

#### 3.1 SSO Authentication Endpoints
```typescript
// /src/app/api/auth/sso/authorize/route.ts
// /src/app/api/auth/sso/callback/route.ts
// /src/app/api/auth/sso/metadata/route.ts
```

#### 3.2 SSO Management Endpoints
```typescript
// /src/app/api/organizations/[orgId]/sso/connections/route.ts
// /src/app/api/organizations/[orgId]/sso/connections/[connectionId]/route.ts
// /src/app/api/organizations/[orgId]/sso/metadata/route.ts
```

**Validation:**
```bash
# Run API tests
npm run test -- tests/api/sso-auth.test.ts
npm run test -- tests/api/sso-connections.test.ts
```

### Step 4: Clerk Integration Updates

#### 4.1 Update Clerk Configuration
```typescript
// Update user metadata structure
// Add SSO provider information
// Configure organization roles
```

#### 4.2 Implement SSO-Clerk Bridge
```typescript
// /src/lib/auth/sso-integration.ts
// Handle user creation from SSO
// Sync attributes
// Manage sessions
```

**Validation:**
```bash
# Run Clerk integration tests
npm run test -- tests/integration/clerk-sso.test.ts
```

### Step 5: UI Implementation

#### 5.1 Admin SSO Management Page
```bash
# Create SSO management interface
# Path: /src/app/[locale]/(auth)/admin/sso/page.tsx
```

#### 5.2 Update Login Flow
```bash
# Add SSO login option
# Path: /src/app/[locale]/(unauth)/sign-in/[[...sign-in]]/page.tsx
```

**Validation:**
```bash
# Run E2E tests
npm run test:e2e -- tests/e2e/sso-flows.spec.ts
```

## 🧪 Testing Strategy

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run specific test suites
npm run test -- tests/database/
npm run test -- tests/api/
npm run test -- tests/components/
```

### Integration Tests
```bash
# Run integration tests
npm run test -- tests/integration/

# Run with coverage
npm run test -- --coverage
```

### E2E Tests
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run in headed mode for debugging
npm run test:e2e -- --headed
```

### Hospital-Specific Scenarios
```bash
# Run medical workflow tests
npm run test -- tests/scenarios/hospital-workflows.test.ts
```

## 📊 Validation Checklist

### Database Layer ✓
- [ ] All Phase 1 tables created successfully
- [ ] Constraints and indexes properly applied
- [ ] Foreign key relationships working
- [ ] Migrations are reversible

### API Layer ✓
- [ ] SSO authorization endpoint functional
- [ ] SAML callback processing works
- [ ] Metadata endpoint returns valid XML
- [ ] Connection CRUD operations work
- [ ] Proper authentication and authorization

### UI Layer ✓
- [ ] SSO connection creation dialog works
- [ ] Connection list displays properly
- [ ] Edit functionality operational
- [ ] Delete with confirmation works
- [ ] Form validation functioning

### Integration Layer ✓
- [ ] Jackson SSO properly integrated
- [ ] Clerk user creation from SSO works
- [ ] Session management functional
- [ ] Attribute synchronization working
- [ ] Multi-tenant isolation verified

### Security ✓
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified
- [ ] XSS protection in place
- [ ] CSRF protection enabled
- [ ] Proper authorization checks

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
npm run db:studio
```

#### 2. Jackson SSO Not Working
```bash
# Check Jackson is running
curl http://localhost:5225/api/v1/health

# Verify API key
echo $JACKSON_API_KEY

# Check logs
docker logs <jackson-container-id>
```

#### 3. Test Failures
```bash
# Run tests in debug mode
npm run test -- --reporter=verbose

# Run single test with debugging
npm run test -- tests/api/sso-auth.test.ts --no-coverage
```

#### 4. TypeScript Errors
```bash
# Check types
npm run check-types

# Generate missing types
npm run db:generate
```

## 📈 Performance Benchmarks

### Expected Performance Metrics
- SSO login: < 2 seconds
- Connection list load: < 500ms
- Metadata generation: < 100ms
- Database queries: < 50ms

### Load Testing
```bash
# Use k6 for load testing
k6 run tests/load/sso-auth.js
```

## 🎯 Success Criteria

Phase 1 is considered complete when:

1. **All tests pass**
   - 100% of unit tests passing
   - 100% of integration tests passing
   - 100% of E2E tests passing
   - Code coverage > 80%

2. **Functionality verified**
   - Can create SSO connections
   - Can authenticate via SAML
   - Multi-tenant isolation works
   - Clerk integration functional

3. **Security validated**
   - No security vulnerabilities found
   - HIPAA compliance requirements met
   - Audit logging operational

4. **Performance acceptable**
   - All operations within benchmarks
   - No memory leaks detected
   - Database queries optimized

## 📝 Phase 1 Sign-off

Once all criteria are met:

1. Run full test suite: `npm run test && npm run test:e2e`
2. Generate test report: `npm run test -- --coverage --reporter=html`
3. Review security checklist
4. Document any known issues
5. Prepare for Phase 2

## 🔄 Continuous Integration

### GitHub Actions Workflow
```yaml
name: Phase 1 Validation
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run check-types
      - run: npm run test
      - run: npm run test:e2e
```

## 📚 Additional Resources

- [Jackson SSO Documentation](https://boxyhq.com/docs/jackson/overview)
- [Clerk SSO Integration Guide](https://clerk.com/docs/authentication/saml-sso)
- [Drizzle ORM Migration Guide](https://orm.drizzle.team/docs/migrations)
- [Playwright Testing Guide](https://playwright.dev/docs/intro)

---

**Note:** This guide should be updated as implementation progresses. Each completed step should be checked off and any issues documented for future reference.
