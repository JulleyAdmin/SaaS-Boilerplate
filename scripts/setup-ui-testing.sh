#!/bin/bash

# Phase 1 UI Testing Environment Setup Script
# This script prepares your development environment for manual UI testing

set -e

echo "🏥 Setting up HospitalOS Phase 1 UI Testing Environment"
echo "======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "\n${BLUE}📋 Step $1: $2${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
print_step 1 "Checking Prerequisites"

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

print_success "All prerequisites are installed"

# Check if .env.local exists
print_step 2 "Environment Configuration"

if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating from template..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        print_success "Created .env.local from .env.example"
    else
        print_warning "No .env.example found. Creating basic .env.local..."
        cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://localhost:5432/hospitalos_development"

# Clerk Authentication (Replace with your actual keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_ZXhhbXBsZWtleWZvcnRlc3Rpbmc"
CLERK_SECRET_KEY="sk_test_ZXhhbXBsZWtleWZvcnRlc3Rpbmc"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Stripe (for existing functionality)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_ZXhhbXBsZWtleWZvcnRlc3Rpbmc"
STRIPE_SECRET_KEY="sk_test_ZXhhbXBsZWtleWZvcnRlc3Rpbmc"
STRIPE_WEBHOOK_SECRET="whsec_ZXhhbXBsZWtleWZvcnRlc3Rpbmc"

# SSO Configuration
JACKSON_API_KEY="your_jackson_api_key_here"
JACKSON_URL="http://localhost:5225"
SSO_ISSUER="https://your-hospital.app"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOF
        print_success "Created basic .env.local"
    fi
else
    print_success ".env.local already exists"
fi

# Install dependencies
print_step 3 "Installing Dependencies"

npm install
print_success "Dependencies installed"

# Check database connection
print_step 4 "Database Setup"

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    print_warning "PostgreSQL is not running. Please start PostgreSQL before testing."
    print_warning "You can start it with: brew services start postgresql (macOS) or systemctl start postgresql (Linux)"
else
    print_success "PostgreSQL is running"
    
    # Try to create database if it doesn't exist
    if ! psql -h localhost -p 5432 -U postgres -lqt | cut -d \| -f 1 | grep -qw hospitalos_development; then
        print_warning "Creating hospitalos_development database..."
        createdb -h localhost -p 5432 -U postgres hospitalos_development 2>/dev/null || print_warning "Could not create database automatically"
    else
        print_success "hospitalos_development database exists"
    fi
fi

# Set up Jackson SSO service
print_step 5 "Setting up Jackson SSO Service"

# Check if Jackson container already exists
if docker ps -a | grep -q jackson-hospitalos; then
    print_warning "Jackson container already exists. Stopping and removing..."
    docker stop jackson-hospitalos 2>/dev/null || true
    docker rm jackson-hospitalos 2>/dev/null || true
fi

# Start Jackson SSO container
DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f2 | tr -d '"')
JACKSON_API_KEY=$(grep JACKSON_API_KEY .env.local | cut -d '=' -f2 | tr -d '"')

print_warning "Starting Jackson SSO service..."
docker run -d \
  --name jackson-hospitalos \
  -p 5225:5225 \
  -e DB_ENGINE=sql \
  -e DB_TYPE=postgres \
  -e DB_URL="$DATABASE_URL" \
  -e JACKSON_API_KEY="$JACKSON_API_KEY" \
  boxyhq/jackson

# Wait for Jackson to start
echo "Waiting for Jackson SSO to start..."
sleep 10

# Check if Jackson is responding
if curl -f http://localhost:5225/api/v1/health &> /dev/null; then
    print_success "Jackson SSO service is running"
else
    print_error "Jackson SSO service failed to start"
    print_warning "Check Docker logs with: docker logs jackson-hospitalos"
fi

# Run database migrations
print_step 6 "Running Database Migrations"

if npm run db:migrate &> /dev/null; then
    print_success "Database migrations completed"
else
    print_warning "Database migrations failed or skipped"
    print_warning "You may need to configure your database connection properly"
fi

# Create test data script
print_step 7 "Creating Test Data Setup"

cat > scripts/create-test-data.js << 'EOF'
#!/usr/bin/env node

/**
 * Create Test Data for UI Testing
 * Run this script to set up test users and organizations
 */

