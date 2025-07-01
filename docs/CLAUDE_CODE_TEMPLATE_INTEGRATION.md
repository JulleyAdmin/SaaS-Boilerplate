# Claude Code Template Integration Guide

## Overview

This guide provides a systematic approach to executing the HospitalOS template integration plan using Claude Code CLI, following best practices for agentic development.

## Prerequisites

1. **Claude Code Setup**
   ```bash
   # Ensure Claude Code is installed and configured
   claude --version

   # Navigate to project root
   cd /Users/girishpastula/Documents/Projects/hospitalos

   # Verify project configuration
   cat CLAUDE.md
   ```

2. **Environment Preparation**
   ```bash
   # Install dependencies if needed
   npm install

   # Verify database connection
   npm run db:studio

   # Check current schema
   npm run check-types
   ```

## Phase-by-Phase Execution

### Phase 1: Foundation & SSO (Week 1)

#### Day 1-2: Database Schema Extension

**Step 1: Analyze Reference Schemas**
```bash
claude "/project:analyze-schemas template-references/boxyhq/prisma/schema.prisma template-references/nextacular/prisma/schema.prisma"
```

**Step 2: Schema Mapping and Design**
```bash
claude "Think carefully about the schema mapping between BoxyHQ, Nextacular, and our current Drizzle schema. Create a unified design that:
1. Maps overlapping concepts (Team vs Organization)
2. Preserves existing functionality
3. Adds new features incrementally
4. Follows our TypeScript/Drizzle patterns

Create SCHEMA_MAPPING.md with field mappings and update src/models/Schema.ts with new tables."
```

**Step 3: Generate and Test Migrations**
```bash
# After schema changes
claude "Run database migration commands:
1. npm run db:generate
2. npm run db:migrate
3. npm run db:studio
4. Verify all tables created correctly"
```

**Verification Commands:**
```bash
npm run check-types
npm run lint
npm run test
```

#### Day 3-4: SSO Implementation

**Step 1: Jackson Integration Setup**
```bash
claude "/project:setup-sso BoxyHQ Jackson SAML integration"
```

**Step 2: Create SSO Infrastructure**
```bash
claude "Implement complete SSO system based on template-references/boxyhq/:
1. Copy and adapt lib/jackson.ts to src/lib/sso/jackson.ts
2. Create API routes in src/app/api/auth/sso/
3. Build UI components in src/features/sso/
4. Integrate with existing Clerk auth
5. Follow our Shadcn UI patterns
6. Add proper TypeScript types
7. Include error handling and security measures"
```

**Step 3: Integration Testing**
```bash
claude "Test SSO integration:
1. npm run dev
2. Navigate to SSO settings
3. Verify API endpoints respond
4. Test SAML metadata generation
5. Check component rendering
6. Validate Clerk integration"
```

#### Day 5: API Key Management

**Step 1: API Key System Setup**
```bash
claude "/project:setup-api-keys based on BoxyHQ implementation"
```

**Step 2: Complete Implementation**
```bash
claude "Build comprehensive API key management:
1. Create hooks in src/hooks/useAPIKeys.ts
2. Build API routes for CRUD operations
3. Implement UI components with proper security
4. Add key generation, hashing, expiration
5. Include usage tracking
6. Follow our existing patterns for forms and validation"
```

**Step 3: Security Testing**
```bash
claude "Test API key security:
1. Verify proper hashing
2. Test organization-level access control
3. Validate expiration logic
4. Test key revocation
5. Check API endpoint security"
```

### Phase 2: Advanced Features (Week 2)

#### Day 1-2: Webhook Infrastructure

**Step 1: Svix Integration**
```bash
claude "/project:setup-webhooks with Svix integration from BoxyHQ"
```

**Step 2: Complete Webhook System**
```bash
claude "Implement full webhook infrastructure:
1. Install and configure Svix
2. Create webhook schema in src/models/Schema.ts
3. Build API routes for webhook management
4. Create UI for webhook configuration
5. Implement delivery tracking
6. Add event type management
7. Include retry logic and monitoring"
```

**Step 3: Webhook Testing**
```bash
claude "Test webhook system thoroughly:
1. Create test webhooks
2. Trigger test events
3. Verify delivery tracking
4. Test retry mechanisms
5. Validate UI functionality"
```

#### Day 3-4: Enhanced Team Management

**Step 1: Advanced Team Features**
```bash
claude "/project:enhance-team-management based on Nextacular patterns"
```

**Step 2: Team Management Implementation**
```bash
claude "Build advanced team management:
1. Extend organization model with settings
2. Add enhanced invitation system
3. Implement role-based permissions
4. Create bulk invitation features
5. Add domain-based auto-join
6. Build team analytics
7. Follow multi-tenant security patterns"
```

