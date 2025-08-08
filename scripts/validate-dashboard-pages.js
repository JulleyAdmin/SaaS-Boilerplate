#!/usr/bin/env node

/**
 * Dashboard Pages Validation Script
 * Validates all recently created dashboard pages for completeness and functionality
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// List of dashboard pages to validate
const dashboardPages = [
  // Reception Dashboard
  { path: 'queue/page.tsx', name: 'Queue Management', category: 'Reception' },
  { path: 'registration/page.tsx', name: 'Patient Registration', category: 'Reception' },
  { path: 'tokens/page.tsx', name: 'Token Generation', category: 'Reception' },
  
  // Nurse Dashboard
  { path: 'beds/page.tsx', name: 'Bed Management', category: 'Nurse' },
  { path: 'medication-administration/page.tsx', name: 'Medication Administration', category: 'Nurse' },
  { path: 'nursing-notes/page.tsx', name: 'Nursing Notes', category: 'Nurse' },
  
  // General Dashboard
  { path: 'consultations/page.tsx', name: 'Consultations', category: 'General' },
  { path: 'analytics/page.tsx', name: 'Real-time Analytics', category: 'General' },
  { path: 'emergency/page.tsx', name: 'Emergency Department', category: 'General' },
  
  // Billing Dashboard
  { path: 'billing/insurance/page.tsx', name: 'Insurance Claims', category: 'Billing' },
  
  // Lab Dashboard (if exists)
  { path: 'lab/test-results/page.tsx', name: 'Test Results', category: 'Lab' },
  { path: 'lab/sample-collection/page.tsx', name: 'Sample Collection', category: 'Lab' },
  { path: 'lab/reports/page.tsx', name: 'Lab Reports', category: 'Lab' },
  { path: 'lab/equipment/page.tsx', name: 'Lab Equipment', category: 'Lab' }
];

// Required imports/components that should be present in pages
const requiredImports = [
  '@/components/ui/card',
  '@/components/ui/button',
  'lucide-react'
];

// Required UI patterns
const uiPatterns = [
  { pattern: /<Card/, name: 'Card component' },
  { pattern: /<Button/, name: 'Button component' },
  { pattern: /<Badge/, name: 'Badge component' },
  { pattern: /useState/, name: 'State management' },
  { pattern: /export default function/, name: 'Default export' }
];

// Indian healthcare context patterns
const indianContextPatterns = [
  { pattern: /₹|INR|Rupee/i, name: 'Indian currency' },
  { pattern: /ABHA|Aadhar|Aadhaar/i, name: 'Indian ID systems' },
  { pattern: /PMJAY|Ayushman|CGHS|ESIC/i, name: 'Government schemes' },
  { pattern: /UPI|Paytm/i, name: 'Indian payment methods' },
  { pattern: /TPA|Third Party/i, name: 'TPA/Insurance' }
];

// Key features by page type
const pageFeatures = {
  'queue': ['token display', 'department filtering', 'wait time tracking'],
  'registration': ['patient form', 'ABHA integration', 'government schemes'],
  'tokens': ['token generation', 'department selection', 'priority handling'],
  'beds': ['occupancy tracking', 'ward management', 'patient assignment'],
  'medication': ['schedule tracking', 'administration recording', 'safety alerts'],
  'nursing-notes': ['vital signs', 'interventions', 'care plans'],
  'consultations': ['doctor assignment', 'prescription', 'payment status'],
  'analytics': ['real-time stats', 'auto-refresh', 'multiple tabs'],
  'emergency': ['triage levels', 'ambulance tracking', 'resource monitoring'],
  'insurance': ['claims management', 'pre-authorization', 'TPA coordination']
};

function validatePage(pagePath, pageName, category) {
  const fullPath = path.join(
    __dirname, 
    '../src/app/[locale]/(auth)/dashboard',
    pagePath
  );
  
  console.log(`\n${colors.cyan}Validating: ${colors.bright}${pageName}${colors.reset} (${category})`);
  console.log(`Path: ${fullPath}`);
  
  const results = {
    exists: false,
    size: 0,
    imports: [],
    uiComponents: [],
    indianContext: [],
    features: [],
    issues: []
  };
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.log(`${colors.red}✗ File does not exist${colors.reset}`);
    return results;
  }
  
  results.exists = true;
  const content = fs.readFileSync(fullPath, 'utf8');
  results.size = content.length;
  
  console.log(`${colors.green}✓ File exists${colors.reset} (${results.size} bytes)`);
  
  // Check for required imports
  console.log(`\n  ${colors.blue}Checking imports:${colors.reset}`);
  requiredImports.forEach(imp => {
    if (content.includes(imp)) {
      results.imports.push(imp);
      console.log(`  ${colors.green}✓${colors.reset} ${imp}`);
    } else {
      console.log(`  ${colors.yellow}⚠${colors.reset} Missing: ${imp}`);
    }
  });
  
  // Check UI patterns
  console.log(`\n  ${colors.blue}Checking UI components:${colors.reset}`);
  uiPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(content)) {
      results.uiComponents.push(name);
      console.log(`  ${colors.green}✓${colors.reset} ${name}`);
    } else {
      results.issues.push(`Missing ${name}`);
      console.log(`  ${colors.red}✗${colors.reset} ${name}`);
    }
  });
  
  // Check Indian context (for relevant pages)
  const needsIndianContext = ['registration', 'insurance', 'billing', 'tokens'].some(
    type => pagePath.includes(type)
  );
  
  if (needsIndianContext) {
    console.log(`\n  ${colors.blue}Checking Indian healthcare context:${colors.reset}`);
    indianContextPatterns.forEach(({ pattern, name }) => {
      if (pattern.test(content)) {
        results.indianContext.push(name);
        console.log(`  ${colors.green}✓${colors.reset} ${name}`);
      }
    });
  }
  
  // Check for key features
  const pageType = Object.keys(pageFeatures).find(key => pagePath.includes(key));
  if (pageType && pageFeatures[pageType]) {
    console.log(`\n  ${colors.blue}Checking key features:${colors.reset}`);
    pageFeatures[pageType].forEach(feature => {
      // Simple keyword search for features
      if (content.toLowerCase().includes(feature.replace(' ', ''))) {
        results.features.push(feature);
        console.log(`  ${colors.green}✓${colors.reset} ${feature}`);
      } else {
        console.log(`  ${colors.yellow}⚠${colors.reset} May be missing: ${feature}`);
      }
    });
  }
  
  // Check for mock data
  if (content.includes('// Mock') || content.includes('mock')) {
    console.log(`  ${colors.magenta}ℹ${colors.reset} Contains mock data (needs API integration)`);
  }
  
  // Check for TypeScript errors (basic)
  if (content.includes('any>') || content.includes(': any')) {
    console.log(`  ${colors.yellow}⚠${colors.reset} Contains 'any' types (consider proper typing)`);
  }
  
  return results;
}

function generateSummaryReport(allResults) {
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bright}VALIDATION SUMMARY${colors.reset}`);
  console.log('='.repeat(80));
  
  const categories = {};
  let totalPages = 0;
  let existingPages = 0;
  let missingPages = [];
  let pagesWithIssues = [];
  
  allResults.forEach(({ page, result }) => {
    totalPages++;
    if (!categories[page.category]) {
      categories[page.category] = { total: 0, existing: 0, missing: [] };
    }
    categories[page.category].total++;
    
    if (result.exists) {
      existingPages++;
      categories[page.category].existing++;
      if (result.issues.length > 0) {
        pagesWithIssues.push({ name: page.name, issues: result.issues });
      }
    } else {
      missingPages.push(page.name);
      categories[page.category].missing.push(page.name);
    }
  });
  
  // Overall statistics
  console.log(`\n${colors.cyan}Overall Statistics:${colors.reset}`);
  console.log(`  Total pages checked: ${totalPages}`);
  console.log(`  Existing pages: ${colors.green}${existingPages}${colors.reset}`);
  console.log(`  Missing pages: ${colors.red}${totalPages - existingPages}${colors.reset}`);
  console.log(`  Pages with issues: ${colors.yellow}${pagesWithIssues.length}${colors.reset}`);
  
  // Category breakdown
  console.log(`\n${colors.cyan}Category Breakdown:${colors.reset}`);
  Object.entries(categories).forEach(([category, stats]) => {
    const status = stats.existing === stats.total 
      ? `${colors.green}✓ Complete${colors.reset}` 
      : `${colors.yellow}⚠ ${stats.existing}/${stats.total}${colors.reset}`;
    console.log(`  ${category}: ${status}`);
    if (stats.missing.length > 0) {
      stats.missing.forEach(page => {
        console.log(`    ${colors.red}✗ Missing: ${page}${colors.reset}`);
      });
    }
  });
  
  // Missing pages
  if (missingPages.length > 0) {
    console.log(`\n${colors.red}Missing Pages:${colors.reset}`);
    missingPages.forEach(page => {
      console.log(`  ✗ ${page}`);
    });
  }
  
  // Pages with issues
  if (pagesWithIssues.length > 0) {
    console.log(`\n${colors.yellow}Pages with Issues:${colors.reset}`);
    pagesWithIssues.forEach(({ name, issues }) => {
      console.log(`  ${name}:`);
      issues.forEach(issue => {
        console.log(`    - ${issue}`);
      });
    });
  }
  
  // Recommendations
  console.log(`\n${colors.cyan}Recommendations:${colors.reset}`);
  console.log('  1. Replace mock data with actual API integrations');
  console.log('  2. Add proper TypeScript types instead of "any"');
  console.log('  3. Implement missing pages for complete functionality');
  console.log('  4. Add error handling and loading states');
  console.log('  5. Connect to backend APIs for real data');
  console.log('  6. Add proper authentication and authorization checks');
  console.log('  7. Implement data persistence and state management');
}

// Main execution
function main() {
  console.log(`${colors.bright}${colors.cyan}Hospital Management System - Dashboard Pages Validation${colors.reset}`);
  console.log('='.repeat(80));
  console.log(`Validating ${dashboardPages.length} dashboard pages...`);
  
  const allResults = [];
  
  dashboardPages.forEach(page => {
    const result = validatePage(page.path, page.name, page.category);
    allResults.push({ page, result });
  });
  
  generateSummaryReport(allResults);
  
  // Test URLs
  console.log(`\n${colors.cyan}Test URLs (when running locally):${colors.reset}`);
  console.log('  Reception:');
  console.log('    http://localhost:3002/dashboard/queue');
  console.log('    http://localhost:3002/dashboard/registration');
  console.log('    http://localhost:3002/dashboard/tokens');
  console.log('  Nurse:');
  console.log('    http://localhost:3002/dashboard/beds');
  console.log('    http://localhost:3002/dashboard/medication-administration');
  console.log('    http://localhost:3002/dashboard/nursing-notes');
  console.log('  General:');
  console.log('    http://localhost:3002/dashboard/consultations');
  console.log('    http://localhost:3002/dashboard/analytics');
  console.log('    http://localhost:3002/dashboard/emergency');
  console.log('  Billing:');
  console.log('    http://localhost:3002/dashboard/billing/insurance');
  
  console.log(`\n${colors.green}Validation complete!${colors.reset}`);
}

// Run the validation
main();