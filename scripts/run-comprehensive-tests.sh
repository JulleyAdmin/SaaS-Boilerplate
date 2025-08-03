#!/bin/bash

# HospitalOS Comprehensive Test Suite
# This script runs all tests to validate the system is production-ready

set -e

echo "======================================"
echo "HospitalOS Comprehensive Test Suite"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0

# Function to run a test
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -n "Running $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}FAILED${NC}"
        ((FAILED++))
    fi
}

# 1. Environment Checks
echo "1. Environment Checks"
echo "--------------------"
run_test "Node.js version" "node --version"
run_test "npm version" "npm --version"
run_test "Docker running" "docker info"
run_test "PostgreSQL connection" "docker-compose exec -T postgres pg_isready"
echo ""

# 2. Code Quality Checks
echo "2. Code Quality Checks"
echo "---------------------"
run_test "TypeScript compilation" "npm run check-types"
run_test "ESLint validation" "npm run lint"
run_test "Prettier formatting" "npx prettier --check 'src/**/*.{ts,tsx}'"
echo ""

# 3. Unit Tests
echo "3. Unit Tests"
echo "-------------"
run_test "Component tests" "npm run test -- --run"
echo ""

# 4. Integration Tests
echo "4. Integration Tests"
echo "-------------------"
run_test "API endpoint tests" "npm run test:integration -- --run"
echo ""

# 5. Security Checks
echo "5. Security Checks"
echo "------------------"
run_test "Dependency vulnerabilities" "npm audit --production"
run_test "Security headers" "curl -s -I http://localhost:3000 | grep -E '(X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security)'"
echo ""

# 6. Performance Checks
echo "6. Performance Checks"
echo "--------------------"
run_test "Bundle size check" "npm run build-stats"
run_test "Lighthouse audit" "npx lighthouse http://localhost:3000 --quiet --chrome-flags='--headless' --only-categories=performance"
echo ""

# 7. API Tests
echo "7. API Tests"
echo "------------"
run_test "Health check endpoint" "curl -f http://localhost:3000/api/health"
run_test "Patients API" "curl -f http://localhost:3000/api/patients"
run_test "Appointments API" "curl -f http://localhost:3000/api/appointments"
run_test "Billing API" "curl -f http://localhost:3000/api/invoices"
echo ""

# 8. Database Tests
echo "8. Database Tests"
echo "-----------------"
run_test "Database migrations" "npm run db:migrate"
run_test "Database schema validity" "docker-compose exec -T postgres psql -U hospitalos -c '\dt'"
echo ""

# 9. Docker Tests
echo "9. Docker Tests"
echo "---------------"
run_test "Docker build" "docker build -t hospitalos-test ."
run_test "Container health" "docker-compose ps | grep -E '(healthy|Up)'"
echo ""

# 10. Documentation Tests
echo "10. Documentation Tests"
echo "----------------------"
run_test "API documentation" "test -f docs/API_DOCUMENTATION.md"
run_test "Deployment guide" "test -f docs/DEPLOYMENT_GUIDE.md"
run_test "Admin guide" "test -f docs/ADMIN_GUIDE.md"
echo ""

# Summary
echo "======================================"
echo "Test Summary"
echo "======================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! System is ready for production.${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please fix issues before deployment.${NC}"
    exit 1
fi