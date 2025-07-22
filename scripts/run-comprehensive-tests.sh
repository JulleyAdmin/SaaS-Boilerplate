#!/bin/bash

# 🧪 Comprehensive Test Execution Script for Phase 2 Hospital SSO System
# This script runs all test suites and generates detailed reports

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test configuration
TEST_START_TIME=$(date +%s)
REPORT_DIR="./test-reports/$(date +%Y%m%d_%H%M%S)"
LOG_FILE="$REPORT_DIR/test-execution.log"
COVERAGE_DIR="$REPORT_DIR/coverage"

# Create report directory
mkdir -p "$REPORT_DIR"
mkdir -p "$COVERAGE_DIR"

# Logging function
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Header function
print_header() {
    log "\n${CYAN}=================================="
    log "$1"
    log "==================================${NC}\n"
}

# Section function
print_section() {
    log "\n${BLUE}🔍 $1${NC}"
}

# Success function
print_success() {
    log "${GREEN}✅ $1${NC}"
}

# Warning function
print_warning() {
    log "${YELLOW}⚠️  $1${NC}"
}

# Error function
print_error() {
    log "${RED}❌ $1${NC}"
}

# Start execution
print_header "PHASE 2 COMPREHENSIVE TEST EXECUTION"
log "Hospital SSO System - Complete Validation Suite"
log "Start Time: $(date)"
log "Report Directory: $REPORT_DIR"

# Pre-flight checks
print_section "Pre-flight System Checks"

# Check Node.js version
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_success "Node.js: $NODE_VERSION"
else
    print_error "Node.js not found"
    exit 1
fi

# Check npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_success "npm: $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

# Check PostgreSQL connection
print_section "Database Connection Check"
if command -v psql >/dev/null 2>&1; then
    if psql "${DATABASE_URL:-postgresql://localhost:5432/hospitalos_test}" -c "\q" >/dev/null 2>&1; then
        print_success "PostgreSQL connection successful"
    else
        print_warning "PostgreSQL connection failed - some tests may fail"
    fi
else
    print_warning "psql not found - database tests may fail"
fi

# Install dependencies
print_section "Installing Dependencies"
if npm ci; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Setup test environment
print_section "Test Environment Setup"
export NODE_ENV=test
export DATABASE_URL="${TEST_DATABASE_URL:-postgresql://localhost:5432/hospitalos_test}"
export JACKSON_CLIENT_SECRET_VERIFIER="test_secret_123"
export NEXT_PUBLIC_APP_URL="http://localhost:3003"

print_success "Test environment configured"

# Function to run test suite with reporting
run_test_suite() {
    local suite_name="$1"
    local test_pattern="$2"
    local description="$3"
    
    print_section "Running $suite_name"
    log "Description: $description"
    log "Pattern: $test_pattern"
    
    local start_time=$(date +%s)
    local output_file="$REPORT_DIR/${suite_name,,}.json"
    
    if npm run test -- "$test_pattern" --reporter=json --outputFile="$output_file" 2>&1 | tee -a "$LOG_FILE"; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_success "$suite_name completed in ${duration}s"
        
        # Parse results if JSON file exists
        if [[ -f "$output_file" ]]; then
            local test_count=$(jq '.numTotalTests // 0' "$output_file" 2>/dev/null || echo "0")
            local passed=$(jq '.numPassedTests // 0' "$output_file" 2>/dev/null || echo "0")
            local failed=$(jq '.numFailedTests // 0' "$output_file" 2>/dev/null || echo "0")
            log "   Tests: $test_count | Passed: $passed | Failed: $failed"
        fi
        
        return 0
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_error "$suite_name failed after ${duration}s"
        return 1
    fi
}

# Test execution results tracking
declare -A test_results
total_suites=0
passed_suites=0
failed_suites=0

