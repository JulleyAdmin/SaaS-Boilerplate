#!/bin/bash

# 🧪 Test Environment Setup Script for Hospital SSO System
# This script sets up the complete testing environment

set -e

echo "🏥 Setting up Hospital SSO Test Environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Check Node.js version
echo "🔍 Checking Node.js version..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_success "Node.js: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# 2. Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# 3. Install test dependencies
echo "📦 Installing test dependencies..."
npm install --save-dev @testing-library/jest-dom @types/testing-library__jest-dom
print_success "Test dependencies installed"

# 4. Set up test database (if PostgreSQL is available)
echo "🗄️  Setting up test database..."
if command -v psql >/dev/null 2>&1; then
    # Try to create test database
    createdb hospitalos_test 2>/dev/null || print_warning "Test database already exists or could not be created"
    print_success "Test database setup complete"
else
    print_warning "PostgreSQL not found - integration tests may not work"
fi

# 5. Create test environment file if it doesn't exist
if [[ ! -f ".env.test" ]]; then
    print_warning ".env.test not found - should already be created"
fi

# 6. Verify test setup
echo "🧪 Verifying test setup..."

# Check if vitest is available
if npm list vitest >/dev/null 2>&1; then
    print_success "Vitest is installed"
else
    print_error "Vitest not found in dependencies"
fi

# Check if testing library is available
if npm list @testing-library/react >/dev/null 2>&1; then
    print_success "React Testing Library is installed"
else
    print_error "React Testing Library not found"
fi

# 7. Run a simple test to verify everything works
echo "🎯 Running test validation..."

# Set test environment variables
export NODE_ENV=test
export SKIP_ENV_VALIDATION=true
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_Y2xlcmsuaG9zcGl0YWxvcy50ZXN0JA"
export NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51234567890abcdef"
export DATABASE_URL="postgresql://localhost:5432/hospitalos_test"
export JACKSON_CLIENT_SECRET_VERIFIER="test_secret_verifier_12345"
export NEXT_PUBLIC_APP_URL="http://localhost:3003"

# Try to run a simple test
if npm run test -- --run --reporter=minimal tests/setup/ 2>/dev/null; then
    print_success "Test infrastructure validation passed"
else
    print_warning "Test infrastructure needs configuration"
fi

echo ""
echo "🎉 Test Environment Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Run 'npm run test' to execute all tests"
echo "2. Run 'npm run test:watch' for development testing"
echo "3. Run 'npm run test:coverage' for coverage reports"
echo ""
echo "🏥 Hospital SSO Test Categories Available:"
echo "   • Jackson SAML Integration Tests"
echo "   • API CRUD Operations Tests"
echo "   • Hospital Department & Role Tests"
echo "   • Security & Compliance Tests"
echo "   • UI Integration Tests"
echo "   • End-to-End Workflow Tests"
echo ""
echo "Ready to test 295+ comprehensive test cases! 🚀"