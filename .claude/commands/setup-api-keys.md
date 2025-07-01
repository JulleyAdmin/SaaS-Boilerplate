Implement comprehensive API key management system based on BoxyHQ implementation.

**Template Source:** $ARGUMENTS (specify template reference and any specific requirements)

Follow these steps:

1. **Database Schema Verification:**
   - Ensure API key tables exist in `src/models/Schema.ts`
   - Verify relationships with organizations
   - Check indexes for performance

2. **Core API Key Logic:**
   - Create secure key generation utilities
   - Implement proper key hashing (never store plain text)
   - Add expiration and usage tracking
   - Create key validation middleware

3. **API Routes Implementation:**
   - Build CRUD endpoints in `src/app/api/organizations/[orgId]/api-keys/`
   - Add proper Clerk authentication checks
   - Implement organization-scoped access
   - Include usage tracking endpoints
   - Add key rotation functionality

4. **React Hooks and State Management:**
   - Create `src/hooks/useAPIKeys.ts` with SWR
   - Implement CRUD operations
   - Add loading and error states
   - Handle optimistic updates

5. **UI Components:**
   - Build API key list view with proper security
   - Create key creation dialog
   - Add key details and usage metrics
   - Implement key revocation UI
   - Use our Shadcn UI patterns
   - Never display full keys after creation

6. **Security Features:**
   - Mask keys in UI (show only prefix/suffix)
   - Add confirmation dialogs for destructive actions
   - Implement rate limiting
   - Add audit logging for key operations
   - Organization-level access control

7. **Integration:**
   - Add API key management to dashboard navigation
   - Integrate with existing auth flows
   - Follow our form validation patterns

8. **Testing:**
   - Test key generation and validation
   - Verify organization access control
   - Test UI functionality
   - Validate security measures

Remember: Never expose full API keys in logs or UI after initial creation.
