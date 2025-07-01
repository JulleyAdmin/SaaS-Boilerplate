# 🧪 Live UI Testing Session - Phase 1

**Status**: READY TO TEST  
**Server**: http://localhost:3001  
**Test User**: admin@stmarys.hospital.com / u3Me65zO&8@b  
**Organization**: St. Mary's General Hospital  

---

## 🎯 Testing Session Checklist

### ✅ Pre-Test Setup Complete
- [x] Development server running on http://localhost:3001
- [x] Clerk organization "St. Mary's General Hospital" created
- [x] Admin user admin@stmarys.hospital.com created
- [x] Jackson SSO service running
- [x] Real Clerk test keys configured

---

## 🚀 Test Scenario 1: Admin Authentication & SSO Access

### Step 1: Initial Login Test
**Objective**: Verify admin can log in and access SSO management

**Actions**:
1. Open browser to: **http://localhost:3001**
2. Click "Sign In" button
3. Enter credentials:
   - Email: `admin@stmarys.hospital.com`
   - Password: `u3Me65zO&8@b`
4. Complete login process

**Expected Results**:
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ User session established
- ✅ Organization context set to "St. Mary's General Hospital"

**Status**: [ ] Pass [ ] Fail [ ] Notes: ________________

---

### Step 2: Navigate to SSO Management
**Objective**: Access the SSO administration interface

**Actions**:
1. From dashboard, navigate to organization profile
2. Look for SSO or Security settings
3. Access SSO connection management page
4. Target URL: `/dashboard/organization-profile/sso`

**Expected Results**:
- ✅ SSO management page loads
- ✅ Page shows current SSO connections (likely empty initially)
- ✅ "Create SSO Connection" button visible
- ✅ User has appropriate admin permissions

**Status**: [ ] Pass [ ] Fail [ ] Notes: ________________

---

## 🔧 Test Scenario 2: SSO Connection Creation

### Step 3: Create Test SSO Connection
**Objective**: Create a SAML connection for the hospital

**Test Data**:
```
Name: St. Mary's Hospital SAML
Description: Primary SAML connection for hospital staff
Tenant: st-marys-hospital
Product: hospitalos
Redirect URL: http://localhost:3001/api/auth/sso/callback
Metadata URL: https://mocksaml.com/api/saml/metadata
```

**Actions**:
1. Click "Create SSO Connection" or similar button
2. Fill out the connection form with test data above
3. Submit the form
4. Verify connection appears in list

**Expected Results**:
- ✅ Create dialog opens successfully
- ✅ Form fields are properly labeled and validated
- ✅ Form accepts all test data
- ✅ Connection is created successfully
- ✅ Success message displayed
- ✅ New connection appears in connections list

**Status**: [ ] Pass [ ] Fail [ ] Notes: ________________

---

### Step 4: Edit SSO Connection
**Objective**: Modify existing SSO connection

**Actions**:
1. From connections list, click "Edit" on the connection created above
2. Modify the description: "Updated SAML connection for all departments"
3. Save changes
4. Verify changes are reflected

**Expected Results**:
- ✅ Edit dialog opens with current values pre-populated
- ✅ Changes can be made successfully
- ✅ Save operation completes without errors
- ✅ Updated values shown in connections list

**Status**: [ ] Pass [ ] Fail [ ] Notes: ________________

---

## 📱 Test Scenario 3: User Interface Validation

### Step 5: Responsive Design Test
**Objective**: Verify SSO interface works on different screen sizes

**Actions**:
1. Test on desktop (current view)
2. Resize browser to tablet size (~768px wide)
3. Resize browser to mobile size (~375px wide)
4. Verify all functionality remains accessible

**Expected Results**:
- ✅ All buttons and forms remain clickable
- ✅ Text remains readable at all sizes
- ✅ No horizontal scrolling required
- ✅ Navigation menus adapt appropriately

**Status**: [ ] Pass [ ] Fail [ ] Notes: ________________

