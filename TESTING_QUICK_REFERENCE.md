# 🧪 Quick Testing Reference Card

## 🔗 **READY TO TEST - START HERE**

### **Main App**: http://localhost:3001
### **Login**: admin@stmarys.hospital.com / u3Me65zO&8@b
### **Organization**: St. Mary's General Hospital

---

## 🎯 **Testing Priority Order**

### 1. **Login Test** (2 minutes)
- Go to http://localhost:3001
- Click "Sign In"
- Login with admin@stmarys.hospital.com / u3Me65zO&8@b
- ✅ Should reach dashboard

### 2. **SSO Management Access** (2 minutes)
- Navigate to organization profile
- Find SSO/Security settings
- Access SSO connection management
- ✅ Should see SSO admin interface

### 3. **Create SSO Connection** (5 minutes)
- Click "Create SSO Connection"
- Fill form with:
  - Name: `St. Mary's Hospital SAML`
  - Description: `Primary SAML connection`
  - Tenant: `st-marys-hospital`
  - Redirect URL: `http://localhost:3001/api/auth/sso/callback`
- ✅ Connection should be created successfully

### 4. **Responsive Design** (3 minutes)
- Test on desktop, tablet, mobile sizes
- Verify all buttons work
- Check text readability
- ✅ Should work on all screen sizes

### 5. **Form Validation** (3 minutes)
- Try submitting empty form
- Enter invalid URLs
- Test error messages
- ✅ Should show proper validation

---

## 🏥 **Hospital-Specific Test Data**

```json
{
  "organization": "St. Mary's General Hospital",
  "slug": "st-marys-hospital",
  "admin_email": "admin@stmarys.hospital.com",
  "departments": ["Emergency", "ICU", "Surgery", "Laboratory"],
  "sso_config": {
    "name": "St. Mary's Hospital SAML",
    "tenant": "st-marys-hospital",
    "redirect": "http://localhost:3001/api/auth/sso/callback"
  }
}
```

---

## ⚡ **Quick Status Check**

```bash
# App Status
curl http://localhost:3001/api/health

# SSO Service Status
docker ps | grep jackson

# View Logs
docker logs jackson-hospitalos
```

---

## 🔧 **If Something Goes Wrong**

### App Won't Load
- Check terminal for errors
- Try http://localhost:3000 instead
- Restart: `npm run dev`

### Login Issues
- Verify organization exists in Clerk
- Check user is added to organization
- Try password reset if needed

### SSO Page Not Found
- Check URL: `/dashboard/organization-profile/sso`
- Verify user has admin permissions
- Look for alternative SSO menu location

### Jackson SSO Issues
- Check container: `docker ps`
- Restart: `docker restart jackson-hospitalos`
- Check logs: `docker logs jackson-hospitalos`

---

## 📋 **Success Criteria**

### ✅ **Must Pass**
- [ ] User can login successfully
- [ ] SSO management page loads
- [ ] Can create SSO connection
- [ ] Forms validate properly
- [ ] Responsive design works

### ⚠️ **Should Pass**
- [ ] Error messages are clear
- [ ] Navigation is intuitive
- [ ] Hospital branding/context visible
- [ ] Performance is acceptable

### 💡 **Nice to Have**
- [ ] Advanced SSO features work
- [ ] Department-specific features
- [ ] Multi-user scenarios
- [ ] Accessibility compliance

---

## 📊 **Report Template**

**Date**: _______________
**Tester**: _______________
**Duration**: _____ minutes

**Results**:
- Login: ✅ ❌ ⚠️
- SSO Access: ✅ ❌ ⚠️
- Connection Creation: ✅ ❌ ⚠️
- Responsive Design: ✅ ❌ ⚠️
- Form Validation: ✅ ❌ ⚠️

**Issues Found**: _______________

**Overall Assessment**: Ready | Needs Minor Fixes | Needs Major Work

---

## 🎉 **When Testing is Complete**

1. Fill out `docs/UI_TESTING_CHECKLIST.md`
2. Document any issues found
3. Take screenshots if needed
4. Report results for Phase 2 planning

**Start testing now**: http://localhost:3001 🚀
