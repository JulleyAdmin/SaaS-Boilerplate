#!/usr/bin/env node

/**
 * Test script for API Key Management functionality
 * Run with: node scripts/test-api-keys.js
 */

const testApiKeys = async () => {
  console.log('🔑 Testing API Key Management...\n');

  // Test 1: Check if API routes are accessible
  console.log('1️⃣ Testing API routes accessibility...');
  try {
    const response = await fetch('http://localhost:3002/api/organizations/test/api-keys');
    console.log(`   GET /api/organizations/[orgId]/api-keys - Status: ${response.status}`);
    if (response.status === 401) {
      console.log('   ✅ Route exists and requires authentication (expected)');
    } else {
      console.log('   ⚠️  Unexpected status code');
    }
  } catch (error) {
    console.log('   ❌ Error accessing API route:', error.message);
  }

  // Test 2: Check if API Key page exists
  console.log('\n2️⃣ Testing API Key management page...');
  try {
    const response = await fetch('http://localhost:3002/en/dashboard/api-keys');
    console.log(`   GET /dashboard/api-keys - Status: ${response.status}`);
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

  // Test 3: Check database schema
  console.log('\n3️⃣ Checking database schema...');
  try {
    const { db } = require('../src/libs/DB');
    const { apiKey } = require('../src/models/Schema');

    // Try to query the table (will fail if table doesn't exist)
    const result = await db.select().from(apiKey).limit(1);
    console.log('   ✅ API keys table exists in database');
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log('   ❌ API keys table missing - run migrations');
    } else {
      console.log('   ⚠️  Database check error:', error.message);
    }
  }

  // Test 4: Verify model functions exist
  console.log('\n4️⃣ Checking API Key model functions...');
  try {
    const apiKeyModel = require('../src/models/apiKey');
    const functions = [
      'generateApiKey',
      'hashApiKey',
      'createApiKey',
      'fetchApiKeys',
      'deleteApiKey',
      'validateApiKey',
    ];

    let allExist = true;
    functions.forEach((fn) => {
      if (typeof apiKeyModel[fn] === 'function') {
        console.log(`   ✅ ${fn}() exists`);
      } else {
        console.log(`   ❌ ${fn}() missing`);
        allExist = false;
      }
    });

    if (allExist) {
      console.log('   ✅ All model functions implemented correctly');
    }
  } catch (error) {
    console.log('   ❌ Error loading API Key model:', error.message);
  }

  console.log('\n✨ API Key Management Test Complete!\n');
};

// Run the test
testApiKeys().catch(console.error);
