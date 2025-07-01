# Phase 1 UI Testing Plan

## 🎯 Testing Objectives

**Goal**: Validate all SSO user interface components and workflows to ensure hospital staff can successfully configure and use SAML authentication.

**Scope**: Complete user interface testing for Phase 1 SSO implementation including admin configuration, user authentication flows, and error handling.

## 🏥 Hospital User Personas

### 1. Hospital IT Administrator (Primary Tester)
- **Role**: System configuration and SSO setup
- **Access Level**: Full administrative rights
- **Responsibilities**: Configure SAML connections, manage user access
- **Technical Skills**: High - understands SSO protocols

### 2. Department Head (Secondary Tester)
- **Role**: Department-level user management
- **Access Level**: Organization admin rights
- **Responsibilities**: Review SSO configurations, manage department staff
- **Technical Skills**: Medium - understands basic IT concepts

### 3. Medical Staff (End User)
- **Role**: Daily system access via SSO
- **Access Level**: Member-level access
- **Responsibilities**: Login via SAML, access patient systems
- **Technical Skills**: Low - primarily clinical focus

## 📋 Pre-Testing Setup

### Environment Preparation

```bash
# 1. Start development environment
npm run dev

# 2. Start Jackson SSO service (Docker)
docker run -d \
  --name jackson-hospitalos \
  -p 5225:5225 \
  -e DB_ENGINE=sql \
  -e DB_TYPE=postgres \
  -e DB_URL=$DATABASE_URL \
  -e JACKSON_API_KEY="your_api_key_here" \
  boxyhq/jackson

# 3. Verify services are running
curl http://localhost:3000/api/health
curl http://localhost:5225/api/v1/health

# 4. Set up test organization in Clerk
# Use Clerk dashboard to create test organization: "St. Mary's Hospital"
```

### Test Data Requirements

```javascript
// Test Hospital Organization
const testOrganization = {
  name: "St. Mary's General Hospital",
  slug: "st-marys-hospital",
  domain: "stmarys.hospital.com",
  departments: ["Emergency", "ICU", "Surgery", "Laboratory"]
};

// Test Users
const testUsers = {
  itAdmin: {
    email: "admin@stmarys.hospital.com",
    firstName: "John",
    lastName: "Smith",
    role: "OWNER",
    department: "IT Administration"
  },
  deptHead: {
    email: "head.emergency@stmarys.hospital.com", 
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    role: "ADMIN",
    department: "Emergency"
  },
  medicalStaff: {
    email: "nurse.williams@stmarys.hospital.com",
    firstName: "Lisa",
    lastName: "Williams", 
    role: "MEMBER",
    department: "Emergency"
  }
};

// Mock SAML Provider (for testing)
const mockSamlProvider = {
  entityId: "https://stmarys-idp.hospital.com",
  ssoUrl: "https://stmarys-idp.hospital.com/sso",
  x509Certificate: "-----BEGIN CERTIFICATE-----\n[Mock Certificate]\n-----END CERTIFICATE-----",
  metadataUrl: "https://stmarys-idp.hospital.com/metadata"
};
```

## 🧪 Test Scenarios

### Scenario 1: SSO Connection Management (IT Administrator)

#### Test Case 1.1: Create New SSO Connection
**Objective**: Verify admin can create SAML connection for hospital

**Steps**:
1. Login as IT Administrator
2. Navigate to `/admin/sso` or equivalent SSO management page
3. Click "Create SSO Connection" button
4. Fill out connection form:
   - **Name**: "St. Mary's Hospital SAML"
   - **Description**: "Primary SAML connection for hospital staff"
   - **Metadata URL**: Mock provider metadata URL
   - **Redirect URL**: `http://localhost:3000/api/auth/sso/callback`
5. Click "Create Connection"

**Expected Results**:
- ✅ Form validates all required fields
- ✅ Connection is created successfully
- ✅ Success message is displayed
- ✅ New connection appears in connections list
- ✅ Connection shows "Active" status

**Test Data**: Use mock SAML provider metadata

---

#### Test Case 1.2: Edit Existing SSO Connection
**Objective**: Verify admin can modify SSO connection settings

**Steps**:
1. From SSO connections list, click "Edit" on existing connection
2. Modify connection details:
   - **Description**: "Updated SAML connection for all departments"
   - **Metadata**: Upload new metadata file or URL
3. Click "Save Changes"

**Expected Results**:
- ✅ Edit dialog opens with current values pre-populated
- ✅ Form accepts valid changes
- ✅ Changes are saved successfully
- ✅ Updated values are reflected in connections list
- ✅ Connection remains functional after update

---

#### Test Case 1.3: Delete SSO Connection
**Objective**: Verify admin can safely remove SSO connections

