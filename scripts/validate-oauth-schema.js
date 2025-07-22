/**
 * OAuth Schema Validation Script
 * Validates that all OAuth tables and enums are properly defined
 */

const fs = require('fs');
const path = require('path');

function validateOAuthSchema() {
  console.log('🔍 Validating OAuth 2.0 Database Schema...\n');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../src/models/Schema.ts');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Check OAuth enums
    console.log('📋 Checking OAuth Enums...');
    
    const requiredEnums = [
      'oauthGrantTypeEnum',
      'oauthTokenTypeEnum', 
      'oauthClientTypeEnum'
    ];
    
    const foundEnums = [];
    requiredEnums.forEach(enumName => {
      if (schemaContent.includes(`export const ${enumName}`)) {
        foundEnums.push(enumName);
        console.log(`✅ ${enumName}`);
      } else {
        console.log(`❌ Missing: ${enumName}`);
      }
    });
    
    // Check OAuth tables
    console.log('\n📊 Checking OAuth Tables...');
    
    const requiredTables = [
      'oauthClient',
      'oauthAuthorizationCode',
      'oauthAccessToken',
      'oauthRefreshToken',
      'oauthClientPermission'
    ];
    
    const foundTables = [];
    requiredTables.forEach(tableName => {
      if (schemaContent.includes(`export const ${tableName} = pgTable`)) {
        foundTables.push(tableName);
        console.log(`✅ ${tableName}`);
      } else {
        console.log(`❌ Missing: ${tableName}`);
      }
    });
    
    // Check audit resource enum includes OAuth resources
    console.log('\n🔍 Checking Audit Resource Coverage...');
    
    const oauthAuditResources = [
      'oauth_client',
      'oauth_token', 
      'oauth_authorization',
      'oauth_permission',
      'oauth_code'
    ];
    
    const auditEnumMatch = schemaContent.match(/auditResourceEnum = pgEnum\('audit_resource', \[(.*?)\]/s);
    if (auditEnumMatch) {
      const auditResources = auditEnumMatch[1];
      
      oauthAuditResources.forEach(resource => {
        if (auditResources.includes(`'${resource}'`)) {
          console.log(`✅ ${resource}`);
        } else {
          console.log(`❌ Missing audit resource: ${resource}`);
        }
      });
    } else {
      console.log('❌ Could not find auditResourceEnum definition');
    }
    
    // Check for hospital-specific OAuth features
    console.log('\n🏥 Checking Hospital-Specific Features...');
    
    const hospitalFeatures = [
      'hospitalRole',
      'departmentId',
      'dataAccessScope',
      'phiAccess',
      'allowedDepartments',
      'auditRequired'
    ];
    
    hospitalFeatures.forEach(feature => {
      if (schemaContent.includes(feature)) {
        console.log(`✅ ${feature}`);
      } else {
        console.log(`❌ Missing hospital feature: ${feature}`);
      }
    });
    
    // Check migration files exist
    console.log('\n📁 Checking Migration Files...');
    
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Look for OAuth-related migrations
    const oauthMigrations = migrationFiles.filter(file => {
      const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      return content.includes('oauth') || content.includes('authorization_code') || content.includes('access_token');
    });
    
    console.log(`✅ Found ${oauthMigrations.length} OAuth-related migrations:`);
    oauthMigrations.forEach(file => {
      console.log(`   - ${file}`);
    });
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Validation Summary:');
    console.log(`   - OAuth Enums: ${foundEnums.length}/${requiredEnums.length}`);
    console.log(`   - OAuth Tables: ${foundTables.length}/${requiredTables.length}`);
    console.log(`   - Migration Files: ${oauthMigrations.length}`);
    
    const isValid = foundEnums.length === requiredEnums.length && 
                   foundTables.length === requiredTables.length;
    
    if (isValid) {
      console.log('\n✅ OAuth Schema Validation: PASSED');
      console.log('🎉 All OAuth database structures are properly defined');
    } else {
      console.log('\n❌ OAuth Schema Validation: FAILED');
      console.log('⚠️  Some OAuth structures are missing');
    }
    
    return isValid;
    
  } catch (error) {
    console.log('❌ Schema validation failed:', error.message);
    return false;
  }
}

// Export for testing
module.exports = { validateOAuthSchema };

// Run if called directly
if (require.main === module) {
  const success = validateOAuthSchema();
  process.exit(success ? 0 : 1);
}