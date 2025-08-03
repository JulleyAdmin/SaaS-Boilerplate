# New Features Testing Guide

This guide will help you manually test the newly implemented features: API Key Management, MFA, and Team Management.

## Prerequisites

1. ✅ Development server is running: `npm run dev`
2. ✅ Database is connected and migrated
3. ✅ User is signed in to the application

## Testing Checklist

### 1. API Key Management Testing

**Navigate to:** `http://localhost:3000/dashboard/api-keys`

#### Test Cases:
- [ ] **Page Loads**: Verify the API Keys page loads without errors
- [ ] **Create API Key**:
  - Click "Create API Key"
  - Fill in name and description
  - Select permissions/scopes
  - Verify key is created and shown once
  - Verify key starts with `sk_` prefix
- [ ] **List API Keys**:
  - Verify existing keys are displayed
  - Check created date, last used, etc.
- [ ] **Delete API Key**:
  - Click delete on a test key
  - Confirm deletion dialog
  - Verify key is removed from list
- [ ] **Key Security**:
  - Verify full key is only shown once during creation
  - Verify only prefix is shown in the list

### 2. MFA (Multi-Factor Authentication) Testing

**Navigate to:** `http://localhost:3000/dashboard/security`

#### Test Cases:
- [ ] **Page Loads**: Verify the Security/MFA page loads
- [ ] **MFA Status**:
  - Check current MFA status (enabled/disabled)
  - Verify TOTP status display
  - Verify backup codes status
- [ ] **Enable TOTP**:
  - Click "Set up authenticator app"
  - Follow Clerk's TOTP setup flow
  - Verify QR code or setup key is shown
- [ ] **Backup Codes**:
  - Generate backup codes
  - Verify codes are shown
  - Test downloading/copying codes
- [ ] **Security Settings**:
  - Test password change (if applicable)
  - Test other security options

### 3. Team Management Testing

**Navigate to:** `http://localhost:3000/dashboard/team`

#### Test Cases:
- [ ] **Page Loads**: Verify the Team page loads without errors
- [ ] **Current Members**:
  - Verify current user is shown as OWNER
  - Check member list displays correctly
  - Verify avatars and user info display
- [ ] **Invite Member**:
  - Click "Invite Member" button
  - Test email invitation:
    - Enter email address
    - Select role (ADMIN/MEMBER)
    - Create invitation
    - Verify invitation created
  - Test link invitation:
    - Leave email empty
    - Select role
    - Create invitation
    - Copy invitation link
- [ ] **Pending Invitations**:
  - Verify pending invitations are shown
  - Test copying invitation links
  - Test canceling invitations
- [ ] **Role Management** (as OWNER):
  - Test promoting MEMBER to ADMIN
  - Test demoting ADMIN to MEMBER
  - Verify role changes are reflected
- [ ] **Remove Members**:
  - Test removing a team member
  - Verify confirmation dialog
  - Verify member is removed

### 4. Invitation Acceptance Testing

**Test URL:** `http://localhost:3000/invitations/accept?token=<invitation_token>`

#### Test Cases:
- [ ] **Valid Invitation**:
  - Use a valid invitation token
  - Verify acceptance page loads
  - Click "Accept Invitation"
  - Verify user is added to organization
- [ ] **Invalid/Expired Token**:
  - Use invalid token
  - Verify appropriate error message
- [ ] **Already Member**:
  - Try accepting invitation for organization user is already in
  - Verify appropriate handling

### 5. API Endpoint Testing

You can test the API endpoints directly:

#### API Key Endpoints:
```bash
# List API keys (requires auth)
curl -H "Authorization: Bearer <clerk-token>" http://localhost:3000/api/organizations/<org-id>/api-keys

# Create API key
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-token>" \
  -d '{"name":"Test Key","description":"Testing"}' \
  http://localhost:3000/api/organizations/<org-id>/api-keys
```

#### Team Management Endpoints:
```bash
# List team members
curl -H "Authorization: Bearer <clerk-token>" http://localhost:3000/api/organizations/<org-id>/members

# Create invitation
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-token>" \
  -d '{"email":"test@example.com","role":"MEMBER"}' \
  http://localhost:3000/api/organizations/<org-id>/invitations
```

## Expected Behaviors

### Success Indicators:
- ✅ All pages load without console errors
- ✅ Create operations show success messages
- ✅ Data persists after refresh
- ✅ Proper role-based access control
- ✅ Secure handling of sensitive data (API keys shown once)
- ✅ Email notifications for invitations (if configured)

### Error Handling:
- ❌ Graceful error messages for failed operations
- ❌ Validation errors for invalid inputs
- ❌ Permission denied for unauthorized actions
- ❌ Expired/invalid invitation handling

## Common Issues to Watch For:

1. **TypeScript Errors**: Check browser console for any TS compilation errors
2. **Missing UI Components**: Verify all buttons, modals, and forms render correctly
3. **Database Constraints**: Test edge cases like duplicate emails, invalid roles
4. **Authentication**: Ensure all endpoints properly check user authentication
5. **Organization Context**: Verify all operations are scoped to the correct organization

## Testing Data

To facilitate testing, you can:
1. Create multiple test users via Clerk dashboard
2. Use temp email services for invitation testing
3. Create test organizations for isolation
4. Use browser dev tools to inspect API calls

## Reporting Issues

When you find issues, please note:
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Browser console errors
- [ ] Network tab API responses
- [ ] User role and organization context

---

Once testing is complete, we can move on to implementing the Webhook Management System!