const testData = {
  organization: {
    name: "St. Mary's General Hospital",
    slug: "st-marys-hospital",
    domain: "stmarys.hospital.com",
    departments: ["Emergency", "ICU", "Surgery", "Laboratory", "Radiology", "Pharmacy", "Administration", "Nursing"]
  },
  
  users: [
    {
      email: "admin@stmarys.hospital.com",
      firstName: "John",
      lastName: "Smith",
      role: "OWNER",
      department: "IT Administration"
    },
    {
      email: "head.emergency@stmarys.hospital.com",
      firstName: "Dr. Sarah",
      lastName: "Johnson", 
      role: "ADMIN",
      department: "Emergency"
    },
    {
      email: "nurse.williams@stmarys.hospital.com",
      firstName: "Lisa",
      lastName: "Williams",
      role: "MEMBER", 
      department: "Emergency"
    }
  ],
  
  ssoConnection: {
    name: "St. Mary's Hospital SAML",
    description: "Primary SAML connection for hospital staff",
    tenant: "st-marys-hospital",
    product: "hospitalos",
    redirectUrl: "http://localhost:3000/api/auth/sso/callback",
    metadataUrl: "https://mocksaml.com/api/saml/metadata",
    // Mock SAML metadata for testing
    metadata: `<?xml version="1.0" encoding="UTF-8"?>
<EntityDescriptor entityID="https://mocksaml.com/demo" xmlns="urn:oasis:names:tc:SAML:2.0:metadata">
  <IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://mocksaml.com/api/saml/sso"/>
    <KeyDescriptor use="signing">
      <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
        <X509Data>
          <X509Certificate>MIICert...</X509Certificate>
        </X509Data>
      </KeyInfo>
    </KeyDescriptor>
  </IDPSSODescriptor>
</EntityDescriptor>`
  }
};

console.log('🏥 HospitalOS Test Data Configuration');
console.log('=====================================\n');

console.log('📋 Test Organization:');
console.log(`   Name: ${testData.organization.name}`);
console.log(`   Slug: ${testData.organization.slug}`);
console.log(`   Domain: ${testData.organization.domain}`);
console.log(`   Departments: ${testData.organization.departments.join(', ')}\n`);

console.log('👥 Test Users:');
testData.users.forEach((user, index) => {
  console.log(`   ${index + 1}. ${user.firstName} ${user.lastName}`);
  console.log(`      Email: ${user.email}`);
  console.log(`      Role: ${user.role}`);
  console.log(`      Department: ${user.department}\n`);
});

console.log('🔐 SSO Connection:');
console.log(`   Name: ${testData.ssoConnection.name}`);
console.log(`   Description: ${testData.ssoConnection.description}`);
console.log(`   Redirect URL: ${testData.ssoConnection.redirectUrl}\n`);

console.log('📝 Manual Setup Instructions:');
console.log('=============================');
console.log('1. Create organization in Clerk dashboard:');
console.log(`   - Name: ${testData.organization.name}`);
console.log(`   - Slug: ${testData.organization.slug}`);
console.log('');
console.log('2. Create test users in Clerk dashboard:');
testData.users.forEach((user, index) => {
  console.log(`   ${index + 1}. Email: ${user.email}, Role: ${user.role}`);
});
console.log('');
console.log('3. Use SSO management UI to create SAML connection');
console.log('4. Begin UI testing following the test plan');
console.log('');
console.log('🚀 Ready to start UI testing!');
EOF

chmod +x scripts/create-test-data.js
print_success "Test data setup script created"

# Start the development server
print_step 8 "Starting Development Server"

print_success "Environment setup complete!"

echo ""
echo "🎉 UI Testing Environment Ready!"
echo "================================="
echo ""
echo "📍 Service URLs:"
echo "   • HospitalOS App: http://localhost:3000"
echo "   • SSO Admin Page: http://localhost:3000/admin/sso"
echo "   • Jackson Admin:  http://localhost:5225"
echo ""
echo "🔧 Next Steps:"
echo "   1. Run 'npm run dev' to start the development server"
echo "   2. Run 'node scripts/create-test-data.js' to see test data setup"
echo "   3. Follow the UI Testing Plan in docs/PHASE_1_UI_TESTING_PLAN.md"
echo "   4. Set up test organization and users in Clerk dashboard"
echo "   5. Begin testing with Scenario 1: SSO Connection Management"
echo ""
echo "📚 Documentation:"
echo "   • UI Testing Plan: docs/PHASE_1_UI_TESTING_PLAN.md"
echo "   • Phase 1 Execution Guide: docs/PHASE_1_EXECUTION_GUIDE.md"
echo ""
echo "🆘 Need Help?"
echo "   • Check service status: curl http://localhost:3000/api/health"
echo "   • View Jackson logs: docker logs jackson-hospitalos"
echo "   • Stop Jackson: docker stop jackson-hospitalos"
echo ""
print_success "Happy testing! 🧪"