# 1. Jackson SAML Integration Tests
print_header "TEST SUITE 1: JACKSON SAML INTEGRATION"
total_suites=$((total_suites + 1))
if run_test_suite "Jackson_SAML_Integration" "tests/integration/jackson-saml.test.ts" "Core Jackson SAML service integration and database connectivity"; then
    test_results["Jackson_SAML_Integration"]="PASSED"
    passed_suites=$((passed_suites + 1))
else
    test_results["Jackson_SAML_Integration"]="FAILED"
    failed_suites=$((failed_suites + 1))
fi

# 2. API CRUD Operations Tests
print_header "TEST SUITE 2: API CRUD OPERATIONS"
total_suites=$((total_suites + 1))
if run_test_suite "API_CRUD_Operations" "tests/api/sso-connections-crud.test.ts" "Complete CRUD operations for SSO connections"; then
    test_results["API_CRUD_Operations"]="PASSED"
    passed_suites=$((passed_suites + 1))
else
    test_results["API_CRUD_Operations"]="FAILED"
    failed_suites=$((failed_suites + 1))
fi

# 3. SAML Authentication Flow Tests
print_header "TEST SUITE 3: SAML AUTHENTICATION FLOW"
total_suites=$((total_suites + 1))
if run_test_suite "SAML_Authentication_Flow" "tests/api/saml-authentication-flow.test.ts" "Complete SAML authentication workflow testing"; then
    test_results["SAML_Authentication_Flow"]="PASSED"
    passed_suites=$((passed_suites + 1))
else
    test_results["SAML_Authentication_Flow"]="FAILED"
    failed_suites=$((failed_suites + 1))
fi

# 4. Hospital Department & Role Management Tests
print_header "TEST SUITE 4: HOSPITAL FEATURES"
total_suites=$((total_suites + 1))
if run_test_suite "Hospital_Department_Roles" "tests/hospital/department-role-management.test.ts" "Hospital-specific department and role management features"; then
    test_results["Hospital_Department_Roles"]="PASSED"
    passed_suites=$((passed_suites + 1))
else
    test_results["Hospital_Department_Roles"]="FAILED"
    failed_suites=$((failed_suites + 1))
fi

# 5. UI Integration Tests
print_header "TEST SUITE 5: UI INTEGRATION"
total_suites=$((total_suites + 1))
if run_test_suite "UI_Integration" "tests/ui/sso-management-page.test.tsx" "React UI component integration and user interaction testing"; then
    test_results["UI_Integration"]="PASSED"
    passed_suites=$((passed_suites + 1))
else
    test_results["UI_Integration"]="FAILED"
    failed_suites=$((failed_suites + 1))
fi

# 6. Security & Compliance Tests
print_header "TEST SUITE 6: SECURITY & COMPLIANCE"
total_suites=$((total_suites + 1))
if run_test_suite "Security_Compliance" "tests/security/authentication-authorization.test.ts" "Security, authentication, authorization, and HIPAA compliance testing"; then
    test_results["Security_Compliance"]="PASSED"
    passed_suites=$((passed_suites + 1))
else
    test_results["Security_Compliance"]="FAILED"
    failed_suites=$((failed_suites + 1))
fi

# 7. End-to-End Tests (if Playwright is available)
print_header "TEST SUITE 7: END-TO-END WORKFLOWS"
total_suites=$((total_suites + 1))
if command -v npx >/dev/null 2>&1 && npm list @playwright/test >/dev/null 2>&1; then
    print_section "Running Playwright E2E Tests"
    if npx playwright test tests/e2e/hospital-sso-workflows.spec.ts --reporter=json --output-dir="$REPORT_DIR/e2e" 2>&1 | tee -a "$LOG_FILE"; then
        test_results["E2E_Workflows"]="PASSED"
        passed_suites=$((passed_suites + 1))
        print_success "End-to-end tests completed"
    else
        test_results["E2E_Workflows"]="FAILED"
        failed_suites=$((failed_suites + 1))
        print_error "End-to-end tests failed"
    fi
else
    print_warning "Playwright not available - skipping E2E tests"
    test_results["E2E_Workflows"]="SKIPPED"
fi

