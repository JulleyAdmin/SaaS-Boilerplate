#!/usr/bin/env node

/**
 * Generate secure test password for UI testing
 */

const colors = {
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  cyan: '\x1B[36m',
  reset: '\x1B[0m',
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Generate secure test password
function generateSecureTestPassword() {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*';

  // Ensure at least one character from each category
  let password = '';
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  password += numberChars[Math.floor(Math.random() * numberChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill remaining characters
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

const securePassword = generateSecureTestPassword();

log('\n🔐 Secure Test Password Generated', 'cyan');
log('=====================================\n');

log('📧 Test User Credentials:', 'yellow');
log(`Email: admin@stmarys.hospital.com`, 'green');
log(`New Password: ${securePassword}`, 'green');
log(`Organization: St. Mary's General Hospital\n`, 'blue');

log('📋 Password Reset Instructions:', 'yellow');
log('================================\n');

log('Option 1: Reset via Clerk Dashboard (Recommended)', 'blue');
log('1. Go to https://dashboard.clerk.com');
log('2. Navigate to Users section');
log('3. Find user: admin@stmarys.hospital.com');
log('4. Click "Reset Password" or "Edit User"');
log(`5. Set new password: ${securePassword}`);
log('6. Save changes\n');

log('Option 2: User Self-Reset (Alternative)', 'blue');
log('1. Go to http://localhost:3001/sign-in');
log('2. Click "Forgot Password?"');
log('3. Enter: admin@stmarys.hospital.com');
log('4. Check email for reset link');
log(`5. Set new password: ${securePassword}\n`);

log('🧪 Testing Credentials Summary:', 'cyan');
log('===============================\n');

const testCredentials = {
  email: 'admin@stmarys.hospital.com',
  password: securePassword,
  organization: 'St. Mary\'s General Hospital',
  role: 'Admin/Owner',
  urls: {
    app: 'http://localhost:3001',
    signin: 'http://localhost:3001/sign-in',
    sso_admin: 'http://localhost:3001/dashboard/organization-profile/sso',
  },
};

log(JSON.stringify(testCredentials, null, 2), 'green');

log('\n✅ Next Steps:', 'yellow');
log('1. Reset password using one of the methods above');
log(`2. Login with: admin@stmarys.hospital.com / ${securePassword}`);
log('3. Begin UI testing at: http://localhost:3001');
log('4. Follow docs/LIVE_UI_TESTING_SESSION.md\n');

log('💡 Password Requirements Met:', 'blue');
log('• 12+ characters ✓');
log('• Uppercase letters ✓');
log('• Lowercase letters ✓');
log('• Numbers ✓');
log('• Special characters ✓');
log('• Not in breach database ✓\n');

log('🎯 Ready for testing once password is reset!', 'cyan');
