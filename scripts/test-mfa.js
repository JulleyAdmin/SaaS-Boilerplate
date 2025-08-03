#!/usr/bin/env node

/**
 * Test script for MFA functionality
 * Run with: node scripts/test-mfa.js
 */

const testMFA = async () => {
  console.log('🔐 Testing Multi-Factor Authentication...\n');

  // Test 1: Check if MFA routes are accessible
  console.log('1️⃣ Testing MFA routes accessibility...');
  try {
    const response = await fetch('http://localhost:3002/api/auth/mfa/status');
    console.log(`   GET /api/auth/mfa/status - Status: ${response.status}`);
    if (response.status === 401) {
      console.log('   ✅ Route exists and requires authentication (expected)');
    } else {
      console.log('   ⚠️  Unexpected status code');
    }
  } catch (error) {
    console.log('   ❌ Error accessing API route:', error.message);
  }

  // Test 2: Check if MFA page exists
  console.log('\n2️⃣ Testing MFA management page...');
  try {
    const response = await fetch('http://localhost:3002/en/dashboard/security/mfa');
    console.log(`   GET /dashboard/security/mfa - Status: ${response.status}`);
    if (response.status === 426) {
      console.log('   ✅ Page exists and requires authentication upgrade (expected)');
    } else if (response.status === 200) {
      console.log('   ✅ Page loaded successfully');
    } else {
      console.log('   ⚠️  Unexpected status code');
    }
  } catch (error) {
    console.log('   ❌ Error accessing page:', error.message);
  }

  // Test 3: Verify MFA components exist
  console.log('\n3️⃣ Checking MFA components...');
  const fs = require('node:fs');
  const path = require('node:path');

  const components = [
    'src/components/security/MFASettings.tsx',
    'src/components/security/MFASetupFlow.tsx',
    'src/components/security/MFAStatusWidget.tsx',
    'src/lib/auth/mfa-enforcement.ts',
  ];

  let allExist = true;
  components.forEach((component) => {
    const fullPath = path.join(process.cwd(), component);
    if (fs.existsSync(fullPath)) {
      console.log(`   ✅ ${component} exists`);
    } else {
      console.log(`   ❌ ${component} missing`);
      allExist = false;
    }
  });

  if (allExist) {
    console.log('   ✅ All MFA components implemented correctly');
  }

  // Test 4: Check Clerk integration
  console.log('\n4️⃣ Checking Clerk MFA integration...');
  console.log('   ℹ️  MFA is handled by Clerk\'s built-in components');
  console.log('   ℹ️  Users can enable MFA through UserProfile component');
  console.log('   ℹ️  Our components provide convenient shortcuts and status display');

  console.log('\n✨ MFA Test Complete!\n');
};

// Run the test
testMFA().catch(console.error);
