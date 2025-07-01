Set up complete SSO (Single Sign-On) integration using SAML Jackson from BoxyHQ template.

**Template Source:** $ARGUMENTS (should specify BoxyHQ or other SSO implementation)

Follow these steps:

1. **Prerequisites Check:**
   - Verify database schema includes Jackson tables
   - Check environment variables for SSO configuration
   - Ensure Clerk authentication is working

2. **Jackson Library Integration:**
   - Install @boxyhq/saml-jackson package
   - Create `src/lib/sso/jackson.ts` with configuration
   - Set up database connection for Jackson
   - Configure SAML paths and audience

3. **API Routes Creation:**
   - Create SSO API routes in `src/app/api/auth/sso/`
   - Implement ACS (Assertion Consumer Service) endpoint
   - Add SAML metadata endpoint
   - Create SSO callback handlers
   - Integrate with Clerk auth system

4. **UI Components:**
   - Build SSO settings page in `src/features/sso/`
   - Create SAML configuration forms
   - Add SSO status indicators
   - Use our Shadcn UI components
   - Follow existing form patterns with React Hook Form + Zod

5. **Security Implementation:**
   - Add proper input validation
   - Implement organization-level access control
   - Secure token handling
   - Add CSRF protection

6. **Testing and Verification:**
   - Test SAML metadata generation
   - Verify ACS endpoint functionality
   - Test UI component rendering
   - Validate Clerk integration
   - Check error handling

7. **Documentation:**
   - Create SSO setup guide for administrators
   - Document API endpoints
   - Add troubleshooting steps

Always follow our existing patterns for multi-tenancy and TypeScript strict typing.