---

### Step 6: Form Validation Test
**Objective**: Verify proper form validation and error handling

**Actions**:
1. Try to create SSO connection with empty required fields
2. Enter invalid URL in metadata field
3. Enter invalid email format (if applicable)
4. Test field length limits

**Expected Results**:
- ✅ Required field validation triggers
- ✅ URL validation prevents invalid URLs
- ✅ Clear error messages displayed
- ✅ Form prevents submission with invalid data

**Status**: [ ] Pass [ ] Fail [ ] Notes: ________________

---

## 🔐 Test Scenario 4: SSO Authentication Flow Simulation

### Step 7: SSO Login Process Test
**Objective**: Test the SAML authentication initiation

**Actions**:
1. Open new incognito/private browser window
2. Go to: http://localhost:3001
3. Look for "Login with SSO" option
4. Enter organization identifier: `st-marys-hospital`
5. Observe SSO flow initiation

**Expected Results**:
- ✅ SSO login option is visible
- ✅ Organization identifier is accepted
- ✅ User is redirected to SSO authorize endpoint
- ✅ No error messages during flow initiation

**Status**: [ ] Pass [ ] Fail [ ] Notes: ________________

---

## 🏥 Test Scenario 5: Hospital-Specific Features

### Step 8: Department Context Test
**Objective**: Verify hospital/department-specific features work

**Actions**:
1. Check if department information is displayed
2. Verify role-based access controls
3. Look for hospital-specific branding or context
4. Test any medical workflow features

**Expected Results**:
- ✅ Hospital context ("St. Mary's General Hospital") is shown
- ✅ Admin role permissions are properly applied
- ✅ Medical/hospital terminology is used appropriately
- ✅ Department-based features function correctly

**Status**: [ ] Pass [ ] Fail [ ] Notes: ________________

---

## 📊 Test Session Results Summary

### Overall Assessment
- **Total Tests Attempted**: ___/8
- **Tests Passed**: ___
- **Tests Failed**: ___
- **Critical Issues Found**: ___

### Performance Observations
- **Page Load Speed**: Fast | Moderate | Slow
- **Form Responsiveness**: Excellent | Good | Needs Improvement
- **Navigation Flow**: Intuitive | Acceptable | Confusing

### Issues Found
| Priority | Issue Description | Steps to Reproduce |
|----------|------------------|-------------------|
| 🔴 High | | |
| 🟡 Medium | | |
| 🟢 Low | | |

### Browser/Device Info
- **Browser**: ________________
- **Version**: ________________
- **Screen Size**: ________________
- **Operating System**: ________________

---

## 🎯 Next Steps Based on Results

### If All Tests Pass (8/8) ✅
- Phase 1 UI is production-ready
- Move to advanced testing scenarios
- Consider Phase 2 implementation
- Document successful test completion

### If Most Tests Pass (6-7/8) ⚠️
- Address any critical issues found
- Re-test failed scenarios
- Consider minor fixes before production
- Document known minor issues

### If Several Tests Fail (< 6/8) ❌
- Review and fix critical functionality
- Re-run complete testing session
- Consider additional development needed
- Update implementation based on findings

---

## 🔧 Quick Commands for Testing

```bash
# Check if services are running
curl http://localhost:3001/api/health
curl http://localhost:5225/api/v1/health

# View server logs
# Check terminal where npm run dev is running

# Check Jackson SSO logs
docker logs jackson-hospitalos

# Get test data reference
node scripts/test-sso-ui.js test-data
```

---

## 📞 Support During Testing

- **Documentation**: docs/PHASE_1_UI_TESTING_PLAN.md
- **Detailed Checklist**: docs/UI_TESTING_CHECKLIST.md
- **Implementation Guide**: docs/PHASE_1_EXECUTION_GUIDE.md

**Start testing now at: http://localhost:3001** 🚀

Good luck with the testing session! 🏥✨