**Steps**:
1. From SSO connections list, click "Delete" on test connection
2. Confirm deletion in confirmation dialog
3. Verify connection is removed

**Expected Results**:
- ✅ Confirmation dialog appears with warning message
- ✅ Deletion requires explicit confirmation
- ✅ Connection is removed from list after confirmation
- ✅ Appropriate success message is shown

---

#### Test Case 1.4: View SSO Connection Details
**Objective**: Verify admin can review connection configuration

**Steps**:
1. Click on connection name or "View Details"
2. Review all connection information
3. Check metadata download functionality
4. Verify ACS URL and Entity ID display

**Expected Results**:
- ✅ All connection details are displayed accurately
- ✅ Metadata can be downloaded as XML file
- ✅ ACS URL and Entity ID are correctly formatted
- ✅ Connection status shows as "Active" or "Inactive"

---

### Scenario 2: SSO Authentication Flow (End User)

#### Test Case 2.1: SAML Login Flow
**Objective**: Verify medical staff can login via SAML

**Prerequisites**: SSO connection must be configured and active

**Steps**:
1. Navigate to HospitalOS login page
2. Click "Login with SSO" or "Login with St. Mary's Hospital"
3. Enter organization identifier: "st-marys-hospital"
4. Complete SAML authentication (mock or test IdP)
5. Verify redirect back to HospitalOS dashboard

**Expected Results**:
- ✅ SSO login option is clearly visible
- ✅ Organization identifier is accepted
- ✅ User is redirected to SAML provider
- ✅ After SAML auth, user returns to HospitalOS
- ✅ User session is established with correct role
- ✅ User profile shows SAML authentication source

---

#### Test Case 2.2: SSO Login Error Handling
**Objective**: Verify graceful handling of SSO authentication errors

**Steps**:
1. Attempt SSO login with invalid organization
2. Attempt SSO login with non-existent connection
3. Test SAML authentication failure scenarios
4. Test network/connectivity issues

**Expected Results**:
- ✅ Clear error messages for invalid organization
- ✅ Helpful guidance for connection issues
- ✅ Graceful fallback for SAML failures
- ✅ Option to retry or contact support
- ✅ No sensitive information exposed in errors

---

### Scenario 3: User Interface Validation

#### Test Case 3.1: Responsive Design Testing
**Objective**: Verify SSO interfaces work on different screen sizes

**Steps**:
1. Test SSO management interface on:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
2. Verify all forms and dialogs are usable
3. Check button placement and text readability

**Expected Results**:
- ✅ All SSO forms are fully functional on mobile
- ✅ Text remains readable at all screen sizes
- ✅ Buttons and links are easily clickable
- ✅ No horizontal scrolling required
- ✅ Form fields stack appropriately on small screens

---

#### Test Case 3.2: Accessibility Testing
**Objective**: Verify SSO interfaces are accessible to all users

**Steps**:
1. Navigate SSO interfaces using only keyboard
2. Test with screen reader (VoiceOver/NVDA)
3. Verify color contrast for all text
4. Check ARIA labels and roles

**Expected Results**:
- ✅ All interactive elements are keyboard accessible
- ✅ Tab order is logical and intuitive
- ✅ Screen readers can navigate all content
- ✅ Form validation messages are announced
- ✅ Color contrast meets WCAG 2.1 AA standards

---

#### Test Case 3.3: Form Validation Testing
**Objective**: Verify all SSO forms provide proper validation

**Steps**:
1. Submit empty SSO connection form
2. Enter invalid URLs in metadata field
3. Enter invalid email formats
4. Test field length limits
5. Test special character handling

**Expected Results**:
- ✅ Required field validation triggers appropriately
- ✅ URL validation works for metadata fields
- ✅ Email validation prevents invalid formats
- ✅ Field length limits are enforced
- ✅ Special characters are handled safely
- ✅ Validation messages are clear and helpful

---

### Scenario 4: Hospital-Specific Workflows

#### Test Case 4.1: Emergency Department Access
**Objective**: Verify SSO works for emergency scenarios

**Steps**:
1. Simulate emergency department login during night shift
2. Test rapid login for multiple emergency staff
3. Verify role-based access to emergency systems
4. Test SSO during high-traffic periods

**Expected Results**:
- ✅ Login completes in under 3 seconds
- ✅ Multiple concurrent logins work smoothly
- ✅ Emergency staff get appropriate access levels
- ✅ System remains responsive under load

---

#### Test Case 4.2: Department Head Management
**Objective**: Verify department heads can manage SSO for their staff

**Steps**:
1. Login as Department Head (Emergency)
2. View SSO connections for department
3. Review staff SSO access logs
4. Verify department-scoped permissions

