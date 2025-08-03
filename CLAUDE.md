# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run dev` - Start development server with Sentry Spotlight
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run clean` - Remove build artifacts

### Database
- `npm run db:generate` - Generate migration files after schema changes in `/src/models/Schema.ts`
- `npm run db:migrate` - Run migrations (requires DATABASE_URL env var)
- `npm run db:studio` - Open Drizzle Studio for database management

### Testing
- `npm run test` - Run unit tests with Vitest
- `npm run test -- --watch` - Run tests in watch mode
- `npm run test -- src/components/Button.test.tsx` - Run specific test file
- `npm run test:e2e` - Run Playwright E2E tests (run `npx playwright install` first)
- `npm run test:e2e -- --headed` - Run E2E tests with browser UI
- `npm run test-storybook:ci` - Run Storybook visual tests in CI

### Hospital-Specific Testing Scripts
- `node scripts/validate-phase1.js` - Check Phase 1 implementation status
- `./scripts/run-comprehensive-tests.sh` - Run all test suites
- `./scripts/setup-test-env.sh` - Setup test environment
- `node scripts/test-sso-ui.js` - Test SSO UI functionality

### Code Quality
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run check-types` - TypeScript type checking
- `npm run commit` - Use Commitizen for conventional commits

### Storybook
- `npm run storybook` - Start Storybook dev server (port 6006)
- `npm run storybook:build` - Build static Storybook
- `npm run serve-storybook` - Serve built Storybook
- `npm run build-stats` - Analyze bundle sizes

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **Database**: Drizzle ORM (PostgreSQL/SQLite/MySQL)
- **Auth**: Clerk (passwordless, MFA, social auth, multi-tenancy) + Jackson SAML SSO
- **Payments**: Stripe subscriptions
- **I18n**: next-intl with Crowdin
- **Testing**: Vitest (unit), Playwright (E2E)
- **Monitoring**: Sentry, Pino.js logging, Checkly uptime

### Project Structure
```
src/
├── app/                    # Next.js App Router pages with i18n
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API endpoints
│   └── dashboard/         # Dashboard routes
├── components/            # Reusable UI components
├── features/             # Feature-specific components
│   ├── auth/            # Authentication flows
│   ├── billing/         # Stripe subscription management
│   ├── sso/             # SSO management components
│   └── landing/         # Landing page components
├── templates/           # Page templates
├── models/              # Database models
│   └── Schema.ts       # Drizzle ORM schema definitions
├── libs/               # Third-party integrations
│   ├── DB.ts          # Database connection
│   ├── Env.ts         # Type-safe env vars
│   └── Stripe.ts      # Stripe configuration
└── utils/
    └── AppConfig.ts   # App configuration (pricing, locales)
```

### Hospital-Specific Features

#### SSO Management
- **UI Access**: http://localhost:3002/dashboard/sso-management
- **Features**: Create/Delete SAML connections, Department-based access, Role mapping
- **Roles**: Doctor, Nurse, Technician, Administrator
- **Department Management**: Organization-based departments

#### Phase Status
- **Phase 1 (82% Complete)**: SSO Foundation & UI
- **Phase 2 (In Progress)**: Backend Integration & Advanced Features

## Key Patterns

### Database Schema Modifications
1. Edit `/src/models/Schema.ts`
2. Run `npm run db:generate` to create migration
3. Migrations auto-apply on next DB interaction

### Environment Variables
- Development: `.env.local` (gitignored)
- Type-safe access via `src/libs/Env.ts`
- Required: DATABASE_URL, CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- Hospital: HOSPITAL_NAME, HOSPITAL_TYPE, HIPAA_COMPLIANCE_MODE
- SSO: JACKSON_API_KEY, JACKSON_URL

### Multi-tenancy
- Organizations as primary tenant model
- Users belong to organizations via `teamMember` table
- Check organization access with Clerk's `auth().orgId`
- Organization-scoped queries filter by `organizationId`

### Form Handling
- Use React Hook Form with Zod validation
- Examples in `src/features/auth/` and `src/features/sso/`

### Testing Strategy
- Unit tests: Component logic with Vitest
- Integration tests: API endpoints, SSO flows
- E2E tests: Critical user flows (auth, hospital workflows)
- Coverage threshold: 80% for all metrics

## Best Practices

### Code Style
- Use ES modules (import/export) syntax
- Destructure imports when possible
- Follow existing component patterns
- Use TypeScript strict mode

### Workflow Guidelines
- Run typecheck and lint after code changes
- Test critical flows with E2E tests
- Use React Hook Form with Zod for forms
- Check organization access for multi-tenant features

### Security & Performance
- Parameterized queries via Drizzle ORM
- Runtime env validation via `src/libs/Env.ts`
- Dynamic imports for code splitting
- Image optimization with next/image

## Template Integration

### Available Commands
- `/project:analyze-schemas` - Compare database schemas
- `/project:setup-sso` - Implement SSO/SAML
- `/project:setup-api-keys` - Build API key management
- `/project:setup-webhooks` - Create webhook infrastructure
- `/project:enhance-team-management` - Advanced team features
- `/project:setup-audit-logging` - Audit system with compliance
- `/project:adapt-for-hospitals` - Hospital-specific adaptations

### Reference Templates
- **BoxyHQ**: `/template-references/boxyhq/` - SSO, API keys, webhooks
- **Nextacular**: `/template-references/nextacular/` - Team management
- **Supabase**: `/template-references/supabase-template/` - Auth patterns

## Hospital Management System Gap Closure Context

### Current Status (v6.0.0)
- **Schema**: 98% complete with 95+ roles, comprehensive tables
- **Implementation**: 20% complete (only patients/appointments APIs functional)
- **Critical Gap**: 80% of schema features have no implementation

### Development Plan Documents
- `HMS_GAP_CLOSURE_DEVELOPMENT_PLAN.md` - Comprehensive implementation strategy
- `HMS_IMPLEMENTATION_TRACKER.md` - Real-time progress tracking
- `COMPREHENSIVE_SCHEMA_ANALYSIS_REPORT.md` - Detailed gap analysis

### Implementation Standards

#### API Development Workflow
1. **Verify Alignment**: `npm run verify:alignment [tableName]`
2. **Use Templates**: Copy from `scripts/api-templates/`
3. **Follow Patterns**: Reference `/api/patients/` implementation
4. **Test Coverage**: Minimum 80% required

#### Type Alignment Protocol
- Database Schema → Drizzle ORM → Zod Validation → TypeScript Types
- All layers MUST align before implementation
- Sensitive fields (passwordHash, encrypted) excluded from APIs

#### Key Commands
```bash
# Verify type alignment
npm run verify:alignment consultations

# Check types during development
npm run check-types

# Run tests with coverage
npm run test -- --coverage
```

### Active Development Focus
**Phase 1 Priority (Weeks 1-2)**:
1. Consultations API (with vitals, diagnosis)
2. Prescriptions API (with items, dispensing)
3. Queue Management API (token generation)

**Phase 2 (Weeks 3-4)**: Pharmacy System
**Phase 3 (Weeks 5-6)**: Departments & Scheduling
**Phase 4 (Weeks 7-8)**: Billing & Government Schemes

## Code Patterns

### Standard API Response
```typescript
// Success
{ data: T, pagination?: {...} }

// Error
{ error: { code: string, message: string, details?: any } }
```

### Multi-tenant Security
- Always filter by `clinicId` (orgId)
- Use `validateOrganizationAccess()`
- Implement audit logging for all operations

### Performance Targets
- API Response: <200ms
- Database Queries: Use indexes
- Batch Operations: When possible

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
