#!/bin/bash

# 🧪 UI Testing Setup Script for Phase 2 Hospital SSO System
# This script sets up the complete UI testing environment

set -e

echo "🏥 Setting up Phase 2 UI Testing Environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${PURPLE}🔷 $1${NC}"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_header "Phase 2 UI Testing Setup - Hospital SSO System"
echo "Setting up comprehensive UI testing infrastructure..."
echo

# 1. Environment Prerequisites Check
print_header "1. Environment Prerequisites Check"

# Check Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_success "Node.js: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_success "npm: $NPM_VERSION"
else
    print_error "npm not found."
    exit 1
fi

# Check if development server dependencies are installed
if [[ ! -d "node_modules" ]]; then
    print_warning "Node modules not found. Installing dependencies..."
    npm install
    print_success "Dependencies installed"
fi

# 2. Test Data Setup
print_header "2. Test Data Setup"

# Create test data directory
mkdir -p tests/ui-testing/data
mkdir -p tests/ui-testing/results
mkdir -p tests/ui-testing/screenshots

print_success "UI testing directories created"

# 3. Create test environment validation
print_header "3. Environment Validation"

# Check if application is running
if curl -s http://localhost:3003 > /dev/null 2>&1; then
    print_success "Application detected on http://localhost:3003"
else
    print_warning "Application not running. Start with: npm run dev"
fi

print_success "UI testing setup completed successfully!"
echo
print_header "🎉 Phase 2 UI Testing Environment Ready!"
echo
echo "📋 Testing Plan Created:"
echo "   • docs/PHASE_2_UI_TESTING_PLAN.md (150+ test scenarios)"
echo "   • Complete hospital department testing"
echo "   • Role-based access control validation"
echo "   • SAML integration workflow testing"
echo "   • Performance and security validation"
echo
echo "🏥 Test Categories Available:"
echo "   ✅ Core SSO Management (15 tests)"
echo "   ✅ Hospital Departments (25 tests)"
echo "   ✅ Role-Based Access (20 tests)"
echo "   ✅ SAML Integration (15 tests)"
echo "   ✅ Error Handling (18 tests)"
echo "   ✅ Performance & Usability (15 tests)"
echo "   ✅ Security Validation (12 tests)"
echo "   ✅ Regression Testing (30 tests)"
echo
echo "🚀 Quick Start:"
echo "   1. Review docs/PHASE_2_UI_TESTING_PLAN.md"
echo "   2. Navigate to http://localhost:3003/dashboard/sso-management"
echo "   3. Login with: admin@stmarys.hospital.com / u3Me65zO&8@b"
echo "   4. Execute smoke test (10 minutes)"
echo "   5. Run focused testing categories as needed"
echo
echo "🎯 Success Criteria:"
echo "   • 95%+ test pass rate"
echo "   • All 7 hospital departments functional"
echo "   • All 4 roles working properly"
echo "   • SAML integration operational"
echo "   • Performance targets met"
echo
echo "Ready for comprehensive Phase 2 validation! 🧪"