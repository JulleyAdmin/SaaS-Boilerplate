# HospitalOS Developer Workflow Guide

## Quick Start with Claude Code

### Daily Development Workflow

```bash
# 1. Start your development session
cd /Users/girishpastula/Documents/Projects/hospitalos
claude

# 2. Check current project status
/help
# Review available slash commands and current todos

# 3. Choose your development focus
/project:analyze-schemas     # If working on database
/project:setup-sso          # If implementing SSO
/project:setup-api-keys     # If building API management
/project:setup-webhooks     # If adding webhook system
/project:enhance-team-management # If improving team features
/project:setup-audit-logging    # If adding compliance
/project:adapt-for-hospitals    # If customizing for healthcare
```

## Template Integration Execution

### Phase 1: Foundation & SSO (Week 1)

#### Day 1-2: Database Schema Extension
```bash
# Morning: Schema Analysis
claude "/project:analyze-schemas template-references/boxyhq/prisma/schema.prisma template-references/nextacular/prisma/schema.prisma"

# Review the analysis and proceed with schema updates
claude "Based on the schema analysis, update src/models/Schema.ts with the new tables. Follow these priorities:
1. Add core team/role tables first
2. Add API key tables second
3. Add SSO Jackson tables third
4. Generate migrations after each group"

# Verify each step
npm run db:generate
npm run check-types
npm run db:migrate
```

#### Day 3-4: SSO Implementation
```bash
# Start SSO implementation
claude "/project:setup-sso BoxyHQ Jackson SAML integration"

# Follow up with specific testing
claude "Test the SSO implementation thoroughly:
1. Start development server
2. Navigate to SSO settings
3. Test metadata endpoint
4. Verify UI components render
5. Check error handling"
```

#### Day 5: API Key Management
```bash
# Implement API key system
claude "/project:setup-api-keys based on BoxyHQ with enhanced security"

# Security validation
claude "Perform comprehensive security testing of API keys:
1. Verify key hashing implementation
2. Test organization access controls
3. Validate expiration logic
4. Check audit logging"
```

### Phase 2: Advanced Features (Week 2)

#### Day 1-2: Webhook Infrastructure
```bash
# Set up webhook system
claude "/project:setup-webhooks with Svix integration for hospital events"

# Test webhook delivery
claude "Create comprehensive webhook testing:
1. Set up test endpoints
2. Trigger sample events
3. Verify delivery tracking
4. Test retry mechanisms"
```

#### Day 3-4: Enhanced Team Management
```bash
# Enhance team features
claude "/project:enhance-team-management with focus on hospital departments and roles"

# Integration testing
claude "Test team management enhancements:
1. Create hospital departments
2. Assign medical staff roles
3. Test invitation workflows
4. Verify access controls"
```

### Phase 3: Audit & Security (Week 3)

#### Audit System Implementation
```bash
# Implement audit logging
claude "/project:setup-audit-logging with HIPAA compliance focus"

# Compliance verification
claude "Verify audit system compliance:
1. Test all audit event types
2. Validate data integrity
3. Test report generation
4. Check retention policies"
```

### Phase 4: Hospital Adaptation (Week 4)

#### Domain-Specific Customization
```bash
# Adapt for hospital use
claude "/project:adapt-for-hospitals with focus on [specific hospital type/requirements]"

# End-to-end testing
claude "Perform comprehensive hospital workflow testing:
1. Test patient admission flows
2. Verify staff management
3. Test emergency procedures
4. Validate compliance reports"
```

## Development Best Practices

### 1. Always Start with Planning
```bash
# Before coding, always plan
claude "Think carefully about implementing [feature]. Create a detailed plan including:
1. Database schema changes needed
2. API routes to create/modify
3. UI components required
4. Testing strategy
5. Security considerations
Don't start coding until the plan is approved."
```

### 2. Use Test-Driven Development
```bash
# Write tests first
claude "Before implementing [feature], write comprehensive tests:
1. Unit tests for core logic
2. Integration tests for API routes
3. Component tests for UI
4. E2E tests for user flows
Make sure tests fail initially, then implement to make them pass."
```