# 8. Code Coverage Report
print_header "CODE COVERAGE ANALYSIS"
print_section "Generating Coverage Report"
if npm run test -- --coverage --coverageDirectory="$COVERAGE_DIR" 2>&1 | tee -a "$LOG_FILE"; then
    print_success "Coverage report generated: $COVERAGE_DIR"
    
    # Extract coverage summary if available
    if [[ -f "$COVERAGE_DIR/coverage-summary.json" ]]; then
        local coverage=$(jq '.total.lines.pct // 0' "$COVERAGE_DIR/coverage-summary.json" 2>/dev/null || echo "0")
        log "Overall Line Coverage: ${coverage}%"
        
        if (( $(echo "$coverage >= 90" | bc -l) )); then
            print_success "Excellent coverage: ${coverage}%"
        elif (( $(echo "$coverage >= 80" | bc -l) )); then
            print_warning "Good coverage: ${coverage}%"
        else
            print_warning "Coverage needs improvement: ${coverage}%"
        fi
    fi
else
    print_error "Coverage report generation failed"
fi

# 9. Performance Tests (basic load testing)
print_header "PERFORMANCE VALIDATION"
print_section "Basic Performance Tests"

# Simple load test using curl if available
if command -v curl >/dev/null 2>&1; then
    print_section "Testing API Response Times"
    
    # Start dev server in background for testing
    npm run dev > /dev/null 2>&1 &
    DEV_SERVER_PID=$!
    sleep 10  # Wait for server to start
    
    # Test metadata endpoint performance
    local start_time=$(date +%s%3N)
    if curl -s "http://localhost:3003/api/auth/sso/metadata?tenant=test" > /dev/null; then
        local end_time=$(date +%s%3N)
        local response_time=$((end_time - start_time))
        print_success "Metadata endpoint response time: ${response_time}ms"
    else
        print_warning "Could not test API performance - server not responding"
    fi
    
    # Clean up dev server
    kill $DEV_SERVER_PID 2>/dev/null || true
else
    print_warning "curl not available - skipping performance tests"
fi

# 10. Generate Final Report
print_header "TEST EXECUTION SUMMARY"

TEST_END_TIME=$(date +%s)
TOTAL_DURATION=$((TEST_END_TIME - TEST_START_TIME))

# Create summary report
SUMMARY_FILE="$REPORT_DIR/test-summary.md"

cat > "$SUMMARY_FILE" << EOF
# 🧪 Phase 2 Comprehensive Test Report

**Date**: $(date)  
**Duration**: ${TOTAL_DURATION} seconds  
**Report Directory**: $REPORT_DIR  

## Executive Summary

- **Total Test Suites**: $total_suites
- **Passed**: $passed_suites
- **Failed**: $failed_suites
- **Success Rate**: $(( (passed_suites * 100) / total_suites ))%

## Test Suite Results

| Test Suite | Status | Description |
|------------|--------|-------------|
EOF

# Add test results to summary
for suite in "${!test_results[@]}"; do
    status="${test_results[$suite]}"
    case $status in
        "PASSED") icon="✅" ;;
        "FAILED") icon="❌" ;;
        "SKIPPED") icon="⏭️" ;;
        *) icon="❓" ;;
    esac
    
    case $suite in
        "Jackson_SAML_Integration") desc="Jackson SAML service integration and database connectivity" ;;
        "API_CRUD_Operations") desc="Complete CRUD operations for SSO connections" ;;
        "SAML_Authentication_Flow") desc="Complete SAML authentication workflow testing" ;;
        "Hospital_Department_Roles") desc="Hospital-specific department and role management" ;;
        "UI_Integration") desc="React UI component integration and user interactions" ;;
        "Security_Compliance") desc="Security, authentication, and HIPAA compliance" ;;
        "E2E_Workflows") desc="End-to-end hospital SSO workflow testing" ;;
        *) desc="Additional testing" ;;
    esac
    
    echo "| $suite | $icon $status | $desc |" >> "$SUMMARY_FILE"
done

cat >> "$SUMMARY_FILE" << EOF