**Expected Results**:
- ✅ Department heads see relevant SSO information
- ✅ Staff access logs are filterable by department
- ✅ Permissions are properly scoped to department
- ✅ No access to other departments' data

---

## 🔧 Testing Tools and Setup

### Browser Testing Matrix

| Browser | Version | Platform | Priority |
|---------|---------|----------|----------|
| Chrome | Latest | Windows/Mac | High |
| Firefox | Latest | Windows/Mac | High |
| Safari | Latest | Mac | Medium |
| Edge | Latest | Windows | Medium |
| Mobile Safari | Latest | iOS | Medium |
| Chrome Mobile | Latest | Android | Medium |

### Testing Checklist Template

```markdown
## Test Execution Log

**Test Date**: ___________
**Tester**: ___________  
**Environment**: ___________
**Browser/Device**: ___________

### Pre-Test Setup
- [ ] Development server running (localhost:3000)
- [ ] Jackson SSO service running (localhost:5225)
- [ ] Test organization created in Clerk
- [ ] Mock SAML provider configured
- [ ] Test users created

### Test Results
| Test Case | Status | Notes | Screenshots |
|-----------|--------|-------|-------------|
| 1.1 Create SSO Connection | ⏳ | | |
| 1.2 Edit SSO Connection | ⏳ | | |
| 1.3 Delete SSO Connection | ⏳ | | |
| 1.4 View Connection Details | ⏳ | | |
| 2.1 SAML Login Flow | ⏳ | | |
| 2.2 SSO Error Handling | ⏳ | | |
| 3.1 Responsive Design | ⏳ | | |
| 3.2 Accessibility | ⏳ | | |
| 3.3 Form Validation | ⏳ | | |
| 4.1 Emergency Dept Access | ⏳ | | |
| 4.2 Dept Head Management | ⏳ | | |

**Legend**: ✅ Pass | ❌ Fail | ⏳ Not Tested | ⚠️ Issue Found

### Issues Found
| Issue | Severity | Description | Steps to Reproduce |
|-------|----------|-------------|-------------------|
| | | | |

### Overall Assessment
- **Total Tests**: ___/11
- **Passed**: ___
- **Failed**: ___
- **Critical Issues**: ___
- **Minor Issues**: ___

**Recommendation**: [ ] Ready for Production [ ] Needs Fixes [ ] Major Issues
```

## 🚀 Quick Start Guide

### For Testers

1. **Clone and Setup**:
   ```bash
   git clone [repository]
   cd hospitalos
   npm install
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

2. **Start Testing Environment**:
   ```bash
   npm run dev
   docker run -d -p 5225:5225 boxyhq/jackson
   ```

3. **Access Testing URLs**:
   - Main App: http://localhost:3000
   - SSO Admin: http://localhost:3000/admin/sso
   - Jackson Admin: http://localhost:5225

4. **Begin Testing**:
   - Follow test cases in order
   - Record results in checklist
   - Take screenshots of issues
   - Document any unexpected behavior

### Mock SAML Provider Setup

For testing purposes, you can use Jackson's built-in mock SAML provider or set up a simple test IdP:

```bash
# Jackson provides test SAML responses
# Use these test values in your SSO connection:

Entity ID: "https://mocksaml.com/demo"
SSO URL: "https://mocksaml.com/api/saml/sso"
Metadata URL: "https://mocksaml.com/api/saml/metadata"
```

## 🎯 Success Criteria

### Phase 1 UI Testing Complete When:

1. **Core Functionality** (100% Pass Required):
   - ✅ SSO connection CRUD operations work flawlessly
   - ✅ SAML authentication flow completes successfully
   - ✅ User roles and permissions function correctly
   - ✅ Error handling provides clear user guidance

2. **User Experience** (90% Pass Required):
   - ✅ All forms are intuitive and user-friendly
   - ✅ Responsive design works on all target devices
   - ✅ Loading states and feedback are appropriate
   - ✅ Navigation is logical and efficient

3. **Hospital Workflows** (95% Pass Required):
   - ✅ Emergency department access patterns work
   - ✅ Department-based permissions function
   - ✅ Multi-user concurrent access is stable
   - ✅ Integration with existing hospital systems

4. **Accessibility & Security** (100% Pass Required):
   - ✅ WCAG 2.1 AA compliance verified
   - ✅ Keyboard navigation fully functional
   - ✅ Screen reader compatibility confirmed
   - ✅ No sensitive data exposed in UI

## 📞 Support During Testing

- **Technical Issues**: Create GitHub issue with "UI-Testing" label
- **Questions**: Consult this testing plan or reach out to development team
- **Urgent Blockers**: Contact project lead immediately

---

**Ready to begin testing?** Start with Scenario 1 (SSO Connection Management) and work through each test case systematically. Document everything and don't hesitate to ask questions!