### 3. Incremental Implementation
```bash
# Build incrementally
claude "Implement [feature] incrementally:
1. Start with core functionality only
2. Add UI after core logic works
3. Add enhanced features last
4. Test thoroughly at each step
5. Commit working increments"
```

### 4. Security-First Approach
```bash
# Always prioritize security
claude "Implement [feature] with security as the top priority:
1. Add input validation first
2. Implement access controls
3. Add audit logging
4. Test for vulnerabilities
5. Follow HIPAA requirements"
```

## Error Handling and Debugging

### Common Issues and Solutions

#### Database Migration Issues
```bash
# If migrations fail
claude "/project:debug-build with focus on database issues"

# Manual intervention if needed
git checkout HEAD~1 -- src/models/Schema.ts
npm run db:generate
npm run db:migrate
```

#### Authentication Integration Problems
```bash
# SSO troubleshooting
claude "Debug SSO integration by:
1. Checking environment variables
2. Verifying Clerk configuration
3. Testing Jackson setup
4. Validating callback URLs
5. Checking SAML metadata"
```

#### Component Integration Issues
```bash
# Fix component problems
claude "/project:migrate-component [component-path] to resolve integration issues"
```

### Performance Optimization
```bash
# After major changes, optimize
claude "Optimize the current implementation:
1. Run performance analysis
2. Check bundle sizes with npm run build-stats
3. Identify slow database queries
4. Optimize component rendering
5. Add proper loading states"
```

## Quality Assurance Workflow

### Before Each Commit
```bash
# Quality checks
npm run check-types
npm run lint
npm run test
npm run build

# If any fail, fix before committing
claude "Fix the failing [check-types/lint/test/build] issues:
1. Analyze the error output
2. Identify root causes
3. Fix systematically
4. Re-run checks
5. Only commit when all pass"
```

### Code Review Preparation
```bash
# Prepare for review
claude "Prepare the current changes for code review:
1. Create descriptive commit messages
2. Update documentation as needed
3. Add comments for complex logic
4. Ensure tests cover new functionality
5. Verify security considerations"
```

## Collaboration Workflow

### Working with Team Members
```bash
# Before starting shared work
claude "Coordinate with team on [feature]:
1. Check for conflicts with ongoing work
2. Plan integration points
3. Define interfaces and contracts
4. Set up shared testing strategies
5. Document dependencies"
```

### Git Workflow with Claude Code
```bash
# Creating feature branches
git checkout -b feature/sso-integration
claude # Start Claude Code in the feature branch

# Regular commits during development
claude "commit the current SSO progress with descriptive message"

# Before merging
claude "Prepare feature branch for merge:
1. Rebase on latest main
2. Run full test suite
3. Update documentation
4. Create pull request"
```

## Monitoring and Maintenance

### Regular Health Checks
```bash
# Weekly health check
claude "Perform comprehensive system health check:
1. Verify all integrations working
2. Check database performance
3. Review error logs
4. Test critical user flows
5. Validate security measures"
```

### Performance Monitoring
```bash
# Monitor after deployments
claude "Set up monitoring for the new features:
1. Add performance metrics
2. Set up error tracking
3. Monitor user adoption
4. Track system load
5. Set up alerts for issues"
```

## Emergency Procedures

### Production Issues
```bash
# Emergency response
claude "Emergency: [describe issue]. Immediate response needed:
1. Assess impact and severity
2. Identify root cause quickly
3. Implement immediate fix or rollback
4. Communicate with stakeholders
5. Plan permanent solution"
```

### Rollback Procedures
```bash
# If deployment fails
claude "Perform safe rollback:
1. Stop current deployment
2. Revert to last known good state
3. Verify system stability
4. Analyze failure cause
5. Plan fixed deployment"
```

This workflow guide ensures systematic, secure, and efficient development using Claude Code while maintaining code quality and hospital compliance requirements.
