# 🔐 Password Reset Guide for UI Testing

## ⚠️ Issue: Breached Password Detected

Clerk has detected that the password "password" has been found in a data breach and cannot be used for security reasons.

## ✅ **New Secure Test Credentials**

```
Email: admin@stmarys.hospital.com
New Password: u3Me65zO&8@b
Organization: St. Mary's General Hospital
```

---

## 🚀 **Quick Reset Options**

### **Option 1: Clerk Dashboard Reset (Fastest - 2 minutes)**

1. **Go to**: https://dashboard.clerk.com
2. **Login** to your Clerk account
3. **Navigate** to "Users" section
4. **Find user**: admin@stmarys.hospital.com
5. **Click**: "Actions" → "Reset Password" or "Edit User"
6. **Set password**: `u3Me65zO&8@b`
7. **Save** changes

### **Option 2: Self-Service Reset (3-5 minutes)**

1. **Go to**: http://localhost:3001/sign-in
2. **Click**: "Forgot Password?" link
3. **Enter email**: admin@stmarys.hospital.com
4. **Check email** for reset link
5. **Set new password**: `u3Me65zO&8@b`
6. **Complete** reset process

---

## 🧪 **Resume Testing Immediately After Reset**

### **Step 1: Test New Login**
1. Go to: http://localhost:3001/sign-in
2. Enter: admin@stmarys.hospital.com
3. Enter: u3Me65zO&8@b
4. ✅ Should login successfully

### **Step 2: Continue Testing**
1. Navigate to SSO management
2. Follow: `docs/LIVE_UI_TESTING_SESSION.md`
3. Use: `TESTING_QUICK_REFERENCE.md` for quick checks

---

## 🔒 **Password Security Features Met**

✅ **12+ characters** (12 chars)  
✅ **Uppercase letters** (M, O)  
✅ **Lowercase letters** (u, e, z, b)  
✅ **Numbers** (3, 6, 5, 8)  
✅ **Special characters** (&, @)  
✅ **Not in breach databases**  
✅ **Randomly generated**  

---

## 📞 **If Reset Doesn't Work**

### **Clerk Dashboard Issues**
- Verify you have admin access to the Clerk project
- Check if user exists in correct organization
- Try refreshing the dashboard

### **Email Reset Issues**
- Check spam/junk folder
- Wait 5-10 minutes for email delivery
- Try requesting reset again

### **Alternative: Create New Test User**
If reset fails, create a new test user:
- Email: `testadmin@stmarys.hospital.com`
- Password: `u3Me65zO&8@b`
- Add to: "St. Mary's General Hospital" organization
- Role: Admin/Owner

---

## ⏱️ **Expected Timeline**

- **Clerk Dashboard Reset**: 2 minutes
- **Email Reset**: 3-5 minutes
- **Resume Testing**: Immediate after reset

---

## 🎯 **After Password Reset**

**You're ready to continue with Phase 1 UI testing!**

1. ✅ **Login**: admin@stmarys.hospital.com / u3Me65zO&8@b
2. ✅ **Test App**: http://localhost:3001
3. ✅ **Follow Guide**: docs/LIVE_UI_TESTING_SESSION.md

**The secure password will allow you to complete all UI testing scenarios without security blocks.** 🏥✨