### Phase 3: Audit & Security (Week 3)

#### Audit Logging Implementation

**Step 1: Audit System Setup**
```bash
claude "/project:setup-audit-logging using Retraced from BoxyHQ"
```

**Step 2: Complete Audit Implementation**
```bash
claude "Implement comprehensive audit logging:
1. Install and configure Retraced
2. Create audit event schema
3. Add audit middleware to API routes
4. Build audit log viewer UI
5. Implement audit search and filtering
6. Add export capabilities
7. Include compliance reporting"
```

### Phase 4: Hospital-Specific Adaptation (Week 4)

#### Hospital Domain Integration

**Step 1: Domain Analysis**
```bash
claude "Think hard about hospital-specific requirements and adapt the integrated features:
1. Analyze current hospital domain models
2. Map SSO to hospital staff roles
3. Adapt team management for departments
4. Configure audit logging for compliance
5. Design hospital-specific dashboards"
```

**Step 2: Hospital Feature Implementation**
```bash
claude "/project:adapt-for-hospitals with specific requirements"
```

## Custom Slash Commands for Template Integration

The following custom commands are available for this project:

### Phase-Specific Commands

- `/project:analyze-schemas` - Analyze and compare database schemas
- `/project:setup-sso` - Implement SSO integration
- `/project:setup-api-keys` - Build API key management
- `/project:setup-webhooks` - Create webhook infrastructure
- `/project:enhance-team-management` - Advanced team features
- `/project:setup-audit-logging` - Implement audit system
- `/project:adapt-for-hospitals` - Hospital-specific adaptations

### Development Commands

- `/project:fix-github-issue` - Automated issue resolution
- `/project:migrate-component` - Modernize components
- `/project:add-feature` - Structured feature development
- `/project:debug-build` - Build troubleshooting

## Best Practices for Template Integration

### 1. Incremental Development
```bash
# Always work in phases
claude "Work on Phase 1 Day 1 tasks only. Do not proceed to Day 2 until Day 1 is complete and tested."
```

### 2. Copy-Adapt Pattern
```bash
# Copy proven code, then adapt
claude "Copy the exact implementation from template-references/boxyhq/lib/jackson.ts and adapt it to our Next.js App Router and TypeScript patterns."
```

### 3. Test-Driven Verification
```bash
# Test each component thoroughly
claude "After implementing SSO, create comprehensive tests:
1. Unit tests for Jackson integration
2. API endpoint tests
3. Component rendering tests
4. Integration tests with Clerk
5. E2E tests for SSO flow"
```

### 4. Documentation-First Approach
```bash
# Document as you build
claude "Create comprehensive documentation for SSO setup including:
1. Administrator configuration guide
2. Developer integration guide
3. Troubleshooting steps
4. Security considerations"
```

### 5. Security-First Implementation
```bash
# Always prioritize security
claude "Implement all security measures from the start:
1. Proper input validation
2. Organization-level access control
3. Secure token handling
4. Audit logging for sensitive operations"
```

## Monitoring and Verification

### Continuous Verification Commands
```bash
# Run after each major change
npm run check-types
npm run lint
npm run test
npm run build

# Database verification
npm run db:studio

# Development server testing
npm run dev
```

### Integration Testing Workflow
```bash
# Test complete flows
claude "Test the full user journey:
1. Organization setup
2. SSO configuration
3. Team member invitation
4. API key creation
5. Webhook configuration
6. Audit log verification"
```

## Troubleshooting Common Issues

### Schema Migration Issues
```bash
claude "/project:debug-build and focus on database schema issues"
```

### Authentication Integration Problems
```bash
claude "Debug Clerk + Jackson SSO integration issues by:
1. Checking environment variables
2. Verifying callback URLs
3. Testing SAML metadata
4. Validating session handling"
```

### Component Integration Issues
```bash
claude "/project:migrate-component [component-path] to fix integration issues"
```

## Success Metrics

After each phase, verify these metrics:

1. **Phase 1**: SSO working, API keys functional, no TypeScript errors
2. **Phase 2**: Webhooks delivering, team management enhanced, audit trails active
3. **Phase 3**: Complete audit logging, security validated, compliance ready
4. **Phase 4**: Hospital-specific features integrated, system ready for production

## Emergency Procedures

### Rollback Commands
```bash
# If a phase fails, rollback safely
git checkout HEAD~1 -- src/models/Schema.ts
npm run db:generate
npm run db:migrate
```

### Recovery Workflow
```bash
claude "Emergency recovery - analyze the current state and provide step-by-step recovery:
1. Check git status
2. Identify broken components
3. Restore from last working state
4. Re-apply changes incrementally"
```

This guide ensures systematic, secure, and verifiable execution of the template integration plan using Claude Code's agentic capabilities while maintaining code quality and project integrity.
