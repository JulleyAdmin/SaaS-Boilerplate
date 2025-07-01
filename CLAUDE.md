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

### Phase 1 - COMPLETED ✅
- **Status**: 100% Complete - SSO Management UI fully functional
- **UI Access**: http://localhost:3002/dashboard/sso-management
- **Features**: Create/Delete SSO connections, Form validation, Hospital context
- `node scripts/validate-phase1.js` - Check Phase 1 implementation status
- `npm run test -- tests/database/` - Run database migration tests
- `npm run test -- tests/api/` - Run SSO API tests
- `npm run test -- tests/components/` - Run SSO UI component tests

### Phase 2 - IN PROGRESS 🚧
- **Goal**: Backend Integration & Advanced Features
- **Focus**: Jackson SSO service integration, Edit functionality, Department management

### Code Quality
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run check-types` - TypeScript type checking
- `npm run commit` - Use Commitizen for conventional commits

### Storybook
- `npm run storybook` - Start Storybook dev server (port 6006)
- `npm run build-stats` - Analyze bundle sizes

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **Database**: Drizzle ORM (PostgreSQL/SQLite/MySQL)
- **Auth**: Clerk (passwordless, MFA, social auth, multi-tenancy)
- **Payments**: Stripe subscriptions
- **I18n**: next-intl with Crowdin
- **Testing**: Vitest (unit), Playwright (E2E)
- **Monitoring**: Sentry, Pino.js logging, Checkly uptime

### Project Structure
```
src/
├── app/                    # Next.js App Router pages with i18n
│   └── [locale]/          # Internationalized routes
├── components/            # Reusable UI components
├── features/             # Feature-specific components
│   ├── auth/            # Authentication flows
│   ├── billing/         # Stripe subscription management
│   ├── dashboard/       # User/org dashboards
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

### Key Patterns

#### Database Schema Modifications
When modifying database schema:
1. Edit `/src/models/Schema.ts`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply changes

#### Environment Variables
- Development: `.env.local` (gitignored)
- Production: Set in deployment platform
- Type-safe access via `src/libs/Env.ts`

#### Multi-tenancy
- Users belong to organizations via `organizationUsers` table
- Check organization access with Clerk's `auth().orgId`
- Organization-scoped queries filter by `organizationId`

#### Internationalization
- Locales defined in `src/utils/AppConfig.ts`
- Translations in `src/locales/[locale].json`
- Use `useTranslations()` hook from next-intl

#### Form Handling
- Use React Hook Form with Zod validation
- See examples in `src/features/auth/` and `src/features/billing/`

#### API Routes
- Located in `src/app/api/`
- Stripe webhook: `/api/stripe/webhook`
- Use Clerk's `auth()` for authentication

#### Testing Strategy
- Unit tests: Component logic and utilities
- E2E tests: Critical user flows (auth, billing)
- Visual regression: Percy integration in CI

### Security Considerations
- All database queries are parameterized (Drizzle ORM)
- Environment variables validated at runtime
- Clerk handles auth security (JWT, session management)
- Stripe webhook signature verification implemented
- CSRF protection via Next.js built-in features

### Performance Optimizations
- Static pages pre-rendered at build time
- Dynamic imports for code splitting
- Image optimization with next/image
- Database connection pooling
- Edge runtime compatible where possible

## Best Practices

### Code Style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')
- Follow existing component patterns in `src/features/` and `src/components/`
- Use TypeScript strict mode - all types must be properly defined
- Never add comments unless explicitly requested

### Workflow Guidelines
- Run typecheck and lint commands after making code changes
- Prefer running single tests over full test suite for performance
- Use React Hook Form with Zod validation for forms
- Always check organization access with Clerk's `auth().orgId` for multi-tenant features
- Test critical user flows (auth, billing) with E2E tests

### Development Process
- Research and plan before coding (use "think" for extended thinking)
- Write tests first when functionality is easily verifiable
- Iterate with visual feedback using screenshots for UI work
- Use git worktrees for parallel development tasks
- Commit frequently with descriptive messages

### Security & Performance
- All database queries must use Drizzle ORM parameterization
- Validate environment variables at runtime via `src/libs/Env.ts`
- Use dynamic imports for code splitting
- Optimize images with next/image component
- Never commit secrets or keys to repository

## Template Integration Project

### Available Slash Commands
- `/project:analyze-schemas [files]` - Compare and analyze database schemas
- `/project:setup-sso [type]` - Implement SSO/SAML integration
- `/project:setup-api-keys [template]` - Build API key management system
- `/project:setup-webhooks [integration]` - Create webhook infrastructure
- `/project:enhance-team-management [focus]` - Advanced team features
- `/project:setup-audit-logging [compliance]` - Audit system with compliance
- `/project:adapt-for-hospitals [requirements]` - Hospital-specific adaptations

### Template Integration Guidelines
- **Copy-Adapt Pattern**: Copy proven implementations, then adapt to our patterns
- **Incremental Phases**: Complete each phase fully before proceeding
- **Security First**: Implement security measures from the start
- **Hospital Focus**: Always consider healthcare compliance (HIPAA, etc.)
- **Test Each Step**: Verify functionality before moving forward

### Reference Templates
- **BoxyHQ**: `/template-references/boxyhq/` - SSO, API keys, webhooks, audit
- **Nextacular**: `/template-references/nextacular/` - Team management, workspaces
- **Supabase**: `/template-references/supabase-template/` - Auth patterns, UI components

### Integration Documentation
- **Execution Guide**: `docs/CLAUDE_CODE_TEMPLATE_INTEGRATION.md`
- **Workflow Guide**: `docs/DEVELOPER_WORKFLOW_GUIDE.md`
- **Original Plan**: `docs/template-integration-detailed-plan.md`

## Phase 1 Status: 82% Complete ✅

### ✅ Completed
- Database schema with hospital roles and SSO support
- Comprehensive test suite (600+ test cases)
- SSO integration infrastructure (Jackson SAML/OIDC)
- API endpoints for authentication and management
- UI components for SSO connection management
- Hospital-specific workflow testing scenarios
- Multi-tenant architecture with security

### 🔧 Remaining (18%)
- Environment configuration (.env.local setup)
- TypeScript compilation fixes
- ESLint formatting cleanup
- Live integration testing

### 📋 Quick Phase 1 Validation
```bash
# Check implementation status
node scripts/validate-phase1.js

# Set up environment
cp .env.example .env.local
# Edit with your configuration

# Run targeted tests
npm run test -- tests/database/
npm run test -- tests/api/
npm run test -- tests/components/
```

### 📖 Phase 1 Documentation
- **Summary**: `docs/PHASE_1_SUMMARY.md`
- **Execution Guide**: `docs/PHASE_1_EXECUTION_GUIDE.md`
- **Test Plan**: `docs/PHASE_1_TEST_PLAN.md`

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