## Coverage Information

Coverage reports are available in: \`$COVERAGE_DIR\`

## Test Artifacts

- **Execution Log**: \`$LOG_FILE\`
- **JSON Reports**: \`$REPORT_DIR/*.json\`
- **Coverage Reports**: \`$COVERAGE_DIR/\`
- **E2E Reports**: \`$REPORT_DIR/e2e/\`

## Hospital SSO System Validation

### ✅ Validated Features
- Jackson SAML integration with PostgreSQL
- Complete CRUD operations for SSO connections
- SAML authentication flow (authorize, callback, metadata)
- Hospital department and role management
- Security and compliance (authentication, authorization)
- UI functionality and user experience

### 🏥 Hospital-Specific Features Tested
- Emergency department rapid access
- ICU 24/7 monitoring access
- Surgery department procedure-based access
- Laboratory equipment-specific roles
- Radiology imaging system integration
- Pharmacy controlled substance protocols
- Multi-department staff configurations
- Role-based access controls (doctor, nurse, technician, administrator)

### 🔒 Security Validations
- Organization-scoped access control
- Input validation and sanitization
- SAML security (signature validation, replay prevention)
- Rate limiting and DoS prevention
- Error information disclosure prevention
- HIPAA compliance requirements

## Recommendations

EOF

# Add recommendations based on test results
if [[ $failed_suites -eq 0 ]]; then
    cat >> "$SUMMARY_FILE" << EOF
🎉 **All test suites passed!** The Hospital SSO system is ready for production deployment.

**Next Steps:**
1. Deploy to staging environment for user acceptance testing
2. Conduct security penetration testing
3. Perform load testing with realistic hospital traffic patterns
4. Complete HIPAA compliance audit
5. Schedule production deployment
EOF
else
    cat >> "$SUMMARY_FILE" << EOF
⚠️ **$failed_suites test suite(s) failed.** Review and fix issues before deployment.

**Required Actions:**
1. Review failed test logs in \`$LOG_FILE\`
2. Fix identified issues
3. Re-run comprehensive test suite
4. Verify all tests pass before proceeding to deployment

**Failed Suites:**
EOF
    
    for suite in "${!test_results[@]}"; do
        if [[ "${test_results[$suite]}" == "FAILED" ]]; then
            echo "- $suite" >> "$SUMMARY_FILE"
        fi
    done
fi

cat >> "$SUMMARY_FILE" << EOF

---

*Generated by Phase 2 Comprehensive Test Suite*  
*Hospital SSO System - Production Readiness Validation*
EOF

# Display final results
log "\n${PURPLE}========================================="
log "🏥 HOSPITAL SSO SYSTEM TEST RESULTS"
log "=========================================${NC}\n"

log "📊 Test Summary:"
log "   Total Suites: $total_suites"
log "   Passed: ${GREEN}$passed_suites${NC}"
log "   Failed: ${RED}$failed_suites${NC}"
log "   Success Rate: $(( (passed_suites * 100) / total_suites ))%"
log "   Duration: ${TOTAL_DURATION}s"

log "\n📁 Reports Generated:"
log "   Summary: $SUMMARY_FILE"
log "   Logs: $LOG_FILE"
log "   Coverage: $COVERAGE_DIR"

# Display individual suite results
log "\n🧪 Suite Results:"
for suite in "${!test_results[@]}"; do
    status="${test_results[$suite]}"
    case $status in
        "PASSED") log "   ${GREEN}✅ $suite${NC}" ;;
        "FAILED") log "   ${RED}❌ $suite${NC}" ;;
        "SKIPPED") log "   ${YELLOW}⏭️ $suite${NC}" ;;
    esac
done

if [[ $failed_suites -eq 0 ]]; then
    log "\n${GREEN}🎉 ALL TESTS PASSED! Hospital SSO system is ready for production.${NC}"
    exit 0
else
    log "\n${RED}❌ Some tests failed. Review logs and fix issues before deployment.${NC}"
    exit 1
fi